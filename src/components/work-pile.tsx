"use client";

import {
  Children,
  isValidElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { SheetFrame } from "./sheet-frame";
import type { SheetProps, SheetSize } from "./sheet";
import { scatter } from "@/lib/scatter";
import type { WorkView } from "@/lib/work-view";
import { PileIcon, WallIcon } from "./work-view-icons";
import {
  closeOverlay,
  openOverlay,
  useActiveOverlay,
} from "@/lib/exclusive-overlay";
import { useKeydown } from "@/lib/keydown";
import { useMediaQuery } from "@/lib/media-query";
import { ANNOTATION } from "@/lib/type";

const OVERLAY_ID = "work-pile";
const ROOM_FOR_A_PILE = "(min-width: 768px)";

type Item = {
  id: string;
  kind: SheetProps["kind"];
  title: string;
  size: SheetSize;
  eyebrow?: string;
  front: ReactNode;
  frontKind: SheetProps["frontKind"];
  link: SheetProps["link"];
  content: ReactNode;
};

function readSheets(children: ReactNode): Item[] {
  return Children.toArray(children).flatMap((child) => {
    if (!isValidElement(child)) return [];
    const props = child.props as Partial<SheetProps>;
    if (
      typeof props.id !== "string" ||
      typeof props.title !== "string" ||
      (props.kind !== "professional" && props.kind !== "personal")
    ) {
      return [];
    }
    return [
      {
        id: props.id,
        kind: props.kind,
        title: props.title,
        size: props.size ?? "narrow",
        eyebrow: props.eyebrow,
        front: props.front,
        frontKind: props.frontKind,
        link: props.link,
        content: props.children,
      },
    ];
  });
}

function ViewIcon({
  active,
  lit,
  children,
}: {
  active: boolean;
  lit: string;
  children: ReactNode;
}) {
  return (
    <span
      aria-hidden="true"
      className={[
        "transition-colors duration-(--motion-quick) ease-out-strong",
        active ? lit : "text-foreground-faint",
      ].join(" ")}
    >
      {children}
    </span>
  );
}

function ViewToggle({
  view,
  onToggle,
}: {
  view: WorkView;
  onToggle: () => void;
}) {
  const piled = view === "pile";
  return (
    <button
      type="button"
      role="switch"
      aria-checked={piled}
      data-pressable
      onClick={onToggle}
      className={[
        "relative h-5 w-9 shrink-0 cursor-pointer rounded-full",
        "transition-[background-color,scale] duration-(--motion-quick) ease-out-strong",
        "active:scale-[0.97] active:duration-(--press)",
        "outline-offset-4 focus-visible:outline-2 focus-visible:outline-foreground",
        "after:absolute after:left-1/2 after:top-1/2 after:h-11 after:w-11 after:content-['']",
        "after:-translate-x-1/2 after:-translate-y-1/2",
        "shadow-hollow",
        piled ? "bg-background-hard" : "bg-foreground/10",
      ].join(" ")}
    >
      <span
        aria-hidden="true"
        className={[
          "absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-background shadow-chip",
          "transition-transform duration-(--motion-quick) ease-out-strong",
          piled ? "translate-x-0" : "translate-x-4",
        ].join(" ")}
      />
      <span className="sr-only">Tip the work into a pile</span>
    </button>
  );
}

export function WorkPile({
  label = "Selected work",
  children,
}: {
  label?: string;
  children: ReactNode;
}) {
  const items = useMemo(() => readSheets(children), [children]);
  const placements = useMemo(
    () => scatter(items.map(({ id, size, kind }) => ({ id, size, kind }))),
    [items],
  );

  const canPile = useMediaQuery(ROOM_FOR_A_PILE);
  const [chosen, setChosen] = useState<WorkView>("wall");
  const view: WorkView = canPile ? chosen : "wall";
  const [requestedId, setRequestedId] = useState<string | null>(null);
  const active = useActiveOverlay();
  const focusedId = active === OVERLAY_ID ? requestedId : null;

  const [lifted, setLifted] = useState<Record<string, number>>({});
  const top = useRef(items.length);

  const bringToFront = useCallback((id: string) => {
    top.current += 1;
    const next = top.current;
    setLifted((current) =>
      current[id] === next ? current : { ...current, [id]: next },
    );
  }, []);

  const open = useCallback(
    (id: string) => {
      bringToFront(id);
      setRequestedId(id);
      openOverlay(OVERLAY_ID);
    },
    [bringToFront],
  );

  const close = useCallback(() => closeOverlay(OVERLAY_ID), []);

  const show = useCallback((next: WorkView) => {
    closeOverlay(OVERLAY_ID);
    setChosen(next);
  }, []);

  useEffect(() => {
    const outside = document.querySelectorAll<HTMLElement>(
      "[data-dim-on-focus]",
    );
    const clear = () => {
      delete document.body.dataset.sheetFocused;
      for (const el of outside) el.removeAttribute("inert");
    };

    if (focusedId) {
      document.body.dataset.sheetFocused = "";
      for (const el of outside) el.setAttribute("inert", "");
    } else {
      clear();
    }

    return clear;
  }, [focusedId]);

  useKeydown((event) => {
    if (focusedId && event.key === "Escape") closeOverlay(OVERLAY_ID);
  });

  return (
    <section id="work" className="relative mt-[18vh] pb-[12vh]">
      <div className="flex items-center justify-between gap-6">
        <h2 className={`${ANNOTATION} leading-none text-foreground-soft`}>
          {label}
        </h2>

        <div className="relative hidden items-center gap-2 md:flex">
          <p
            data-flavour
            aria-hidden={view === "wall" || undefined}
            className={[
              "pointer-events-none absolute right-full mr-3 whitespace-nowrap",
              `${ANNOTATION} leading-none text-foreground-hard`,
              "transition-opacity duration-(--motion-quick) ease-out-strong",
              view === "pile" ? "opacity-100" : "opacity-0",
            ].join(" ")}
          >
            it&rsquo;s art, please touch
          </p>

          <ViewIcon active={view === "pile"} lit="text-foreground-hard">
            <PileIcon />
          </ViewIcon>

          <ViewToggle
            view={view}
            onToggle={() => show(view === "pile" ? "wall" : "pile")}
          />

          <ViewIcon active={view === "wall"} lit="text-foreground-soft">
            <WallIcon />
          </ViewIcon>
        </div>
      </div>

      <div
        data-pile={view === "pile" ? "" : undefined}
        data-wall={view === "wall" ? "" : undefined}
        className="relative mt-10 md:mt-16"
      >
        {items.map((item) => (
          <SheetFrame
            key={item.id}
            id={item.id}
            title={item.title}
            size={item.size}
            view={view}
            eyebrow={item.eyebrow}
            front={item.front}
            frontKind={item.frontKind}
            link={item.link}
            placement={placements[item.id]}
            z={lifted[item.id] ?? placements[item.id].z}
            focused={focusedId === item.id}
            dimmed={focusedId !== null && focusedId !== item.id}
            onOpen={open}
            onClose={close}
            onBringToFront={bringToFront}
          >
            {item.content}
          </SheetFrame>
        ))}
      </div>

      {focusedId ? (
        <div
          aria-hidden="true"
          onClick={close}
          className="fixed inset-0 z-50 bg-background/40"
        />
      ) : null}
    </section>
  );
}
