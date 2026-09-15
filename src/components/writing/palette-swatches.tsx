"use client";

import { useState } from "react";
import { MICRO } from "@/lib/type";
import type { Palette } from "@/lib/writing/palettes";

function numbers(oklch: string) {
  return oklch.replace("oklch(", "").replace(")", "");
}

function Band({ color }: { color: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(color);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="relative min-h-0 flex-1" style={{ background: color }}>
      <span
        className={`absolute bottom-1.5 left-1/2 -translate-x-1/2 rounded-full bg-background px-2 py-0.5 shadow-chip ${MICRO} whitespace-nowrap text-foreground`}
      >
        {numbers(color)}
      </span>
      <button
        type="button"
        onClick={copy}
        className={`absolute right-1.5 bottom-1.5 rounded-full bg-background/60 px-2 py-0.5 backdrop-blur-sm transition-colors duration-(--motion-quick) can-hover:hover:bg-background/85 ${MICRO} text-foreground`}
      >
        {copied ? "copied" : "copy"}
      </button>
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
