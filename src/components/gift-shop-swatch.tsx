"use client";

import {
  useRef,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { useSpringDrag } from "@/lib/spring-drag";
import {
  Announcement,
  CHIP_W,
  COPIED_ANNOUNCEMENT,
  COPIED_NOTE,
  useCopy,
} from "./gift-shop-row";
import { ANNOTATION } from "@/lib/type";

const DRAGGED_PAST_PX = 4;

export function GiftShopSwatch({
  title,
  hex,
  fill,
}: {
  title: string;
  hex: string;
  fill: string;
}) {
  const { ref, lifted, onPointerDown, onPointerMove } =
    useSpringDrag<HTMLButtonElement>();
  const [outcome, copy] = useCopy(hex);
  const copied = outcome === "done";
  const pressedAt = useRef({ x: 0, y: 0 });

  const note = outcome ? COPIED_NOTE[outcome] : hex;
  const announcement = outcome ? COPIED_ANNOUNCEMENT[outcome](hex) : "";

  function press(event: ReactPointerEvent<HTMLElement>) {
    pressedAt.current = { x: event.clientX, y: event.clientY };
    onPointerDown(event);
  }

  function take(event: ReactMouseEvent<HTMLButtonElement>) {
    const shoved =
      event.detail > 0 &&
      Math.hypot(
        event.clientX - pressedAt.current.x,
        event.clientY - pressedAt.current.y,
      ) > DRAGGED_PAST_PX;
    if (shoved) return;
    void copy();
  }

  return (
    <>
      <button
        ref={ref}
        type="button"
        onPointerDown={press}
        onPointerMove={onPointerMove}
        onClick={take}
        data-pressable
        className={[
          `mx-auto flex aspect-[3/4] ${CHIP_W} touch-none motion-reduce:touch-auto flex-col select-none`,
          "bg-white p-1 text-left",
          "transition-[scale,box-shadow] duration-(--motion-quick) ease-out-strong",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/40",
          lifted
            ? "scale-[1.04] cursor-grabbing shadow-card"
            : "cursor-grab shadow-chip",
        ].join(" ")}
      >
        <span aria-hidden="true" className={`block w-full flex-1 ${fill}`} />
        <span className="block px-2 pt-2 pb-1">
          <span className={`block ${ANNOTATION} leading-tight`}>{title}</span>
          <span
            className={`mt-0.5 block ${ANNOTATION} leading-tight text-foreground-soft`}
          >
            {note}
          </span>
          <span className="sr-only">{copied ? "" : ", copy the hex code"}</span>
        </span>
      </button>
      <Announcement>{announcement}</Announcement>
    </>
  );
}
