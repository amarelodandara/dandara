"use client";

import Image from "next/image";
import { useRef, type ReactNode, type PointerEvent as ReactPointerEvent } from "react";
import { ANNOTATION, MICRO } from "@/lib/type";
import { findPalette, type Palette } from "@/lib/writing/palettes";
import { PaletteCodeTheme } from "./palette-code-theme";
import { PaletteDiagram } from "./palette-diagram";
import { PaletteSwatches } from "./palette-swatches";
import { PaletteUiWidget } from "./palette-ui-widget";

const CARD = "size-72 shrink-0 snap-start overflow-hidden sm:size-80";

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

function FishCard({ palette }: { palette: Palette }) {
  if (!palette.photo) {
    return (
      <Recessed>
        <p
          className={`${ANNOTATION} text-center leading-normal text-foreground-soft italic`}
        >
          {palette.scientific}
        </p>
      </Recessed>
    );
  }

  return (
    <Recessed>
      <div className="relative size-full self-stretch">
        <Image
          src={palette.photo.src}
          alt={palette.photo.alt}
          fill
          sizes="320px"
          className="object-contain"
        />
        <span
          className={`absolute bottom-1 left-1 rounded-md bg-background px-1.5 py-0.5 shadow-chip ${MICRO} leading-normal text-foreground-soft`}
        >
          {palette.photo.credit}
        </span>
      </div>
    </Recessed>
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
        className="flex cursor-grab touch-pan-y snap-x snap-proximity gap-4 overflow-x-auto pb-2 select-none active:cursor-grabbing"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        <div className={CARD}>
          <FishCard palette={palette} />
        </div>

        <div className={CARD}>
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
