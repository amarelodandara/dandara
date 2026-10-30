"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { Ref } from "./export";
import { Depth, DRUM_HEIGHT, Drum } from "./drum";
import { Intro } from "./intro";
import { fileKey, useRolodexKeys } from "./keys";
import {
  keepBefore,
  pick,
  pickOnly,
  takeBefore,
  unpick,
  usePicked,
} from "./picked";
import { randomIndex, wrap } from "./roll";
import { Selection } from "./selection";
import type { SheetLink } from "./sheet";
import { land, quiet, tick, unlockTicks } from "./sound";
import { paint, useRoll } from "./use-roll";
import { openOverlay, SHOP_OVERLAY } from "@/lib/exclusive-overlay";
import { useSound } from "@/lib/sound";
import { ANNOTATION } from "@/lib/type";

const KEY = [
  "flex items-center rounded-lg border border-transparent bg-graphite-50 px-2.5 py-2 shadow-chip",
  `${ANNOTATION} leading-none text-graphite-700`,
  "transition-[background-color,scale] duration-(--motion-quick) ease-out-strong",
  "can-hover:hover:bg-graphite-100 focus-visible:bg-graphite-100 active:scale-[0.97] active:duration-(--press)",
].join(" ");

const RUSH_MS_PER_CARD = 8;
const SHORTEST_RUSH_MS = 300;
const LONGEST_RUSH_MS = 1400;

const rushMs = (cards: number) =>
  Math.min(LONGEST_RUSH_MS, SHORTEST_RUSH_MS + cards * RUSH_MS_PER_CARD);

type Rush = { to: "all" | "back"; keep: Ref[] };

const still = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const firstOfEachLetter = (links: SheetLink[]) => {
  const letters = new Map<string, string>();
  let last = "";
  for (const link of links) {
    const letter = fileKey(link.title).charAt(0);
    if (letter !== last) letters.set(link.slug, letter);
    last = letter;
  }
  return letters;
};

export function Rolodex({ links }: { links: SheetLink[] }) {
  const count = links.length;
  const sheets = count + 1;
  const stage = useRef<HTMLDivElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const [letters] = useState(() => firstOfEachLetter(links));
  const [centre, setCentre] = useState(0);
  const [landed, setLanded] = useState<number | null>(null);
  const [rush, setRush] = useState<Rush | null>(null);
  const picked = usePicked();
  const soundOn = useSound();

  const isIntro = (k: number) => wrap(k, sheets) === 0;
  const linkAt = (k: number) =>
    isIntro(k) ? undefined : links[wrap(k, sheets) - 1];

  const roll = useRoll(
    stage,
    {
      onIndex: (k, speed) => {
        setCentre(k);
        if (soundOn) tick(speed);
      },
      onLand: (k) => {
        setLanded(wrap(k, sheets));
        setRush(null);
        if (soundOn) land();
        else quiet();
      },
      onTap: (k) => {
        if (k !== centre) go(k);
      },
    },
    true,
  );

  useLayoutEffect(() => {
    paint(stage.current, roll.position);
  }, [centre, roll]);

  useEffect(() => {
    const unlock = () => unlockTicks();
    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);

  function go(k: number) {
    if (still()) roll.jump(k);
    else roll.goTo(k);
  }

  const toIndex = (index: number) =>
    go(roll.heading + index + 1 - wrap(roll.heading, sheets));

  const passed = (index: number) => index < wrap(centre, sheets);
  const kept = new Set(rush?.keep.map((ref) => ref.slug));
  const shown = rush
    ? links.filter(
        (link, index) =>
          passed(index) || (rush.to === "back" && kept.has(link.slug)),
      )
    : picked;
  const selected = new Set(shown.map((ref) => ref.slug));

  function select(k: number) {
    const link = linkAt(k);
    if (!link) return;
    if (selected.has(link.slug)) unpick(link.slug);
    else pick(link);
  }

  const rolled =
    rush?.to === "all" ||
    (!rush && links.every((link) => selected.has(link.slug)));

  function sweep(next: Rush, to: number) {
    const cards = Math.abs(to - roll.position);
    if (still() || cards < 1) {
      roll.jump(to);
      return;
    }
    setRush(next);
    roll.travel(to, rushMs(cards));
  }

  function rollAll() {
    const from = roll.heading;
    const at = wrap(from, sheets);
    if (rolled) {
      const keep = takeBefore();
      pickOnly(keep);
      sweep({ to: "back", keep }, from - at);
      return;
    }
    keepBefore(picked);
    pickOnly(links);
    sweep({ to: "all", keep: [] }, from + count - at);
  }

  useRolodexKeys({
    links,
    heading: () => roll.heading,
    step: (by) => go(roll.heading + by),
    toIndex,
  });

  const landedOn = landed === null ? undefined : linkAt(landed);
  const announcement = landedOn
    ? `${landed} of ${count}: ${landedOn.title}`
    : `${count} references, filed A to Z`;

  return (
    <div
      ref={root}
      data-links
      className="relative flex flex-1 flex-col pt-[9vh] sm:pt-[12vh]"
    >
      <Selection refs={shown} all={rolled} rushing={rush !== null} />

      <div aria-hidden className={`shrink-0 ${DRUM_HEIGHT}`} />
      <Depth />
      <Drum
        stage={stage}
        links={links}
        letters={letters}
        intro={<Intro count={count} />}
        centre={centre}
        selected={selected}
        onSelect={select}
        controls={
          <>
            <button type="button" onClick={rollAll} className={KEY}>
              {rolled ? "Roll it back up" : "Roll all"}
            </button>
            <button
              type="button"
              onClick={() => toIndex(randomIndex(count))}
              className={`${KEY} max-sm:hidden`}
            >
              Random
            </button>
            {picked.length > 0 ? (
              <button
                type="button"
                onClick={() => openOverlay(SHOP_OVERLAY)}
                aria-haspopup="dialog"
                className={`${KEY} max-sm:hidden`}
              >
                Export
              </button>
            ) : null}
          </>
        }
      />

      <p role="status" className="sr-only">
        {landed === null ? "" : announcement}
      </p>
    </div>
  );
}
