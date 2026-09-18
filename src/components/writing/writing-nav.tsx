import Link from "next/link";
import { SunMark } from "@/components/sun-mark";
import { ANNOTATION } from "@/lib/type";

const HOME = [
  `rounded-lg px-2.5 py-2 ${ANNOTATION} leading-none`,
  "text-graphite-500",
  "transition-[background-color,color,scale] duration-(--motion-quick) ease-out-strong",
  "can-hover:hover:bg-graphite-100 can-hover:hover:text-graphite-900",
  "focus-visible:bg-graphite-100 focus-visible:text-graphite-900",
  "active:scale-[0.97] active:duration-(--press)",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-graphite-900/40",
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
