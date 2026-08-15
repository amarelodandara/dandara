"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { GiftShopItem } from "@/content/gift-shop";

const CONFIRMED_FOR = 1500;

const ROW = [
  "group flex w-full rounded-lg px-3 py-3 text-left",
  "transition-[background-color,scale] duration-(--motion-quick) ease-out-strong",
  "active:scale-[0.99] active:duration-(--press)",
  "hover:bg-white/45 focus-visible:bg-white/45",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/40",
].join(" ");

const CHIP_W = "w-[9.5rem]";

function Label({ title, meta }: { title: string; meta: string }) {
  return (
    <span className="min-w-0 flex-1">
      <span className="block text-[0.9rem] leading-tight font-semibold">
        {title}
      </span>
      <span className="mt-0.5 block text-[0.7rem] leading-tight text-foreground-hard">
        {meta}
      </span>
    </span>
  );
}

function Verb({ children, shown }: { children: string; shown?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={[
        "shrink-0 self-center text-[0.7rem] text-foreground-hard",
        "transition-opacity duration-(--motion-quick) ease-out-strong",
        shown
          ? "opacity-100"
          : [
              "opacity-100",
              "can-hover:opacity-0",
              "can-hover:group-hover:opacity-100",
              "can-hover:group-focus-visible:opacity-100",
            ].join(" "),
      ].join(" ")}
    >
      {children}
    </span>
  );
}

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
        className="block aspect-3/4 w-full object-cover"
      />
    </span>
  );
}

export function GiftShopRow({ item }: { item: GiftShopItem }) {
  if (item.kind === "swatch") {
    return (
      <SwatchChip
        title={item.title}
        meta={item.meta}
        hex={item.hex}
        fill={item.fill}
      />
    );
  }

  if (item.kind === "file") {
    return <FileRow item={item} />;
  }

  return <CopyRow title={item.title} meta={item.meta} text={item.text} />;
}

function useConfirmation() {
  const [confirmed, setConfirmed] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const confirm = useCallback(() => {
    setConfirmed(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setConfirmed(false), CONFIRMED_FOR);
  }, []);

  return [confirmed, confirm] as const;
}

function FileRow({ item }: { item: Extract<GiftShopItem, { kind: "file" }> }) {
  const [saved, confirm] = useConfirmation();

  const label = (
    <>
      <Label title={item.title} meta={saved ? "Saved" : item.meta} />
      <Verb shown={saved}>{saved ? "✓" : "Download"}</Verb>
    </>
  );

  return (
    <a
      href={item.href}
      download={item.download}
      onClick={confirm}
      data-pressable
      className={
        item.preview
          ? `${ROW} flex-col items-start gap-2`
          : `${ROW} items-center gap-3`
      }
    >
      {item.preview ? (
        <>
          <Preview preview={item.preview} />
          <span className="flex w-full items-center gap-3">{label}</span>
        </>
      ) : (
        label
      )}
    </a>
  );
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
  const [copied, confirm] = useConfirmation();

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      return;
    }
    confirm();
  }

  return (
    <button
      type="button"
      onClick={copy}
      data-pressable
      className={`${ROW} items-center gap-3`}
    >
      <Label title={title} meta={copied ? "Copied" : meta} />
      <Verb shown={copied}>{copied ? "✓" : "Copy"}</Verb>
    </button>
  );
}

function SwatchChip({
  title,
  meta,
  hex,
  fill,
}: {
  title: string;
  meta: string;
  hex: string;
  fill: string;
}) {
  const [copied, confirm] = useConfirmation();

  async function copy() {
    try {
      await navigator.clipboard.writeText(hex);
    } catch {
      return;
    }
    confirm();
  }

  return (
    <button
      type="button"
      onClick={copy}
      data-pressable
      className={[
        `group mx-auto flex aspect-[3/4] ${CHIP_W} flex-col bg-white p-1 text-left`,
        "shadow-chip transition-[opacity,scale] duration-(--motion-quick) ease-out-strong",
        "active:scale-[0.97] active:duration-(--press)",
        "hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2",
        "focus-visible:outline-foreground/40",
      ].join(" ")}
    >
      <span aria-hidden="true" className={`block w-full flex-1 ${fill}`} />
      <span className="block px-2 pt-2 pb-1">
        <span className="block text-[0.7rem] leading-tight font-semibold">
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
