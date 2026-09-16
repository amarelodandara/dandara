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
import { useColorFormat } from "./format-store";
import type { Swatch } from "./palettes";

const BAND = [
  "group relative min-h-9 basis-0 cursor-pointer text-left select-none",
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

function Band({ swatch, text }: { swatch: Swatch; text: string }) {
  const [outcome, copy] = useCopy(text);
  const copied = outcome === "done";
  const announcement = outcome ? COPIED_ANNOUNCEMENT[outcome](text) : "";

  return (
    <>
      <button
        type="button"
        onClick={copy}
        data-pressable
        style={
          {
            background: swatch.oklch,
            flexGrow: swatch.share,
            "--band-fg": swatch.ink,
            "--band-lit": swatch.lit,
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

export function PaletteSwatches({
  name,
  swatches,
}: {
  name: string;
  swatches: Swatch[];
}) {
  const format = useColorFormat();
  const [outcome, copyAll] = useCopy(
    swatches.map((swatch) => swatch[format]).join("\n"),
  );
  const announcement = outcome
    ? COPIED_ANNOUNCEMENT[outcome](`The ${name} palette`)
    : "";

  return (
    <>
      <div className="flex size-72 flex-col overflow-hidden rounded-md sm:size-80">
        {swatches.map((swatch) => (
          <Band key={swatch.variables} swatch={swatch} text={swatch[format]} />
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
