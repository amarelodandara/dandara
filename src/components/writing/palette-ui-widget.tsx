import { ANNOTATION, MICRO, TITLE } from "@/lib/type";
import { roleFor } from "@/lib/writing/palette-widget";
import type { Palette } from "@/lib/writing/palettes";

export function PaletteUiWidget({ palette }: { palette: Palette }) {
  return (
    <div className="flex w-full items-center gap-(--fish-bar-gap) rounded-t-(--fish-bar-radius-top) rounded-b-(--fish-bar-radius-bottom) border border-(--fish-bar-rule) bg-(--fish-bar-fill) bg-[image:var(--fish-bar-image)] p-(--fish-bar-pad) text-(--fish-bar-ink) [border-bottom-color:var(--fish-bar-underline)]">
      <span className="flex shrink-0 items-center self-stretch border-r border-(--fish-bar-cell-rule) p-(--fish-bar-cell-pad)">
        <span
          aria-hidden="true"
          className="block size-10 shrink-0 rounded-full bg-[image:var(--fish-avatar)]"
        />
      </span>

      <div className="min-w-0 flex-1 px-(--fish-bar-cell-pad)">
        <p className={`${TITLE} truncate`}>{palette.common}</p>
        <p className={`${ANNOTATION} truncate opacity-60`}>
          {roleFor(palette.slug)}
        </p>
      </div>

      <span className="flex shrink-0 items-center self-stretch border-l border-(--fish-bar-cell-rule) p-(--fish-bar-cell-pad)">
        <span
          className={`grid h-5 min-w-5 shrink-0 place-items-center rounded-full bg-(--fish-badge-fill) px-1.5 text-(--fish-badge-ink) ${MICRO}`}
        >
          <span className="block translate-y-[0.1em] leading-none tabular-nums">
            {palette.colors.length}
          </span>
          <span className="sr-only"> unread</span>
        </span>
      </span>
    </div>
  );
}
