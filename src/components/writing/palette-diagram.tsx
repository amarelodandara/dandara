import type { CSSProperties } from "react";
import { GraphFlow } from "@/components/graphs/graph-flow";
import type { Palette } from "@/lib/writing/palettes";

export function PaletteDiagram({ palette }: { palette: Palette }) {
  const style = {
    "--graph-accent": palette.accents[0],
    "--graph-accent-2": palette.accents[1] ?? palette.accents[0],
    "--graph-frame": palette.ink,
  } as CSSProperties;

  return (
    <div style={style}>
      <GraphFlow
        title="trace"
        palette="duo"
        rows={[
          {
            nodes: [
              { label: "tank" },
              { label: palette.common, tone: "accent" },
              { label: "oklch" },
              { label: palette.name, tone: "muted", stretch: true },
            ],
          },
        ]}
      />
    </div>
  );
}
