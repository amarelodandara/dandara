import type { SheetLink } from "./sheet";
import { PRESS_BASE } from "@/lib/pressable";
import { ANNOTATION } from "@/lib/type";

const ACTION = [
  PRESS_BASE,
  "relative inline-flex items-center rounded-sm px-2 py-1 max-sm:min-h-11 max-sm:px-3",
  `${ANNOTATION} leading-none`,
  "can-hover:hover:bg-graphite-100 focus-visible:bg-graphite-100",
].join(" ");

export function Visit({ link }: { link: SheetLink }) {
  if (!link.url) return null;
  return (
    <a href={link.url} target="_blank" rel="noreferrer" className={ACTION}>
      Visit ↗<span className="sr-only"> {link.title} (opens in a new tab)</span>
    </a>
  );
}
