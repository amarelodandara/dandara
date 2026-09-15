import { ANNOTATION, MICRO, TITLE } from "@/lib/type";
import type { Palette } from "@/lib/writing/palettes";

const ROLE = "Chief Executive Officer";

export function PaletteUiWidget({ palette }: { palette: Palette }) {
  return (
    <div className="flex w-full items-center gap-3 rounded-(--fish-radius) border border-(--fish-rule) bg-(--fish-ink) p-4 text-(--fish-paper)">
      <span
        aria-hidden="true"
        className="block size-10 shrink-0 rounded-full bg-[linear-gradient(135deg,var(--fish-accent)_0%,var(--fish-accent)_55%,var(--fish-paper)_100%)]"
      />

      <div className="min-w-0 flex-1">
        <p className={`${TITLE} truncate`}>{palette.common}</p>
        <p className={`${ANNOTATION} truncate opacity-60`}>{ROLE}</p>
      </div>

      <span
        className={`grid h-5 min-w-5 shrink-0 place-items-center rounded-full bg-(--fish-accent) px-1.5 text-(--fish-paper) ${MICRO}`}
      >
        <span className="block translate-y-[0.1em] leading-none tabular-nums">
          {palette.colors.length}
        </span>
        <span className="sr-only"> unread</span>
      </span>
    </div>
  );
}
