"use client";

import { motion, useReducedMotion } from "motion/react";

import { Graph, GraphBody } from "./graph-frame";
import { fadeUp, staggerList, type GraphPalette } from "./graph-motion";
import { cn } from "@/lib/cn";

type TreeTone = "accent" | "ink" | "muted" | "alt";

type TreeItem = {
  label: string;
  depth?: number;
  dir?: boolean;
  tone?: TreeTone;
};

const TONES: Record<TreeTone, string> = {
  accent: "text-(--graph-accent)",
  ink: "text-(--graph-ink)",
  muted: "text-(--graph-muted)",
  alt: "text-(--graph-accent-2)",
};

type GraphTreeProps = {
  title: string;
  items: TreeItem[];
  palette?: GraphPalette;
  corner?: string;
  className?: string;
};

function branchOf(items: TreeItem[], index: number) {
  const depth = items[index].depth ?? 0;
  if (depth === 0) return "";

  const next = items[index + 1];
  const last = !next || (next.depth ?? 0) < depth;
  const indent = " ".repeat((depth - 1) * 3);
  return `${indent}${last ? "└─ " : "├─ "}`;
}

function GraphTree({ title, items, corner, className }: GraphTreeProps) {
  const reduce = useReducedMotion();
  const item = fadeUp(reduce);
  const list = staggerList(reduce, 0.06);

  return (
    <Graph title={title} className={className} corner={corner}>
      <GraphBody>
        <motion.ul
          className="flex flex-col gap-2"
          initial={reduce ? false : "hidden"}
          variants={list}
          viewport={{ once: true, amount: 0.5 }}
          whileInView="show"
        >
          {items.map((entry, index) => (
            <motion.li
              key={`${entry.label}-${index}`}
              className="flex min-w-0 whitespace-pre"
              variants={item}
            >
              <span aria-hidden="true" className="text-(--graph-frame)">
                {branchOf(items, index)}
              </span>
              <span
                className={cn(
                  "truncate",
                  TONES[entry.tone ?? (entry.dir ? "accent" : "ink")],
                )}
              >
                {entry.label}
              </span>
            </motion.li>
          ))}
        </motion.ul>
      </GraphBody>
    </Graph>
  );
}

export { GraphTree };
export type { GraphTreeProps, TreeItem, TreeTone };
