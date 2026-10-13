import Link from "next/link";
import { SignpostArrow } from "@/components/signpost-arrow";
import { SignpostGrain } from "@/components/signpost-grain";
import { SECTION_HEADING } from "@/lib/type";

type Area = "blog" | "site" | "work";

type Sign = { href: string; name: string; area: Area };

const SIGNPOSTS: Sign[] = [
  { href: "/writing", name: "Writing", area: "blog" },
  { href: "/changelog", name: "Changelog", area: "site" },
];

const SIGN_COLOR: Record<Area, string> = {
  blog: "bg-area-blog text-area-blog-ink",
  site: "bg-area-site text-area-site-ink",
  work: "bg-area-work text-area-work-ink",
};

const FOCUS =
  "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-graphite-900/40";

export function Signpost({ href, name, area }: Sign) {
  return (
    <Link
      href={href}
      data-signpost={area}
      className={`flex items-center justify-between gap-3 rounded-(--shop-radius) px-8 pt-7 pb-6 ${SIGN_COLOR[area]} ${FOCUS}`}
    >
      <SignpostGrain />
      <span className={`min-w-0 ${SECTION_HEADING}`}>{name}</span>
      <span
        data-signpost-hole
        className="-mr-3 flex size-9 shrink-0 items-center justify-center rounded-full bg-cadmium-50"
      >
        <SignpostArrow />
      </span>
    </Link>
  );
}

export function Signposts({ here }: { here: string }) {
  const signs = SIGNPOSTS.filter(({ href }) => href !== here);
  if (signs.length === 0) return null;

  return (
    <nav
      aria-label="Elsewhere on the site"
      className="mx-auto flex w-full max-w-[1400px] justify-end px-[7vw] pt-[12vh]"
    >
      <ul className="w-full space-y-3 sm:max-w-120">
        {signs.map((sign) => (
          <li key={sign.href}>
            <Signpost {...sign} />
          </li>
        ))}
      </ul>
    </nav>
  );
}
