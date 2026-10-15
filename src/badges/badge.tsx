"use client";

import { useEffect, useId, useRef } from "react";
import { badgeMarkup, LOOK, placeAlong, type Badge } from "./shape";

const GLOSS_FOLLOW_PER_SECOND = 10;
const LONGEST_FRAME_SECONDS = 1 / 30;
const MS_PER_SECOND = 1000;

const clamp = (value: number) => Math.min(1, Math.max(0, value));

export function ArticleBadge({
  badge,
  size = LOOK.box,
  playing = true,
  className,
}: {
  badge: Badge;
  size?: number;
  playing?: boolean;
  className?: string;
}) {
  const id = `badge${useId().replaceAll(/\W/g, "")}`;
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const gloss = svg.querySelector("[data-gloss]");
    const [restX, restY] = LOOK.glossRest;
    const aim: { x: number; y: number } = { x: restX, y: restY };
    const shine: { x: number; y: number } = { x: restX, y: restY };
    let drift = 0;
    let clock = 0;
    let seen = true;
    let frame = 0;
    let previous = performance.now();

    const draw = (now: number) => {
      const elapsed = Math.min(
        (now - previous) / MS_PER_SECOND,
        LONGEST_FRAME_SECONDS,
      );
      previous = now;
      drift += elapsed * LOOK.driftPxPerSecond;
      clock += elapsed * MS_PER_SECOND;
      const follow = Math.min(1, elapsed * GLOSS_FOLLOW_PER_SECOND);
      shine.x += (aim.x - shine.x) * follow;
      shine.y += (aim.y - shine.y) * follow;
      for (const [name, value] of [
        ["cx", shine.x],
        ["fx", shine.x],
        ["cy", shine.y],
        ["fy", shine.y],
      ] as const) {
        gloss?.setAttribute(name, value.toFixed(3));
      }
      placeAlong(svg, { badge, ms: clock, drift });
    };

    const loop = (now: number) => {
      draw(now);
      if (playing && seen) frame = requestAnimationFrame(loop);
    };

    const point = (event: PointerEvent) => {
      const box = svg.getBoundingClientRect();
      aim.x = clamp((event.clientX - box.left) / box.width);
      aim.y = clamp((event.clientY - box.top) / box.height);
    };

    const watch = new IntersectionObserver(([entry]) => {
      seen = entry.isIntersecting;
      cancelAnimationFrame(frame);
      if (seen && playing && !still) {
        previous = performance.now();
        frame = requestAnimationFrame(loop);
      }
    });

    placeAlong(svg, { badge, ms: 0, drift: 0 });
    void document.fonts.ready.then(() =>
      placeAlong(svg, { badge, ms: clock, drift }),
    );
    if (!still) {
      watch.observe(svg);
      window.addEventListener("pointermove", point, { passive: true });
    }

    return () => {
      cancelAnimationFrame(frame);
      watch.disconnect();
      window.removeEventListener("pointermove", point);
    };
  }, [badge, playing]);

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${LOOK.box} ${LOOK.box}`}
      width={size}
      height={size}
      aria-hidden="true"
      className={className}
      overflow="visible"
      dangerouslySetInnerHTML={{ __html: badgeMarkup(badge, { id, ms: 0 }) }}
    />
  );
}
