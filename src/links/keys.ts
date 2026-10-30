import { wrap } from "./roll";
import type { SheetLink } from "./sheet";
import { useActiveOverlay } from "@/lib/exclusive-overlay";
import { isBrowserChord, isTypingTarget, useKeydown } from "@/lib/keydown";

const LETTER = /^[a-z]$/;

export const fileKey = (title: string) =>
  title.normalize("NFD").replaceAll(/[̀-ͯ]/g, "").toLowerCase();

export function letterTarget(links: SheetLink[], here: number, letter: string) {
  const starts = (index: number) =>
    fileKey(links[index].title).startsWith(letter);
  if (
    here >= 0 &&
    starts(here) &&
    here + 1 < links.length &&
    starts(here + 1)
  ) {
    return here + 1;
  }
  const first = links.findIndex((link) => fileKey(link.title) >= letter);
  return first === -1 ? links.length - 1 : first;
}

type Keys = {
  links: SheetLink[];
  heading: () => number;
  step: (by: number) => void;
  toIndex: (index: number) => void;
};

export function useRolodexKeys(keys: Keys) {
  const overlay = useActiveOverlay();

  useKeydown((event) => {
    if (overlay || event.defaultPrevented) return;
    if (isBrowserChord(event) || isTypingTarget(event.target)) return;

    const commands: Record<string, () => void> = {
      ArrowDown: () => keys.step(-1),
      ArrowUp: () => keys.step(1),
    };
    const command = commands[event.key];
    if (command) {
      event.preventDefault();
      command();
      return;
    }

    const letter = event.key.toLowerCase();
    if (!LETTER.test(letter)) return;
    const here = wrap(keys.heading(), keys.links.length + 1) - 1;
    keys.toIndex(letterTarget(keys.links, here, letter));
  });
}
