import type { CheckItem } from "@/components/graphs/graph-check";
import type { StackItem } from "@/components/graphs/graph-stack";
import type { TreeItem } from "@/components/graphs/graph-tree";
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
  | (GraphShared & { kind: "check"; items: CheckItem[] })
  | (GraphShared & { kind: "stack"; items: StackItem[] })
  | (GraphShared & { kind: "tree"; items: TreeItem[] });

const GRAPHS: Record<string, PaletteGraph> = {
  caranx: {
    kind: "tree",
    title: "SHOAL",
    width: "13rem",
    items: [
      { label: "school/", dir: true },
      { label: "caranx.rs", depth: 1, tone: "ink" },
      { label: "shoal.rs", depth: 1, tone: "muted" },
      { label: "Cargo.toml", tone: "alt" },
    ],
  },
  patela: {
    kind: "stack",
    title: "USAGE",
    width: "12rem",
    items: [
      { label: "Empathy", muted: true },
      { label: "Focus" },
      { label: "Impute", muted: true },
    ],
  },
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
