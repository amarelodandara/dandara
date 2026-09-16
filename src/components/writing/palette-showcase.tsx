import type { CSSProperties, ReactNode } from "react";
import { CAPTION } from "./figure";
import { ANNOTATION } from "@/lib/type";
import {
  findPalette,
  type Palette,
  type PalettePhoto,
} from "@/lib/writing/palettes";
import { skinFor } from "@/lib/writing/palette-skin";
import { PaletteCarousel } from "./palette-carousel";
import { PaletteCodeTheme } from "./palette-code-theme";
import { PaletteDiagram } from "./palette-diagram";
import { PaletteSwatches } from "./palette-swatches";
import { PaletteUiWidget } from "./palette-ui-widget";

const PHOTO_FRAME = 320;
const SQUARE = "size-72 sm:size-80";
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
      className={`relative flex size-full items-center justify-center overflow-hidden rounded-md bg-background ${bleed ? "" : "p-4"}`}
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

function FishPhoto({ photo }: { photo: PalettePhoto }) {
  const baseScale = PHOTO_FRAME / Math.min(photo.width, photo.height);
  const scale = baseScale * (photo.zoom ?? 1);
  const scaleX = photo.flip ? -scale : scale;

  return (
    <div className="relative size-full overflow-hidden rounded-md">
      <img
        src={photo.src}
        alt={photo.alt}
        width={photo.width}
        height={photo.height}
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: photo.width,
          height: photo.height,
          maxWidth: "none",
          transform: `translate(calc(-50% + ${photo.x ?? 0}px), calc(-50% + ${photo.y ?? 0}px)) scale(${scaleX}, ${scale})`,
        }}
      />
    </div>
  );
}

function FishCard({ palette }: { palette: Palette }) {
  return (
    <div className={WRAP}>
      <div className={`${SQUARE} overflow-hidden`}>
        <Recessed bleed={Boolean(palette.photo)}>
          {palette.photo ? (
            <FishPhoto photo={palette.photo} />
          ) : (
            <p
              className={`${ANNOTATION} text-center leading-normal text-foreground-soft italic`}
            >
              {palette.scientific}
            </p>
          )}
        </Recessed>
      </div>
      {palette.photo ? <p className={CAPTION}>{palette.photo.credit}</p> : null}
    </div>
  );
}

export function PaletteShowcase({ slug }: { slug: string }) {
  const palette = findPalette(slug);

  return (
    <figure className="my-12" style={skinFor(palette)}>
      <PaletteCarousel>
        <FishCard palette={palette} />

        <div className={WRAP}>
          <PaletteSwatches palette={palette} />
        </div>

        <div className={CARD}>
          <Recessed>
            <PaletteUiWidget palette={palette} />
          </Recessed>
        </div>

        <div className={CARD}>
          <Recessed>
            <PaletteCodeTheme palette={palette} />
          </Recessed>
        </div>

        <div className={CARD}>
          <Recessed style={{ background: "var(--graph-paper)" }}>
            <PaletteDiagram palette={palette} />
          </Recessed>
        </div>
      </PaletteCarousel>
    </figure>
  );
}
