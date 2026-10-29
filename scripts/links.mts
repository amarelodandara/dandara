import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { LINKS } from "../src/links/data.ts";
import { KINDS, type Kind } from "../src/links/kinds.ts";
import type { Link } from "../src/links/link.ts";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "src", "links", "data.ts");

const LONGEST_TITLE = 240;
const LONGEST_NOTE = 240;
const SPELLED_OUT_FROM = 3;

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

const sameUrl = (url: string) =>
  url
    .toLowerCase()
    .replace(/^https?:\/\/(www\.)?/, "")
    .replace(/\/$/, "");

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

function linkFrom(entry: Entry): Link {
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

function source(links: Link[]) {
  const entries = links
    .map(
      (link) =>
        `  {\n${field("slug", link.slug)}${field("title", link.title)}${field("url", link.url)}${field("tag", link.tag)}${field("by", link.by)}${field("note", link.note)}  },\n`,
    )
    .join("");
  return `import type { Link } from "./link";

export const LINKS: Link[] = [
${entries}];
`;
}

async function fromList(file: string) {
  const parsed: unknown = JSON.parse(await readFile(file, "utf8"));
  if (!Array.isArray(parsed)) throw new Error(`${file} is not a list`);
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

async function add() {
  const list = process.argv
    .slice(2)
    .find((argument) => argument.endsWith(".json"));
  if (!list)
    throw new Error("give it a list: npm run links -- path/to/list.json");

  const slugs = new Map(LINKS.map((link) => [link.slug, link]));
  const urls = new Map(
    LINKS.flatMap((link) => (link.url ? [[sameUrl(link.url), link]] : [])),
  );
  const added: Link[] = [];
  const skipped: string[] = [];

  for (const entry of await fromList(list)) {
    const link = linkFrom(entry);
    const already =
      slugs.get(link.slug) ??
      (link.url ? urls.get(sameUrl(link.url)) : undefined);
    if (already) {
      skipped.push(`${link.title} (already in as "${already.title}")`);
      continue;
    }
    slugs.set(link.slug, link);
    if (link.url) urls.set(sameUrl(link.url), link);
    added.push(link);
  }

  for (const repair of repairs) console.log(`· ${repair}`);
  for (const skip of skipped) console.log(`· skipped ${skip}`);

  const links = [...LINKS, ...added].toSorted((a, b) =>
    a.title.localeCompare(b.title, "en", { sensitivity: "base" }),
  );
  await writeFile(OUT, source(links));
  console.log(`✓ added ${added.length}, ${links.length} references in all`);
}

add().catch((error) => {
  console.error(`✗ ${error instanceof Error ? error.message : error}`);
  process.exit(1);
});
