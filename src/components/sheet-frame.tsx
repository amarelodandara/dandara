"use client";

import {
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type RefObject,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import type { SheetKind, SheetSize } from "./sheet";
import type { Placement } from "@/lib/scatter";

const WIDTH: Record<SheetSize, string> = {
  narrow: "clamp(9.5rem, 42vw, 18rem)",
  wide: "clamp(11rem, 52vw, 24rem)",
  feature: "clamp(13rem, 66vw, 38rem)",
};

const BACKGROUND: Record<SheetKind, string> = {
  professional: "bg-professional",
  personal: "bg-creative",
};

const DRAG_THRESHOLD = 4;
const KEPT_ON_SCREEN_PX = 72;

const EASE_OUT_STRONG = "cubic-bezier(0.2, 0, 0, 1)";
const FLIP_DURATION = 280;

const MAX_ZOOM = 2.4;

const ZOOM_WIDTH_SHARE = 0.9;
const ZOOM_HEIGHT_SHARE = 0.86;
const SCROLLING_HEIGHT_SHARE = 0.88;

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

const queries = new Map<string, MediaQueryList>();

const matches = (query: string) => {
  if (typeof window === "undefined") return false;
  let list = queries.get(query);
  if (!list) {
    list = window.matchMedia(query);
    queries.set(query, list);
  }
  return list.matches;
};

type Offset = { x: number; y: number };

type RestingRect = {
  left: number;
  top: number;
  right: number;
  bottom: number;
};

type DragSession = {
  pointerId: number;
  startX: number;
  startY: number;
  originX: number;
  originY: number;
  resting: RestingRect;
  moved: boolean;
};

const between = (value: number, edges: [number, number]) =>
  Math.min(Math.max(value, Math.min(...edges)), Math.max(...edges));

const restingRect = (frame: HTMLElement, offset: Offset): RestingRect => {
  const rect = frame.getBoundingClientRect();
  return {
    left: rect.left - offset.x,
    top: rect.top - offset.y,
    right: rect.right - offset.x,
    bottom: rect.bottom - offset.y,
  };
};

const keptWithinReach = (resting: RestingRect, offset: Offset): Offset => ({
  x: between(offset.x, [
    KEPT_ON_SCREEN_PX - resting.right,
    window.innerWidth - KEPT_ON_SCREEN_PX - resting.left,
  ]),
  y: between(offset.y, [
    KEPT_ON_SCREEN_PX - resting.bottom,
    window.innerHeight - KEPT_ON_SCREEN_PX - resting.top,
  ]),
});

function useKeptWithinReach({
  frameRef,
  drag,
  focused,
}: {
  frameRef: RefObject<HTMLDivElement | null>;
  drag: RefObject<Offset>;
  focused: boolean;
}) {
  useEffect(() => {
    if (focused) return;

    const haulBackIntoReach = () => {
      const frame = frameRef.current;
      if (!frame) return;
      const next = keptWithinReach(restingRect(frame, drag.current), drag.current);
      if (next.x === drag.current.x && next.y === drag.current.y) return;
      drag.current = next;
      frame.style.translate = `calc(-50% + ${next.x}px) ${next.y}px`;
    };

    window.addEventListener("resize", haulBackIntoReach);
    return () => window.removeEventListener("resize", haulBackIntoReach);
  }, [drag, focused, frameRef]);
}

export type SheetFrameProps = {
  id: string;
  kind: SheetKind;
  title: string;
  size: SheetSize;
  placement: Placement;
  z: number;
  focused: boolean;
  dimmed: boolean;
  onOpen: (id: string) => void;
  onClose: () => void;
  onBringToFront: (id: string) => void;
  children: ReactNode;
};

function useBailOutOfALostPointer(endDrag: (pointerId?: number) => void) {
  useEffect(() => {
    const bail = () => endDrag();
    window.addEventListener("blur", bail);
    document.addEventListener("pointerup", bail);
    document.addEventListener("pointercancel", bail);
    return () => {
      window.removeEventListener("blur", bail);
      document.removeEventListener("pointerup", bail);
      document.removeEventListener("pointercancel", bail);
    };
  }, [endDrag]);
}

function SheetFrameImpl({
  id,
  kind,
  title,
  size,
  placement,
  z,
  focused,
  dimmed,
  onOpen,
  onClose,
  onBringToFront,
  children,
}: SheetFrameProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const drag = useRef({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const session = useRef<DragSession | null>(null);

  const previousRect = useRef<DOMRect | null>(null);
  const flip = useRef<Animation | null>(null);
  const wasFocused = useRef(focused);

  useIsomorphicLayoutEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    el.style.translate = focused
      ? ""
      : `calc(-50% + ${drag.current.x}px) ${drag.current.y}px`;
  }, [focused]);

  useIsomorphicLayoutEffect(() => {
    const el = frameRef.current;
    if (!el) return;

    const from = previousRect.current;
    const to = el.getBoundingClientRect();
    previousRect.current = to;

    const toggled = wasFocused.current !== focused;
    wasFocused.current = focused;

    if (!toggled || !from || matches("(prefers-reduced-motion: reduce)")) return;
    if (!to.width || !to.height) return;

    flip.current?.cancel();
    flip.current = el.animate(
      [
        {
          transformOrigin: "top left",
          transform: `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${from.width / to.width}, ${from.height / to.height})`,
        },
        { transformOrigin: "top left", transform: "none" },
      ],
      { duration: FLIP_DURATION, easing: EASE_OUT_STRONG },
    );
  });

  useEffect(() => {
    const card = cardRef.current;
    const frame = frameRef.current;
    if (!card || !frame) return;

    if (!focused) {
      card.style.scale = "";
      frame.style.maxHeight = "";
      frame.style.overflowY = "";
      return;
    }

    const measure = () => {
      if (!card.offsetWidth || !card.offsetHeight) return;

      const width = window.visualViewport?.width ?? window.innerWidth;
      const height = window.visualViewport?.height ?? window.innerHeight;

      const fit = Math.min(
        (width * ZOOM_WIDTH_SHARE) / card.offsetWidth,
        (height * ZOOM_HEIGHT_SHARE) / card.offsetHeight,
      );

      const tallerThanScreen = fit < 1;
      card.style.scale = tallerThanScreen ? "1" : String(Math.min(MAX_ZOOM, fit));
      frame.style.maxHeight = tallerThanScreen
        ? `${Math.round(height * SCROLLING_HEIGHT_SHARE)}px`
        : "";
      frame.style.overflowY = tallerThanScreen ? "auto" : "";
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(card);

    window.addEventListener("resize", measure);
    window.visualViewport?.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
      window.visualViewport?.removeEventListener("resize", measure);
    };
  }, [focused]);

  const heldFocus = useRef(false);
  useEffect(() => {
    if (focused) {
      cardRef.current?.focus();
      heldFocus.current = true;
    } else if (heldFocus.current) {
      buttonRef.current?.focus();
      heldFocus.current = false;
    }
  }, [focused]);

  const endDrag = useCallback((pointerId?: number) => {
    const active = session.current;
    if (!active) return;
    if (pointerId !== undefined && active.pointerId !== pointerId) return;
    const frame = frameRef.current;
    if (frame?.hasPointerCapture(active.pointerId)) {
      frame.releasePointerCapture(active.pointerId);
    }
    session.current = null;
    if (active.moved && frameRef.current) {
      previousRect.current = frameRef.current.getBoundingClientRect();
    }
    setDragging(false);
  }, []);

  useBailOutOfALostPointer(endDrag);

  useKeptWithinReach({ frameRef, drag, focused });

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (focused || event.button !== 0) return;
    if ((event.target as HTMLElement).closest("a, button, input, textarea, select, video"))
      return;

    onBringToFront(id);
    session.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: drag.current.x,
      originY: drag.current.y,
      resting: restingRect(event.currentTarget, drag.current),
      moved: false,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const active = session.current;
    if (!active || active.pointerId !== event.pointerId) return;

    const dx = event.clientX - active.startX;
    const dy = event.clientY - active.startY;

    if (!active.moved) {
      if (Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
      const scrolling =
        event.pointerType === "touch" && Math.abs(dy) > Math.abs(dx);
      if (scrolling) {
        session.current = null;
        setDragging(false);
        return;
      }
    }

    active.moved = true;
    drag.current = keptWithinReach(active.resting, {
      x: active.originX + dx,
      y: active.originY + dy,
    });

    const el = frameRef.current;
    if (!el) return;
    el.style.translate = `calc(-50% + ${drag.current.x}px) ${drag.current.y}px`;
  }

  const frameClass = focused
    ? "fixed left-1/2 top-1/2 z-[60] w-[88vw] -translate-x-1/2 -translate-y-1/2 md:w-[var(--sheet-w)]"
    : ["group", dragging ? "cursor-grabbing" : "cursor-grab"].join(" ");

  return (
    <div
      ref={frameRef}
      data-sheet-frame={focused ? undefined : ""}
      data-dimmed={dimmed ? "" : undefined}
      inert={dimmed || undefined}
      style={
        {
          "--sheet-x": `${placement.xPct}%`,
          "--sheet-y": `${placement.yPct}%`,
          "--sheet-r": `${placement.rotate}deg`,
          "--sheet-w": WIDTH[size],
          zIndex: focused ? undefined : z,
        } as CSSProperties
      }
      className={frameClass}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={(event) => endDrag(event.pointerId)}
      onPointerCancel={(event) => endDrag(event.pointerId)}
    >
      <div
        ref={cardRef}
        role={focused ? "dialog" : undefined}
        aria-modal={focused ? true : undefined}
        aria-label={focused ? title : undefined}
        tabIndex={focused ? -1 : undefined}
        data-sheet-card
        className={[
          focused ? "p-6 md:p-7" : "p-4 md:p-7",
          "outline-none",
          BACKGROUND[kind],
          "transition-[rotate,scale] duration-(--motion-enter) ease-out-strong",
          focused ? "rotate-0" : "rotate-[var(--sheet-r)]",
        ].join(" ")}
      >
        <button
          ref={buttonRef}
          type="button"
          data-pressable
          onClick={() => (focused ? onClose() : onOpen(id))}
          className={[
            "relative z-10 float-right -mr-2 -mt-2 ml-4 cursor-pointer",
            "rounded-sm px-2 py-1",
            "text-[0.7rem] font-medium tracking-[0.01em]",
            "hover:bg-foreground/10 focus-visible:bg-foreground/10",
            "transition-[opacity,background-color,scale] duration-(--motion-quick) ease-out-strong",
            "active:scale-[0.97] active:duration-(--press)",
            "after:absolute after:left-1/2 after:top-1/2 after:content-['']",
            "after:h-11 after:w-[max(100%+1.5rem,2.75rem)]",
            "after:-translate-x-1/2 after:-translate-y-1/2",
            focused
              ? "opacity-100"
              : "can-hover:opacity-0 can-hover:group-hover:opacity-100 can-hover:group-focus-within:opacity-100",
          ].join(" ")}
        >
          {focused ? "Close" : "Open"}
          <span className="sr-only"> {title}</span>
        </button>
        {children}
      </div>
    </div>
  );
}

export const SheetFrame = memo(SheetFrameImpl);
