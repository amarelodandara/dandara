import {
  type RefObject,
  useEffect,
  useEffectEvent,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createRoll } from "./roll";

const BEHIND_DEGREES_PER_CARD = 5;
const SHRINK_PER_CARD = 0.04;
const LIFT_PX_PER_CARD = 16;
const SHRINKS_UNTIL = 10;
const FARTHEST_BEHIND_DEGREES = 66;
const FLIPPED_DEGREES = 82;
const FLIPPED_DEGREES_PER_CARD = 3;
const FARTHEST_FLIPPED_DEGREES = 92;
const FADES_BEHIND_FROM = 7;
const FADES_BEHIND_OVER = 3;
const FADES_FLIPPED_FROM = 2;
const BLURS_BEHIND_FROM = 5;
const BLURS_BEHIND_OVER = 5;
const MOST_BLUR_PX = 6;
const UNBLURRED_PX = 0.05;

const PX_PER_CARD = 44;
const DRAG_FROM_PX = 4;
const MS_PER_SECOND = 1000;
const SAMPLE_WINDOW_MS = 100;

const still = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const angleFor = (d: number) => {
  if (d >= 0)
    return Math.min(FARTHEST_BEHIND_DEGREES, d * BEHIND_DEGREES_PER_CARD);
  if (d > -1) return d * FLIPPED_DEGREES;
  return -Math.min(
    FARTHEST_FLIPPED_DEGREES,
    FLIPPED_DEGREES + (-d - 1) * FLIPPED_DEGREES_PER_CARD,
  );
};

const opacityFor = (d: number) => {
  if (d > FADES_BEHIND_FROM) {
    return Math.max(0, 1 - (d - FADES_BEHIND_FROM) / FADES_BEHIND_OVER);
  }
  if (d < -FADES_FLIPPED_FROM) return Math.max(0, d + FADES_FLIPPED_FROM + 1);
  return 1;
};

export const FALL = { mostBlur: 8, from: 0.05, over: 0.85, feather: 24 };

export type Fall = typeof FALL;

export const FALL_LAYERS = 3;

const clamp = (share: number) => Math.min(1, Math.max(0, share));

const blurFor = (d: number) =>
  d < 0 ? 0 : MOST_BLUR_PX * clamp((d - BLURS_BEHIND_FROM) / BLURS_BEHIND_OVER);

const fallFor = (d: number, fall: Fall) =>
  d >= 0 ? 0 : clamp((-d - fall.from) / fall.over);

const behind = (d: number) => Math.min(SHRINKS_UNTIL, Math.max(0, d));

export function paintSlot(slot: HTMLElement, d: number, fall: Fall = FALL) {
  const back = behind(d);
  slot.style.transform = `translateY(${(-LIFT_PX_PER_CARD * back).toFixed(2)}px) rotateX(${angleFor(d).toFixed(2)}deg) scale(${(1 - SHRINK_PER_CARD * back).toFixed(4)})`;
  slot.style.opacity = opacityFor(d).toFixed(3);
  const blur = blurFor(d);
  slot.style.filter =
    blur > UNBLURRED_PX ? `blur(${blur.toFixed(2)}px)` : "none";
  const share = fallFor(d, fall);
  if (share <= 0) {
    delete slot.dataset.falling;
    return;
  }
  slot.dataset.falling = "";
  slot.style.setProperty(
    "--fall-blur",
    `${(fall.mostBlur * share).toFixed(2)}px`,
  );
  slot.style.setProperty("--fall-feather", `${fall.feather}%`);
  slot.style.setProperty(
    "--fall-reach",
    `${(share * (100 + fall.feather * FALL_LAYERS)).toFixed(2)}%`,
  );
}

export function paint(stage: HTMLElement | null, position: number) {
  if (!stage) return;
  for (const slot of stage.querySelectorAll<HTMLElement>("[data-k]"))
    paintSlot(slot, Number(slot.dataset.k) - position);
}

type Events = {
  onIndex: (index: number, speed: number) => void;
  onLand: (index: number) => void;
  onTap: (k: number) => void;
};

export function useRoll(
  stage: RefObject<HTMLElement | null>,
  events: Events,
  live: boolean,
) {
  const [roll] = useState(createRoll);
  const shown = useRef(0);
  const tap = useEffectEvent(events.onTap);

  useLayoutEffect(() => {
    roll.listen({
      onFrame: (position, speed) => {
        const nearest = Math.round(position);
        if (nearest !== shown.current) {
          shown.current = nearest;
          events.onIndex(nearest, speed);
        }
        paint(stage.current, position);
      },
      onLand: (position) => events.onLand(Math.round(position)),
    });
  });

  useEffect(() => {
    const element = stage.current;
    if (!live || !element) return;
    let down: {
      y: number;
      dragging: boolean;
      samples: [number, number][];
    } | null = null;
    let justDragged = false;

    const onDown = (event: PointerEvent) => {
      if (event.button !== 0) return;
      down = {
        y: event.clientY,
        dragging: false,
        samples: [[event.timeStamp, event.clientY]],
      };
    };
    const onMove = (event: PointerEvent) => {
      if (!down) return;
      const moved = event.clientY - down.y;
      if (!down.dragging && Math.abs(moved) < DRAG_FROM_PX) return;
      if (!down.dragging) element.setPointerCapture(event.pointerId);
      down.dragging = true;
      const [, lastY] = down.samples.at(-1) ?? [0, event.clientY];
      roll.drag((lastY - event.clientY) / PX_PER_CARD);
      down.samples.push([event.timeStamp, event.clientY]);
      down.samples = down.samples.filter(
        ([t]) => event.timeStamp - t < SAMPLE_WINDOW_MS,
      );
    };
    const onUp = (event: PointerEvent) => {
      if (!down) return;
      const { dragging, samples } = down;
      down = null;
      justDragged = dragging;
      if (!dragging) {
        const slot = (event.target as Element).closest<HTMLElement>("[data-k]");
        if (slot) tap(Number(slot.dataset.k));
        return;
      }
      if (still()) {
        roll.rest();
        return;
      }
      const [firstT, firstY] = samples[0];
      const seconds = Math.max(1, event.timeStamp - firstT) / MS_PER_SECOND;
      roll.release((firstY - event.clientY) / PX_PER_CARD / seconds);
    };
    const onClick = (event: MouseEvent) => {
      if (!justDragged) return;
      justDragged = false;
      event.preventDefault();
      event.stopPropagation();
    };

    element.addEventListener("pointerdown", onDown);
    element.addEventListener("pointermove", onMove);
    element.addEventListener("pointerup", onUp);
    element.addEventListener("pointercancel", onUp);
    element.addEventListener("click", onClick, true);
    return () => {
      roll.stop();
      element.removeEventListener("pointerdown", onDown);
      element.removeEventListener("pointermove", onMove);
      element.removeEventListener("pointerup", onUp);
      element.removeEventListener("pointercancel", onUp);
      element.removeEventListener("click", onClick, true);
    };
  }, [live, roll, stage]);

  return roll;
}
