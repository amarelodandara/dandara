"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Changelog } from "@/components/graph/changelog";
import { ExhibitVideo } from "@/components/exhibit-video";
import type { ExhibitMedia } from "@/content/exhibits";
import type { Tile } from "@/lib/exhibition";
import { useLooseDrag } from "@/lib/loose-drag";
import { PRESS_BASE } from "@/lib/pressable";
import { ANNOTATION, LABEL } from "@/lib/type";

const MEDIA = "pointer-events-none h-auto w-full select-none";
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

const RESET = [
  PRESS_BASE,
  "relative cursor-pointer rounded-sm px-2 py-1",
  `${ANNOTATION} leading-none text-graphite-700`,
  "can-hover:hover:bg-graphite-200 focus-visible:bg-graphite-200",
  "after:absolute after:left-1/2 after:top-1/2 after:content-['']",
  "after:h-11 after:w-full",
  "after:-translate-x-1/2 after:-translate-y-1/2",
].join(" ");

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
        draggable={false}
        className={MEDIA}
      />
      <Image
        src={second}
        alt=""
        aria-hidden="true"
        width={media.width}
        height={media.height}
        sizes={SIZES}
        draggable={false}
        className={`absolute inset-0 ${MEDIA}`}
      />
    </div>
  );
}

function Media({ media }: { media: ExhibitMedia }) {
  if (media.kind === "changelog") {
    return (
      <div className="bg-cadmium-50 p-4 shadow-label md:p-7">
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
      draggable={false}
      className={MEDIA}
    />
  );
}

function Caption({ title, when, live, read }: Tile) {
  return (
    <figcaption className="mt-3 flex items-baseline justify-between gap-4">
      <span className="min-w-0">
        <span className={`${LABEL} text-graphite-700`}>{title}</span>
        {when ? (
          <span className={`ml-2 ${ANNOTATION} text-graphite-500`}>{when}</span>
        ) : null}
      </span>
      {live ? (
        <a href={live.href} draggable={false} className={CAPTION_LINK}>
          Live
          <span aria-hidden="true">&nbsp;↗</span>
          <span className="sr-only">
            {" "}
            {title} at {live.label}
          </span>
        </a>
      ) : null}
      {read ? (
        <Link href={read} draggable={false} className={CAPTION_LINK}>
          Read
          <span className="sr-only"> {title}</span>
        </Link>
      ) : null}
    </figcaption>
  );
}

type Drag = ReturnType<typeof useLooseDrag>;

function Exhibit({
  tile,
  receded,
  lifted,
  loose,
  drag,
  onLook,
}: {
  tile: Tile;
  receded: boolean;
  lifted: boolean;
  loose: boolean;
  drag: Omit<Drag, "moved" | "dragging" | "reset">;
  onLook: (id: string | null) => void;
}) {
  const look = () => onLook(tile.id);
  return (
    <div
      ref={drag.register(tile.id)}
      data-exhibit={tile.id}
      data-receded={receded ? "" : undefined}
      data-lifted={lifted ? "" : undefined}
      style={{ order: tile.rank }}
      onPointerDown={
        loose ? (event) => drag.onPointerDown(tile.id, event) : undefined
      }
      onPointerMove={loose ? drag.onPointerMove : undefined}
      onPointerUp={loose ? drag.onPointerEnd : undefined}
      onPointerCancel={loose ? drag.onPointerEnd : undefined}
      onClickCapture={loose ? drag.onClickCapture : undefined}
      onPointerEnter={(event) => event.pointerType === "mouse" && look()}
      onPointerLeave={() => onLook(null)}
      className={
        loose
          ? "relative touch-pan-y md:cursor-grab md:select-none"
          : "relative"
      }
    >
      <figure>
        {tile.read ? (
          <Link href={tile.read} draggable={false} tabIndex={-1}>
            <Media media={tile.media} />
          </Link>
        ) : (
          <Media media={tile.media} />
        )}
        <Caption {...tile} />
      </figure>
    </div>
  );
}

export function ExhibitionGrid({
  label,
  column,
  loose = true,
  tiles,
  columns,
  coda,
}: {
  label?: string;
  column?: string;
  loose?: boolean;
  tiles: Tile[];
  columns: string[][];
  coda?: ReactNode;
}) {
  const { moved, dragging, reset, ...drag } = useLooseDrag();
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

  const focus = dragging ?? looking;
  const kept = useMemo(
    () =>
      focus ? new Set([focus, ...(byId.get(focus)?.related ?? [])]) : null,
    [focus, byId],
  );

  return (
    <section className="relative">
      {label || loose ? (
        <div
          className={`mb-8 flex min-h-7 items-center justify-between gap-6 md:mb-12 ${column ?? HERO_COLUMN}`}
        >
          {label ? (
            <h2 className={`${ANNOTATION} leading-none text-graphite-700`}>
              {label}
            </h2>
          ) : null}
          <div className="ml-auto hidden items-center gap-4 md:flex">
            {loose ? (
              <p className={`${ANNOTATION} leading-none text-cadmium-900`}>
                it&rsquo;s art, please touch
              </p>
            ) : null}
            {moved ? (
              <button type="button" onClick={reset} className={RESET}>
                Put it all back
              </button>
            ) : null}
          </div>
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
                  lifted={dragging === id}
                  loose={loose}
                  drag={drag}
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
