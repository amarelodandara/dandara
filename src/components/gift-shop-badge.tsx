"use client";

import { ArticleBadge } from "@/badges/badge";
import { badgeFor } from "@/badges/pick";
import { useSpringDrag } from "@/lib/spring-drag";

const DRAWN_AT_PX = 240;

export function GiftShopBadge({ slug }: { slug: string }) {
  const { ref, lifted, onPointerDown, onPointerMove } =
    useSpringDrag<HTMLDivElement>();

  return (
    <div
      ref={ref}
      role="presentation"
      aria-hidden="true"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      className={[
        "mx-auto block w-60 touch-none select-none motion-reduce:touch-auto",
        "will-change-transform",
        "transition-[scale] duration-(--motion-quick) ease-out-strong",
        lifted ? "scale-[1.04] cursor-grabbing" : "cursor-grab",
      ].join(" ")}
    >
      <ArticleBadge
        badge={badgeFor(slug)}
        size={DRAWN_AT_PX}
        className="block h-auto w-full"
      />
    </div>
  );
}
