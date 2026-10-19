"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import { Popover } from "@base-ui/react/popover";
import { Signpost, SmallSignpost, type Sign } from "@/components/signposts";
import { SunMark } from "@/components/sun-mark";
import { ANNOTATION } from "@/lib/type";

const NAV_LINK = [
  `rounded-lg px-2.5 py-2 ${ANNOTATION} leading-none`,
  "text-graphite-600 aria-[current=page]:text-graphite-900",
  "transition-[background-color,color,scale] duration-(--motion-quick) ease-out-strong",
  "can-hover:hover:bg-graphite-100 can-hover:hover:text-graphite-900",
  "focus-visible:bg-graphite-100 focus-visible:text-graphite-900",
  "active:scale-[0.97] active:duration-(--press)",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-graphite-900/50",
].join(" ");

const PHONE = "(max-width: 639px)";

const MORE_POPUP = [
  "group w-[86vw] outline-none sm:w-56",
  "transition-opacity duration-(--motion-quick) ease-out-strong",
  "data-ending-style:opacity-0 motion-reduce:transition-none",
].join(" ");

const MORE_SIGN = [
  "transition-[opacity,translate] duration-(--motion-quick) ease-out-strong",
  "group-data-starting-style:-translate-y-1 group-data-starting-style:opacity-0",
  "nth-2:delay-40 nth-3:delay-80 nth-4:delay-120 nth-5:delay-160 nth-6:delay-200",
  "sm:nth-4:delay-0 sm:nth-5:delay-40 sm:nth-6:delay-80 motion-reduce:transition-none",
].join(" ");

const MORE_BACKDROP = [
  "fixed inset-0 z-20 bg-graphite-50/60 backdrop-blur-md sm:hidden",
  "transition-opacity duration-(--motion-quick) ease-out-strong",
  "data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none",
].join(" ");

const PAGES: Sign[] = [
  { href: "/", name: "Home", area: "home" },
  { href: "/work", name: "Work", area: "work" },
  { href: "/writing", name: "Writing", area: "blog" },
];

const ELSEWHERE: Sign[] = [
  { href: "/work/sketchbook", name: "Sketchbook", area: "site" },
  { href: "/work/photography", name: "Photography", area: "site" },
  { href: "/changelog", name: "Changelog", area: "site" },
];

const here = (pathname: string, href: string) =>
  href === "/" ? pathname === href : pathname.startsWith(href);

const watchPhone = (change: () => void) => {
  const query = window.matchMedia(PHONE);
  query.addEventListener("change", change);
  return () => query.removeEventListener("change", change);
};

const onPhone = () => window.matchMedia(PHONE).matches;

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
      <Link
        href="/"
        aria-label="Home"
        className="block shrink-0 rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-graphite-900/50"
      >
        <SunMark />
      </Link>

      {PAGES.map(({ href, name }) => (
        <Link
          key={href}
          href={href}
          aria-current={here(pathname, href) ? "page" : undefined}
          data-quiet
          data-pressable
          className={`${NAV_LINK} max-sm:hidden`}
        >
          {name}
        </Link>
      ))}

      <MorePages key={pathname} />
    </nav>
  );
}

function MorePages() {
  const phone = useSyncExternalStore(watchPhone, onPhone, () => false);

  return (
    <Popover.Root>
      <Popover.Trigger
        aria-label={phone ? "Pages" : "More pages"}
        data-quiet
        data-pressable
        className={`${NAV_LINK} data-popup-open:bg-graphite-100 data-popup-open:text-graphite-900 max-sm:ml-auto`}
      >
        <svg viewBox="0 0 16 16" aria-hidden="true" className="size-[1em]">
          <circle cx="3" cy="8" r="1.25" fill="currentColor" />
          <circle cx="8" cy="8" r="1.25" fill="currentColor" />
          <circle cx="13" cy="8" r="1.25" fill="currentColor" />
        </svg>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Backdrop className={MORE_BACKDROP} />
        <Popover.Positioner
          side="bottom"
          align={phone ? "end" : "start"}
          sideOffset={6}
          className="z-20"
        >
          <Popover.Popup className={MORE_POPUP}>
            <MoreList />
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}

function MoreList() {
  return (
    <ul className="space-y-3 sm:space-y-2">
      {PAGES.map((sign) => (
        <li key={sign.href} className={`${MORE_SIGN} sm:hidden`}>
          <Signpost {...sign} />
        </li>
      ))}
      {ELSEWHERE.map((sign) => (
        <li key={sign.href} className={MORE_SIGN}>
          <div className="sm:hidden">
            <Signpost {...sign} />
          </div>
          <div className="max-sm:hidden">
            <SmallSignpost {...sign} />
          </div>
        </li>
      ))}
    </ul>
  );
}
