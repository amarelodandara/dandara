import { MICRO } from "@/lib/type";
import type { Palette } from "./palettes";

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

export function PaletteCodeTheme({ code }: { code: Palette["code"] }) {
  const numbers = Array.from({ length: code.lines }, (_, index) => index + 1);

  return (
    <div className="w-full overflow-hidden [border-radius:var(--fish-code-radius)] border border-(--fish-code-rule) bg-(--fish-code-fill) bg-[image:var(--fish-code-image)] text-(--fish-code-ink) [border-bottom-color:var(--fish-code-underline)]">
      <div
        className={`flex items-center justify-between gap-2 border-b border-(--fish-header-rule) bg-(--fish-header-fill) bg-[image:var(--fish-header-image)] px-3 py-2 text-(--fish-header-ink) ${MICRO}`}
      >
        <span className="flex min-w-0 items-center gap-1.5">
          <FileIcon />
          <span className="truncate">{code.file}</span>
        </span>
        <span className="shrink-0 text-(--fish-header-note) uppercase">
          {code.label}
        </span>
      </div>

      <div className="flex">
        <ol
          aria-hidden="true"
          className={`${MICRO} shrink-0 border-r border-(--fish-header-rule) py-3 pr-2 pl-3 text-right opacity-35 select-none`}
          style={{ lineHeight: LINE }}
        >
          {numbers.map((number) => (
            <li key={number} className="tabular-nums">
              {number}
            </li>
          ))}
        </ol>

        <pre
          className={`${MICRO} min-w-0 flex-1 overflow-x-auto py-3 pr-3 pl-2.5`}
          style={{ lineHeight: LINE }}
        >
          <code dangerouslySetInnerHTML={{ __html: code.html }} />
        </pre>
      </div>
    </div>
  );
}
