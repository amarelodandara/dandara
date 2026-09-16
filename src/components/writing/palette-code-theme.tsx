import hljs from "highlight.js";
import { MICRO } from "@/lib/type";
import { codeFor } from "@/lib/writing/palette-code";
import type { Palette } from "@/lib/writing/palettes";

const LINE = "1.35rem";

function FileIcon() {
  return (
    <svg
      width="10"
      height="12"
      viewBox="0 0 10 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      aria-hidden="true"
      className="shrink-0"
    >
      <path d="M1 1h4.5L9 4.5V11H1z" />
      <path d="M5.5 1v3.5H9" />
    </svg>
  );
}

export function PaletteCodeTheme({ palette }: { palette: Palette }) {
  const { language, label, file, code } = codeFor(palette.slug);
  const highlighted = hljs.highlight(code, { language }).value;
  const lines = code.split("\n");

  return (
    <div className="w-full overflow-hidden rounded-t-(--fish-code-radius-top) rounded-b-(--fish-code-radius-bottom) border border-(--fish-code-rule) bg-(--fish-code-fill) bg-[image:var(--fish-code-image)] text-(--fish-code-ink) [border-bottom-color:var(--fish-code-underline)]">
      <div
        className={`flex items-center justify-between gap-2 border-b border-(--fish-header-rule) bg-(--fish-header-fill) px-3 py-2 text-(--fish-header-ink) ${MICRO}`}
      >
        <span className="flex min-w-0 items-center gap-1.5">
          <FileIcon />
          <span className="truncate">{file}</span>
        </span>
        <span className="shrink-0 text-(--fish-header-note) uppercase">
          {label}
        </span>
      </div>

      <div className="flex">
        <ol
          aria-hidden="true"
          className={`${MICRO} shrink-0 border-r border-(--fish-code-rule) py-3 pr-2 pl-3 text-right opacity-35 select-none`}
          style={{ lineHeight: LINE }}
        >
          {lines.map((line, index) => (
            <li key={`${index}-${line}`} className="tabular-nums">
              {index + 1}
            </li>
          ))}
        </ol>

        <pre
          className={`${MICRO} min-w-0 flex-1 overflow-x-auto py-3 pr-3 pl-2.5`}
          style={{ lineHeight: LINE }}
        >
          <code dangerouslySetInnerHTML={{ __html: highlighted }} />
        </pre>
      </div>
    </div>
  );
}
