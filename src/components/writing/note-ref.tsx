"use client";

import type { MouseEvent, ReactNode } from "react";
import { requestNote, useRequestedNote } from "@/lib/article-notes";
import {
  openOverlay,
  SHOP_OVERLAY,
  useActiveOverlay,
} from "@/lib/exclusive-overlay";

const PRESSABLE = [
  "group transition-[color] duration-(--motion-quick) ease-out-strong",
  "can-hover:hover:text-sun-ink focus-visible:text-sun-ink active:text-sun-ink",
  "active:duration-(--press)",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/40",
].join(" ");

const MARKER = [
  "ml-[0.15em] inline-flex min-w-[1.1em] items-center justify-center align-super",
  "rounded-[0.25rem] border border-sun-ink/30 px-1 py-0.5",
  "transition-[background-color,border-color,color] duration-(--motion-quick) ease-out-strong",
  "can-hover:group-hover:border-sun-ink/70 can-hover:group-hover:bg-sun-core/15",
  "can-hover:group-hover:text-sun-ink",
  "group-focus-visible:border-sun-ink/70 group-focus-visible:text-sun-ink",
  "font-mono text-[0.55em] leading-none font-normal text-sun-ink/80",
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
      <span data-marker className={`${MARKER} ${current ? "border-sun-ink bg-sun-core/15 text-sun-ink" : ""}`}>
        {n}
      </span>
      {children ? <span className="sr-only">, note {n}</span> : null}
    </button>
  );
}
