import { MICRO } from "@/lib/type";
import type { Palette } from "@/lib/writing/palettes";

function numbers(oklch: string) {
  return oklch.replace("oklch(", "").replace(")", "");
}

function Band({ color }: { color: string }) {
  return (
    <div className="relative min-h-0 flex-1" style={{ background: color }}>
      <span
        className={`absolute bottom-1.5 left-1/2 -translate-x-1/2 rounded-full bg-background px-2 py-0.5 shadow-chip ${MICRO} whitespace-nowrap text-foreground`}
      >
        {numbers(color)}
      </span>
    </div>
  );
}

export function PaletteSwatches({ palette }: { palette: Palette }) {
  const bands = [palette.ink, ...palette.accents, palette.paper];

  return (
    <div className="flex size-full flex-col overflow-hidden rounded-md">
      {bands.map((color, i) => (
        <Band key={color + i} color={color} />
      ))}
    </div>
  );
}
