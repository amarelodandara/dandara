"use client";

import Image from "next/image";
import { useRef, type ReactNode, type PointerEvent as ReactPointerEvent } from "react";
import { CAPTION } from "./figure";
import { ANNOTATION } from "@/lib/type";
import { findPalette, type Palette, type PalettePhoto } from "@/lib/writing/palettes";
import { PaletteCodeTheme } from "./palette-code-theme";
import { PaletteDiagram } from "./palette-diagram";
import { PaletteSwatches } from "./palette-swatches";
import { PaletteUiWidget } from "./palette-ui-widget";

const FRAME = 320;
const PHOTO_PADDING = 16;
const PHOTO_FRAME = FRAME - PHOTO_PADDING * 2;
const SQUARE = "size-72 sm:size-80";
const CARD = `${SQUARE} shrink-0 snap-start overflow-hidden`;
const WRAP = "w-72 sm:w-80 shrink-0 snap-start";

function Recessed({ children }: { children: ReactNode }) {
  return (
    <div
      data-recessed
      className="flex size-full items-center justify-center rounded-md bg-background p-4"
    >
      {children}
    </div>
  );
}

function FishPhoto({ photo }: { photo: PalettePhoto }) {
  const baseScale = PHOTO_FRAME / Math.min(photo.width, photo.height);
  const scale = baseScale * (photo.zoom ?? 1);

  return (
    <div className="relative size-full overflow-hidden rounded-sm">
      <Image
        src={photo.src}
        alt={photo.alt}
        width={photo.width}
        height={photo.height}
        sizes="320px"
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: photo.width,
          height: photo.height,
          maxWidth: "none",
          transform: `translate(calc(-50% + ${photo.x ?? 0}px), calc(-50% + ${photo.y ?? 0}px)) scale(${scale})`,
        }}
      />
    </div>
  );
}

function FishCard({ palette }: { palette: Palette }) {
  return (
    <div className={WRAP}>
      <div className={`${SQUARE} overflow-hidden`}>
        <Recessed>
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
  const scroller = useRef<HTMLDivElement>(null);
  const drag = useRef<{ startX: number; startScroll: number } | null>(null);

  function onPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.pointerType === "touch" || !scroller.current) return;
    drag.current = {
      startX: event.clientX,
      startScroll: scroller.current.scrollLeft,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const active = drag.current;
    if (!active || !scroller.current) return;
    scroller.current.scrollLeft = active.startScroll - (event.clientX - active.startX);
  }

  function onPointerUp() {
    drag.current = null;
  }

  return (
    <figure className="my-12">
      <div
        ref={scroller}
        data-palette-carousel
        className="flex cursor-grab touch-pan-y snap-x snap-proximity items-start gap-4 overflow-x-auto pb-2 select-none active:cursor-grabbing"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
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
          <PaletteCodeTheme palette={palette} />
        </div>

        <div className={CARD}>
          <Recessed>
            <PaletteDiagram palette={palette} />
          </Recessed>
        </div>
      </div>
    </figure>
  );
}
