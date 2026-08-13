import type {
  CvDoc,
  CvEntry,
  CvLang,
  CvMeta,
  CvSection,
  Inline,
  PageSize,
} from "./types";

const LANGS: CvLang[] = ["en", "pt"];
const PAGE_SIZES: PageSize[] = ["letter", "a4"];

const BANNED_INLINE: [RegExp, string][] = [
  [/`/, "code spans"],
  [/!\[/, "images"],
  [/\]\(/, "link syntax — write the bare URL instead"],
  [/(^|[^*])\*([^*]|$)/, "single-asterisk emphasis — use ** for bold"],
  [/^\s*>/, "block quotes"],
  [/^\s*\d+\.\s/, "numbered lists"],
];

export class CvParseError extends Error {
  constructor(file: string, line: number, message: string) {
    super(`${file}:${line} — ${message}`);
    this.name = "CvParseError";
  }
}

export function parseCv(source: string, file: string): CvDoc {
  const { meta, body, bodyOffset } = parseFrontmatter(source, file);
  const sections = parseBody(body, file, bodyOffset);

  if (sections.length === 0) {
    throw new CvParseError(file, bodyOffset + 1, "document has no sections");
  }

  return { meta, sections };
}

function parseFrontmatter(
  source: string,
  file: string,
): { meta: CvMeta; body: string; bodyOffset: number } {
  const lines = source.split("\n");

  if (lines[0]?.trim() !== "---") {
    throw new CvParseError(file, 1, "expected JSON frontmatter opening `---`");
  }

  const close = lines.indexOf("---", 1);
  if (close === -1) {
    throw new CvParseError(file, 1, "frontmatter is never closed with `---`");
  }

  const raw = lines.slice(1, close).join("\n");
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    throw new CvParseError(file, 2, `frontmatter is not valid JSON: ${detail}`);
  }

  return {
    meta: validateMeta(parsed, file),
    body: lines.slice(close + 1).join("\n"),
    bodyOffset: close + 1,
  };
}

function validateMeta(value: unknown, file: string): CvMeta {
  const fail = (message: string): never => {
    throw new CvParseError(file, 2, `frontmatter ${message}`);
  };

  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return fail("must be a JSON object");
  }
  const raw = value as Record<string, unknown>;

  const str = (key: string): string => {
    const v = raw[key];
    if (typeof v !== "string" || v.trim() === "") {
      return fail(`\`${key}\` must be a non-empty string`);
    }
    return v;
  };

  const lang = raw.lang;
  if (typeof lang !== "string" || !LANGS.includes(lang as CvLang)) {
    return fail(`\`lang\` must be one of ${LANGS.join(", ")}`);
  }

  const pageSize = raw.pageSize;
  if (
    typeof pageSize !== "string" ||
    !PAGE_SIZES.includes(pageSize as PageSize)
  ) {
    return fail(`\`pageSize\` must be one of ${PAGE_SIZES.join(", ")}`);
  }

  const contact = raw.contact;
  if (
    !Array.isArray(contact) ||
    contact.length === 0 ||
    contact.some((c) => typeof c !== "string" || c.trim() === "")
  ) {
    return fail("`contact` must be a non-empty array of non-empty strings");
  }

  return {
    lang: lang as CvLang,
    name: str("name"),
    title: str("title"),
    contact: contact as string[],
    pageSize: pageSize as PageSize,
  };
}

