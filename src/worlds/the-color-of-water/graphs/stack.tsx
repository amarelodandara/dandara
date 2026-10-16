"use client";

import { Fragment } from "react";

import { Graph, GraphBody } from "./frame";
import type { GraphPalette } from "./motion";
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
  return (
    <Graph title={title} className={className} corner={corner}>
      <GraphBody>
        <div className="flex flex-col gap-4">
          {items.map((entry, index) => (
            <Fragment key={`${entry.label}-${index}`}>
              {index > 0 ? <GraphRule /> : null}
              <p
                className={cn(
                  "truncate",
                  entry.muted
                    ? "text-(--graph-muted)"
                    : "text-(--graph-accent)",
                )}
              >
                {entry.label}
              </p>
            </Fragment>
          ))}
        </div>
      </GraphBody>
    </Graph>
  );
}

export { GraphStack };
export type { GraphStackProps, StackItem };
