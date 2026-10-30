import { TEXT } from "./look";
import { ANNOTATION, LABEL, MICRO } from "@/lib/type";

export const BUTTON_ROLES = { MICRO, ANNOTATION, LABEL };

export const PADS = ["0.5", "1", "1.5", "2", "2.5", "3"] as const;

const PX: Record<Pad, string> = {
  "0.5": "px-0.5",
  "1": "px-1",
  "1.5": "px-1.5",
  "2": "px-2",
  "2.5": "px-2.5",
  "3": "px-3",
};

const PY: Record<Pad, string> = {
  "0.5": "py-0.5",
  "1": "py-1",
  "1.5": "py-1.5",
  "2": "py-2",
  "2.5": "py-2.5",
  "3": "py-3",
};

const RADIUS = {
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-full",
};

const SHADOW = {
  none: "",
  label: "shadow-label",
  chip: "shadow-chip",
  hollow: "shadow-hollow",
  key: "shadow-key",
  lift: "shadow-lift",
};

const HOVER_SHADOW: Record<Shadow, string> = {
  none: "",
  label: "can-hover:hover:shadow-label",
  chip: "can-hover:hover:shadow-chip",
  hollow: "can-hover:hover:shadow-hollow",
  key: "can-hover:hover:shadow-key",
  lift: "can-hover:hover:shadow-lift",
};

const PRESS_SHADOW: Record<Shadow, string> = {
  none: "",
  label: "",
  chip: "",
  hollow: "",
  key: "enabled:active:shadow-key-pressed",
  lift: "enabled:active:shadow-key-pressed",
};

const PRESSED_SHADOW: Record<Shadow, string> = {
  none: "",
  label: "",
  chip: "",
  hollow: "",
  key: "shadow-key-pressed",
  lift: "shadow-key-pressed",
};

const SURFACE = {
  none: "",
  "graphite-50": "bg-graphite-50",
  "graphite-100": "bg-graphite-100",
  "cadmium-100": "bg-cadmium-100",
};

const HOVER: Record<Surface, string> = {
  none: "",
  "graphite-50": "can-hover:hover:bg-graphite-50",
  "graphite-100": "can-hover:hover:bg-graphite-100",
  "cadmium-100": "can-hover:hover:bg-cadmium-100",
};

export const SURFACES = Object.keys(SURFACE) as Surface[];

export const INKS = [
  "graphite-500",
  "graphite-600",
  "graphite-700",
  "graphite-800",
  "graphite-900",
] as const;

const HOVER_INK: Record<Ink, string> = {
  "graphite-500": "can-hover:hover:text-graphite-500",
  "graphite-600": "can-hover:hover:text-graphite-600",
  "graphite-700": "can-hover:hover:text-graphite-700",
  "graphite-800": "can-hover:hover:text-graphite-800",
  "graphite-900": "can-hover:hover:text-graphite-900",
};

const PRESS = {
  none: "",
  "0.98": "motion-safe:enabled:active:scale-[0.98]",
  "0.97": "motion-safe:enabled:active:scale-[0.97]",
  "0.96": "motion-safe:enabled:active:scale-[0.96]",
  "0.95": "motion-safe:enabled:active:scale-[0.95]",
};

const PRESSED: Record<Press, string> = {
  none: "",
  "0.98": "scale-[0.98]",
  "0.97": "scale-[0.97]",
  "0.96": "scale-[0.96]",
  "0.95": "scale-[0.95]",
};

export const RADII = Object.keys(RADIUS) as Radius[];
export const SHADOWS = Object.keys(SHADOW) as Shadow[];
export const PRESSES = Object.keys(PRESS) as Press[];

export type Pad = (typeof PADS)[number];
export type Radius = keyof typeof RADIUS;
export type Shadow = keyof typeof SHADOW;
export type Surface = keyof typeof SURFACE;
export type Ink = (typeof INKS)[number];
export type Press = keyof typeof PRESS;
export type ButtonRole = keyof typeof BUTTON_ROLES;

export type ButtonLook = {
  role: ButtonRole;
  ink: Ink;
  hoverInk: Ink;
  surface: Surface;
  hover: Surface;
  shadow: Shadow;
  hoverShadow: Shadow;
  radius: Radius;
  x: Pad;
  y: Pad;
  press: Press;
};

export type RemoveLook = ButtonLook & {
  shows: "hover" | "always";
  label: "Remove" | "×";
  place: "inline" | "end";
};

export const KEY_LOOK: ButtonLook = {
  role: "ANNOTATION",
  ink: "graphite-800",
  hoverInk: "graphite-900",
  surface: "graphite-50",
  hover: "graphite-50",
  shadow: "key",
  hoverShadow: "lift",
  radius: "md",
  x: "2.5",
  y: "2",
  press: "0.96",
};

export const REMOVE_LOOK: RemoveLook = {
  role: "ANNOTATION",
  ink: "graphite-700",
  hoverInk: "graphite-900",
  surface: "none",
  hover: "cadmium-100",
  shadow: "none",
  hoverShadow: "none",
  radius: "sm",
  x: "1.5",
  y: "1",
  press: "0.96",
  shows: "hover",
  label: "Remove",
  place: "inline",
};

export type ButtonState = "rest" | "hover" | "pressed" | "focus";

const BASE =
  "inline-flex items-center leading-none transition-[background-color,color,opacity,scale,box-shadow] duration-(--motion-quick) ease-out-strong active:duration-(--press) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-graphite-900/50";

const FOCUSED = "outline-2 outline-offset-2 outline-graphite-900/50";

const live = (look: ButtonLook) =>
  [
    HOVER[look.hover],
    HOVER_INK[look.hoverInk],
    HOVER_SHADOW[look.hoverShadow],
    PRESS[look.press],
    PRESS_SHADOW[look.hoverShadow === "none" ? look.shadow : look.hoverShadow],
  ].join(" ");

const forced = (look: ButtonLook, state: ButtonState) => {
  if (state === "pressed") return PRESSED[look.press];
  if (state === "focus") return FOCUSED;
  return "";
};

const shadowFor = (look: ButtonLook, state: ButtonState) => {
  const lit = look.hoverShadow === "none" ? look.shadow : look.hoverShadow;
  if (state === "pressed") return PRESSED_SHADOW[lit] || SHADOW[lit];
  return state === "hover" ? SHADOW[lit] : SHADOW[look.shadow];
};

export function buttonClass(look: ButtonLook, state: ButtonState = "rest") {
  const lit = state === "hover" || state === "pressed";
  const surface = lit && look.hover !== "none" ? look.hover : look.surface;
  return [
    BASE,
    BUTTON_ROLES[look.role],
    TEXT[lit ? look.hoverInk : look.ink],
    SURFACE[surface],
    look.shadow === "none" ? "" : "border border-transparent",
    shadowFor(look, state),
    RADIUS[look.radius],
    PX[look.x],
    PY[look.y],
    state === "rest" ? live(look) : forced(look, state),
  ]
    .filter(Boolean)
    .join(" ");
}

const REVEALS =
  "can-hover:opacity-0 can-hover:group-hover:opacity-100 can-hover:group-has-focus-visible:opacity-100";

export function removeClass(look: RemoveLook, state: ButtonState = "rest") {
  return [
    buttonClass(look, state),
    "relative ml-2 after:absolute after:-inset-2",
    look.place === "end" ? "float-end" : "",
    look.shows === "hover" && state === "rest" ? REVEALS : "",
  ]
    .filter(Boolean)
    .join(" ");
}