function parseBody(body: string, file: string, offset: number): CvSection[] {
  const sections: CvSection[] = [];
  const lines = body.split("\n");

  let section: CvSection | undefined;
  let entry: CvEntry | undefined;
  let expectMeta = false;
  let paragraph: string[] = [];
  let bullets: Inline[][] = [];

  const lineNo = (i: number) => offset + i + 1;

  const flushParagraph = (i: number) => {
    if (paragraph.length === 0) return;
    const text = paragraph.join(" ");
    paragraph = [];
    if (!section) throw new CvParseError(file, lineNo(i), "text before any `##` section");
    section.blocks.push({ t: "paragraph", content: parseInline(text, file, lineNo(i)) });
  };

  const flushBullets = () => {
    if (bullets.length === 0) return;
    if (entry) entry.bullets.push(...bullets);
    else section?.blocks.push({ t: "bullets", items: bullets });
    bullets = [];
  };

  const flushEntry = () => {
    flushBullets();
    if (entry && section) section.entries.push(entry);
    entry = undefined;
  };

  const flushSection = (i: number) => {
    flushParagraph(i);
    flushEntry();
    if (section) sections.push(section);
    section = undefined;
  };

  for (const [i, line] of lines.entries()) {
    const trimmed = line.trim();
    const at = lineNo(i);

    const metaSlot = expectMeta;
    expectMeta = false;

    if (trimmed === "") {
      flushParagraph(i);
      flushBullets();
      continue;
    }

    for (const [pattern, name] of BANNED_INLINE) {
      if (pattern.test(trimmed)) {
        throw new CvParseError(file, at, `this grammar has no ${name}`);
      }
    }

    if (trimmed.startsWith("#")) {
      const hashes = trimmed.match(/^#+/)![0].length;
      const rest = trimmed.slice(hashes).trim();

      if (hashes === 2) {
        flushSection(i);
        if (rest === "") throw new CvParseError(file, at, "`##` section has no heading");
        section = { heading: rest, blocks: [], entries: [] };
        continue;
      }

      if (hashes === 3) {
        if (!section) throw new CvParseError(file, at, "`###` entry outside any `##` section");
        flushParagraph(i);
        flushEntry();
        if (rest === "") throw new CvParseError(file, at, "`###` entry has no heading");
        entry = { heading: parseInline(rest, file, at), bullets: [] };
        expectMeta = true;
        continue;
      }

      throw new CvParseError(
        file,
        at,
        `only \`##\` and \`###\` headings exist here, found \`${"#".repeat(hashes)}\``,
      );
    }

    if (trimmed.startsWith("- ")) {
      flushParagraph(i);
      const text = trimmed.slice(2).trim();
      if (text === "") throw new CvParseError(file, at, "empty bullet");
      bullets.push(parseInline(text, file, at));
      continue;
    }

    if (trimmed === "-" || trimmed.startsWith("-\t")) {
      throw new CvParseError(file, at, "bullets are written `- ` with a space");
    }

    if (metaSlot && entry) {
      entry.meta = trimmed;
      continue;
    }

    if (entry) {
      throw new CvParseError(
        file,
        at,
        "an entry takes one meta line and then bullets — prose here would not be rendered",
      );
    }

    paragraph.push(trimmed);
  }

  flushSection(lines.length - 1);
  return sections;
}

const URL = /https?:\/\/[^\s)]+/g;

export function parseInline(text: string, file: string, line: number): Inline[] {
  const out: Inline[] = [];

  let rest = text;
  while (rest.length > 0) {
    const open = rest.indexOf("**");
    if (open === -1) {
      pushText(out, rest, file, line);
      break;
    }

    const close = rest.indexOf("**", open + 2);
    if (close === -1) {
      throw new CvParseError(file, line, "unclosed `**`");
    }

    pushText(out, rest.slice(0, open), file, line);

    const bold = rest.slice(open + 2, close);
    if (bold.trim() === "") throw new CvParseError(file, line, "empty `**` pair");
    out.push({ t: "bold", v: bold });

    rest = rest.slice(close + 2);
  }

  return out;
}

function pushText(out: Inline[], text: string, file: string, line: number) {
  if (text === "") return;

  let last = 0;
  for (const match of text.matchAll(URL)) {
    const start = match.index;
    const matched = match[0];
    let end = matched.length;
    while (end > 0 && ".,;:".includes(matched[end - 1])) end -= 1;
    const href = matched.slice(0, end);

    if (start > last) out.push({ t: "text", v: text.slice(last, start) });
    out.push({ t: "link", v: href, href });
    last = start + href.length;
  }

  if (last < text.length) {
    const tail = text.slice(last);
    if (tail.includes("**")) throw new CvParseError(file, line, "unclosed `**`");
    out.push({ t: "text", v: tail });
  }
}
