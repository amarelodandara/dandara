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
  "group flex w-full items-start gap-3 rounded-lg px-3 py-3 text-left",
  "transition-colors duration-150",
  "hover:bg-ink/[0.055] focus-visible:bg-ink/[0.055]",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink/40",
].join(" ");

function Label({ title, meta }: { title: string; meta: string }) {
  return (
    <span className="min-w-0 flex-1">
      <span className="block text-[0.9rem] font-semibold leading-tight">
        {title}
      </span>
      <span className="mt-0.5 block text-[0.7rem] leading-tight text-ink-soft">
        {meta}
      </span>
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
    <span className="shrink-0 bg-white p-1 shadow-[0_1px_3px_rgb(0_0_0/0.18)]">
      <Image
        src={preview.src}
        alt={preview.alt}
        width={preview.width}
        height={preview.height}
        sizes="44px"
        className="block h-14 w-11 object-cover"
      />
    </span>
  );
}

export function GiftShopRow({ item }: { item: GiftShopItem }) {
  if (item.kind === "file") {
    return (
      <a href={item.href} download={item.download} className={ROW}>
        {item.preview && <Preview preview={item.preview} />}
        <Label title={item.title} meta={item.meta} />
        <span
          aria-hidden="true"
          className="mt-0.5 shrink-0 text-[0.7rem] text-ink-soft opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100"
        >
          Take
        </span>
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
    <button type="button" onClick={copy} className={ROW}>
      <Label title={title} meta={copied ? "Copied" : meta} />
      <span
        aria-hidden="true"
        className={[
          "mt-0.5 shrink-0 text-[0.7rem] text-ink-soft transition-opacity duration-150",
          copied
            ? "opacity-100"
            : "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100",
        ].join(" ")}
      >
        {copied ? "✓" : "Copy"}
      </span>
    </button>
  );
}
