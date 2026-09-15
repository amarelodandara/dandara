import type { FlowRow } from "@/components/graphs/graph-flow";
import type { GraphPalette } from "@/components/graphs/graph-motion";
import type { Palette } from "./palettes";

export type PaletteGraph = {
  title: string;
  rows: FlowRow[];
  direction?: "row" | "column";
  palette?: GraphPalette;
};

const GRAPHS: Record<string, PaletteGraph> = {
  idea: {
    title: "THE PLAN",
    direction: "column",
    rows: [
      {
        nodes: [
          { label: "execute" },
          { label: "execute", tone: "accent" },
          { label: "execute", stretch: true, tone: "muted" },
        ],
      },
    ],
  },
};

export function graphFor(palette: Palette): PaletteGraph {
  return (
    GRAPHS[palette.slug] ?? {
      title: "trace",
      palette: "duo",
      rows: [
        {
          nodes: [
            { label: "tank" },
            { label: palette.common, tone: "accent" },
            { label: "oklch" },
            { label: palette.name, tone: "muted", stretch: true },
          ],
        },
      ],
    }
  );
}
