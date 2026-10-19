import { BrokenFavicon } from "@/components/broken-favicon";
import { Signpost, type Sign } from "@/components/signposts";
import { ANNOTATION, PROSE } from "@/lib/type";

const WAYS_OUT: Sign[] = [
  { href: "/", name: "Home", area: "home" },
  { href: "/work", name: "Work", area: "work" },
  { href: "/writing", name: "Writing", area: "blog" },
];

const RETRY = [
  `self-end rounded-lg px-2.5 py-2 ${ANNOTATION} leading-none`,
  "text-graphite-600",
  "transition-[background-color,color,scale] duration-(--motion-quick) ease-out-strong",
  "can-hover:hover:bg-graphite-100 can-hover:hover:text-graphite-900",
  "focus-visible:bg-graphite-100 focus-visible:text-graphite-900",
  "active:scale-[0.97] active:duration-(--press)",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-graphite-900/50",
].join(" ");

export function ErrorWall({ retry }: { retry: () => void }) {
  return (
    <main
      data-lost-wall
      className="flex min-h-dvh items-center justify-center p-[max(1.5rem,4vw)]"
    >
      <BrokenFavicon />
      <div className="flex w-full flex-col gap-3 sm:max-w-120">
        <div
          data-recessed
          className="flex flex-col gap-4 rounded-(--shop-radius) bg-graphite-50 px-8 py-6"
        >
          <h1 className="sr-only">Something broke</h1>
          <p className={`text-pretty ${PROSE}`}>
            Something on this page broke. Try again, or follow the signs back to
            the exhibition.
          </p>
          <button
            type="button"
            onClick={retry}
            data-cuelume-tap
            data-quiet
            data-pressable
            className={RETRY}
          >
            Try again
          </button>
        </div>
        <nav aria-label="Ways out" className="flex flex-col gap-3">
          {WAYS_OUT.map((sign) => (
            <Signpost key={sign.href} {...sign} />
          ))}
        </nav>
      </div>
    </main>
  );
}
