"use client";

import { GraphArrow } from "./arrow";
import { Graph, GraphBody } from "./frame";
import { toneClass as paletteTone, type GraphPalette } from "./motion";
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
  const tones = nodeTone(palette);

  return (
    <Graph title={title} className={className} corner={corner}>
      <GraphBody className="flex flex-col gap-7">
        <div className="flex flex-col gap-7">
          {rows.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className={cn(
                "flex min-w-0 gap-x-3 gap-y-2",
                column ? "flex-col items-center" : "flex-wrap items-center",
              )}
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
            </div>
          ))}
        </div>
      </GraphBody>
    </Graph>
  );
}

export { GraphFlow };
export type { FlowNode, FlowRow, GraphFlowProps };
