"use client";

import type { Ref } from "react";

/**
 * The way in. A museum plaque in the corner, in the same quiet type as the
 * section labels, appearing only once the visitor has walked past the landing.
 *
 * It sits outside the page plane on purpose: the plane takes a transform while
 * the shop is open, and a transform captures `position: fixed` descendants.
 */
export function GiftShopPlaque({
  visible,
  onOpen,
  ref,
}: {
  visible: boolean;
  onOpen: () => void;
  ref?: Ref<HTMLButtonElement>;
}) {
  return (
    <button
      ref={ref}
      type="button"
      onClick={onOpen}
      inert={!visible || undefined}
      className={[
        "group fixed top-[5vh] left-[3vw] z-20 flex items-center gap-2",
        "rounded-sm border border-foreground/15 bg-white px-3 py-2",
        "shadow-[0_2px_10px_-4px_rgb(0_0_0/0.18)]",
        "transition-[opacity,translate] duration-[280ms] ease-[cubic-bezier(0.2,0,0,1)]",
        /* Enters from above now that it lives at the top. */
        visible ? "opacity-100" : "-translate-y-3 opacity-0",
      ].join(" ")}
    >
      {/* `leading-none` on both halves is what does the optical alignment: the
          label would otherwise carry body line-height, so centring the two
          boxes would centre the label's leading rather than its glyphs. */}
      <span className="text-[0.7rem] font-medium leading-none tracking-[0.01em]">
        Visit the gift shop
      </span>
      <kbd className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border border-foreground/25 font-sans text-[0.6rem] font-medium leading-none tracking-[0.04em] text-foreground-soft">
        G
      </kbd>
    </button>
  );
}
