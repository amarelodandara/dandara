"use client";

import type { Ref } from "react";

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
      data-plaque
      className={[
        "group fixed top-[5vh] left-[3vw] z-20 flex items-center",
        "rounded-sm bg-amber-100 px-3 py-2 shadow-card",
        "transition-[opacity,translate,scale] duration-(--motion-enter) ease-out-strong",
        "active:scale-[0.97] active:duration-(--press)",
        visible ? "opacity-100" : "-translate-y-3 opacity-0",
      ].join(" ")}
    >
      <span className="text-[0.7rem] leading-none font-medium tracking-[0.01em]">
        Visit the gift shop
      </span>
    </button>
  );
}
