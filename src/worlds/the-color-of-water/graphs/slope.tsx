"use client";

import { Graph, GraphBody } from "./frame";
import type { GraphPalette } from "./motion";
import { cn } from "../cn";

type SlopeItem = {
  label: string;
  from: number;
  to: number;
};

type GraphSlopeProps = {
  title: string;
  items: SlopeItem[];
  fromLabel?: string;
  toLabel?: string;
  palette?: GraphPalette;
  corner?: string;
  className?: string;
};

const ROW = "col-span-4 grid grid-cols-subgrid items-baseline";

function reading(value: number) {
  return value.toLocaleString("en-US");
}

function GraphSlope({
  title,
  items,
  fromLabel,
  toLabel,
  corner,
  className,
}: GraphSlopeProps) {
  return (
    <Graph title={title} className={className} corner={corner}>
      <GraphBody className="px-4 py-6 sm:px-5 sm:py-7">
        <div className="grid grid-cols-[1fr_auto_1rem_auto] gap-x-2 gap-y-3">
          {fromLabel || toLabel ? (
            <div className={`${ROW} text-(--graph-frame)`}>
              <span />
              <span className="tabular-nums">{fromLabel}</span>
              <span />
              <span className="tabular-nums">{toLabel}</span>
            </div>
          ) : null}

          {items.map((entry) => {
            const rose = entry.to >= entry.from;

            return (
              <div key={entry.label} className={ROW}>
                <span className="truncate text-(--graph-ink)">
                  {entry.label}
                </span>
                <span className="tabular-nums text-(--graph-muted)">
                  {reading(entry.from)}
                </span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "text-center",
                    rose ? "text-(--graph-accent)" : "text-(--graph-accent-2)",
                  )}
                >
                  {rose ? "↗" : "↘"}
                </span>
                <span
                  className={cn(
                    "tabular-nums",
                    rose ? "text-(--graph-accent)" : "text-(--graph-accent-2)",
                  )}
                >
                  {reading(entry.to)}
                </span>
              </div>
            );
          })}
        </div>
      </GraphBody>
    </Graph>
  );
}

export { GraphSlope };
export type { GraphSlopeProps, SlopeItem };
