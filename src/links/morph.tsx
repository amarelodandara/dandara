"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";

const still = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const SLIDES =
  "transition-[width] duration-(--motion-exit) ease-out-strong motion-reduce:transition-none";

const WORD = "col-start-1 row-start-1 whitespace-nowrap";

const ENTERS =
  "transition-[opacity,translate,filter] duration-(--motion-exit) ease-out-strong starting:translate-y-1 starting:opacity-0 starting:blur-[2px] motion-reduce:transition-opacity";

const LEAVES =
  "-translate-y-1 opacity-0 blur-[2px] transition-[opacity,translate,filter] duration-(--motion-quick) ease-out-strong starting:translate-y-0 starting:opacity-100 starting:blur-none";

export function MorphLabel({ children }: { children: string }) {
  const box = useRef<HTMLSpanElement>(null);
  const word = useRef<HTMLSpanElement>(null);
  const settled = useRef(0);
  const [current, setCurrent] = useState(children);
  const [previous, setPrevious] = useState<string | null>(null);

  if (children !== current) {
    setPrevious(current);
    setCurrent(children);
  }

  useLayoutEffect(() => {
    const element = box.current;
    const target = word.current;
    if (!element || !target) return;
    const to = target.getBoundingClientRect().width;
    const from = settled.current;
    settled.current = to;
    if (from === 0 || from === to || still()) return;
    element.style.width = `${from}px`;
    element.getBoundingClientRect();
    element.style.width = `${to}px`;
  }, [current]);

  function settle() {
    if (box.current) box.current.style.width = "";
  }

  return (
    <span
      ref={box}
      onTransitionEnd={(event) => {
        if (event.target === event.currentTarget) settle();
      }}
      className={`inline-grid justify-items-start overflow-x-clip ${SLIDES}`}
    >
      {previous === null ? null : (
        <span
          key={`out-${previous}`}
          aria-hidden
          onTransitionEnd={(event) => {
            if (event.propertyName === "opacity") setPrevious(null);
          }}
          className={`${WORD} ${still() ? "hidden" : LEAVES}`}
        >
          {previous}
        </span>
      )}
      <span key={current} ref={word} className={`${WORD} ${ENTERS}`}>
        {current}
      </span>
    </span>
  );
}

export function Reveal({
  shown,
  className = "",
  children,
}: {
  shown: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      inert={!shown || undefined}
      aria-hidden={!shown || undefined}
      className={`grid transition-[grid-template-columns,opacity,margin] duration-(--motion-exit) ease-out-strong motion-reduce:transition-opacity ${shown ? "grid-cols-[1fr] opacity-100" : "-ml-2 grid-cols-[0fr] opacity-0"} ${className}`}
    >
      <span className="min-w-0">{children}</span>
    </span>
  );
}
