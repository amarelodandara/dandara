import { GraphFlow } from "@/components/graphs/graph-flow";
import { graphFor } from "@/lib/writing/palette-graph";
import type { Palette } from "@/lib/writing/palettes";

export function PaletteDiagram({ palette }: { palette: Palette }) {
  const { title, rows, direction, palette: tones } = graphFor(palette);

  return (
    <div className="w-full bg-(--fish-ink)">
      <GraphFlow
        title={title}
        direction={direction}
        palette={tones}
        rows={rows}
      />
    </div>
  );
}
