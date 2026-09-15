import { ANNOTATION } from "@/lib/type";
import { findPalette } from "@/lib/writing/palettes";
import { PaletteCodeTheme } from "./palette-code-theme";
import { PaletteDiagram } from "./palette-diagram";
import { PaletteSwatches } from "./palette-swatches";
import { PaletteUiWidget } from "./palette-ui-widget";

function FishPlaceholder({ scientific }: { scientific: string }) {
  return (
    <div
      data-recessed
      className="flex aspect-square w-full items-center justify-center rounded-md bg-background p-3 sm:w-36"
    >
      <p
        className={`${ANNOTATION} text-center leading-normal text-foreground-soft italic`}
      >
        {scientific}
      </p>
    </div>
  );
}

export function PaletteShowcase({ slug }: { slug: string }) {
  const palette = findPalette(slug);

  return (
    <figure className="my-12">
      <div className="grid gap-4 sm:grid-cols-[9rem_1fr_14rem]">
        <FishPlaceholder scientific={palette.scientific} />
        <PaletteSwatches palette={palette} />
        <PaletteUiWidget palette={palette} />

        <div className="sm:col-span-3">
          <PaletteCodeTheme palette={palette} />
        </div>

        <div className="sm:col-span-3">
          <PaletteDiagram palette={palette} />
        </div>
      </div>
    </figure>
  );
}
