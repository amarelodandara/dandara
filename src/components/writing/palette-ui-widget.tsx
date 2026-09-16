import { ANNOTATION, MICRO, TITLE } from "@/lib/type";
import { roleFor } from "@/lib/writing/palette-widget";
import type { Palette } from "@/lib/writing/palettes";

export function PaletteUiWidget({ palette }: { palette: Palette }) {
  return (
    <div className="flex w-full items-center gap-3 rounded-t-(--fish-bar-radius-top) rounded-b-(--fish-bar-radius-bottom) border border-(--fish-bar-rule) bg-(--fish-bar-fill) bg-[image:var(--fish-bar-image)] p-4 text-(--fish-bar-ink) [border-bottom-color:var(--fish-bar-underline)]">
      <span
        aria-hidden="true"
        className="block size-10 shrink-0 rounded-full bg-[image:var(--fish-avatar)]"
      />

      <div className="min-w-0 flex-1">
        <p className={`${TITLE} truncate`}>{palette.common}</p>
        <p className={`${ANNOTATION} truncate opacity-60`}>
          {roleFor(palette.slug)}
        </p>
      </div>

      <span
        className={`grid h-5 min-w-5 shrink-0 place-items-center rounded-full bg-(--fish-badge-fill) px-1.5 text-(--fish-badge-ink) ${MICRO}`}
      >
        <span className="block translate-y-[0.1em] leading-none tabular-nums">
          {palette.colors.length}
        </span>
        <span className="sr-only"> unread</span>
      </span>
    </div>
  );
}
