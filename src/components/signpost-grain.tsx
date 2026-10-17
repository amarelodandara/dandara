"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const PAST_THE_CORNER = 1.02;
const HELD_CLEAN_MS = 60;
const MS_PER_SECOND = 1000;
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

const growMs = (el: HTMLElement) => {
  const value = getComputedStyle(el)
    .getPropertyValue("--signpost-spot-grow")
    .trim();
  const amount = Number.parseFloat(value) || 0;
  return value.endsWith("ms") ? amount : amount * MS_PER_SECOND;
};

const opensElsewhere = (event: MouseEvent) =>
  event.button !== 0 ||
  event.metaKey ||
  event.ctrlKey ||
  event.shiftKey ||
  event.altKey;

type Spot = "off" | "placing" | "on" | "pressed";

const farthestCorner = (rect: DOMRect, x: number, y: number) =>
  Math.max(
    Math.hypot(x, y),
    Math.hypot(rect.width - x, y),
    Math.hypot(x, rect.height - y),
    Math.hypot(rect.width - x, rect.height - y),
  );

export function SignpostGrain() {
  const ref = useRef<HTMLSpanElement>(null);
  const router = useRouter();

  useEffect(() => {
    const grain = ref.current;
    const sign = grain?.parentElement;
    if (!grain || !sign) return;

    let frame = 0;
    const set = (spot: Spot) => {
      grain.dataset.spot = spot;
    };
    const aim = (event: PointerEvent) => {
      const rect = sign.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      grain.style.setProperty("--signpost-spot-x", `${x}px`);
      grain.style.setProperty("--signpost-spot-y", `${y}px`);
      return { rect, x, y };
    };

    const enter = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      set("placing");
      aim(event);
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => set("on"));
    };
    const move = (event: PointerEvent) => {
      if (grain.dataset.spot === "on") aim(event);
    };
    const leave = () => {
      cancelAnimationFrame(frame);
      set("off");
    };
    const press = (event: PointerEvent) => {
      if (event.button !== 0) return;
      const { rect, x, y } = aim(event);
      const reach = farthestCorner(rect, x, y) * PAST_THE_CORNER;
      grain.style.setProperty("--signpost-spot-reach", `${reach}px`);
      set("pressed");
    };
    let leaving = 0;
    const go = (event: MouseEvent) => {
      const href = sign.getAttribute("href");
      if (!href || grain.dataset.spot !== "pressed") return;
      if (opensElsewhere(event)) return;
      if (window.matchMedia(REDUCED_MOTION).matches) return;
      event.preventDefault();
      window.clearTimeout(leaving);
      leaving = window.setTimeout(
        () => router.push(href),
        growMs(grain) + HELD_CLEAN_MS,
      );
    };

    sign.addEventListener("pointerenter", enter);
    sign.addEventListener("pointermove", move);
    sign.addEventListener("pointerleave", leave);
    sign.addEventListener("pointerdown", press);
    sign.addEventListener("click", go);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(leaving);
      sign.removeEventListener("click", go);
      sign.removeEventListener("pointerenter", enter);
      sign.removeEventListener("pointermove", move);
      sign.removeEventListener("pointerleave", leave);
      sign.removeEventListener("pointerdown", press);
    };
  }, [router]);

  return (
    <span
      ref={ref}
      aria-hidden="true"
      data-signpost-grain=""
      data-spot="off"
      className="pointer-events-none absolute inset-0 -z-10 rounded-[inherit]"
    />
  );
}
