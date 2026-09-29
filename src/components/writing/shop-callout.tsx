"use client";

import type { ReactNode } from "react";
import { Kbd } from "@/components/kbd";
import { openOverlay, SHOP_OVERLAY } from "@/lib/exclusive-overlay";
import { ANNOTATION, LABEL } from "@/lib/type";

const OPEN = [
  "flex shrink-0 items-center rounded-lg bg-cadmium-50 px-2.5 py-2 shadow-chip",
  "transition-[box-shadow,scale] duration-(--motion-quick) ease-out-strong",
  "can-hover:hover:shadow-card focus-visible:shadow-card",
  "active:scale-[0.97] active:duration-(--press)",
].join(" ");

export function ShopCallout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 rounded-md bg-cadmium-100 py-3 pr-3 pl-4">
      <p className={LABEL}>{children}</p>
      <button
        type="button"
        onClick={() => openOverlay(SHOP_OVERLAY)}
        aria-keyshortcuts="g"
        data-pressable
        className={OPEN}
      >
        <span className={`${ANNOTATION} leading-none text-graphite-700`}>
          Open gift shop
        </span>
        <Kbd>G</Kbd>
      </button>
    </div>
  );
}
