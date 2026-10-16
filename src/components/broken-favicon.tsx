"use client";

import { useEffect } from "react";
import { BROKEN_ICON } from "@/lib/site";

export function BrokenFavicon() {
  useEffect(() => {
    const links = [
      ...document.querySelectorAll<HTMLLinkElement>('link[rel~="icon"]'),
    ];
    const was = links.map((link) => link.href);
    for (const link of links) link.href = BROKEN_ICON.url;
    return () => {
      for (const [index, link] of links.entries()) link.href = was[index];
    };
  }, []);
  return null;
}
