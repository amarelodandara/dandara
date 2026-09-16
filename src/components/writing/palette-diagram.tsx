import { GraphCheck } from "@/components/graphs/graph-check";
import { GraphFlow } from "@/components/graphs/graph-flow";
import { graphFor } from "@/lib/writing/palette-graph";
import type { Palette } from "@/lib/writing/palettes";

export function PaletteDiagram({ palette }: { palette: Palette }) {
  const graph = graphFor(palette);

  return (
    <div
      className="mx-auto w-full bg-(--fish-ink)"
      style={graph.width ? { maxWidth: graph.width } : undefined}
    >
      {graph.kind === "check" ? (
        <GraphCheck
          title={graph.title}
          items={graph.items}
          palette={graph.palette}
        />
      ) : (
        <GraphFlow
          title={graph.title}
          direction={graph.direction}
          palette={graph.palette}
          rows={graph.rows}
        />
      )}
    </div>
  );
}
