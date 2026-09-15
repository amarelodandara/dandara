"use client";

import Image from "next/image";
import type { GiftShopItem } from "@/content/gift-shop";
import {
  Announcement,
  COPIED_ANNOUNCEMENT,
  COPIED_NOTE,
  useCopy,
  useOutcome,
  Verb,
  type Settled,
} from "./copy";
import { GiftShopSwatch } from "./gift-shop-swatch";
import { ROW } from "@/lib/pressable";
import { ANNOTATION, TITLE } from "@/lib/type";

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

const SAVED_NOTE: Record<Settled, string> = {
  done: "Saved",
  failed: "Not saved",
};

const SAVED_ANNOUNCEMENT: Record<Settled, (title: string) => string> = {
  done: (title) => `${title} saved.`,
  failed: (title) => `${title} could not be saved.`,
};

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
            ? `${ROW} w-full flex-col items-start gap-2`
            : `${ROW} w-full items-center gap-3`
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
        className={`${ROW} w-full items-center gap-3`}
      >
        <Label title={title} meta={note} />
        <Verb idle="Copy" done="✓" shown={copied} />
      </button>
      <Announcement>{announcement}</Announcement>
    </>
  );
}
