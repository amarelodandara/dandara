"use client";

import { Graph, GraphBody } from "./frame";
import type { GraphPalette } from "./motion";
import { cn } from "../cn";

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
  return (
    <Graph title={title} className={className} corner={corner}>
      <GraphBody>
        <ul className="flex flex-col gap-2">
          {items.map((entry, index) => (
            <li
              key={`${entry.label}-${index}`}
              className="flex min-w-0 whitespace-pre"
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
            </li>
          ))}
        </ul>
      </GraphBody>
    </Graph>
  );
}

export { GraphTree };
export type { GraphTreeProps, TreeItem, TreeTone };
