"use client";

import { Graph, GraphBody } from "./frame";
import type { GraphPalette } from "./motion";
import { cn } from "../cn";

type CheckItem = {
  label: string;
  done?: boolean;
};

type GraphCheckProps = {
  title: string;
  items: CheckItem[];
  palette?: GraphPalette;
  corner?: string;
  className?: string;
};

function GraphCheck({ title, items, corner, className }: GraphCheckProps) {
  return (
    <Graph title={title} className={className} corner={corner}>
      <GraphBody>
        <ul className="flex flex-col gap-4">
          {items.map((entry, index) => (
            <li
              key={`${entry.label}-${index}`}
              className="flex min-w-0 items-center gap-3"
            >
              <span
                aria-hidden="true"
                className={cn(
                  "shrink-0",
                  entry.done ? "text-(--graph-accent)" : "text-(--graph-frame)",
                )}
              >
                {entry.done ? "[x]" : "[ ]"}
              </span>
              <span
                className={cn(
                  "min-w-0 truncate",
                  entry.done
                    ? "text-(--graph-muted) line-through"
                    : "text-(--graph-ink)",
                )}
              >
                {entry.label}
              </span>
              <span className="sr-only">
                {entry.done ? ", done" : ", still open"}
              </span>
            </li>
          ))}
        </ul>
      </GraphBody>
    </Graph>
  );
}

export { GraphCheck };
export type { CheckItem, GraphCheckProps };
