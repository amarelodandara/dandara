import Link from "next/link";
import { SunMark } from "@/components/sun-mark";
import { ANNOTATION } from "@/lib/type";

const HOME = [
  `rounded-lg px-2.5 py-2 ${ANNOTATION} leading-none`,
  "text-foreground-soft/70",
  "transition-[background-color,color,scale] duration-(--motion-quick) ease-out-strong",
  "hover:bg-foreground/5 hover:text-foreground",
  "focus-visible:bg-foreground/5 focus-visible:text-foreground",
  "active:scale-[0.97] active:duration-(--press)",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/40",
].join(" ");

export function WritingNav() {
  return (
    <nav
      aria-label="Site"
      className="mx-auto flex w-full max-w-[1400px] items-center gap-2 px-[7vw] pt-[5vh]"
    >
      <SunMark />

      <Link href="/" data-quiet data-pressable className={HOME}>
        Home
      </Link>
    </nav>
  );
}
