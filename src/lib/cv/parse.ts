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

type Body = {
  file: string;
  offset: number;
  sections: CvSection[];
  section?: CvSection;
  entry?: CvEntry;
  expectMeta: boolean;
  metaSlot: boolean;
  paragraph: string[];
  bullets: Inline[][];
  index: number;
  trimmed: string;
};

const at = (body: Body) => body.offset + body.index + 1;

const fail = (body: Body, message: string) =>
  new CvParseError(body.file, at(body), message);

function flushParagraph(body: Body) {
  if (body.paragraph.length === 0) return;
  const text = body.paragraph.join(" ");
  body.paragraph = [];
  if (!body.section) throw fail(body, "text before any `##` section");
  body.section.blocks.push({
    t: "paragraph",
    content: parseInline(text, body.file, at(body)),
  });
}

function flushBullets(body: Body) {
  if (body.bullets.length === 0) return;
  if (body.entry) body.entry.bullets.push(...body.bullets);
  else body.section?.blocks.push({ t: "bullets", items: body.bullets });
  body.bullets = [];
}

function flushEntry(body: Body) {
  flushBullets(body);
  if (body.entry && body.section) body.section.entries.push(body.entry);
  body.entry = undefined;
}

function flushSection(body: Body) {
  flushParagraph(body);
  flushEntry(body);
  if (body.section) body.sections.push(body.section);
  body.section = undefined;
}

function rejectBanned(body: Body) {
  for (const [pattern, name] of BANNED_INLINE) {
    if (pattern.test(body.trimmed)) throw fail(body, `this grammar has no ${name}`);
  }
}

function openSection(body: Body, heading: string) {
  flushSection(body);
  if (heading === "") throw fail(body, "`##` section has no heading");
  body.section = { heading, blocks: [], entries: [] };
}

function openEntry(body: Body, heading: string) {
  if (!body.section) throw fail(body, "`###` entry outside any `##` section");
  flushParagraph(body);
  flushEntry(body);
  if (heading === "") throw fail(body, "`###` entry has no heading");
  body.entry = { heading: parseInline(heading, body.file, at(body)), bullets: [] };
  body.expectMeta = true;
}

function consumeHeading(body: Body) {
  const hashes = body.trimmed.match(/^#+/)![0].length;
  const heading = body.trimmed.slice(hashes).trim();

  if (hashes === 2) return openSection(body, heading);
  if (hashes === 3) return openEntry(body, heading);

  throw fail(
    body,
    `only \`##\` and \`###\` headings exist here, found \`${"#".repeat(hashes)}\``,
  );
}

function consumeBullet(body: Body) {
  if (body.trimmed.startsWith("- ")) {
    flushParagraph(body);
    const text = body.trimmed.slice(2).trim();
    if (text === "") throw fail(body, "empty bullet");
    body.bullets.push(parseInline(text, body.file, at(body)));
    return true;
  }

  if (body.trimmed === "-" || body.trimmed.startsWith("-\t")) {
    throw fail(body, "bullets are written `- ` with a space");
  }

  return false;
}

function consumeProse(body: Body) {
  if (body.metaSlot && body.entry) {
    body.entry.meta = body.trimmed;
    return;
  }

  if (body.entry) {
    throw fail(
      body,
      "an entry takes one meta line and then bullets — prose here would not be rendered",
    );
  }

  body.paragraph.push(body.trimmed);
}

function consumeLine(body: Body) {
  if (body.trimmed === "") {
    flushParagraph(body);
    flushBullets(body);
    return;
  }

  rejectBanned(body);

  if (body.trimmed.startsWith("#")) return consumeHeading(body);
  if (consumeBullet(body)) return;

  consumeProse(body);
}

function parseBody(source: string, file: string, offset: number): CvSection[] {
  const lines = source.split("\n");
  const body: Body = {
    file,
    offset,
    sections: [],
    expectMeta: false,
    metaSlot: false,
    paragraph: [],
    bullets: [],
    index: 0,
    trimmed: "",
  };

  for (const [index, line] of lines.entries()) {
    body.index = index;
    body.trimmed = line.trim();
    body.metaSlot = body.expectMeta;
    body.expectMeta = false;
    consumeLine(body);
  }

  body.index = lines.length - 1;
  flushSection(body);
  return body.sections;
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
