import type { ReactNode, RefObject } from "react";
import { wrap } from "./roll";
import { Sheet, type SheetLink } from "./sheet";
import { FALL_LAYERS } from "./use-roll";
import { Visit } from "./visit";

const BEHIND = 3;
const AHEAD = 10;
const DEPTH_LAYERS = 5;

export const DRUM_HEIGHT = "h-[44vh] sm:h-[min(26rem,50vh)]";

export const SLOT =
  "absolute inset-0 origin-[50%_calc(100%+3.5rem)] backface-hidden will-change-transform";

export function Fall() {
  return Array.from({ length: FALL_LAYERS }, (_, layer) => (
    <span key={layer} aria-hidden data-fall={layer} />
  ));
}

export function Depth() {
  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-x-0 bottom-0 z-10 ${DRUM_HEIGHT}`}
    >
      {Array.from({ length: DEPTH_LAYERS }, (_, layer) => (
        <span key={layer} data-depth={layer} />
      ))}
      <span data-depth="wash" />
    </div>
  );
}

export function Drum({
  stage,
  links,
  letters,
  intro,
  centre,
  selected,
  onSelect,
  controls,
}: {
  stage: RefObject<HTMLDivElement | null>;
  links: SheetLink[];
  letters: Map<string, string>;
  intro: ReactNode;
  centre: number;
  selected: Set<string>;
  onSelect: (k: number) => void;
  controls: ReactNode;
}) {
  const count = links.length + 1;
  const slots = Array.from(
    { length: Math.min(count, BEHIND + AHEAD + 1) },
    (_, i) => centre - BEHIND + i,
  ).toReversed();

  return (
    <div
      className={`pointer-events-none fixed inset-x-0 bottom-0 z-10 flex ${DRUM_HEIGHT} items-end justify-center pb-6 perspective-distant perspective-origin-[50%_20%]`}
    >
      <div
        ref={stage}
        className="pointer-events-auto relative w-[86vw] cursor-grab touch-none select-none active:cursor-grabbing max-sm:translate-y-1/6 sm:w-[min(24rem,76vw)]"
      >
        <div className="relative aspect-video -rotate-x-12 transform-3d max-sm:aspect-5/4">
          {slots.map((k) => {
            const at = wrap(k, count);
            if (at === 0) {
              return (
                <div
                  key={k}
                  data-k={k}
                  aria-hidden={k !== centre || undefined}
                  inert={k !== centre || undefined}
                  className={SLOT}
                >
                  {intro}
                  <Fall />
                </div>
              );
            }
            const index = at - 1;
            const link = links[index];
            if (k !== centre) {
              return (
                <div key={k} data-k={k} aria-hidden inert className={SLOT}>
                  <Sheet
                    link={link}
                    index={index}
                    letter={letters.get(link.slug)}
                    picked={selected.has(link.slug)}
                  />
                  <Fall />
                </div>
              );
            }
            return (
              <div key={k} data-k={k} className={SLOT}>
                <Sheet
                  link={link}
                  index={index}
                  letter={letters.get(link.slug)}
                  picked={selected.has(link.slug)}
                  onPick={() => onSelect(k)}
                  corner={link.url ? <Visit link={link} /> : null}
                >
                  {link.url ? (
                    <div className="relative -mx-2 mt-2 flex max-sm:hidden">
                      <Visit link={link} />
                    </div>
                  ) : null}
                </Sheet>
                <Fall />
              </div>
            );
          })}
        </div>

        <div className="absolute inset-x-0 bottom-full mb-12 flex justify-center gap-2">
          {controls}
        </div>
      </div>
    </div>
  );
}
