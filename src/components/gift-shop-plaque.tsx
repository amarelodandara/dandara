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
        "group fixed bottom-[5vh] left-[7vw] z-20 flex items-center gap-2",
        "bg-ink px-4 py-3 text-paper",
        "shadow-[0_6px_24px_-6px_rgb(0_0_0/0.45)]",
        "transition-[opacity,translate] duration-[280ms] ease-[cubic-bezier(0.2,0,0,1)]",
        visible ? "opacity-100" : "translate-y-3 opacity-0",
      ].join(" ")}
    >
      <span className="text-[0.7rem] font-medium tracking-[0.01em]">
        Visit the gift shop
      </span>
      <kbd className="border border-paper/35 px-1.5 py-0.5 font-sans text-[0.6rem] font-medium leading-none tracking-[0.04em] text-paper/75">
        G
      </kbd>
    </button>
  );
}
