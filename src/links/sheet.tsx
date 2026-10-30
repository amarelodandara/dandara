import type { CSSProperties, ReactNode } from "react";
import type { Link } from "./link";
import { BG, look, ROLES, SHEET_LOOK, TEXT, type SheetLook } from "./look";
import { ANNOTATION, SECTION_HEADING } from "@/lib/type";

export type SheetLink = Pick<
  Link,
  "slug" | "title" | "url" | "tag" | "by" | "note"
>;

const ALPHABET = 26;
const A = 97;

export const FACE = `relative flex w-full flex-col justify-between overflow-hidden px-4 py-4 text-graphite-900 max-sm:justify-start max-sm:gap-6 sm:px-6 sm:py-6 border border-transparent shadow-label`;

export const CARD_SHAPE =
  "aspect-16/9 rounded-[1.4%/2.5%] max-sm:aspect-5/4 max-sm:rounded-[1.4%/1.75%]";

const SPOT =
  "absolute top-[8%] right-[5%] aspect-square w-[10%] -rotate-12 rounded-full max-sm:hidden";

const PRESS =
  "cursor-pointer transition-[scale,background-color] duration-(--motion-quick) ease-out-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-graphite-900/50";

const HOLLOW = "shadow-hollow can-hover:hover:bg-cadmium-200";

function Corner({
  title,
  picked,
  onPick,
  children,
}: {
  title: string;
  picked: boolean;
  onPick?: () => void;
  children?: ReactNode;
}) {
  const dot = "size-7 -rotate-12 rounded-full";
  return (
    <div className="absolute top-1 right-1 z-10 flex items-center sm:hidden">
      {children}
      {onPick ? (
        <button
          type="button"
          onClick={onPick}
          aria-pressed={picked}
          aria-label={`Select ${title}`}
          className={`group flex size-11 items-center justify-center rounded-full ${PRESS}`}
        >
          <span
            data-sticker={picked || undefined}
            className={`${dot} transition-[scale,background-color] duration-(--motion-quick) ease-out-strong group-active:scale-90 ${picked ? "" : HOLLOW}`}
          />
        </button>
      ) : null}
      {!onPick && picked ? (
        <span aria-hidden className="flex size-11 items-center justify-center">
          <span data-sticker className={dot} />
        </span>
      ) : null}
    </div>
  );
}

export const number = (index: number) => String(index + 1).padStart(3, "0");

const along = (letter: string) =>
  ({
    "--along": Math.max(
      0,
      Math.min(1, (letter.toLowerCase().codePointAt(0)! - A) / (ALPHABET - 1)),
    ),
  }) as CSSProperties;

export function Tab({
  letter,
  parts = SHEET_LOOK,
}: {
  letter: string;
  parts?: SheetLook;
}) {
  return (
    <span
      aria-hidden
      style={along(letter)}
      className={`absolute bottom-full left-[calc(var(--along)*(100%-2.5rem))] -mb-px flex h-5 w-10 items-center justify-center rounded-t-[0.3rem] ${BG[parts.tabBackground]} shadow-label ${look(parts.tabLetter)} leading-none uppercase`}
    >
      {letter}
    </span>
  );
}

export function Sheet({
  link,
  index,
  letter,
  large = false,
  children,
  corner,
  picked = false,
  onPick,
  parts = SHEET_LOOK,
}: {
  link: SheetLink;
  index: number;
  letter?: string;
  large?: boolean;
  children?: ReactNode;
  corner?: ReactNode;
  picked?: boolean;
  onPick?: () => void;
  parts?: SheetLook;
}) {
  return (
    <div className="relative w-full">
      {letter ? <Tab letter={letter} parts={parts} /> : null}
      <div
        className={`${FACE} ${BG[parts.background]} ${large ? "min-h-full rounded-md" : CARD_SHAPE}`}
      >
        {onPick ? (
          <button
            type="button"
            onClick={onPick}
            aria-pressed={picked}
            aria-label={`Select ${link.title}`}
            data-sticker={picked || undefined}
            className={`${SPOT} z-10 ${PRESS} active:scale-90 ${picked ? "" : HOLLOW}`}
          />
        ) : null}
        {onPick || picked || corner ? (
          <Corner title={link.title} picked={picked} onPick={onPick}>
            {corner}
          </Corner>
        ) : null}
        {!onPick && picked ? (
          <span aria-hidden data-sticker className={SPOT} />
        ) : null}
        <span className={look(parts.number)}>{number(index)}</span>

        <div className="min-w-0">
          <p
            className={`${large ? SECTION_HEADING : ROLES[parts.title.role]} ${TEXT[parts.title.colour]} wrap-break-word`}
          >
            {link.tag === "quote" ? `“${link.title}”` : link.title}
          </p>
          {link.by ? (
            <p className={`mt-1 ${look(parts.by)}`}>{link.by}</p>
          ) : null}
          {children}
          {link.note && !large ? (
            <p
              className={`mt-2 leading-normal text-graphite-700 ${ANNOTATION}`}
            >
              {link.note}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
