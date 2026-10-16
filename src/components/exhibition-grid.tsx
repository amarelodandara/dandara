"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { BadgeTile } from "@/badges/tile";
import { Changelog } from "@/components/graph/changelog";
import { ExhibitVideo } from "@/components/exhibit-video";
import type { ExhibitMedia } from "@/content/exhibits";
import type { Tile } from "@/lib/exhibition";
import { PRESS_BASE } from "@/lib/pressable";
import { ANNOTATION, LABEL } from "@/lib/type";

const MEDIA = "h-auto w-full";
const SIZES = "(min-width: 768px) 33vw, 100vw";

const CAPTION_LINK = [
  PRESS_BASE,
  "relative -my-1 inline-flex shrink-0 cursor-pointer items-center rounded-sm px-2 py-1",
  `${ANNOTATION} text-graphite-700`,
  "can-hover:hover:bg-cadmium-200 focus-visible:bg-cadmium-200",
  "after:absolute after:left-1/2 after:top-1/2 after:content-['']",
  "after:h-11 after:w-[max(100%+1.5rem,2.75rem)]",
  "after:-translate-x-1/2 after:-translate-y-1/2",
].join(" ");

const HERO_COLUMN = "mx-auto w-full max-w-[1400px] px-[7vw]";
const WALL_GUTTER = "px-[max(1.5rem,4vw)]";

type FlipMedia = Extract<ExhibitMedia, { kind: "flip" }>;

function Flip({ media }: { media: FlipMedia }) {
  const [first, second] = media.frames;
  return (
    <div data-flip="" className="relative">
      <Image
        src={first}
        alt={media.alt}
        width={media.width}
        height={media.height}
        sizes={SIZES}
        className={MEDIA}
      />
      <Image
        src={second}
        alt=""
        aria-hidden="true"
        width={media.width}
        height={media.height}
        sizes={SIZES}
        className={`absolute inset-0 ${MEDIA}`}
      />
    </div>
  );
}

function Media({ media }: { media: ExhibitMedia }) {
  if (media.kind === "badges") return <BadgeTile slug={media.slug} />;
  if (media.kind === "changelog") {
    return (
      <div className="bg-cadmium-50 p-4 shadow-label md:p-8">
        <Changelog className="@container text-left" version={media.version}>
          <ul>
            {media.lines.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </Changelog>
      </div>
    );
  }
  if (media.kind === "video") {
    return (
      <ExhibitVideo
        sources={media.sources}
        poster={media.poster}
        width={media.width}
        height={media.height}
        label={media.label}
        className={MEDIA}
      />
    );
  }
  if (media.kind === "flip") return <Flip media={media} />;
  return (
    <Image
      src={media.src}
      alt={media.alt}
      width={media.width}
      height={media.height}
      sizes={SIZES}

      className={MEDIA}
    />
  );
}

function Mat({ media }: { media: ExhibitMedia }) {
  if (media.kind === "changelog") return <Media media={media} />;
  return (
    <div data-inset="" className="relative">
      <Media media={media} />
    </div>
  );
}

const isElsewhere = (href: string) => /^https?:\/\//.test(href);

function ReadLink({ title, read, readAt }: Tile & { read: string }) {
  if (isElsewhere(read)) {
    return (
      <a href={read} className={CAPTION_LINK}>
        Read
        <span aria-hidden="true">&nbsp;↗</span>
        <span className="sr-only">
          {" "}
          {title}
          {readAt ? ` at ${readAt}` : ""}
        </span>
      </a>
    );
  }
  return (
    <Link href={read} className={CAPTION_LINK}>
      Read
      <span className="sr-only"> {title}</span>
    </Link>
  );
}

function Caption(tile: Tile) {
  const { title, when, live, read } = tile;
  return (
    <figcaption className="mt-3 flex items-baseline justify-between gap-4">
      <span className="min-w-0">
        <span className={`${LABEL} text-graphite-700`}>{title}</span>
        {when ? (
          <span className={`ml-2 ${ANNOTATION} text-graphite-500`}>{when}</span>
        ) : null}
      </span>
      {live ? (
        <a href={live.href} className={CAPTION_LINK}>
          Live
          <span aria-hidden="true">&nbsp;↗</span>
          <span className="sr-only">
            {" "}
            {title} at {live.label}
          </span>
        </a>
      ) : null}
      {read ? <ReadLink {...tile} read={read} /> : null}
    </figcaption>
  );
}

function Framed({ read, children }: { read?: string; children: ReactNode }) {
  if (!read) return children;
  if (isElsewhere(read)) {
    return (
      <a href={read} tabIndex={-1}>
        {children}
      </a>
    );
  }
  return (
    <Link href={read} tabIndex={-1}>
      {children}
    </Link>
  );
}

function Exhibit({
  tile,
  receded,
  onLook,
}: {
  tile: Tile;
  receded: boolean;
  onLook: (id: string | null) => void;
}) {
  const look = () => onLook(tile.id);
  return (
    <div
      data-exhibit={tile.id}
      data-receded={receded ? "" : undefined}
      style={{ order: tile.rank }}
      onPointerEnter={(event) => event.pointerType === "mouse" && look()}
      onPointerLeave={() => onLook(null)}
      className="relative"
    >
      <figure>
        <Framed read={tile.read}>
          <Mat media={tile.media} />
        </Framed>
        <Caption {...tile} />
      </figure>
    </div>
  );
}

export function ExhibitionGrid({
  label,
  column,
  tiles,
  columns,
  coda,
}: {
  label?: string;
  column?: string;
  tiles: Tile[];
  columns: string[][];
  coda?: ReactNode;
}) {
  const [looking, setLooking] = useState<string | null>(null);
  const byId = useMemo(
    () => new Map(tiles.map((tile) => [tile.id, tile])),
    [tiles],
  );

  const wall = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wall.current;
    if (!el) return;
    const look = (event: FocusEvent) => {
      const piece = (event.target as Element).closest<HTMLElement>(
        "[data-exhibit]",
      );
      setLooking(piece?.dataset.exhibit ?? null);
    };
    const away = () => setLooking(null);
    el.addEventListener("focusin", look);
    el.addEventListener("focusout", away);
    return () => {
      el.removeEventListener("focusin", look);
      el.removeEventListener("focusout", away);
    };
  }, []);

  const kept = useMemo(
    () =>
      looking
        ? new Set([looking, ...(byId.get(looking)?.related ?? [])])
        : null,
    [looking, byId],
  );

  return (
    <section className="relative">
      {label ? (
        <div
          className={`mb-8 flex min-h-7 items-center md:mb-12 ${column ?? HERO_COLUMN}`}
        >
          <h2 className={`${ANNOTATION} leading-none text-graphite-700`}>
            {label}
          </h2>
        </div>
      ) : null}

      <div
        ref={wall}
        className={`flex flex-col gap-(--wall-gap) md:grid md:grid-cols-3 md:items-start ${WALL_GUTTER}`}
      >
        {columns.map((stack, column) => (
          <div
            key={stack.join(" ")}
            className="contents md:flex md:flex-col md:gap-(--wall-gap)"
          >
            {stack.map((id) => {
              const tile = byId.get(id);
              if (!tile) return null;
              return (
                <Exhibit
                  key={id}
                  tile={tile}
                  receded={kept !== null && !kept.has(id)}
                  onLook={setLooking}
                />
              );
            })}
            {coda && column === columns.length - 1 ? (
              <div
                data-exhibit-coda=""
                style={{ order: tiles.length }}
                data-receded={kept === null ? undefined : ""}
              >
                {coda}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}
