"use client";

import { Fragment } from "react";
import { motion, useReducedMotion } from "motion/react";

import { Graph, GraphBody } from "./frame";
import { fadeUp, staggerList, type GraphPalette } from "./motion";
import { GraphRule } from "./rule";
import { cn } from "../cn";

type StackItem = {
  label: string;
  muted?: boolean;
};

type GraphStackProps = {
  title: string;
  items: StackItem[];
  palette?: GraphPalette;
  corner?: string;
  className?: string;
};

function GraphStack({ title, items, corner, className }: GraphStackProps) {
  const reduce = useReducedMotion();
  const item = fadeUp(reduce);
  const list = staggerList(reduce, 0.08);

  return (
    <Graph title={title} className={className} corner={corner}>
      <GraphBody>
        <motion.div
          className="flex flex-col gap-4"
          initial={reduce ? false : "hidden"}
          variants={list}
          viewport={{ once: true, amount: 0.5 }}
          whileInView="show"
        >
          {items.map((entry, index) => (
            <Fragment key={`${entry.label}-${index}`}>
              {index > 0 ? <GraphRule /> : null}
              <motion.p
                className={cn(
                  "truncate",
                  entry.muted
                    ? "text-(--graph-muted)"
                    : "text-(--graph-accent)",
                )}
                variants={item}
              >
                {entry.label}
              </motion.p>
            </Fragment>
          ))}
        </motion.div>
      </GraphBody>
    </Graph>
  );
}

export { GraphStack };
export type { GraphStackProps, StackItem };
