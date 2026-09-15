import type { CSSProperties } from "react";
import { GraphFlow } from "@/components/graphs/graph-flow";
import { darkest, midtones, type Palette } from "@/lib/writing/palettes";

export function PaletteDiagram({ palette }: { palette: Palette }) {
  const accents = midtones(palette);
  const style = {
    "--graph-accent": accents[0] ?? darkest(palette),
    "--graph-accent-2": accents[1] ?? accents[0] ?? darkest(palette),
    "--graph-frame": darkest(palette),
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
