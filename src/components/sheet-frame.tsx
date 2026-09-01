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
import type { SheetFront, SheetLink, SheetSize } from "./sheet";
import type { WorkView } from "@/lib/work-view";
import type { Placement } from "@/lib/scatter";

const WIDTH: Record<SheetSize, string> = {
  narrow: "clamp(9.5rem, 42vw, 18rem)",
  wide: "clamp(11rem, 52vw, 24rem)",
  feature: "clamp(13rem, 66vw, 38rem)",
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
  placedByDrag,
}: {
  frameRef: RefObject<HTMLDivElement | null>;
  drag: RefObject<Offset>;
  placedByDrag: boolean;
}) {
  useEffect(() => {
    if (!placedByDrag) return;

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
  }, [drag, placedByDrag, frameRef]);
}

export type SheetFrameProps = {
  id: string;
  title: string;
  size: SheetSize;
  view: WorkView;
  eyebrow?: string;
  front?: ReactNode;
  frontKind?: SheetFront;
  link?: SheetLink;
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

type Look = {
  focused: boolean;
  onWall: boolean;
  dragging: boolean;
  bare: boolean;
  words: boolean;
  lightbox: boolean;
};

const FOCUSED_FRAME =
  "fixed left-1/2 top-1/2 z-[60] w-[88vw] -translate-x-1/2 -translate-y-1/2 md:w-[var(--sheet-w)]";

const LIGHTBOX_FRAME = [
  "fixed left-1/2 top-1/2 z-[60] w-max max-w-[92vw] -translate-x-1/2 -translate-y-1/2",
  "max-h-[92vh] overflow-y-auto md:top-1/3 md:max-h-none md:overflow-visible",
].join(" ");

const frameClass = ({ focused, onWall, dragging, lightbox }: Look) => {
  if (lightbox) return LIGHTBOX_FRAME;
  if (focused) return FOCUSED_FRAME;
  if (onWall) return "group";
  return `group ${dragging ? "cursor-grabbing" : "cursor-grab"}`;
};

const DETAIL_LINK = [
  "underline decoration-stone-400 decoration-[0.04em] underline-offset-[0.25em]",
  "transition-opacity duration-(--motion-quick) ease-out-strong hover:opacity-50",
].join(" ");

const MOTION =
  "transition-[rotate,scale,box-shadow] duration-(--motion-enter) ease-out-strong";

const surface = ({ focused, onWall, dragging, bare, lightbox }: Look) => {
  if (lightbox || bare) return "";
  if (onWall) return "bg-background p-4 shadow-label md:p-7";
  const lift = dragging || focused ? "shadow-raised" : "shadow-card";
  return `bg-background ${focused ? "p-6 md:p-7" : "p-4 md:p-7"} ${lift}`;
};

const cardClass = (look: Look) =>
  [
    "relative outline-none",
    look.lightbox ? "w-full" : "",
    look.words ? "text-right" : "",
    surface(look),
    MOTION,
    look.focused || look.onWall || look.lightbox
      ? "rotate-0"
      : "rotate-[var(--sheet-r)]",
  ]
    .filter(Boolean)
    .join(" ");

const WALL_BUTTON = [
  "absolute inset-0 z-10 cursor-pointer",
  "outline-offset-4 focus-visible:outline-2 focus-visible:outline-foreground",
].join(" ");

const PILE_BUTTON = [
  "relative z-10 float-right -mr-2 -mt-2 ml-4 cursor-pointer",
  "rounded-sm px-2 py-1",
  "text-[0.7rem] font-medium tracking-[0.01em]",
  "hover:bg-foreground/10 focus-visible:bg-foreground/10",
  "transition-[opacity,background-color,scale] duration-(--motion-quick) ease-out-strong",
  "active:scale-[0.97] active:duration-(--press)",
  "after:absolute after:left-1/2 after:top-1/2 after:content-['']",
  "after:h-11 after:w-[max(100%+1.5rem,2.75rem)]",
  "after:-translate-x-1/2 after:-translate-y-1/2",
].join(" ");

function SheetButton({
  ref,
  title,
  focused,
  onWall,
  onClick,
}: {
  ref: RefObject<HTMLButtonElement | null>;
  title: string;
  focused: boolean;
  onWall: boolean;
  onClick: () => void;
}) {
  const pileClass = `${PILE_BUTTON} ${focused ? "opacity-100" : REVEALED_ON_HOVER}`;
  return (
    <button
      ref={ref}
      type="button"
      data-pressable
      onClick={onClick}
      className={onWall ? WALL_BUTTON : pileClass}
    >
      {onWall ? null : (focused && "Close") || "Open"}
      <span className="sr-only">
        {onWall ? "Open " : " "}
        {title}
      </span>
    </button>
  );
}

const REVEALED_ON_HOVER =
  "can-hover:opacity-0 can-hover:group-hover:opacity-100 can-hover:group-focus-within:opacity-100";

const CAPTION_VISIT = [
  "relative z-20 shrink-0 cursor-pointer",
  "text-[0.7rem] font-medium tracking-[0.01em] text-foreground-soft",
  "transition-[opacity,color] duration-(--motion-quick) ease-out-strong",
  "hover:text-foreground focus-visible:text-foreground",
  "after:absolute after:left-1/2 after:top-1/2 after:content-['']",
  "after:h-11 after:w-[max(100%+1.5rem,2.75rem)]",
  "after:-translate-x-1/2 after:-translate-y-1/2",
  REVEALED_ON_HOVER,
].join(" ");

// No wash under it. The pill is opaque and carries its own shadow, so it
// reads against the picture on its own — and veiling the whole plate to
// announce a closer look was hiding the thing it was offering to show.
const PEEK_LAYER = [
  "pointer-events-none absolute inset-0 grid place-items-center",
  "opacity-0",
  "transition-opacity duration-(--motion-quick) ease-out-strong",
  "group-hover:opacity-100 group-focus-within:opacity-100",
].join(" ");

const PEEK_PILL = [
  "rounded-full bg-background px-3 py-1.5 shadow-chip",
  "text-[0.7rem] font-medium tracking-[0.01em] text-foreground-soft",
  "scale-[0.96] transition-transform duration-(--motion-quick) ease-out-strong",
  "group-hover:scale-100 group-focus-within:scale-100",
].join(" ");

function Peek() {
  return (
    <div aria-hidden="true" data-peek className={PEEK_LAYER}>
      <span className={PEEK_PILL}>Take a closer look</span>
    </div>
  );
}

function Plate({
  title,
  front,
  link,
}: {
  title: string;
  front?: ReactNode;
  link?: SheetLink;
}) {
  return (
    <>
      <div className="relative">
        {front}
        <Peek />
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-4">
        <h3 className="text-[0.9rem]">{title}</h3>
        {link ? (
          <a href={link.href} className={CAPTION_VISIT}>
            Visit
            <span className="sr-only">
              {" "}
              {title} at {link.label}
            </span>
          </a>
        ) : null}
      </div>
    </>
  );
}

const LIGHTBOX_MEDIA = [
  "flex min-h-0 w-full items-center justify-center md:w-auto",
  "[&>*]:max-h-[46vh] [&>*]:w-auto [&>*]:max-w-full [&>*]:object-contain",
  "md:[&>*]:max-h-[62vh]",
].join(" ");

const LIGHTBOX_LABEL = [
  "w-full shrink-0 self-center bg-background p-5 shadow-raised",
  "md:max-h-[62vh] md:w-[17rem] md:overflow-y-auto md:p-6",
].join(" ");

function Lightbox({
  title,
  eyebrow,
  front,
  link,
  button,
  children,
}: {
  title: string;
  eyebrow?: string;
  front?: ReactNode;
  link?: SheetLink;
  button: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex w-full flex-col items-center gap-5 md:flex-row md:items-start md:justify-center md:gap-8">
      <div className={LIGHTBOX_MEDIA}>{front}</div>
      <aside className={LIGHTBOX_LABEL}>
        {button}
        {eyebrow ? (
          <p className="text-[0.7rem] text-foreground-soft">{eyebrow}</p>
        ) : null}
        <h3 className="clear-right mt-5 text-[1.05rem] text-foreground-soft">
          {title}
        </h3>
        <div className="font-medium">{children}</div>
        {link ? (
          <p className="mt-3">
            <a href={link.href} className={DETAIL_LINK}>
              {link.label}
            </a>
          </p>
        ) : null}
      </aside>
    </div>
  );
}

function Card({
  onWall,
  eyebrow,
  title,
  front,
  link,
  showsDetail,
  children,
}: {
  onWall: boolean;
  eyebrow?: string;
  title: string;
  front?: ReactNode;
  link?: SheetLink;
  showsDetail: boolean;
  children: ReactNode;
}) {
  return (
    <>
      {showsDetail && eyebrow ? (
        <p className="text-[0.7rem] text-foreground-soft">{eyebrow}</p>
      ) : null}
      <h3 className={`text-[1.05rem] ${onWall ? "" : "mt-1 font-semibold"}`}>
        {title}
      </h3>
      {front ? <div className="clear-right mt-6">{front}</div> : null}
      {showsDetail ? children : null}
      {showsDetail && link ? (
        <p className="mt-3">
          <a href={link.href} className={DETAIL_LINK}>
            {link.label}
          </a>
        </p>
      ) : null}
    </>
  );
}

function SheetFrameImpl({
  id,
  title,
  size,
  view,
  eyebrow,
  front,
  frontKind = "picture",
  link,
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
  const wasView = useRef(view);

  const placedByDrag = !focused && view === "pile";
  const lightbox =
    focused && view === "wall" && frontKind === "picture" && Boolean(front);
  useIsomorphicLayoutEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    el.style.translate = placedByDrag
      ? `calc(-50% + ${drag.current.x}px) ${drag.current.y}px`
      : "";
  }, [placedByDrag]);

  useIsomorphicLayoutEffect(() => {
    const el = frameRef.current;
    if (!el) return;

    const from = previousRect.current;
    const to = el.getBoundingClientRect();
    previousRect.current = to;

    const toggled = wasFocused.current !== focused || wasView.current !== view;
    wasFocused.current = focused;
    wasView.current = view;

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

    if (!focused || lightbox) {
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
  }, [focused, lightbox]);

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

  useKeptWithinReach({ frameRef, drag, placedByDrag });

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (!placedByDrag || event.button !== 0) return;
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

  const onWall = view === "wall" && !focused;
  const showsDetail = focused || view === "pile";
  const bare = onWall && frontKind === "picture" && Boolean(front);
  const look = {
    focused,
    onWall,
    dragging,
    bare,
    words: frontKind === "words",
    lightbox,
  };

  const button = (
    <SheetButton
      ref={buttonRef}
      title={title}
      focused={focused}
      onWall={onWall && !lightbox}
      onClick={() => (focused ? onClose() : onOpen(id))}
    />
  );

  let body;
  if (lightbox) {
    body = (
      <Lightbox
        title={title}
        eyebrow={eyebrow}
        front={front}
        link={link}
        button={button}
      >
        {children}
      </Lightbox>
    );
  } else if (bare) {
    body = <Plate title={title} front={front} link={link} />;
  } else {
    body = (
      <Card
        onWall={onWall}
        eyebrow={eyebrow}
        title={title}
        front={front}
        link={link}
        showsDetail={showsDetail}
      >
        {children}
      </Card>
    );
  }

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
      className={frameClass(look)}
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
        className={cardClass(look)}
      >
        {lightbox ? null : button}
        {body}
      </div>
    </div>
  );
}

export const SheetFrame = memo(SheetFrameImpl);
