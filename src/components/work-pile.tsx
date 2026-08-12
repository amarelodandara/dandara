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
import {
  closeOverlay,
  openOverlay,
  useActiveOverlay,
} from "@/lib/exclusive-overlay";

const OVERLAY_ID = "work-pile";

type Item = {
  id: string;
  kind: SheetProps["kind"];
  title: string;
  size: SheetSize;
  content: ReactNode;
};

/**
 * Reads `<Sheet>` props off the children rather than owning any content. A child
 * without the props a sheet needs is skipped, so nothing renders half-formed.
 */
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
        content: props.children,
      },
    ];
  });
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
    () => scatter(items.map(({ id, size }) => ({ id, size }))),
    [items],
  );

  // Which sheet is local; whether the pile owns the screen at all is shared.
  // Gating one on the other is a derivation rather than an effect, so being
  // evicted by the gift shop needs no synchronising.
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

  // Everything outside the pile dims and drops out of the tab order. The blur
  // is applied per element rather than to a shared ancestor, because a filter on
  // an ancestor would blur the focused sheet too and trap its fixed positioning.
  useEffect(() => {
    const outside = document.querySelectorAll<HTMLElement>("[data-dim-on-focus]");
    const clear = () => {
      document.body.removeAttribute("data-sheet-focused");
      outside.forEach((el) => el.removeAttribute("inert"));
    };

    if (focusedId) {
      document.body.setAttribute("data-sheet-focused", "");
      outside.forEach((el) => el.setAttribute("inert", ""));
    } else {
      clear();
    }

    return clear;
  }, [focusedId]);

  useEffect(() => {
    if (!focusedId) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeOverlay(OVERLAY_ID);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [focusedId]);

  return (
    <section id="work" className="relative mt-[18vh] min-h-screen">
      <h2 className="text-[0.7rem] font-medium tracking-[0.01em] text-foreground-soft">
        {label}
      </h2>

      <div className="relative mt-10 flex flex-col md:mt-16 md:block md:min-h-[46rem]">
        {items.map((item, index) => (
          <SheetFrame
            key={item.id}
            id={item.id}
            kind={item.kind}
            title={item.title}
            size={item.size}
            index={index}
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

      {focusedId && (
        <div
          aria-hidden="true"
          onClick={close}
          className="fixed inset-0 z-50 bg-background/40"
        />
      )}
    </section>
  );
}
