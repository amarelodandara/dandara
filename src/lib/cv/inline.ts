import { CvParseError } from "./error";
import type { Inline } from "./types";

export type Where = { file: string; line: number };

type Run = { out: Inline[]; where: Where };

const URL = /https?:\/\/[^\s)]+/g;

const TRAILING = ".,;:";

function pushText(run: Run, text: string) {
  if (text === "") return;

  let last = 0;
  for (const match of text.matchAll(URL)) {
    const start = match.index;
    const matched = match[0];
    let end = matched.length;
    while (end > 0 && TRAILING.includes(matched[end - 1])) end -= 1;
    const href = matched.slice(0, end);

    if (start > last) run.out.push({ t: "text", v: text.slice(last, start) });
    run.out.push({ t: "link", v: href, href });
    last = start + href.length;
  }

  if (last >= text.length) return;

  const tail = text.slice(last);
  if (tail.includes("**")) {
    throw new CvParseError(run.where.file, run.where.line, "unclosed `**`");
  }
  run.out.push({ t: "text", v: tail });
}

export function parseInline(text: string, where: Where): Inline[] {
  const run: Run = { out: [], where };

  let rest = text;
  while (rest.length > 0) {
    const open = rest.indexOf("**");
    if (open === -1) {
      pushText(run, rest);
      break;
    }

    const close = rest.indexOf("**", open + 2);
    if (close === -1) {
      throw new CvParseError(where.file, where.line, "unclosed `**`");
    }

    pushText(run, rest.slice(0, open));

    const bold = rest.slice(open + 2, close);
    if (bold.trim() === "") {
      throw new CvParseError(where.file, where.line, "empty `**` pair");
    }
    run.out.push({ t: "bold", v: bold });

    rest = rest.slice(close + 2);
  }

  return run.out;
}
