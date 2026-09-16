import { GraphCheck } from "@/components/graphs/graph-check";
import { GraphFlow } from "@/components/graphs/graph-flow";
import { GraphStack } from "@/components/graphs/graph-stack";
import { GraphTree } from "@/components/graphs/graph-tree";
import { graphFor, type PaletteGraph } from "@/lib/writing/palette-graph";
import type { Palette } from "@/lib/writing/palettes";

function Drawing({ graph }: { graph: PaletteGraph }) {
  if (graph.kind === "stack") {
    return (
      <GraphStack
        title={graph.title}
        items={graph.items}
        palette={graph.palette}
      />
    );
  }

  if (graph.kind === "tree") {
    return (
      <GraphTree
        title={graph.title}
        items={graph.items}
        palette={graph.palette}
      />
    );
  }

  if (graph.kind === "check") {
    return (
      <GraphCheck
        title={graph.title}
        items={graph.items}
        palette={graph.palette}
      />
    );
  }

  return (
    <GraphFlow
      title={graph.title}
      direction={graph.direction}
      palette={graph.palette}
      rows={graph.rows}
    />
  );
}

export function PaletteDiagram({ palette }: { palette: Palette }) {
  const graph = graphFor(palette);

  return (
    <div
      className="mx-auto w-full bg-(--fish-ink)"
      style={graph.width ? { maxWidth: graph.width } : undefined}
    >
      <Drawing graph={graph} />
    </div>
  );
}
