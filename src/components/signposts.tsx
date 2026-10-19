import Link from "next/link";
import { SignpostArrow } from "@/components/signpost-arrow";
import { SignpostGrain } from "@/components/signpost-grain";
import { LABEL, SECTION_HEADING } from "@/lib/type";

type Area = "blog" | "home" | "site" | "work";

export type Sign = { href: string; name: string; area: Area };

const SIGNPOSTS: Sign[] = [
  { href: "/writing", name: "Writing", area: "blog" },
  { href: "/changelog", name: "Changelog", area: "site" },
];

const SIGN_COLOR: Record<Area, string> = {
  blog: "bg-area-blog text-area-blog-ink",
  home: "bg-area-home text-area-home-ink",
  site: "bg-area-site text-area-site-ink",
  work: "bg-area-work text-area-work-ink",
};

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-graphite-900/50";

export function Signpost({ href, name, area }: Sign) {
  return (
    <Link
      href={href}
      data-signpost={area}
      className={`flex items-center justify-between gap-3 rounded-(--shop-radius) px-8 py-6 ${SIGN_COLOR[area]} ${FOCUS}`}
    >
      <SignpostGrain />
      <span className={`min-w-0 wrap-break-word ${SECTION_HEADING}`}>
        {name}
      </span>
      <span
        data-signpost-hole
        className="-mr-2 flex size-9 shrink-0 items-center justify-center rounded-full bg-cadmium-50"
      >
        <SignpostArrow weight={2} />
      </span>
    </Link>
  );
}

export function SmallSignpost({ href, name, area }: Sign) {
  return (
    <Link
      href={href}
      data-signpost={area}
      className={`flex items-center justify-between gap-3 rounded-lg py-2.5 pr-2.5 pl-3 ${SIGN_COLOR[area]} ${FOCUS}`}
    >
      <SignpostGrain />
      <span className={`min-w-0 wrap-break-word ${LABEL}`}>{name}</span>
      <span
        data-signpost-hole
        className="flex size-6 shrink-0 items-center justify-center rounded-full bg-cadmium-50"
      >
        <SignpostArrow weight={1.5} />
      </span>
    </Link>
  );
}

const STANDALONE = {
  nav: "px-[7vw] pt-[10vh]",
  list: "sm:max-w-120",
};

const AFTER_WALL = {
  nav: "px-[max(1.5rem,4vw)] pt-3 md:px-[7vw] md:pt-[10vh]",
  list: "md:max-w-120",
};

export function Signposts({
  here,
  afterWall = false,
}: {
  here: string;
  afterWall?: boolean;
}) {
  const signs = SIGNPOSTS.filter(({ href }) => href !== here);
  if (signs.length === 0) return null;
  const frame = afterWall ? AFTER_WALL : STANDALONE;

  return (
    <nav
      aria-label="Elsewhere on the site"
      className={`mx-auto flex w-full max-w-[1400px] justify-end ${frame.nav}`}
    >
      <ul className={`w-full space-y-3 ${frame.list}`}>
        {signs.map((sign) => (
          <li key={sign.href}>
            <Signpost {...sign} />
          </li>
        ))}
      </ul>
    </nav>
  );
}
