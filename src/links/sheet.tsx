import type { CSSProperties, ReactNode } from "react";
import type { Link } from "./link";
import { BG, look, ROLES, SHEET_LOOK, TEXT, type SheetLook } from "./look";
import { SECTION_HEADING } from "@/lib/type";

export type SheetLink = Pick<
  Link,
  "slug" | "title" | "url" | "tag" | "by" | "note"
>;

const ALPHABET = 26;
const A = 97;

export const FACE = `relative flex w-full flex-col justify-between overflow-hidden px-4 py-4 text-graphite-900 sm:px-6 sm:py-6 border border-transparent shadow-label`;

export const CARD_SHAPE = "aspect-16/9 rounded-[1.4%/2.5%]";

const SPOT =
  "absolute top-[8%] right-[5%] aspect-square w-[10%] -rotate-12 rounded-full";

export const number = (index: number) => String(index + 1).padStart(3, "0");

const along = (letter: string) =>
  ({
    "--along": Math.min(
      1,
      (letter.toLowerCase().codePointAt(0)! - A) / (ALPHABET - 1),
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
  picked = false,
  onPick,
  parts = SHEET_LOOK,
}: {
  link: SheetLink;
  index: number;
  letter?: string;
  large?: boolean;
  children?: ReactNode;
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
            className={`${SPOT} z-10 cursor-pointer transition-[scale,background-color] duration-(--motion-quick) ease-out-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-graphite-900/50 active:scale-90 ${picked ? "" : "shadow-hollow can-hover:hover:bg-cadmium-200"}`}
          />
        ) : null}
        {!onPick && picked ? (
          <span aria-hidden data-sticker className={SPOT} />
        ) : null}
        <span className={look(parts.number)}>{number(index)}</span>

        <div className="min-w-0">
          <p
            className={`${large ? SECTION_HEADING : ROLES[parts.title.role]} ${TEXT[parts.title.colour]} ${large ? "" : "line-clamp-3"} wrap-break-word`}
          >
            {link.tag === "quote" ? `“${link.title}”` : link.title}
          </p>
          {link.by ? (
            <p className={`mt-1 truncate ${look(parts.by)}`}>{link.by}</p>
          ) : null}
          {children}
        </div>
      </div>
    </div>
  );
}
