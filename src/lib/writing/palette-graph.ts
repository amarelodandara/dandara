import type { CheckItem } from "@/components/graphs/graph-check";
import type { StackItem } from "@/components/graphs/graph-stack";
import type { SlopeItem } from "@/components/graphs/graph-slope";
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
  | (GraphShared & { kind: "tree"; items: TreeItem[] })
  | (GraphShared & {
      kind: "slope";
      items: SlopeItem[];
      fromLabel?: string;
      toLabel?: string;
    })
  | (GraphShared & {
      kind: "countdown";
      to: string;
      done: string;
      caption?: string;
    });

const GRAPHS: Record<string, PaletteGraph> = {
  volitas: {
    kind: "slope",
    title: "USERS",
    palette: "duo",
    width: "16rem",
    fromLabel: "2025",
    toLabel: "2026",
    items: [
      { label: "store", from: 8200, to: 12_400 },
      { label: "docs", from: 5100, to: 4100 },
      { label: "dashboard", from: 640, to: 860 },
    ],
  },
  "pink-moon": {
    kind: "countdown",
    title: "FREEZE",
    width: "13rem",
    to: "2027-01-01T00:00:00Z",
    done: "open",
    caption: "until offsite",
  },
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
