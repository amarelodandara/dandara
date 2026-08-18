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
import { useKeydown } from "@/lib/keydown";

const OVERLAY_ID = "work-pile";

type Item = {
  id: string;
  kind: SheetProps["kind"];
  title: string;
  size: SheetSize;
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
    () => scatter(items.map(({ id, size, kind }) => ({ id, size, kind }))),
    [items],
  );

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
      <div className="flex items-baseline justify-between gap-6">
        <h2 className="text-[0.7rem] leading-none font-medium tracking-[0.01em] text-foreground-soft">
          {label}
        </h2>
        <p className="text-[0.7rem] leading-none tracking-[0.01em] text-foreground-soft/60">
          it&rsquo;s art, please touch
        </p>
      </div>

      <div data-pile className="relative mt-10 md:mt-16">
        {items.map((item) => (
          <SheetFrame
            key={item.id}
            id={item.id}
            kind={item.kind}
            title={item.title}
            size={item.size}
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
