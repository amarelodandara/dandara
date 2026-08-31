"use client";

import type { MouseEvent } from "react";
import { requestNote, useRequestedNote } from "@/lib/article-notes";
import {
  openOverlay,
  SHOP_OVERLAY,
  useActiveOverlay,
} from "@/lib/exclusive-overlay";

const MARKER = [
  "rounded-xs align-super text-[0.62em] leading-none font-medium",
  "transition-[color,opacity] duration-(--motion-quick) ease-out-strong",
  "can-hover:hover:opacity-50",
  "active:opacity-50 active:duration-(--press)",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/40",
].join(" ");

export function Note({ n }: { n: number }) {
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
      aria-label={`Note ${n}`}
      aria-expanded={current}
      data-note-ref={n}
      data-note-current={current || undefined}
      className={`${MARKER} ${current ? "text-foreground" : "text-foreground-soft"}`}
    >
      [{n}]
    </button>
  );
}
