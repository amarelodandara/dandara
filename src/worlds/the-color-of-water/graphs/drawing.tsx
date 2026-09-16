import { GraphCheck, type CheckItem } from "./check";
import { GraphCountdown } from "./countdown";
import { GraphFlow, type FlowRow } from "./flow";
import type { GraphPalette } from "./motion";
import { GraphSlope, type SlopeItem } from "./slope";
import { GraphStack, type StackItem } from "./stack";
import { GraphTree, type TreeItem } from "./tree";

type GraphShared = {
  title: string;
  palette?: GraphPalette;
};

export type PaletteGraph =
  | (GraphShared & {
      kind: "flow";
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

function Drawing({ graph }: { graph: PaletteGraph }) {
  switch (graph.kind) {
    case "stack": {
      return <GraphStack title={graph.title} items={graph.items} />;
    }
    case "slope": {
      return (
        <GraphSlope
          title={graph.title}
          items={graph.items}
          fromLabel={graph.fromLabel}
          toLabel={graph.toLabel}
        />
      );
    }
    case "countdown": {
      return (
        <GraphCountdown
          title={graph.title}
          to={graph.to}
          done={graph.done}
          caption={graph.caption}
        />
      );
    }
    case "tree": {
      return <GraphTree title={graph.title} items={graph.items} />;
    }
    case "check": {
      return <GraphCheck title={graph.title} items={graph.items} />;
    }
    case "flow": {
      return (
        <GraphFlow
          title={graph.title}
          direction={graph.direction}
          palette={graph.palette}
          rows={graph.rows}
        />
      );
    }
  }
}

export function PaletteDiagram({ graph }: { graph: PaletteGraph }) {
  return (
    <div className="mx-auto w-full max-w-(--fish-graph-width) bg-(--graph-paper)">
      <Drawing graph={graph} />
    </div>
  );
}
