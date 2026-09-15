import hljs from "highlight.js";
import type { CSSProperties } from "react";
import type { Palette } from "@/lib/writing/palettes";

const SNIPPET = `type Signal = "spot" | "flash" | "shadow";

function chase(reef: Signal[]): Signal {
  return reef.at(-1) ?? "shadow";
}`;

export function PaletteCodeTheme({ palette }: { palette: Palette }) {
  const { ink, paper, accents } = palette;
  const highlighted = hljs.highlight(SNIPPET, { language: "typescript" }).value;

  const style = {
    background: ink,
    color: paper,
    "--hljs-keyword": accents[0],
    "--hljs-string": accents[1] ?? accents[0],
    "--hljs-number": accents[2] ?? accents[0],
    "--hljs-title": accents[1] ?? accents[0],
    "--hljs-comment": accents.at(-1),
  } as CSSProperties;

  return (
    <pre className="overflow-x-auto rounded-md p-4 text-xs/normal" style={style}>
      <code dangerouslySetInnerHTML={{ __html: highlighted }} />
    </pre>
  );
}
