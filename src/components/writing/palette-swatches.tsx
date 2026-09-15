"use client";

import { useState, type CSSProperties } from "react";
import { ANNOTATION, MICRO } from "@/lib/type";
import { darkest, lightest, type Palette } from "@/lib/writing/palettes";

const GHOST =
  "transition-colors duration-(--motion-quick) can-hover:hover:text-sun-ink";

function lightness(oklch: string) {
  return Number.parseFloat(oklch.replace("oklch(", ""));
}

function legibleOn(color: string, ink: string, paper: string) {
  return lightness(color) > 0.5 ? ink : paper;
}

async function copyText(text: string) {
  await navigator.clipboard.writeText(text);
}

function Band({
  color,
  ink,
  paper,
}: {
  color: string;
  ink: string;
  paper: string;
}) {
  const [copied, setCopied] = useState(false);
  const fg = legibleOn(color, ink, paper);

  async function copy() {
    await copyText(color);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="relative min-h-0 flex-1" style={{ background: color }}>
      <button
        type="button"
        onClick={copy}
        style={{ "--band-fg": fg } as CSSProperties}
        className={`absolute right-1.5 bottom-1.5 text-(--band-fg) ${MICRO} ${GHOST}`}
      >
        {copied ? "copied" : "copy"}
      </button>
    </div>
  );
}

export function PaletteSwatches({ palette }: { palette: Palette }) {
  const bands = palette.colors;
  const ink = darkest(palette);
  const paper = lightest(palette);
  const [copiedAll, setCopiedAll] = useState(false);

  async function copyAll() {
    await copyText(bands.join("\n"));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 1500);
  }

  return (
    <>
      <div className="flex size-72 flex-col overflow-hidden rounded-md sm:size-80">
        {bands.map((color, i) => (
          <Band key={color + i} color={color} ink={ink} paper={paper} />
        ))}
      </div>
      <button
        type="button"
        onClick={copyAll}
        className={`mt-3 ${ANNOTATION} text-foreground-soft ${GHOST}`}
      >
        {copiedAll ? "copied palette" : "copy palette"}
      </button>
    </>
  );
}
