"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import type { SheetKind, SheetSize } from "./sheet";
import type { Placement } from "@/lib/scatter";

const WIDTH: Record<SheetSize, string> = {
  narrow: "clamp(14rem, 20vw, 18rem)",
  wide: "clamp(18rem, 26vw, 24rem)",
};

const BACKGROUND: Record<SheetKind, string> = {
  professional: "bg-sheet-professional",
  personal: "bg-sheet-personal",
};

/** Below this, the pile becomes a stacked column and drag is off. */
const DRAGGABLE = "(min-width: 768px)";

/** A press shorter than this is a click on the sheet, not a drag of it. */
const DRAG_THRESHOLD = 4;

/** How far a focused sheet is allowed to grow, however much room there is. */
const MAX_ZOOM = 2.4;

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

const matches = (query: string) =>
  typeof window !== "undefined" && window.matchMedia(query).matches;

type DragSession = {
  pointerId: number;
  startX: number;
  startY: number;
  originX: number;
  originY: number;
  moved: boolean;
};

export type SheetFrameProps = {
  id: string;
  kind: SheetKind;
  title: string;
  size: SheetSize;
  index: number;
  placement: Placement;
  z: number;
  focused: boolean;
  dimmed: boolean;
  onOpen: (id: string) => void;
  onClose: () => void;
  onBringToFront: (id: string) => void;
  children: ReactNode;
};

export function SheetFrame({
  id,
  kind,
  title,
  size,
  index,
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

  const [drag, setDrag] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const session = useRef<DragSession | null>(null);

  // FLIP. The rect from the previous commit is still in the ref while this one
  // runs, which is exactly the "before" geometry the animation needs. Rotation
  // lives on the inner card, so this element's box is never a rotated one.
  const previousRect = useRef<DOMRect | null>(null);
  const wasFocused = useRef(focused);

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

    el.animate(
      [
        {
          transformOrigin: "top left",
          transform: `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${from.width / to.width}, ${from.height / to.height})`,
        },
        { transformOrigin: "top left", transform: "none" },
      ],
      { duration: 280, easing: "cubic-bezier(0.2, 0, 0, 1)" },
    );
  });

  // Focusing scales the sheet rather than laying it out again, so it keeps its
  // exact proportions on the way up. The factor is whatever fits the viewport
  // with a margin, measured from the live layout and written straight back to
  // it — routing a measurement through state would cost a cascading render on
  // every open, close and resize.
  useEffect(() => {
    const card = cardRef.current;
    const frame = frameRef.current;
    if (!card || !frame) return;

    const measure = () => {
      if (!card.offsetWidth || !card.offsetHeight) return;
      const fit = Math.min(
        (window.innerWidth * 0.9) / card.offsetWidth,
        (window.innerHeight * 0.86) / card.offsetHeight,
      );
      card.style.scale = String(Math.min(MAX_ZOOM, Math.max(1, fit)));
      // Scrolling a scaled box is horrible, so a sheet already too tall to grow
      // stays at 1 and scrolls instead. The two never happen together.
      frame.style.maxHeight = fit < 1 ? "88vh" : "";
      frame.style.overflowY = fit < 1 ? "auto" : "";
    };

    if (!focused) {
      card.style.scale = "1";
      frame.style.maxHeight = "";
      frame.style.overflowY = "";
      return;
    }

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [focused]);

  // Focus follows the sheet: into the card on open, back to its button on close.
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

  const endDrag = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    const active = session.current;
    if (!active || active.pointerId !== event.pointerId) return;
    event.currentTarget.releasePointerCapture?.(event.pointerId);
    session.current = null;
    setDragging(false);
  }, []);

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (focused || event.button !== 0 || !matches(DRAGGABLE)) return;
    // Let anything interactive inside the sheet have its own press.
    if ((event.target as HTMLElement).closest("a, button, input, textarea, select, video"))
      return;

    onBringToFront(id);
    session.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: drag.x,
      originY: drag.y,
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
    if (!active.moved && Math.hypot(dx, dy) < DRAG_THRESHOLD) return;

    active.moved = true;
    setDrag({ x: active.originX + dx, y: active.originY + dy });
  }

  const frameClass = focused
    ? "fixed left-1/2 top-1/2 z-[60] w-[88vw] -translate-x-1/2 -translate-y-1/2 md:w-[var(--sheet-w)]"
    : [
        "group relative w-full",
        index > 0 ? "-mt-6 md:mt-0" : "",
        index % 2 ? "ml-[8%] md:ml-0" : "mr-[8%] md:mr-0",
        "md:absolute md:left-[var(--sheet-x)] md:top-[var(--sheet-y)] md:m-0 md:w-[var(--sheet-w)]",
        "md:translate-x-[calc(-50%+var(--sheet-dx))] md:translate-y-[var(--sheet-dy)]",
        "md:touch-none",
        dragging ? "md:cursor-grabbing" : "md:cursor-grab",
      ].join(" ");

  return (
    <div
      ref={frameRef}
      data-dimmed={dimmed ? "" : undefined}
      inert={dimmed || undefined}
      style={
        {
          "--sheet-x": `${placement.xPct}%`,
          "--sheet-y": `${placement.yPct}%`,
          "--sheet-dx": `${drag.x}px`,
          "--sheet-dy": `${drag.y}px`,
          "--sheet-r": `${placement.rotate}deg`,
          "--sheet-w": WIDTH[size],
          zIndex: focused ? undefined : z,
        } as CSSProperties
      }
      className={frameClass}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <div
        ref={cardRef}
        role={focused ? "dialog" : undefined}
        aria-modal={focused ? true : undefined}
        aria-label={focused ? title : undefined}
        tabIndex={focused ? -1 : undefined}
        data-sheet-card
        className={[
          "p-6 outline-none md:p-7",
          BACKGROUND[kind],
          "transition-[rotate,scale] duration-[280ms] ease-[cubic-bezier(0.2,0,0,1)]",
          focused ? "rotate-0" : "md:rotate-[var(--sheet-r)]",
        ].join(" ")}
      >
        <button
          ref={buttonRef}
          type="button"
          onClick={() => (focused ? onClose() : onOpen(id))}
          className={[
            "relative z-10 float-right -mr-1 -mt-1 ml-4 cursor-pointer",
            "text-[0.7rem] font-medium tracking-[0.01em]",
            "underline decoration-[0.06em] underline-offset-[0.25em]",
            "transition-opacity duration-200",
            // Web Interface Guidelines: hit target >= 24px, >= 44px on mobile.
            // The label is ~13px tall, so the target grows instead of the type —
            // a 44px box centred on the label, whatever the label measures. The
            // sheet body is a drag surface, so a near miss here starts a drag.
            "after:absolute after:left-1/2 after:top-1/2 after:content-['']",
            "after:h-11 after:w-[max(100%+1.5rem,2.75rem)]",
            "after:-translate-x-1/2 after:-translate-y-1/2",
            // On desktop the button is an affordance, not decoration: it waits for
            // the pointer. `group-focus-within` keeps it reachable by keyboard.
            focused
              ? "opacity-100"
              : "md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100",
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
