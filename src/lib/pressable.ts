const SHAPE = "group flex rounded-lg text-left";

const MOTION =
  "transition-[background-color,scale] duration-(--motion-quick) ease-out-strong";

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-graphite-900/40";

const PRESSED = "active:scale-[0.99] active:duration-(--press)";

export const PRESS_BASE = `${MOTION} ${FOCUS} ${PRESSED}`;

export const PRESS = `${SHAPE} ${PRESS_BASE}`;

export const SEAT = `${SHAPE} ${MOTION} ${FOCUS} px-3 py-3 focus-visible:bg-cadmium-200`;

export const ROW = `${SEAT} can-hover:hover:bg-cadmium-200 ${PRESSED}`;
