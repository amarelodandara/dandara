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
import Link from "next/link";
import type { SheetFront, SheetLink, SheetSize } from "./sheet";
import type { WorkView } from "@/lib/work-view";
import type { Placement } from "@/lib/scatter";
import { Swap } from "./copy";
import { PRESS_BASE } from "@/lib/pressable";
import { ANNOTATION, LABEL, PROSE, SECTION_HEADING, TITLE } from "@/lib/type";

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

type Box = { left: number; top: number; width: number; height: number };

const pageBox = (el: HTMLElement): Box => {
  const rect = el.getBoundingClientRect();
  return {
    left: rect.left + window.scrollX,
    top: rect.top + window.scrollY,
    width: rect.width,
    height: rect.height,
  };
};

const slide = (el: HTMLElement, from: Box, to: Box) =>
  el.animate(
    [
      {
        transformOrigin: "top left",
        transform: `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${from.width / to.width}, ${from.height / to.height})`,
      },
      { transformOrigin: "top left", transform: "none" },
    ],
    { duration: FLIP_DURATION, easing: EASE_OUT_STRONG },
  );

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
      const next = keptWithinReach(
        restingRect(frame, drag.current),
        drag.current,
      );
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
  front?: ReactNode;
  full?: string;
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
  "fixed left-1/2 top-1/2 z-[60] -translate-x-1/2 -translate-y-1/2",
  "w-[80vw] md:landscape:w-[70vw]",
  "max-h-[92vh] overflow-x-clip overflow-y-auto",
  "md:landscape:max-h-none md:landscape:overflow-visible",
].join(" ");

const frameClass = ({ focused, onWall, dragging, lightbox }: Look) => {
  if (lightbox) return LIGHTBOX_FRAME;
  if (focused) return FOCUSED_FRAME;
  if (onWall) return "group";
  return `group ${dragging ? "cursor-grabbing" : "cursor-grab"}`;
};

const DETAIL_LINK = [
  "underline decoration-graphite-400 decoration-[0.04em] underline-offset-[0.25em]",
  "transition-opacity duration-(--motion-quick) ease-out-strong can-hover:hover:opacity-50",
].join(" ");

const MOTION =
  "transition-[rotate,scale,box-shadow] duration-(--motion-enter) ease-out-strong";

