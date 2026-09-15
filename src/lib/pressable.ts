const SHAPE = "group flex rounded-lg text-left";

const MOTION =
  "transition-[background-color,scale] duration-(--motion-quick) ease-out-strong";

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/40";

const PRESSED = "active:scale-[0.99] active:duration-(--press)";

export const PRESS = `${SHAPE} ${MOTION} ${FOCUS} ${PRESSED}`;

export const SEAT = `${SHAPE} ${MOTION} ${FOCUS} px-3 py-3 focus-visible:bg-lit`;

export const ROW = `${SEAT} can-hover:hover:bg-lit ${PRESSED}`;
