"use client";

import { motion, useReducedMotion } from "motion/react";

import { Graph, GraphBody } from "./graph-frame";
import { fadeUp, staggerList, type GraphPalette } from "./graph-motion";
import { cn } from "@/lib/cn";

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
  const reduce = useReducedMotion();
  const item = fadeUp(reduce);
  const list = staggerList(reduce, 0.08);

  return (
    <Graph title={title} className={className} corner={corner}>
      <GraphBody className="px-4 py-6 sm:px-5 sm:py-7">
        <motion.div
          className="grid grid-cols-[1fr_auto_1rem_auto] gap-x-2 gap-y-3"
          initial={reduce ? false : "hidden"}
          variants={list}
          viewport={{ once: true, amount: 0.5 }}
          whileInView="show"
        >
          {fromLabel || toLabel ? (
            <motion.div
              className={`${ROW} text-(--graph-frame)`}
              variants={item}
            >
              <span />
              <span className="tabular-nums">{fromLabel}</span>
              <span />
              <span className="tabular-nums">{toLabel}</span>
            </motion.div>
          ) : null}

          {items.map((entry) => {
            const rose = entry.to >= entry.from;

            return (
              <motion.div key={entry.label} className={ROW} variants={item}>
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
              </motion.div>
            );
          })}
        </motion.div>
      </GraphBody>
    </Graph>
  );
}

export { GraphSlope };
export type { GraphSlopeProps, SlopeItem };
