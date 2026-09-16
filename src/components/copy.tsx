"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ANNOTATION } from "@/lib/type";

const CONFIRMED_FOR = 1500;
const REPORTED_FOR = 4000;

export type Outcome = "done" | "failed" | null;
export type Settled = Exclude<Outcome, null>;

export const COPIED_NOTE: Record<Settled, string> = {
  done: "Copied",
  failed: "Not copied",
};

export const COPIED_ANNOUNCEMENT: Record<Settled, (title: string) => string> = {
  done: (title) => `${title} copied.`,
  failed: (title) =>
    `${title} could not be copied, the browser refused the clipboard.`,
};

const SWAPPED = [
  "col-start-1 row-start-1",
  "transition-[opacity,scale,filter,background-color] duration-(--motion-quick) ease-out-strong",
].join(" ");

const ARRIVED = "scale-100 opacity-100 blur-[0px]";

const GONE = [
  "scale-25 opacity-0 blur-[4px]",
  "motion-reduce:scale-100 motion-reduce:blur-[0px]",
].join(" ");

export function useOutcome() {
  const [outcome, setOutcome] = useState<Outcome>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const report = useCallback((next: Settled) => {
    setOutcome(next);
    clearTimeout(timer.current);
    timer.current = setTimeout(
      () => setOutcome(null),
      next === "done" ? CONFIRMED_FOR : REPORTED_FOR,
    );
  }, []);

  return [outcome, report] as const;
}

export function useCopy(text: string) {
  const [outcome, report] = useOutcome();

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      report("failed");
      return;
    }
    report("done");
  }, [report, text]);

  return [outcome, copy] as const;
}

export function Swap({
  idle,
  done,
  shown,
  className = "text-foreground-hard",
  itemClassName = "",
}: {
  idle: string;
  done?: string;
  shown?: boolean;
  className?: string;
  itemClassName?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`grid shrink-0 justify-items-end self-center ${ANNOTATION} ${className}`}
    >
      <span className={`${SWAPPED} ${itemClassName} ${shown ? GONE : ARRIVED}`}>
        {idle}
      </span>
      {done ? (
        <span
          className={`${SWAPPED} ${itemClassName} ${shown ? ARRIVED : GONE}`}
        >
          {done}
        </span>
      ) : null}
    </span>
  );
}

export function Verb({
  idle,
  done,
  shown,
  className = "text-foreground-hard",
  itemClassName = "",
}: {
  idle: string;
  done?: string;
  shown?: boolean;
  className?: string;
  itemClassName?: string;
}) {
  return (
    <span
      className={[
        "shrink-0 self-center transition-opacity duration-(--motion-quick) ease-out-strong",
        shown
          ? "opacity-100"
          : [
              "opacity-100",
              "can-hover:opacity-0",
              "can-hover:group-hover:opacity-100",
              "can-hover:group-focus-visible:opacity-100",
            ].join(" "),
      ].join(" ")}
    >
      <Swap
        idle={idle}
        done={done}
        shown={shown}
        className={className}
        itemClassName={itemClassName}
      />
    </span>
  );
}

export function Announcement({ children }: { children: string }) {
  return (
    <span role="status" className="sr-only">
      {children}
    </span>
  );
}
