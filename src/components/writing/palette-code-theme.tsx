import hljs from "highlight.js";
import type { CSSProperties } from "react";
import { MICRO } from "@/lib/type";
import { darkest, lightest, midtones, withAlpha, type Palette } from "@/lib/writing/palettes";
import { PaletteCopyButton } from "./palette-copy-button";

const SNIPPET = `type Signal = "spot" | "flash" | "shadow";

function chase(reef: Signal[]): Signal {
  return reef.at(-1) ?? "shadow";
}`;

export function PaletteCodeTheme({ palette }: { palette: Palette }) {
  const ink = darkest(palette);
  const paper = lightest(palette);
  const accents = midtones(palette);
  const highlighted = hljs.highlight(SNIPPET, { language: "typescript" }).value;

  const codeStyle = {
    "--hljs-keyword": accents[0],
    "--hljs-string": accents[1] ?? accents[0],
    "--hljs-number": accents[2] ?? accents[0],
    "--hljs-title": accents[1] ?? accents[0],
    "--hljs-comment": accents.at(-1),
  } as CSSProperties;

  return (
    <div
      className="flex size-full flex-col overflow-hidden rounded-md shadow-label"
      style={{ background: ink, color: paper }}
    >
      <div
        className="flex shrink-0 items-center justify-between px-3 py-2"
        style={{ borderBottom: `1px solid ${withAlpha(paper, 0.14)}` }}
      >
        <span className={`${MICRO} uppercase opacity-60`}>typescript</span>
        <PaletteCopyButton text={SNIPPET} />
      </div>

      <pre className="min-h-0 flex-1 overflow-auto p-4 text-xs/relaxed" style={codeStyle}>
        <code dangerouslySetInnerHTML={{ __html: highlighted }} />
      </pre>
    </div>
  );
}
