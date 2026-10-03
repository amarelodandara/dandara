import { readFile } from "node:fs/promises";
import path from "node:path";

export type Run = { kind: "text" | "strong" | "code"; text: string };

export const AREAS = [
  "Home",
  "Work",
  "Blog",
  "Gift shop",
  "Site-wide",
] as const;

export type Area = (typeof AREAS)[number];

export type ChangeItem = { area: Area; runs: Run[] };

export type ChangeGroup = { title: string; items: ChangeItem[] };

export type ChangeWeek = { id: string; title: string; groups: ChangeGroup[] };

export type Changelog = { weeks: ChangeWeek[] };

const FILE = path.join(process.cwd(), "CHANGELOG.md");

const INLINE = /\*\*(.+?)\*\*|`(.+?)`/g;

function parseInline(line: string): Run[] {
  const runs: Run[] = [];
  let last = 0;
  for (const match of line.matchAll(INLINE)) {
    if (match.index > last) {
      runs.push({ kind: "text", text: line.slice(last, match.index) });
    }
    runs.push(
      match[1] === undefined
        ? { kind: "code", text: match[2] ?? "" }
        : { kind: "strong", text: match[1] },
    );
    last = match.index + match[0].length;
  }
  if (last < line.length) runs.push({ kind: "text", text: line.slice(last) });
  return runs;
}

function slug(title: string) {
  return title
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, "-")
    .replaceAll(/^-|-$/g, "");
}

const ITEM = /^- (.+)$/gm;

const TAGGED = /^\[([^\]]+)\] (.+)$/;

function isArea(name: string): name is Area {
  return (AREAS as readonly string[]).includes(name);
}

function parseItem(line: string): ChangeItem {
  const [, area = "", text = ""] = TAGGED.exec(line) ?? [];
  if (!isArea(area)) {
    const tags = AREAS.map((one) => `[${one}]`).join(", ");
    throw new Error(`CHANGELOG.md: "${line}" needs one of ${tags}`);
  }
  return { area, runs: parseInline(text) };
}

function parseGroup(chunk: string): ChangeGroup {
  const [title = ""] = chunk.split("\n");
  const items = [...chunk.matchAll(ITEM)].map(([, item = ""]) =>
    parseItem(item),
  );
  return { title: title.trim(), items };
}

function parseWeek(chunk: string): ChangeWeek {
  const [head = "", ...groups] = chunk.split(/^### /m);
  const [title = ""] = head.split("\n");
  return {
    id: slug(title),
    title: title.trim(),
    groups: groups.map((group) => parseGroup(group)),
  };
}

export function parseChangelog(source: string): Changelog {
  const [, ...weeks] = source.split(/^## /m);
  return { weeks: weeks.map((week) => parseWeek(week)) };
}

export async function loadChangelog(): Promise<Changelog> {
  return parseChangelog(await readFile(FILE, "utf8"));
}
