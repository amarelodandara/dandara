"use client";

import { useEffect, useRef } from "react";

const TURN = 360;
const STOPS = 8;

const TILTS = Array.from({ length: STOPS - 1 }, (_slot, index) => {
  const angle = ((index + 1) * TURN) / STOPS;
  return angle > TURN / 2 ? angle - TURN : angle;
});

const knock = () => {
  const [pick] = crypto.getRandomValues(new Uint32Array(1));
  return TILTS[pick % TILTS.length];
};

export function SignpostArrow() {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const arrow = ref.current;
    if (!arrow) return;
    arrow.style.setProperty("--tilt", `${knock()}deg`);
    const frame = requestAnimationFrame(() => {
      arrow.dataset.settled = "";
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <svg
      ref={ref}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      data-signpost-arrow
      className="size-4"
    >
      <g
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 8h10" />
        <path d="M9 4l4 4-4 4" />
      </g>
    </svg>
  );
}
