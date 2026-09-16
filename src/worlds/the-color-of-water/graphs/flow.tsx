"use client";

import { motion, useReducedMotion } from "motion/react";

import { GraphArrow } from "./arrow";
import { Graph, GraphBody } from "./frame";
import {
  fadeUp,
  staggerList,
  toneClass as paletteTone,
  type GraphPalette,
} from "./motion";
import { cn } from "../cn";

type FlowTone = "default" | "accent" | "muted";

type FlowNode = {
  label: string;
  tone?: FlowTone;
  stretch?: boolean;
};

type FlowRow = {
  nodes: FlowNode[];
};

type GraphFlowProps = {
  title: string;
  rows: FlowRow[];
  direction?: "row" | "column";
  palette?: GraphPalette;
  corner?: string;
  className?: string;
};

function nodeTone(palette: GraphPalette | undefined): Record<FlowTone, string> {
  return {
    default: "text-(--graph-ink)",
    accent: paletteTone(palette, "primary"),
    muted: paletteTone(palette, "secondary"),
  };
}

function GraphFlow({
  title,
  rows,
  direction = "row",
  palette,
  corner,
  className,
}: GraphFlowProps) {
  const column = direction === "column";
  const reduce = useReducedMotion();
  const item = fadeUp(reduce);
  const list = staggerList(reduce, 0.08);
  const tones = nodeTone(palette);

  return (
    <Graph title={title} className={className} corner={corner}>
      <GraphBody className="flex flex-col gap-7">
        <motion.div
          className="flex flex-col gap-7"
          initial={reduce ? false : "hidden"}
          variants={list}
          viewport={{ once: true, amount: 0.5 }}
          whileInView="show"
        >
          {rows.map((row, rowIndex) => (
            <motion.div
              key={rowIndex}
              className={cn(
                "flex min-w-0 gap-x-3 gap-y-2",
                column ? "flex-col items-center" : "flex-wrap items-center",
              )}
              variants={item}
            >
              {row.nodes.map((node, nodeIndex) => {
                const tone = node.tone ?? "default";
                const live = tone === "accent";

                return (
                  <div
                    key={`${node.label}-${nodeIndex}`}
                    className={cn(
                      "flex min-w-0 items-center gap-3",
                      column && "flex-col",
                      node.stretch && (column ? "min-h-16" : "min-w-16 flex-1"),
                    )}
                  >
                    {nodeIndex > 0 ? (
                      <GraphArrow
                        accent={live}
                        stretch={node.stretch}
                        column={column}
                      />
                    ) : null}
                    <span
                      className={cn("shrink-0 whitespace-nowrap", tones[tone])}
                    >
                      {node.label}
                    </span>
                  </div>
                );
              })}
            </motion.div>
          ))}
        </motion.div>
      </GraphBody>
    </Graph>
  );
}

export { GraphFlow };
export type { FlowNode, FlowRow, GraphFlowProps };
