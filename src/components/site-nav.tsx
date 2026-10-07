"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
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

const PAGES = [
  { href: "/", name: "Home" },
  { href: "/writing", name: "Writing" },
];

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
          aria-current={pathname === href ? "page" : undefined}
          data-quiet
          data-pressable
          className={NAV_LINK}
        >
          {name}
        </Link>
      ))}
    </nav>
  );
}
