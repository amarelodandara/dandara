"use client";

import { useEffect, useRef } from "react";
import { chaseThePointer } from "@/lib/sun-chase";

export function SunMark() {
  const mark = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!mark.current) return;
    return chaseThePointer(mark.current);
  }, []);

  return (
    <span
      ref={mark}
      aria-hidden="true"
      data-sun
      className="block size-7 shrink-0 rounded-full"
    />
  );
}
