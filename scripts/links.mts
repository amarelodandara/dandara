import {
  lstat,
  open,
  readdir,
  readFile,
  realpath,
  writeFile,
} from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { KINDS, type Kind } from "../src/links/kinds.ts";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "src", "links", "data.ts");
const FIXTURE = path.join(ROOT, "scripts", "fixtures", "vault");

const STALE_AFTER_DAYS = 30;
const DAY_MS = 86_400_000;
const BIGGEST_SHARE = 0.1;
const LONGEST_TITLE = 240;
const LONGEST_NOTE = 240;
const SPELLED_OUT_FROM = 3;

const FRONTMATTER = /^---\n([\s\S]*?)\n---/;
const FIELD = /^([a-z]+):(.*)$/;
const WIKILINK = /\[\[([^\]|#^]+)/g;
const PULLED = /PULLED_AT = "(\d{4}-\d{2}-\d{2})"/;

type Note = { name: string; fields: Record<string, string>; body: string };

type Entry = {
  name: string;
  slug?: string;
  title?: string;
  url?: string;
  tag?: string;
  by?: string;
  note?: string;
};

const isKind = (value = ""): value is Kind =>
  (KINDS as readonly string[]).includes(value);

const repairs: string[] = [];

const slugify = (value: string) =>
  value
    .normalize("NFD")
    .replaceAll(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, "-")
    .replaceAll(/^-|-$/g, "");

const unquote = (value: string) => value.trim().replace(/^(["'])(.*)\1$/, "$2");

const tidy = (value: string | undefined) => {
  const tidied = value?.replaceAll(/\s+/g, " ").trim();
  return tidied || undefined;
};

function respell(name: string, value: string | undefined) {
  const parts = value?.split(", ") ?? [];
  if (parts.length < SPELLED_OUT_FROM || parts.some((part) => part.length > 1))
    return tidy(value);
  const joined = tidy(parts.join(""));
  repairs.push(`${name}: by "${value}" read as "${joined}"`);
  return joined;
}

async function vaultRoot() {
  const given = process.env.VAULT;
  if (!given) {
    console.log("· VAULT is not set, baking the placeholder vault");
    return realpath(FIXTURE);
  }
  return realpath(given);
}

const listArgument = () =>
  process.argv.slice(2).find((argument) => argument.endsWith(".json"));

async function readOnly(file: string) {
  const handle = await open(file, "r");
  try {
    return await handle.readFile("utf8");
  } finally {
    await handle.close();
  }
}

async function notesIn(vault: string) {
  const entries = await readdir(vault, { recursive: true });
  const notes: Note[] = [];
  for (const entry of entries) {
    if (!entry.endsWith(".md")) continue;
    if (entry.split(path.sep).some((part) => part.startsWith("."))) continue;
    const file = path.join(vault, entry);
    const stats = await lstat(file);
    if (stats.isSymbolicLink()) continue;
    const real = await realpath(file);
    if (!real.startsWith(vault + path.sep)) continue;
    const raw = await readOnly(real);
    const text = raw.replaceAll("\r\n", "\n");
    const head = FRONTMATTER.exec(text);
    const fields: Record<string, string> = {};
    for (const line of head?.[1].split("\n") ?? []) {
      const match = FIELD.exec(line);
      if (match) fields[match[1]] = unquote(match[2]);
    }
    notes.push({
      name: path.basename(entry, ".md"),
      fields,
      body: head ? text.slice(head[0].length) : text,
    });
  }
  return notes;
}

function inbound(notes: Note[]) {
  const counts = new Map<string, number>();
  for (const note of notes) {
    for (const [, target] of note.body.matchAll(WIKILINK)) {
      const key = target.trim().toLowerCase();
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }
  return (note: Note) => counts.get(note.name.toLowerCase()) ?? 0;
}

function report(notes: Note[], linksTo: (note: Note) => number) {
  const ranked = notes.toSorted((a, b) => linksTo(b) - linksTo(a));
  const biggest = ranked.slice(
    0,
    Math.max(1, Math.ceil(ranked.length * BIGGEST_SHARE)),
  );
  console.log(
    `\nBiggest ${biggest.length} of ${notes.length} notes by links in:`,
  );
  for (const note of biggest) {
    const mark = note.fields.rolodex ? "✓" : " ";
    console.log(`  ${mark} ${String(linksTo(note)).padStart(3)}  ${note.name}`);
  }
  console.log(
    "  (✓ is in the rolodex. Add rolodex: <kind> to a note to put it in.)\n",
  );
}

const fromNote = (note: Note): Entry => ({
  name: note.name,
  title: note.fields.title || note.name,
  url: note.fields.url,
  tag: note.fields.rolodex,
  by: note.fields.by,
  note: note.fields.note,
});

function linkFrom(entry: Entry) {
  const { name, tag } = entry;
  const title = tidy(entry.title) ?? "";
  const url = tidy(entry.url);
  const line = tidy(entry.note);
  const problems = [
    !isKind(tag) && `kind "${tag}" is not one of ${KINDS.join(", ")}`,
    !title && "title is missing",
    url !== undefined && !/^https?:\/\//.test(url) && "url is not http(s)",
    url === undefined && tag !== "quote" && "url is missing",
    title.length > LONGEST_TITLE &&
      `title runs past ${LONGEST_TITLE} characters`,
    (line?.length ?? 0) > LONGEST_NOTE &&
      `note runs past ${LONGEST_NOTE} characters`,
  ].filter(Boolean);
  if (problems.length > 0) throw new Error(`${name}: ${problems.join("; ")}`);
  return {
    slug: entry.slug ?? slugify(title),
    title,
    url,
    tag: tag as Kind,
    by: respell(name, entry.by),
    note: line,
  };
}

const field = (name: string, value: string | undefined) =>
  value ? `    ${name}: ${JSON.stringify(value)},\n` : "";

function source(links: ReturnType<typeof linkFrom>[], pulledAt: string) {
  const entries = links
    .map(
      (link) =>
        `  {\n${field("slug", link.slug)}${field("title", link.title)}${field("url", link.url)}${field("tag", link.tag)}${field("by", link.by)}${field("note", link.note)}  },\n`,
    )
    .join("");
  return `import type { Link } from "./link";

export const PULLED_AT = "${pulledAt}";

export const LINKS: Link[] = [
${entries}];
`;
}

async function check() {
  const baked = PULLED.exec(await readFile(OUT, "utf8"))?.[1];
  if (!baked) throw new Error("src/links/data.ts has no PULLED_AT");
  const age = Math.floor((Date.now() - Date.parse(baked)) / DAY_MS);
  if (age > STALE_AFTER_DAYS) {
    throw new Error(
      `the rolodex was last pulled ${age} days ago. Run npm run links.`,
    );
  }
  console.log(`✓ pulled ${age} days ago`);
}

async function fromVault() {
  const vault = await vaultRoot();
  if (OUT.startsWith(vault + path.sep))
    throw new Error("refusing to write inside the vault");
  const notes = await notesIn(vault);
  report(notes, inbound(notes));
  return notes
    .filter((note) => note.fields.rolodex)
    .map((note) => fromNote(note));
}

async function fromList(file: string) {
  const parsed: unknown = JSON.parse(await readOnly(await realpath(file)));
  if (!Array.isArray(parsed)) throw new Error(`${file} is not a list`);
  console.log(`· baking ${parsed.length} entries from ${file}`);
  return parsed.map((value: Record<string, unknown>, index): Entry => {
    const text = (key: string) =>
      typeof value[key] === "string" ? value[key] : undefined;
    return {
      name: text("title") ?? `entry ${index + 1}`,
      slug: text("slug"),
      title: text("title"),
      url: text("url"),
      tag: text("tag"),
      by: text("by"),
      note: text("note"),
    };
  });
}

async function bake() {
  const list = listArgument();
  const entries = list ? await fromList(list) : await fromVault();
  const links = entries
    .map((entry) => linkFrom(entry))
    .toSorted((a, b) =>
      a.title.localeCompare(b.title, "en", { sensitivity: "base" }),
    );
  const slugs = new Set<string>();
  for (const link of links) {
    if (slugs.has(link.slug))
      throw new Error(`two references share the slug ${link.slug}`);
    slugs.add(link.slug);
  }
  for (const repair of repairs) console.log(`· ${repair}`);

  const pulledAt = new Date().toISOString().slice(0, 10);
  await writeFile(OUT, source(links, pulledAt));
  console.log(`✓ ${links.length} references, pulled ${pulledAt}`);
}

(process.argv.includes("--check") ? check() : bake()).catch((error) => {
  console.error(`✗ ${error instanceof Error ? error.message : error}`);
  process.exit(1);
});
