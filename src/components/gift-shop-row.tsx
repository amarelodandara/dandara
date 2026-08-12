"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { GiftShopItem } from "@/content/gift-shop";

/** How long the copy button admits to having worked. */
const COPIED_FOR = 1500;

/**
 * A rounded well that fills on hover, after Arc's Library. No borders anywhere —
 * the fill is the state. Hit targets clear 44px through padding alone, so
 * nothing here needs the expanded-target treatment the work sheets use.
 */
const ROW = [
  "group flex w-full rounded-lg px-3 py-3 text-left",
  "transition-colors duration-150",
  // Lighter than the shelf rather than darker: the row lifts towards the light
  // on hover instead of being pressed into the yellow.
  "hover:bg-white/45 focus-visible:bg-white/45",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/40",
].join(" ");

/** Every item with a preview is a portrait crop, so the frames all agree. */
const CHIP_W = "w-[9.5rem]";

function Label({ title, meta }: { title: string; meta: string }) {
  return (
    <span className="min-w-0 flex-1">
      <span className="block text-[0.9rem] font-semibold leading-tight">
        {title}
      </span>
      <span className="mt-0.5 block text-[0.7rem] leading-tight text-foreground-hard">
        {meta}
      </span>
    </span>
  );
}

/**
 * Names the outcome rather than the gesture, so the row says what it will do
 * before it is pressed. Centred against the label instead of pinned to its
 * first line — the label is two lines and the verb belongs to both.
 */
function Verb({ children, shown }: { children: string; shown?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={[
        "shrink-0 self-center text-[0.7rem] text-foreground-hard",
        "transition-opacity duration-150",
        shown
          ? "opacity-100"
          : "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100",
      ].join(" ")}
    >
      {children}
    </span>
  );
}

/** The white frame is what turns a file into an object rather than a list row. */
function Preview({
  preview,
}: {
  preview: NonNullable<Extract<GiftShopItem, { kind: "file" }>["preview"]>;
}) {
  return (
    <span
      className={`mx-auto block ${CHIP_W} bg-white p-1 shadow-chip`}
    >
      <Image
        src={preview.src}
        alt={preview.alt}
        width={preview.width}
        height={preview.height}
        sizes="152px"
        className="block aspect-[3/4] w-full object-cover"
      />
    </span>
  );
}

export function GiftShopRow({ item }: { item: GiftShopItem }) {
  if (item.kind === "swatch") {
    return <SwatchChip title={item.title} meta={item.meta} hex={item.hex} />;
  }

  if (item.kind === "file") {
    /* With a preview the row turns vertical: the image leads at a size worth
       looking at, and the naming follows underneath it. */
    if (item.preview) {
      return (
        <a
          href={item.href}
          download={item.download}
          className={`${ROW} flex-col items-start gap-2`}
        >
          <Preview preview={item.preview} />
          <span className="flex w-full items-center gap-3">
            <Label title={item.title} meta={item.meta} />
            <Verb>Download</Verb>
          </span>
        </a>
      );
    }

    return (
      <a
        href={item.href}
        download={item.download}
        className={`${ROW} items-center gap-3`}
      >
        <Label title={item.title} meta={item.meta} />
        <Verb>Download</Verb>
      </a>
    );
  }

  return <CopyRow title={item.title} meta={item.meta} text={item.text} />;
}

function CopyRow({
  title,
  meta,
  text,
}: {
  title: string;
  meta: string;
  text: string;
}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Denied permission or an insecure origin. Say nothing rather than lie.
      return;
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), COPIED_FOR);
  }

  return (
    <button
      type="button"
      onClick={copy}
      className={`${ROW} items-center gap-3`}
    >
      <Label title={title} meta={copied ? "Copied" : meta} />
      <Verb shown={copied}>{copied ? "✓" : "Copy"}</Verb>
    </button>
  );
}

/**
 * A Pantone chip: the colour on top, the code on the card below it. The white
 * card is doing real work rather than decoration — the swatch is the same
 * yellow as the panel it sits on, so without a frame there is nothing to see.
 */
function SwatchChip({
  title,
  meta,
  hex,
}: {
  title: string;
  meta: string;
  hex: string;
}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(hex);
    } catch {
      return;
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), COPIED_FOR);
  }

  return (
    <button
      type="button"
      onClick={copy}
      className={[
        `group mx-auto flex aspect-[3/4] ${CHIP_W} flex-col bg-white p-1 text-left`,
        "shadow-chip transition-opacity duration-150",
        "hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2",
        "focus-visible:outline-foreground/40",
      ].join(" ")}
    >
      <span
        aria-hidden="true"
        className="block w-full flex-1"
        style={{ backgroundColor: hex }}
      />
      <span className="block px-2 pb-1 pt-2">
        <span className="block text-[0.7rem] font-semibold leading-tight">
          {title}
        </span>
        <span className="mt-0.5 block text-[0.7rem] leading-tight text-foreground-soft">
          {copied ? "Copied" : hex}
        </span>
        <span className="sr-only">{meta}</span>
      </span>
    </button>
  );
}
