const LINK_BASE = [
  "decoration-rule decoration-[0.04em] underline-offset-[0.25em]",
  "transition-opacity duration-(--motion-quick) ease-out-strong",
  "can-hover:hover:opacity-50",
].join(" ");

export const LINK = `${LINK_BASE} can-hover:hover:underline focus-visible:underline active:underline`;

export const LINK_UNDERLINED = `${LINK_BASE} underline`;
