"use client";

import type { CSSProperties } from "react";
import {
  Announcement,
  COPIED_ANNOUNCEMENT,
  COPIED_NOTE,
  Swap,
  useCopy,
  Verb,
} from "@/components/copy";
import { PRESS } from "@/lib/pressable";
import { ANNOTATION } from "@/lib/type";
import { formatColor, formatPalette } from "@/lib/writing/color-format";
import { useColorFormat } from "@/lib/writing/color-format-store";
import {
  darkest,
  lightest,
  shareOf,
  withAlpha,
  type Palette,
} from "@/lib/writing/palettes";

const BAND = [
  "group relative min-h-0 basis-0 cursor-pointer text-left select-none",
  "focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-(--band-fg)",
].join(" ");

const CHIP_SEAT = [
  "absolute right-2 bottom-2 origin-bottom-right",
  "transition-[scale] duration-(--motion-quick) ease-out-strong",
  "group-active:scale-[0.97] group-active:duration-(--press)",
  "motion-reduce:group-active:scale-100",
].join(" ");

const CHIP = [
  "rounded-md px-2 py-1",
  "can-hover:group-hover:bg-(--band-lit)",
  "can-hover:group-focus-visible:bg-(--band-lit)",
].join(" ");

const CHIP_SETTLED = "rounded-md bg-(--band-lit) px-2 py-1";

const WASH = "can-hover:hover:bg-foreground/5 focus-visible:bg-foreground/5";

function lightness(oklch: string) {
  return Number.parseFloat(oklch.replace("oklch(", ""));
}

function legibleOn(color: string, ink: string, paper: string) {
  return lightness(color) > 0.5 ? ink : paper;
}

function Band({
  color,
  text,
  share,
  ink,
  paper,
}: {
  color: string;
  text: string;
  share: number;
  ink: string;
  paper: string;
}) {
  const [outcome, copy] = useCopy(text);
  const copied = outcome === "done";
  const fg = legibleOn(color, ink, paper);
  const announcement = outcome ? COPIED_ANNOUNCEMENT[outcome](text) : "";

  return (
    <>
      <button
        type="button"
        onClick={copy}
        data-pressable
        style={
          {
            background: color,
            flexGrow: share,
            "--band-fg": fg,
            "--band-lit": withAlpha(fg, 0.12),
          } as CSSProperties
        }
        className={BAND}
      >
        <span className={CHIP_SEAT}>
          <Verb
            idle={outcome === "failed" ? COPIED_NOTE.failed : "Copy"}
            done="Copied"
            shown={copied}
            className="text-(--band-fg)"
            itemClassName={outcome ? CHIP_SETTLED : CHIP}
          />
        </span>
      </button>
      <Announcement>{announcement}</Announcement>
    </>
  );
}

export function PaletteSwatches({ palette }: { palette: Palette }) {
  const bands = palette.colors;
  const ink = darkest(palette);
  const paper = lightest(palette);
  const format = useColorFormat();
  const [outcome, copyAll] = useCopy(
    formatPalette(bands, format, palette.slug),
  );
  const announcement = outcome
    ? COPIED_ANNOUNCEMENT[outcome](`The ${palette.name} palette`)
    : "";

  return (
    <>
      <div className="flex size-72 flex-col overflow-hidden rounded-md sm:size-80">
        {bands.map((color, i) => (
          <Band
            key={color + i}
            color={color}
            text={formatColor(color, format, `${palette.slug}-${i + 1}`)}
            share={shareOf(palette, i)}
            ink={ink}
            paper={paper}
          />
        ))}
      </div>
      <button
        type="button"
        onClick={copyAll}
        data-pressable
        className={`${PRESS} ${WASH} mt-1 ml-auto w-fit cursor-pointer items-center px-3 py-2 ${ANNOTATION} ${outcome ? "text-foreground" : "text-foreground-soft"}`}
      >
        <Swap
          idle="Copy palette"
          done={outcome ? COPIED_NOTE[outcome] : COPIED_NOTE.done}
          shown={Boolean(outcome)}
          className="text-current"
        />
      </button>
      <Announcement>{announcement}</Announcement>
    </>
  );
}
