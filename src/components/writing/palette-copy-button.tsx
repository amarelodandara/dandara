"use client";

import { useState } from "react";
import { MICRO } from "@/lib/type";

export function PaletteCopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <button
      type="button"
      onClick={copy}
      className={`${MICRO} uppercase opacity-60 transition-opacity duration-(--motion-quick) can-hover:hover:opacity-100`}
    >
      {copied ? "copied" : "copy"}
    </button>
  );
}
