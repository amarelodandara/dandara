"use client";

import {
  useRef,
  type ReactNode,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";

const DRAGGED_PAST_PX = 4;
const PRIMARY_BUTTON = 0;
const GLIDE_FROM_PX_PER_MS = 0.3;
const GLIDE_MS = 250;
const GLIDE_AT_MOST_PX = 400;
const SAMPLE_WINDOW_MS = 80;
const SETTLE_FALLBACK_MS = 800;

type Sample = { x: number; t: number };

const CAROUSEL = [
  "flex cursor-grab snap-x snap-proximity items-start gap-4 overflow-x-auto pb-2 select-none",
  "outline-none active:cursor-grabbing data-dragging:snap-none",
].join(" ");

function prefersLessMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function velocityOf(samples: Sample[], releasedAt: number) {
  const last = samples.at(-1);
  if (!last || releasedAt - last.t > SAMPLE_WINDOW_MS) return 0;
  const first = samples.find((one) => last.t - one.t <= SAMPLE_WINDOW_MS);
  if (!first || last.t === first.t) return 0;
  return (last.x - first.x) / (last.t - first.t);
}

function cardEdgeNearest(node: HTMLElement, aim: number) {
  const cards = [...node.children];
  const first = cards[0]?.getBoundingClientRect().left ?? 0;
  const end = node.scrollWidth - node.clientWidth;
  const edges = cards.map((card) =>
    Math.min(end, card.getBoundingClientRect().left - first),
  );
  const clamped = Math.min(end, Math.max(0, aim));
  let nearest = end;
  for (const edge of edges) {
    if (Math.abs(edge - clamped) < Math.abs(nearest - clamped)) nearest = edge;
  }
  return nearest;
}

function settle(node: HTMLElement, aim: number, smooth: boolean) {
  const snapBack = () => {
    node.removeEventListener("scrollend", snapBack);
    clearTimeout(fallback);
    if (node.dataset.dragging === "settling") delete node.dataset.dragging;
  };
  const fallback = setTimeout(snapBack, SETTLE_FALLBACK_MS);

  node.dataset.dragging = "settling";
  node.addEventListener("scrollend", snapBack);
  node.scrollTo({
    left: cardEdgeNearest(node, aim),
    behavior: smooth ? "smooth" : "instant",
  });
}

export function PaletteCarousel({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const drag = useRef<{
    pointerId: number;
    startX: number;
    startScroll: number;
    shoving: boolean;
    samples: Sample[];
  } | null>(null);
  const shoved = useRef(false);

  function onPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.pointerType === "touch" || !scroller.current) return;
    if (event.button !== PRIMARY_BUTTON || drag.current) return;
    drag.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startScroll: scroller.current.scrollLeft,
      shoving: false,
      samples: [{ x: event.clientX, t: event.timeStamp }],
    };
  }

  function onPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const held = drag.current;
    const node = scroller.current;
    if (!held || held.pointerId !== event.pointerId || !node) return;

    const travel = event.clientX - held.startX;
    if (!held.shoving) {
      if (Math.abs(travel) < DRAGGED_PAST_PX) return;
      held.shoving = true;
      shoved.current = true;
      node.dataset.dragging = "held";
      event.currentTarget.setPointerCapture(held.pointerId);
    }

    held.samples = [
      ...held.samples.filter(
        (one) => event.timeStamp - one.t <= SAMPLE_WINDOW_MS,
      ),
      { x: event.clientX, t: event.timeStamp },
    ];
    node.scrollLeft = held.startScroll - travel;
  }

  function release(event: ReactPointerEvent<HTMLDivElement>, glide: boolean) {
    const held = drag.current;
    if (!held || held.pointerId !== event.pointerId) return;
    drag.current = null;
    if (!held.shoving) return;

    if (event.currentTarget.hasPointerCapture(held.pointerId)) {
      event.currentTarget.releasePointerCapture(held.pointerId);
    }

    const node = scroller.current;
    if (!node) return;

    const still = prefersLessMotion();
    const velocity = velocityOf(held.samples, event.timeStamp);
    const flung = glide && !still && Math.abs(velocity) >= GLIDE_FROM_PX_PER_MS;
    const glideBy = flung ? velocity * GLIDE_MS : 0;
    const capped = Math.max(
      -GLIDE_AT_MOST_PX,
      Math.min(GLIDE_AT_MOST_PX, glideBy),
    );
    const aim = node.scrollLeft - capped;
    settle(node, aim, !still);
  }

  function onPointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    release(event, true);
  }

  function onPointerCancel(event: ReactPointerEvent<HTMLDivElement>) {
    release(event, false);
    shoved.current = false;
  }

  function onClickCapture(event: ReactMouseEvent<HTMLDivElement>) {
    if (!shoved.current) return;
    shoved.current = false;
    event.preventDefault();
    event.stopPropagation();
  }

  return (
    <div
      ref={scroller}
      role="region"
      aria-label={label}
      tabIndex={0}
      data-palette-carousel
      className={CAROUSEL}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      onPointerCancel={onPointerCancel}
      onClickCapture={onClickCapture}
    >
      {children}
    </div>
  );
}
