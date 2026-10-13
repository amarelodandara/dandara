import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { springToRest } from "@/lib/spring-drag";

const ROOM_TO_DRAG =
  "(min-width: 768px) and (hover: hover) and (pointer: fine)";
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
const DRAG_THRESHOLD_PX = 4;
const KEPT_ON_SCREEN_PX = 72;

type Offset = { x: number; y: number };
type Resting = { left: number; top: number; right: number; bottom: number };

type Session = {
  id: string;
  pointerId: number;
  startX: number;
  startY: number;
  origin: Offset;
  resting: Resting;
  travelled: boolean;
};

const HOME: Offset = { x: 0, y: 0 };

const between = (value: number, low: number, high: number) =>
  Math.min(Math.max(value, Math.min(low, high)), Math.max(low, high));

const keptWithinReach = (resting: Resting, offset: Offset): Offset => ({
  x: between(
    offset.x,
    KEPT_ON_SCREEN_PX - resting.right,
    window.innerWidth - KEPT_ON_SCREEN_PX - resting.left,
  ),
  y: between(
    offset.y,
    KEPT_ON_SCREEN_PX - resting.bottom,
    window.innerHeight - KEPT_ON_SCREEN_PX - resting.top,
  ),
});

const paint = (el: HTMLElement | undefined, { x, y }: Offset) => {
  if (!el) return;
  el.style.translate = x === 0 && y === 0 ? "" : `${x}px ${y}px`;
};

const restingRect = (el: HTMLElement, offset: Offset): Resting => {
  const rect = el.getBoundingClientRect();
  return {
    left: rect.left - offset.x,
    top: rect.top - offset.y,
    right: rect.right - offset.x,
    bottom: rect.bottom - offset.y,
  };
};

export function useLooseDrag() {
  const elements = useRef(new Map<string, HTMLElement>());
  const offsets = useRef(new Map<string, Offset>());
  const springs = useRef(new Map<string, () => void>());
  const session = useRef<Session | null>(null);
  const swallowClick = useRef(false);
  const top = useRef(1);
  const [moved, setMoved] = useState(false);
  const [dragging, setDragging] = useState<string | null>(null);

  const register = useCallback(
    (id: string) => (el: HTMLElement | null) => {
      if (el) {
        elements.current.set(id, el);
      } else {
        elements.current.delete(id);
      }
    },
    [],
  );

  const end = useCallback(() => {
    const held = session.current;
    if (!held) return;
    session.current = null;
    elements.current.get(held.id)?.releasePointerCapture?.(held.pointerId);
    if (!held.travelled) return;
    swallowClick.current = true;
    setDragging(null);
    setMoved(true);
  }, []);

  useEffect(() => {
    const bail = () => end();
    const stopAll = springs.current;
    window.addEventListener("blur", bail);
    document.addEventListener("pointerup", bail);
    document.addEventListener("pointercancel", bail);
    return () => {
      window.removeEventListener("blur", bail);
      document.removeEventListener("pointerup", bail);
      document.removeEventListener("pointercancel", bail);
      for (const stop of stopAll.values()) stop();
    };
  }, [end]);

  const onPointerDown = useCallback(
    (id: string, event: ReactPointerEvent<HTMLElement>) => {
      if (event.button !== 0) return;
      if (!window.matchMedia(ROOM_TO_DRAG).matches) return;
      const el = elements.current.get(id);
      if (!el) return;

      springs.current.get(id)?.();
      springs.current.delete(id);
      const origin = offsets.current.get(id) ?? HOME;
      swallowClick.current = false;
      session.current = {
        id,
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        origin,
        resting: restingRect(el, origin),
        travelled: false,
      };
    },
    [],
  );

  const onPointerMove = useCallback((event: ReactPointerEvent<HTMLElement>) => {
    const held = session.current;
    if (!held || held.pointerId !== event.pointerId) return;
    const dx = event.clientX - held.startX;
    const dy = event.clientY - held.startY;
    if (!held.travelled && Math.hypot(dx, dy) < DRAG_THRESHOLD_PX) return;

    const el = elements.current.get(held.id);
    if (!el) return;
    if (!held.travelled) {
      held.travelled = true;
      el.setPointerCapture(event.pointerId);
      top.current += 1;
      el.style.zIndex = String(top.current);
      setDragging(held.id);
    }

    const next = keptWithinReach(held.resting, {
      x: held.origin.x + dx,
      y: held.origin.y + dy,
    });
    offsets.current.set(held.id, next);
    paint(el, next);
  }, []);

  const onClickCapture = useCallback((event: ReactMouseEvent) => {
    if (!swallowClick.current) return;
    swallowClick.current = false;
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const reset = useCallback(() => {
    const snap = window.matchMedia(REDUCED_MOTION).matches;
    for (const [id, from] of offsets.current) {
      const el = elements.current.get(id);
      const settle = () => {
        springs.current.delete(id);
        if (el) el.style.zIndex = "";
      };
      offsets.current.delete(id);
      if (snap) {
        paint(el, HOME);
        settle();
        continue;
      }
      springs.current.get(id)?.();
      springs.current.set(
        id,
        springToRest({
          from,
          velocity: HOME,
          onFrame: (x, y) => paint(el, { x, y }),
          onRest: settle,
        }),
      );
    }
    setMoved(false);
  }, []);

  return {
    register,
    moved,
    dragging,
    reset,
    onPointerDown,
    onPointerMove,
    onPointerEnd: end,
    onClickCapture,
  };
}