const surface = ({ focused, onWall, dragging, bare, lightbox }: Look) => {
  if (lightbox || bare) return "";
  if (onWall) return "bg-cadmium-50 p-4 shadow-label md:p-7";
  const lift = dragging || focused ? "shadow-raised" : "shadow-card";
  return `bg-cadmium-50 ${focused ? "p-6 md:p-7" : "p-4 md:p-7"} ${lift}`;
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

const VACATED = "bg-graphite-900/[0.02] shadow-hollow";

const WALL_BUTTON = [
  "absolute inset-0 z-10 cursor-pointer",
  "outline-offset-4 focus-visible:outline-2 focus-visible:outline-graphite-900",
].join(" ");

const PILE_BUTTON = [
  "relative z-10 float-right -mr-2 -mt-2 ml-4 cursor-pointer",
  "rounded-sm px-2 py-1",
  ANNOTATION,
  "can-hover:hover:bg-graphite-200 focus-visible:bg-graphite-200",
  "transition-[opacity,background-color,scale] duration-(--motion-quick) ease-out-strong",
  "active:scale-[0.97] active:duration-(--press)",
  "after:absolute after:left-1/2 after:top-1/2 after:content-['']",
  "after:h-11 after:w-[max(100%+1.5rem,2.75rem)]",
  "after:-translate-x-1/2 after:-translate-y-1/2",
].join(" ");

type ButtonPlace = "wall" | "pile" | "strip";

const buttonPlace = (onWall: boolean, lightbox: boolean): ButtonPlace => {
  if (lightbox) return "strip";
  if (onWall) return "wall";
  return "pile";
};

const STRIP_BUTTON = [
  "relative z-10 shrink-0 cursor-pointer rounded-sm px-3 py-2",
  ANNOTATION,
  "bg-cadmium-50 shadow-label",
  "can-hover:hover:bg-cadmium-200 focus-visible:bg-cadmium-200",
  "transition-[background-color,scale] duration-(--motion-quick) ease-out-strong",
  "active:scale-[0.97] active:duration-(--press)",
  "after:absolute after:left-1/2 after:top-1/2 after:content-['']",
  "after:h-11 after:w-full",
  "after:-translate-x-1/2 after:-translate-y-1/2",
].join(" ");

function SheetButton({
  ref,
  title,
  focused,
  place,
  onClick,
}: {
  ref: RefObject<HTMLButtonElement | null>;
  title: string;
  focused: boolean;
  place: ButtonPlace;
  onClick: () => void;
}) {
  const onWall = place === "wall";
  const pileClass = `${PILE_BUTTON} ${focused ? "opacity-100" : REVEALED_ON_HOVER}`;
  const className = { wall: WALL_BUTTON, pile: pileClass, strip: STRIP_BUTTON }[
    place
  ];
  return (
    <button
      ref={ref}
      type="button"
      data-pressable
      onClick={onClick}
      className={className}
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

const CAPTION_VISIT_SLOT = [
  "hidden shrink-0 can-hover:inline-flex",
  "transition-opacity duration-(--motion-quick) ease-out-strong",
  REVEALED_ON_HOVER,
].join(" ");

const CAPTION_VISIT = [
  PRESS_BASE,
  "relative z-20 -my-1 inline-flex cursor-pointer items-center rounded-sm px-2 py-1",
  `${ANNOTATION} text-graphite-700`,
  "can-hover:hover:bg-cadmium-200 focus-visible:bg-cadmium-200",
  "after:absolute after:left-1/2 after:top-1/2 after:content-['']",
  "after:h-11 after:w-[max(100%+1.5rem,2.75rem)]",
  "after:-translate-x-1/2 after:-translate-y-1/2",
].join(" ");

const PEEK_LAYER = [
  "pointer-events-none absolute inset-0 grid place-items-center",
  "opacity-0",
  "transition-opacity duration-(--motion-quick) ease-out-strong",
  "can-hover:group-hover:opacity-100 group-focus-within:opacity-100",
].join(" ");

const PEEK_PILL = [
  "rounded-full bg-cadmium-50 px-3 py-1.5 shadow-chip",
  `${ANNOTATION} text-graphite-700`,
  "scale-[0.96] transition-transform duration-(--motion-quick) ease-out-strong",
  "can-hover:group-hover:scale-100 group-focus-within:scale-100",
].join(" ");

function Peek() {
  return (
    <div aria-hidden="true" data-peek className={PEEK_LAYER}>
      <span className={PEEK_PILL}>Take a closer look</span>
    </div>
  );
}

const WALL_LABEL = `${LABEL} text-graphite-700`;

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
      <div data-sheet-media className="relative">
        {front}
        <Peek />
      </div>
      <div
        data-sheet-chrome
        className="mt-3 flex items-baseline justify-between gap-4"
      >
        <h3 className={WALL_LABEL}>{title}</h3>
        {link ? (
          <span className={CAPTION_VISIT_SLOT}>
            <a href={link.href} data-pressable className={CAPTION_VISIT}>
              Visit
              <span className="sr-only">
                {" "}
                {title} at {link.label}
              </span>
            </a>
          </span>
        ) : null}
      </div>
    </>
  );
}

const LIGHTBOX_MEDIA = [
  "relative flex min-h-0 w-full items-center justify-center",
  "md:landscape:min-w-0 md:landscape:flex-1",
  "[&>*]:h-auto! [&>*]:w-auto! [&>*]:max-w-full [&>*]:object-contain",
  "[&>*]:max-h-[58vh] md:landscape:[&>*]:max-h-[88vh]",
].join(" ");

const THUMBNAIL_LAYER = [
  "absolute inset-0 flex items-center justify-center",
  "[&>*]:h-full! [&>*]:w-full! [&>*]:max-h-none! [&>*]:object-contain",
].join(" ");

const FULL_PICTURE =
  "transition-opacity duration-(--motion-enter) ease-out-strong";

const LIGHTBOX_COLUMN = [
  "flex w-full flex-col items-stretch gap-3",
  "md:landscape:w-[16rem] md:landscape:shrink-0 md:landscape:self-end",
].join(" ");

const LIGHTBOX_CREDIT = [
  "rounded-sm bg-cadmium-50 px-4 py-4 shadow-label",
  "md:landscape:max-h-[40vh] md:landscape:overflow-y-auto",
  "md:landscape:px-5 md:landscape:py-5",
].join(" ");

const PLATE = [
  "flex items-center rounded-sm px-4 py-3",
  "md:landscape:px-5",
].join(" ");

const DOORWAY = `${PLATE} justify-between gap-3 bg-cadmium-400 shadow-chip`;

const DOORWAY_OPEN = [
  PRESS_BASE,
  "relative shrink-0 cursor-pointer rounded-sm px-2 py-1",
  "can-hover:hover:bg-cadmium-300 focus-visible:bg-cadmium-300",
  "after:absolute after:left-1/2 after:top-1/2 after:content-['']",
  "after:h-11 after:w-full",
  "after:-translate-x-1/2 after:-translate-y-1/2",
].join(" ");

const OUTBOUND = `${PLATE} bg-cadmium-50 shadow-label ${PROSE}`;

const onThisSite = (href: string) => href.startsWith("/");

function Doorway({ link }: { link: SheetLink }) {
  if (!onThisSite(link.href)) {
    return (
      <p className={OUTBOUND}>
        <a href={link.href} className={DETAIL_LINK}>
          {link.label}
        </a>
      </p>
    );
  }
  return (
    <div className={DOORWAY}>
      <span className="min-w-0">
        <span className={`block ${ANNOTATION} leading-none text-cadmium-900`}>
          Read on
        </span>
        <span className={`mt-1.5 block ${TITLE}`}>{link.label}</span>
      </span>
      <Link href={link.href} data-pressable className={DOORWAY_OPEN}>
        <Swap idle="Read" />
        <span className="sr-only">Read {link.label}</span>
      </Link>
    </div>
  );
}

function FullPicture({ full, front }: { full: string; front?: ReactNode }) {
  const [arrived, setArrived] = useState(false);
  return (
    <>
      <div className={THUMBNAIL_LAYER}>{front}</div>
      <img
        src={full}
        alt=""
        aria-hidden="true"
        draggable={false}
        onLoad={() => setArrived(true)}
        className={`${FULL_PICTURE} ${arrived ? "opacity-100" : "opacity-0"}`}
      />
    </>
  );
}

function Lightbox({
  title,
  front,
  full,
  link,
  button,
  children,
}: {
  title: string;
  front?: ReactNode;
  full?: string;
  link?: SheetLink;
  button: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex w-full flex-col items-center gap-4 md:landscape:flex-row md:landscape:items-end md:landscape:justify-center md:landscape:gap-5">
      <div data-sheet-media className={LIGHTBOX_MEDIA}>
        {full ? <FullPicture full={full} front={front} /> : front}
      </div>
      <div data-sheet-chrome className={LIGHTBOX_COLUMN}>
        <span className="flex justify-end">{button}</span>
        {link ? <Doorway link={link} /> : null}
        <aside className={LIGHTBOX_CREDIT}>
          <h3 className={`${LABEL} text-graphite-700`}>{title}</h3>
          <div className={PROSE}>{children}</div>
        </aside>
      </div>
    </div>
  );
}

function Card({
  onWall,
  title,
  front,
  link,
  showsDetail,
  children,
}: {
  onWall: boolean;
  title: string;
  front?: ReactNode;
  link?: SheetLink;
  showsDetail: boolean;
  children: ReactNode;
}) {
  return (
    <>
      <h3 className={onWall ? WALL_LABEL : `mt-1 ${SECTION_HEADING}`}>
        {title}
      </h3>
      {front ? <div className="clear-right mt-6">{front}</div> : null}
      {showsDetail ? <div className={PROSE}>{children}</div> : null}
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
  front,
  full,
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
  const [vacated, setVacated] = useState<number | null>(null);
  const session = useRef<DragSession | null>(null);

  const previousRect = useRef<Box | null>(null);
  const previousMediaRect = useRef<Box | null>(null);
  const flip = useRef<Animation[]>([]);
  const wasFocused = useRef(focused);
  const wasView = useRef(view);
  const wasLightbox = useRef(false);

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

    const toggled = wasFocused.current !== focused || wasView.current !== view;
    const openedOrClosedALightbox = wasLightbox.current !== lightbox;
    wasFocused.current = focused;
    wasView.current = view;
    wasLightbox.current = lightbox;

    const inFlight = flip.current.some((it) => it.playState === "running");
    if (!toggled && inFlight) return;

    for (const animation of flip.current) animation.cancel();
    flip.current = [];

    const media = el.querySelector<HTMLElement>("[data-sheet-media]");

    const from = previousRect.current;
    const mediaFrom = previousMediaRect.current;
    const to = pageBox(el);
    const mediaTo = media ? pageBox(media) : null;
    previousRect.current = to;
    previousMediaRect.current = mediaTo;

    if (!toggled || matches("(prefers-reduced-motion: reduce)")) return;

    if (openedOrClosedALightbox) {
      if (media && mediaFrom && mediaTo && mediaTo.width && mediaTo.height) {
        flip.current.push(
          slide(media, mediaFrom, mediaTo),
          ...Array.from(
            el.querySelectorAll<HTMLElement>("[data-sheet-chrome]"),
            (node) =>
              node.animate([{ opacity: 0 }, { opacity: 1 }], {
                duration: FLIP_DURATION,
                easing: EASE_OUT_STRONG,
              }),
          ),
        );
      }
      return;
    }

    if (!from || !to.width || !to.height) return;
    flip.current.push(slide(el, from, to));
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
      card.style.scale = tallerThanScreen
        ? "1"
        : String(Math.min(MAX_ZOOM, fit));
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
      previousRect.current = pageBox(frameRef.current);
    }
    setDragging(false);
  }, []);

  useBailOutOfALostPointer(endDrag);

  useKeptWithinReach({ frameRef, drag, placedByDrag });

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (!placedByDrag || event.button !== 0) return;
    if (
      (event.target as HTMLElement).closest(
        "a, button, input, textarea, select, video",
      )
    )
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

  const take = () => {
    const frame = frameRef.current;
    if (frame && view === "wall") {
      setVacated(frame.getBoundingClientRect().height);
    }
    onOpen(id);
  };

  const button = (
    <SheetButton
      ref={buttonRef}
      title={title}
      focused={focused}
      place={buttonPlace(onWall, lightbox)}
      onClick={() => (focused ? onClose() : take())}
    />
  );

  let body;
  if (lightbox) {
    body = (
      <Lightbox
        title={title}
        front={front}
        full={full}
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
    <>
      {focused && view === "wall" && vacated !== null ? (
        <div
          aria-hidden="true"
          data-sheet-frame=""
          style={{ height: vacated }}
          className={VACATED}
        />
      ) : null}
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
    </>
  );
}

export const SheetFrame = memo(SheetFrameImpl);
