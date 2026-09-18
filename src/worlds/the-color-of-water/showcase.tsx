import type { CSSProperties, ReactNode } from "react";
import { CAPTION } from "@/components/writing/figure";
import { PaletteCarousel } from "./carousel";
import { PaletteCodeTheme } from "./code-card";
import { PaletteDiagram } from "./graphs/drawing";
import { PALETTES, type Palette as PaletteData } from "./palettes";
import { PersonBar } from "./person-bar";
import { PaletteSwatches } from "./swatches";

const SQUARE = "size-72 sm:size-80";
const SHOWCASE = [
  "my-12 rounded-md outline-offset-4 outline-graphite-900/40",
  "has-[[data-palette-carousel]:focus-visible]:outline-2",
].join(" ");
const CARD = `${SQUARE} shrink-0 snap-start overflow-hidden`;
const WRAP = "w-72 sm:w-80 shrink-0 snap-start";

function Recessed({
  children,
  bleed = false,
  style,
}: {
  children: ReactNode;
  bleed?: boolean;
  style?: CSSProperties;
}) {
  return (
    <div
      data-recessed
      style={style}
      className={`relative flex size-full items-center justify-center overflow-hidden rounded-md bg-cadmium-50 ${bleed ? "" : "p-4"}`}
    >
      {children}
      {bleed ? (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-md shadow-hollow"
        />
      ) : null}
    </div>
  );
}

function FishCard({ photo }: { photo: PaletteData["photo"] }) {
  return (
    <div className={WRAP}>
      <div className={`${SQUARE} overflow-hidden`}>
        <Recessed bleed>
          <div className="relative size-full overflow-hidden rounded-md">
            <img
              data-fish-photo
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              loading="lazy"
              decoding="async"
            />
          </div>
        </Recessed>
      </div>
      <p className={CAPTION}>{photo.credit}</p>
    </div>
  );
}

export function Palette({ slug }: { slug: string }) {
  const palette = PALETTES[slug];

  return (
    <figure className={SHOWCASE} data-palette={palette.slug}>
      <PaletteCarousel label={`${palette.name} showcase`}>
        <FishCard photo={palette.photo} />

        <div className={WRAP}>
          <PaletteSwatches name={palette.name} swatches={palette.swatches} />
        </div>

        <div className={CARD}>
          <Recessed>
            <PersonBar
              person={palette.person}
              unread={palette.swatches.length}
            />
          </Recessed>
        </div>

        <div className={CARD}>
          <Recessed>
            <PaletteCodeTheme code={palette.code} />
          </Recessed>
        </div>

        <div className={CARD}>
          <Recessed style={{ background: "var(--graph-paper)" }}>
            <PaletteDiagram graph={palette.graph} />
          </Recessed>
        </div>
      </PaletteCarousel>
    </figure>
  );
}
