"use client";

import type { MouseEvent, ReactNode } from "react";
import { requestNote, useRequestedNote } from "@/lib/article-notes";
import { MICRO } from "@/lib/type";
import {
  openOverlay,
  SHOP_OVERLAY,
  useActiveOverlay,
} from "@/lib/exclusive-overlay";

const PRESSABLE = [
  "group transition-[color] duration-(--motion-quick) ease-out-strong",
  "can-hover:hover:text-cadmium-700 focus-visible:text-cadmium-700 active:text-cadmium-700",
  "active:duration-(--press)",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-graphite-900/40",
].join(" ");

const MARKER = [
  "ml-[0.3em] inline-flex size-[1.5em] items-center justify-center align-middle",
  "relative after:absolute after:top-1/2 after:left-1/2 after:h-6 after:w-6",
  "after:-translate-x-1/2 after:-translate-y-1/2 after:content-['']",
  "rounded-[0.25rem] bg-cadmium-400 leading-none",
  "transition-[background-color] duration-(--motion-quick) ease-out-strong",
  "can-hover:group-hover:bg-cadmium-500 group-focus-visible:bg-cadmium-500",
  `${MICRO} text-graphite-900`,
].join(" ");

export function Note({ n, children }: { n: number; children?: ReactNode }) {
  const active = useActiveOverlay();
  const requested = useRequestedNote();
  const current = active === SHOP_OVERLAY && requested === n;

  function reveal(event: MouseEvent<HTMLButtonElement>) {
    event.currentTarget.focus();
    requestNote(n);
    if (active === null || active === SHOP_OVERLAY) openOverlay(SHOP_OVERLAY);
  }

  return (
    <button
      type="button"
      onClick={reveal}
      aria-label={children ? undefined : `Note ${n}`}
      aria-expanded={current}
      data-note-ref={n}
      data-note-current={current || undefined}
      className={`${PRESSABLE} inline rounded-xs`}
    >
      {children}
      <span
        data-marker
        className={`${MARKER} ${current ? "bg-cadmium-500" : ""}`}
      >
        {n}
      </span>
      {children ? <span className="sr-only">, note {n}</span> : null}
    </button>
  );
}
