"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { GiftShopItem } from "@/content/gift-shop";
import { GiftShopSwatch } from "./gift-shop-swatch";
import { ANNOTATION, TITLE } from "@/lib/type";

const CONFIRMED_FOR = 1500;
const REPORTED_FOR = 4000;

export const SEAT = [
  "group flex w-full rounded-lg px-3 py-3 text-left",
  "transition-[background-color,scale] duration-(--motion-quick) ease-out-strong",
  "focus-visible:bg-lit",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/40",
].join(" ");

export const ROW = [
  SEAT,
  "can-hover:hover:bg-lit",
  "active:scale-[0.99] active:duration-(--press)",
].join(" ");

export const CHIP_W = "w-[9.5rem]";

function Label({ title, meta }: { title: string; meta: string }) {
  return (
    <span className="min-w-0 flex-1">
      <span className={`block ${TITLE}`}>{title}</span>
      <span
        className={`mt-0.5 block ${ANNOTATION} leading-tight text-foreground-hard`}
      >
        {meta}
      </span>
    </span>
  );
}

const SWAPPED = [
  "col-start-1 row-start-1",
  "transition-[opacity,scale,filter] duration-(--motion-quick) ease-out-strong",
].join(" ");

const ARRIVED = "scale-100 opacity-100 blur-[0px]";

const GONE = [
  "scale-25 opacity-0 blur-[4px]",
  "motion-reduce:scale-100 motion-reduce:blur-[0px]",
].join(" ");

export function Verb({
  idle,
  done,
  shown,
}: {
  idle: string;
  done?: string;
  shown?: boolean;
}) {
  return (
    <span
      aria-hidden="true"
      className={[
        `grid shrink-0 justify-items-end self-center ${ANNOTATION}`,
        "text-foreground-hard",
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
      <span className={`${SWAPPED} ${shown ? GONE : ARRIVED}`}>{idle}</span>
      {done ? (
        <span className={`${SWAPPED} ${shown ? ARRIVED : GONE}`}>{done}</span>
      ) : null}
    </span>
  );
}

export function Announcement({ children }: { children: string }) {
  return (
    <span role="status" className="sr-only">
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
    <span className={`mx-auto block ${CHIP_W} bg-mount p-1 shadow-chip`}>
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
      <GiftShopSwatch title={item.title} hex={item.hex} fill={item.fill} />
    );
  }

  if (item.kind === "file") {
    return <FileRow item={item} />;
  }

  return <CopyRow title={item.title} meta={item.meta} text={item.text} />;
}

type Outcome = "done" | "failed" | null;
type Settled = Exclude<Outcome, null>;

const SAVED_NOTE: Record<Settled, string> = {
  done: "Saved",
  failed: "Not saved",
};

const SAVED_ANNOUNCEMENT: Record<Settled, (title: string) => string> = {
  done: (title) => `${title} saved.`,
  failed: (title) => `${title} could not be saved.`,
};

export const COPIED_NOTE: Record<Settled, string> = {
  done: "Copied",
  failed: "Not copied",
};

export const COPIED_ANNOUNCEMENT: Record<Settled, (title: string) => string> = {
  done: (title) => `${title} copied.`,
  failed: (title) =>
    `${title} could not be copied, the browser refused the clipboard.`,
};

function useOutcome() {
  const [outcome, setOutcome] = useState<Outcome>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const report = useCallback((next: Settled) => {
    setOutcome(next);
    clearTimeout(timer.current);
    timer.current = setTimeout(
      () => setOutcome(null),
      next === "done" ? CONFIRMED_FOR : REPORTED_FOR,
    );
  }, []);

  return [outcome, report] as const;
}

export function useCopy(text: string) {
  const [outcome, report] = useOutcome();

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      report("failed");
      return;
    }
    report("done");
  }, [report, text]);

  return [outcome, copy] as const;
}

async function fileIsThere(href: string) {
  try {
    const response = await fetch(href, { method: "HEAD" });
    return response.ok;
  } catch {
    return false;
  }
}

function FileRow({ item }: { item: Extract<GiftShopItem, { kind: "file" }> }) {
  const [outcome, report] = useOutcome();
  const saved = outcome === "done";

  async function save() {
    report((await fileIsThere(item.href)) ? "done" : "failed");
  }

  const note = outcome ? SAVED_NOTE[outcome] : item.meta;
  const announcement = outcome ? SAVED_ANNOUNCEMENT[outcome](item.title) : "";

  const label = (
    <>
      <Label title={item.title} meta={note} />
      <Verb idle="Download" done="✓" shown={saved} />
    </>
  );

  return (
    <>
      <a
        href={item.href}
        download={item.download}
        onClick={save}
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
      <Announcement>{announcement}</Announcement>
    </>
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
  const [outcome, copy] = useCopy(text);
  const copied = outcome === "done";

  const note = outcome ? COPIED_NOTE[outcome] : meta;
  const announcement = outcome ? COPIED_ANNOUNCEMENT[outcome](title) : "";

  return (
    <>
      <button
        type="button"
        onClick={copy}
        data-pressable
        className={`${ROW} items-center gap-3`}
      >
        <Label title={title} meta={note} />
        <Verb idle="Copy" done="✓" shown={copied} />
      </button>
      <Announcement>{announcement}</Announcement>
    </>
  );
}
