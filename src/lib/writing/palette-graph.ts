import type { CheckItem } from "@/components/graphs/graph-check";
import type { FlowRow } from "@/components/graphs/graph-flow";
import type { GraphPalette } from "@/components/graphs/graph-motion";
import type { Palette } from "./palettes";

type GraphShared = {
  title: string;
  width?: string;
  palette?: GraphPalette;
};

export type PaletteGraph =
  | (GraphShared & {
      kind?: "flow";
      rows: FlowRow[];
      direction?: "row" | "column";
    })
  | (GraphShared & { kind: "check"; items: CheckItem[] });

const GRAPHS: Record<string, PaletteGraph> = {
  idol: {
    kind: "check",
    title: "BLOG DASHBOARD",
    width: "15.5rem",
    items: [
      { label: "build", done: true },
      { label: "curate", done: false },
    ],
  },
  idea: {
    title: "THE PLAN",
    direction: "column",
    width: "13rem",
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
