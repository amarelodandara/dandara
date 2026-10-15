"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Popover } from "@base-ui/react/popover";
import { SIGNPOSTS, SmallSignpost } from "@/components/signposts";
import { SunMark } from "@/components/sun-mark";
import { ANNOTATION } from "@/lib/type";

const NAV_LINK = [
  `rounded-lg px-2.5 py-2 ${ANNOTATION} leading-none`,
  "text-graphite-500 aria-[current=page]:text-graphite-900",
  "transition-[background-color,color,scale] duration-(--motion-quick) ease-out-strong",
  "can-hover:hover:bg-graphite-100 can-hover:hover:text-graphite-900",
  "focus-visible:bg-graphite-100 focus-visible:text-graphite-900",
  "active:scale-[0.97] active:duration-(--press)",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-graphite-900/40",
].join(" ");

const MORE_POPUP = [
  "w-56 origin-(--transform-origin) rounded-(--shop-radius) bg-cadmium-50 p-1.5",
  "shadow-raised outline-none",
  "transition-[opacity,scale] duration-(--motion-quick) ease-out-strong",
  "data-starting-style:scale-[0.97] data-starting-style:opacity-0",
  "data-ending-style:scale-[0.97] data-ending-style:opacity-0",
  "motion-reduce:transition-none",
].join(" ");

const PAGES = [
  { href: "/", name: "Home" },
  { href: "/work", name: "Work" },
  { href: "/writing", name: "Writing" },
];

const ELSEWHERE = SIGNPOSTS.filter(
  (sign) => !PAGES.some(({ href }) => href === sign.href),
);

const here = (pathname: string, href: string) =>
  href === "/" ? pathname === href : pathname.startsWith(href);

export function SiteNav() {
  const pathname = usePathname();
  const [arrivedAt] = useState(pathname);
  const [arrived, setArrived] = useState(false);
  const arriving = !arrived && pathname === arrivedAt;

  return (
    <nav
      aria-label="Site"
      data-site-nav
      data-arriving={arriving || undefined}
      onAnimationEnd={(event) => {
        if (event.target === event.currentTarget) setArrived(true);
      }}
      className="mx-auto flex w-full max-w-[1400px] items-center gap-2 px-[7vw] pt-[5vh]"
    >
      <SunMark />

      {PAGES.map(({ href, name }) => (
        <Link
          key={href}
          href={href}
          aria-current={here(pathname, href) ? "page" : undefined}
          data-quiet
          data-pressable
          className={NAV_LINK}
        >
          {name}
        </Link>
      ))}

      {ELSEWHERE.length > 0 ? <MorePages /> : null}
    </nav>
  );
}

function MorePages() {
  return (
    <Popover.Root>
      <Popover.Trigger
        aria-label="More pages"
        data-quiet
        data-pressable
        className={`${NAV_LINK} data-popup-open:bg-graphite-100 data-popup-open:text-graphite-900`}
      >
        <svg viewBox="0 0 16 16" aria-hidden="true" className="size-[1em]">
          <circle cx="3" cy="8" r="1.25" fill="currentColor" />
          <circle cx="8" cy="8" r="1.25" fill="currentColor" />
          <circle cx="13" cy="8" r="1.25" fill="currentColor" />
        </svg>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner
          side="bottom"
          align="start"
          sideOffset={6}
          className="z-20"
        >
          <Popover.Popup className={MORE_POPUP}>
            <ul className="space-y-1.5">
              {ELSEWHERE.map((sign) => (
                <li key={sign.href}>
                  <SmallSignpost {...sign} />
                </li>
              ))}
            </ul>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
