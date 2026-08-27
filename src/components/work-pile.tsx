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

const OVERLAY_ID = "work-pile";

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

function ViewButton({
  active,
  label,
  onClick,
  children,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      data-pressable
      aria-pressed={active}
      title={label}
      onClick={onClick}
      className={[
        "relative cursor-pointer",
        "transition-[color,scale] duration-(--motion-quick) ease-out-strong",
        "active:scale-[0.97] active:duration-(--press)",
        "after:absolute after:left-1/2 after:top-1/2 after:h-11 after:w-11 after:content-['']",
        "after:-translate-x-1/2 after:-translate-y-1/2",
        "outline-offset-4 focus-visible:outline-2 focus-visible:outline-foreground",
        active
          ? "text-foreground-soft"
          : "text-foreground-soft/35 hover:text-foreground-soft/70",
      ].join(" ")}
    >
      {children}
      <span className="sr-only">{label}</span>
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

  const [view, setView] = useState<WorkView>("wall");
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
    setView(next);
  }, []);

  useEffect(() => {
    const outside = document.querySelectorAll<HTMLElement>("[data-dim-on-focus]");
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
        <h2 className="text-[0.7rem] leading-none font-medium tracking-[0.01em] text-foreground-soft">
          {label}
        </h2>

        <div className="flex items-center gap-1.5">
          <ViewButton
            active={view === "wall"}
            label="Hang the work on a wall"
            onClick={() => show("wall")}
          >
            <WallIcon />
          </ViewButton>

          <div
            data-flavour
            className={[
              "grid transition-[grid-template-columns]",
              "duration-(--motion-enter) ease-out-strong",
              view === "pile"
                ? "grid-cols-[minmax(0,1fr)]"
                : "grid-cols-[minmax(0,0fr)]",
            ].join(" ")}
          >
            <p
              aria-hidden={view === "wall" || undefined}
              className={[
                "min-w-0 overflow-hidden px-2 whitespace-nowrap",
                "text-[0.7rem] leading-none tracking-[0.01em] text-foreground-soft/60",
                "transition-opacity duration-(--motion-quick) ease-out-strong",
                view === "pile" ? "opacity-100" : "opacity-0",
              ].join(" ")}
            >
              it&rsquo;s art, please touch
            </p>
          </div>

          <ViewButton
            active={view === "pile"}
            label="Tip the work into a pile"
            onClick={() => show("pile")}
          >
            <PileIcon />
          </ViewButton>
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
