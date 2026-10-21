"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const EDGE = 40;
const DWELL_BEFORE_PEEKING = 90;
const GRACE_BEFORE_HIDING = 160;

const useMarkedOnTheBody = (peeking: boolean) => {
  useEffect(() => {
    if (!peeking) return;
    document.body.dataset.shopPeek = "";
    return () => {
      delete document.body.dataset.shopPeek;
    };
  }, [peeking]);
};

const useEdgeWatch = ({
  idle,
  peeking,
  setPeeking,
}: {
  idle: boolean;
  peeking: boolean;
  setPeeking: (peeking: boolean) => void;
}) => {
  useEffect(() => {
    if (!idle) return;
    let timer = 0;

    const cancel = () => {
      clearTimeout(timer);
      timer = 0;
    };
    const after = (delay: number, act: () => void) => {
      if (timer !== 0) return;
      timer = window.setTimeout(() => {
        timer = 0;
        act();
      }, delay);
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const atTheEdge = event.clientX <= EDGE;
      if (atTheEdge === peeking) cancel();
      else if (peeking) after(GRACE_BEFORE_HIDING, () => setPeeking(false));
      else if (event.buttons === 0) {
        after(DWELL_BEFORE_PEEKING, () => setPeeking(true));
      }
    };

    const root = document.documentElement;
    window.addEventListener("pointermove", onMove);
    root.addEventListener("pointerleave", cancel);
    return () => {
      window.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", cancel);
      cancel();
    };
  }, [idle, peeking, setPeeking]);
};

export function useEdgePeek(idle: boolean) {
  const pathname = usePathname();
  const [peekedOn, setPeekedOn] = useState<string | null>(null);
  if (peekedOn !== null && !idle) setPeekedOn(null);
  const peeking = idle && peekedOn === pathname;

  const setPeeking = useCallback(
    (on: boolean) => setPeekedOn(on ? pathname : null),
    [pathname],
  );
  const endPeek = useCallback(() => setPeekedOn(null), []);

  useEdgeWatch({ idle, peeking, setPeeking });
  useMarkedOnTheBody(peeking);

  return { peeking, endPeek };
}

export function GiftShopEdge({
  peeking,
  onOpen,
}: {
  peeking: boolean;
  onOpen: () => void;
}) {
  if (!peeking) return null;

  return (
    <div
      aria-hidden
      data-shop-edge
      className="fixed inset-y-0 left-0 z-50 w-10 cursor-pointer"
      onClick={onOpen}
    />
  );
}
