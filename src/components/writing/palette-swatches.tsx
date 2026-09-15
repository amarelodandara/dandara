import { ANNOTATION } from "@/lib/type";
import type { Palette } from "@/lib/writing/palettes";

function chip(color: string, label: string) {
  return (
    <div key={label + color} className="flex-1">
      <div
        className="aspect-square w-full rounded-sm"
        style={{ background: color }}
      />
      <p className={`mt-1.5 ${ANNOTATION} leading-none text-foreground-soft`}>
        {label}
      </p>
    </div>
  );
}

export function PaletteSwatches({ palette }: { palette: Palette }) {
  const chips = [
    chip(palette.ink, "ink"),
    ...palette.accents.map((accent, i) => chip(accent, `accent ${i + 1}`)),
    chip(palette.paper, "paper"),
  ];

  return <div className="flex gap-2">{chips}</div>;
}
