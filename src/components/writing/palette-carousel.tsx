"use client";

import {
  useRef,
  type ReactNode,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";

const DRAGGED_PAST_PX = 4;

export function PaletteCarousel({ children }: { children: ReactNode }) {
  const scroller = useRef<HTMLDivElement>(null);
  const drag = useRef<{
    pointerId: number;
    startX: number;
    startScroll: number;
    shoving: boolean;
  } | null>(null);
  const shoved = useRef(false);

  function onPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.pointerType === "touch" || !scroller.current) return;
    drag.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startScroll: scroller.current.scrollLeft,
      shoving: false,
    };
  }

  function onPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const held = drag.current;
    if (!held || !scroller.current) return;

    const travel = event.clientX - held.startX;
    if (!held.shoving) {
      if (Math.abs(travel) < DRAGGED_PAST_PX) return;
      held.shoving = true;
      shoved.current = true;
      event.currentTarget.setPointerCapture(held.pointerId);
    }

    scroller.current.scrollLeft = held.startScroll - travel;
  }

  function onPointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    const held = drag.current;
    if (
      held?.shoving &&
      event.currentTarget.hasPointerCapture(held.pointerId)
    ) {
      event.currentTarget.releasePointerCapture(held.pointerId);
    }
    drag.current = null;
  }

  function onClickCapture(event: ReactMouseEvent<HTMLDivElement>) {
    if (!shoved.current) return;
    shoved.current = false;
    event.preventDefault();
    event.stopPropagation();
  }

  return (
    <div
      ref={scroller}
      data-palette-carousel
      className="flex cursor-grab touch-pan-y snap-x snap-proximity items-start gap-4 overflow-x-auto pb-2 select-none active:cursor-grabbing"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      onClickCapture={onClickCapture}
    >
      {children}
    </div>
  );
}
