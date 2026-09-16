"use client";

import { motion, useReducedMotion } from "motion/react";

import { Graph, GraphBody } from "./frame";
import { fadeUp, staggerList, type GraphPalette } from "./motion";
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
  const reduce = useReducedMotion();
  const item = fadeUp(reduce);
  const list = staggerList(reduce, 0.08);

  return (
    <Graph title={title} className={className} corner={corner}>
      <GraphBody>
        <motion.ul
          className="flex flex-col gap-4"
          initial={reduce ? false : "hidden"}
          variants={list}
          viewport={{ once: true, amount: 0.5 }}
          whileInView="show"
        >
          {items.map((entry, index) => (
            <motion.li
              key={`${entry.label}-${index}`}
              className="flex min-w-0 items-center gap-3"
              variants={item}
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
            </motion.li>
          ))}
        </motion.ul>
      </GraphBody>
    </Graph>
  );
}

export { GraphCheck };
export type { CheckItem, GraphCheckProps };
