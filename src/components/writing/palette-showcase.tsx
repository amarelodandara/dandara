"use client";

import { useRef, type PointerEvent as ReactPointerEvent } from "react";
import { ANNOTATION } from "@/lib/type";
import { findPalette } from "@/lib/writing/palettes";
import { PaletteCodeTheme } from "./palette-code-theme";
import { PaletteDiagram } from "./palette-diagram";
import { PaletteSwatches } from "./palette-swatches";
import { PaletteUiWidget } from "./palette-ui-widget";

const CARD = "size-72 shrink-0 snap-start overflow-hidden sm:size-80";

function FishPlaceholder({ scientific }: { scientific: string }) {
  return (
    <div
      data-recessed
      className="flex size-full items-center justify-center rounded-md bg-background p-4"
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
          <FishPlaceholder scientific={palette.scientific} />
        </div>

        <div className={CARD}>
          <PaletteSwatches palette={palette} />
        </div>

        <div className={`${CARD} flex items-center`}>
          <PaletteUiWidget palette={palette} />
        </div>

        <div className={CARD}>
          <PaletteCodeTheme palette={palette} />
        </div>

        <div className={`${CARD} flex items-center`}>
          <PaletteDiagram palette={palette} />
        </div>
      </div>
    </figure>
  );
}
