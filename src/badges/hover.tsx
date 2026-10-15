"use client";

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type FocusEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { ArticleBadge } from "./badge";
import { LOOK, type Badge } from "./shape";

const SCALE = 0.75;
const SIZE = LOOK.box * SCALE;
const HALF = SIZE / 2;
const STIFFNESS = 305;
const DAMPING = 24;
const TILT_PER_PX_PER_SECOND = 0.029;
const MOST_TILT_DEGREES = 14;
const TILT_FOLLOW_PER_SECOND = 12;
const OFFSET_X = 34;
const OFFSET_Y = -20;
const LONGEST_FRAME_SECONDS = 1 / 30;
const MS_PER_SECOND = 1000;
const AT_REST_PX = 0.2;

const SHOWN: CSSProperties = {
  opacity: 1,
  transform: "translate(-50%, -50%) scale(1) rotate(0deg)",
  transition:
    "opacity 180ms var(--ease-out-strong), transform 420ms var(--ease-settle)",
};

const HIDDEN: CSSProperties = {
  opacity: 0,
  transform: "translate(-50%, -50%) scale(0.55) rotate(-8deg)",
  transition:
    "opacity 200ms var(--ease-out-strong), transform 200ms var(--ease-out-strong)",
};

const STILL_SHOWN: CSSProperties = {
  opacity: 1,
  transform: "translate(-50%, -50%)",
  transition: "opacity 150ms linear",
};
const STILL_HIDDEN: CSSProperties = { ...STILL_SHOWN, opacity: 0 };

type Motion = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  tx: number;
  ty: number;
  tilt: number;
};

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

const nothing = () => {};

const neverChanges = () => nothing;

const onMotionPreference = (change: () => void) => {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener("change", change);
  return () => query.removeEventListener("change", change);
};

const prefersStill = () => window.matchMedia(REDUCED_MOTION).matches;

const rowOf = (target: EventTarget | null) =>
  target instanceof Element
    ? target.closest<HTMLElement>("[data-badge]")
    : null;

const besideRow = (row: HTMLElement) => {
  const box = row.getBoundingClientRect();
  return {
    x: Math.min(window.innerWidth - HALF, box.right + HALF),
    y: box.top + box.height / 2,
  };
};

export function BadgeHover({
  badges,
  children,
}: {
  badges: Record<string, Badge>;
  children: ReactNode;
}) {
  const [active, setActive] = useState<string | null>(null);
  const mounted = useSyncExternalStore(
    neverChanges,
    () => true,
    () => false,
  );
  const still = useSyncExternalStore(
    onMotionPreference,
    prefersStill,
    () => false,
  );
  const floater = useRef<HTMLDivElement>(null);
  const motion = useRef<Motion>({
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    tx: 0,
    ty: 0,
    tilt: 0,
  });
  const placed = useRef(false);
  const frame = useRef(0);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  const paint = () => {
    const { x, y, tilt } = motion.current;
    if (floater.current) {
      floater.current.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${tilt.toFixed(2)}deg)`;
    }
  };

  const run = () => {
    cancelAnimationFrame(frame.current);
    let previous = performance.now();
    const step = (now: number) => {
      const elapsed = Math.min(
        (now - previous) / MS_PER_SECOND,
        LONGEST_FRAME_SECONDS,
      );
      previous = now;
      const spring = motion.current;
      spring.vx +=
        (-STIFFNESS * (spring.x - spring.tx) - DAMPING * spring.vx) * elapsed;
      spring.vy +=
        (-STIFFNESS * (spring.y - spring.ty) - DAMPING * spring.vy) * elapsed;
      spring.x += spring.vx * elapsed;
      spring.y += spring.vy * elapsed;
      const lean = Math.max(
        -MOST_TILT_DEGREES,
        Math.min(MOST_TILT_DEGREES, spring.vx * TILT_PER_PX_PER_SECOND),
      );
      spring.tilt +=
        (lean - spring.tilt) * Math.min(1, elapsed * TILT_FOLLOW_PER_SECOND);
      paint();
      const moving =
        Math.hypot(
          spring.x - spring.tx,
          spring.y - spring.ty,
          spring.vx,
          spring.vy,
        ) > AT_REST_PX || Math.abs(spring.tilt) > AT_REST_PX;
      if (moving) frame.current = requestAnimationFrame(step);
    };
    frame.current = requestAnimationFrame(step);
  };

  const jumpTo = (x: number, y: number) => {
    Object.assign(motion.current, {
      x,
      y,
      tx: x,
      ty: y,
      vx: 0,
      vy: 0,
      tilt: 0,
    });
    placed.current = true;
    paint();
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    const row = rowOf(event.target);
    setActive(row?.dataset.badge ?? null);
    if (!row) return;

    if (still) {
      const spot = besideRow(row);
      jumpTo(spot.x, spot.y);
      return;
    }

    const tx = event.clientX + OFFSET_X + HALF;
    const ty = event.clientY + OFFSET_Y;
    if (placed.current) Object.assign(motion.current, { tx, ty });
    else jumpTo(tx, ty);
    run();
  };

  const leave = () => {
    setActive(null);
    placed.current = false;
  };

  const onFocus = (event: FocusEvent<HTMLDivElement>) => {
    const row = rowOf(event.target);
    if (!row) return;
    const spot = besideRow(row);
    jumpTo(spot.x, spot.y);
    setActive(row.dataset.badge ?? null);
  };

  const shown = still ? STILL_SHOWN : SHOWN;
  const hidden = still ? STILL_HIDDEN : HIDDEN;

  return (
    <div
      role="presentation"
      onPointerMove={onPointerMove}
      onPointerLeave={leave}
      onFocus={onFocus}
      onBlur={leave}
    >
      {children}
      {mounted
        ? createPortal(
            <div
              ref={floater}
              aria-hidden="true"
              style={{
                position: "fixed",
                left: 0,
                top: 0,
                zIndex: 40,
                pointerEvents: "none",
                willChange: "transform",
              }}
            >
              {Object.entries(badges).map(([slug, badge]) => (
                <div
                  key={slug}
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    ...(slug === active ? shown : hidden),
                  }}
                >
                  <ArticleBadge
                    badge={badge}
                    size={SIZE}
                    playing={slug === active}
                  />
                </div>
              ))}
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
