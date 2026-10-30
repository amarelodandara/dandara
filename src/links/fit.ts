import type { Link } from "./link";

type Measure = { name: string; title: number; note: number; lines: number };

const PHONE: Measure = { name: "a 320px phone", title: 28, note: 39, lines: 6 };
const WIDE: Measure = { name: "a wide screen", title: 39, note: 54, lines: 5 };

export const BY_CHARACTERS = 39;

function wrap(text: string, perLine: number) {
  let lines = 0;
  let used = perLine;
  for (const word of text.split(" ")) {
    const needs = used === 0 ? word.length : used + 1 + word.length;
    if (needs <= perLine) {
      used = needs;
      continue;
    }
    lines += Math.ceil(word.length / perLine);
    used = word.length % perLine || perLine;
  }
  return { lines, used };
}

export const linesOf = (text: string, perLine: number) =>
  wrap(text, perLine).lines;

function room(text: string, perLine: number, allowed: number) {
  const { lines, used } = wrap(text, perLine);
  if (lines === 0) return allowed * perLine;
  if (lines <= allowed) return (allowed - lines) * perLine + perLine - used;
  let fits = 0;
  for (let at = text.indexOf(" "); at !== -1; at = text.indexOf(" ", at + 1)) {
    if (wrap(text.slice(0, at), perLine).lines > allowed) break;
    fits = at;
  }
  return fits - text.length;
}

export type Field = "title" | "note";

export function roomFor(link: Pick<Link, "title" | "note">, field: Field) {
  const text = (field === "title" ? link.title : link.note) ?? "";
  return Math.min(
    ...[PHONE, WIDE].map((measure) => {
      const other =
        field === "title"
          ? linesOf(link.note ?? "", measure.note)
          : linesOf(link.title, measure.title);
      return room(text, measure[field], Math.max(0, measure.lines - other));
    }),
  );
}

const tooTall = (link: Pick<Link, "title" | "note">, measure: Measure) => {
  const title = linesOf(link.title, measure.title);
  const note = link.note ? linesOf(link.note, measure.note) : 0;
  return title + note > measure.lines
    ? `title and note take ${title} + ${note} lines on ${measure.name}, ${measure.lines} fit`
    : undefined;
};

export function misfits(link: Pick<Link, "title" | "note" | "by">) {
  return [
    tooTall(link, PHONE),
    tooTall(link, WIDE),
    (link.by?.length ?? 0) > BY_CHARACTERS &&
      `by runs past ${BY_CHARACTERS} characters`,
  ].filter((problem) => typeof problem === "string");
}
