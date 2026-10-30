import {
  ACCENT_PROSE,
  ANNOTATION,
  LABEL,
  MICRO,
  PAGE_HEADING,
  PROSE,
  SECTION_HEADING,
  TITLE,
} from "@/lib/type";

export const ROLES = {
  PAGE_HEADING,
  SECTION_HEADING,
  ACCENT_PROSE,
  PROSE,
  TITLE,
  LABEL,
  ANNOTATION,
  MICRO,
};

export type Role = keyof typeof ROLES;

export const TEXT = {
  "cadmium-50": "text-cadmium-50",
  "graphite-50": "text-graphite-50",
  "cadmium-100": "text-cadmium-100",
  "graphite-100": "text-graphite-100",
  "cadmium-200": "text-cadmium-200",
  "graphite-200": "text-graphite-200",
  "cadmium-300": "text-cadmium-300",
  "graphite-300": "text-graphite-300",
  "cadmium-400": "text-cadmium-400",
  "graphite-400": "text-graphite-400",
  "cadmium-500": "text-cadmium-500",
  "graphite-500": "text-graphite-500",
  "cadmium-600": "text-cadmium-600",
  "graphite-600": "text-graphite-600",
  "cadmium-700": "text-cadmium-700",
  "graphite-700": "text-graphite-700",
  "cadmium-800": "text-cadmium-800",
  "graphite-800": "text-graphite-800",
  "cadmium-900": "text-cadmium-900",
  "graphite-900": "text-graphite-900",
};

export type Step = keyof typeof TEXT;

export const BG: Record<Step, string> = {
  "cadmium-50": "bg-cadmium-50",
  "graphite-50": "bg-graphite-50",
  "cadmium-100": "bg-cadmium-100",
  "graphite-100": "bg-graphite-100",
  "cadmium-200": "bg-cadmium-200",
  "graphite-200": "bg-graphite-200",
  "cadmium-300": "bg-cadmium-300",
  "graphite-300": "bg-graphite-300",
  "cadmium-400": "bg-cadmium-400",
  "graphite-400": "bg-graphite-400",
  "cadmium-500": "bg-cadmium-500",
  "graphite-500": "bg-graphite-500",
  "cadmium-600": "bg-cadmium-600",
  "graphite-600": "bg-graphite-600",
  "cadmium-700": "bg-cadmium-700",
  "graphite-700": "bg-graphite-700",
  "cadmium-800": "bg-cadmium-800",
  "graphite-800": "bg-graphite-800",
  "cadmium-900": "bg-cadmium-900",
  "graphite-900": "bg-graphite-900",
};

export const BORDER: Record<Step, string> = {
  "cadmium-50": "border-cadmium-50",
  "graphite-50": "border-graphite-50",
  "cadmium-100": "border-cadmium-100",
  "graphite-100": "border-graphite-100",
  "cadmium-200": "border-cadmium-200",
  "graphite-200": "border-graphite-200",
  "cadmium-300": "border-cadmium-300",
  "graphite-300": "border-graphite-300",
  "cadmium-400": "border-cadmium-400",
  "graphite-400": "border-graphite-400",
  "cadmium-500": "border-cadmium-500",
  "graphite-500": "border-graphite-500",
  "cadmium-600": "border-cadmium-600",
  "graphite-600": "border-graphite-600",
  "cadmium-700": "border-cadmium-700",
  "graphite-700": "border-graphite-700",
  "cadmium-800": "border-cadmium-800",
  "graphite-800": "border-graphite-800",
  "cadmium-900": "border-cadmium-900",
  "graphite-900": "border-graphite-900",
};

export type Part = { role: Role; colour: Step };

export type IntroLook = {
  background: Step;
  marker: Part;
  description: Part;
  hint: Part;
  shortcut: Part;
  keyBackground: Step;
  keyText: Step;
  keyBorder: Step;
};

export const INTRO_LOOK: IntroLook = {
  background: "cadmium-300",
  marker: { role: "MICRO", colour: "cadmium-800" },
  description: { role: "LABEL", colour: "cadmium-900" },
  hint: { role: "ANNOTATION", colour: "cadmium-900" },
  shortcut: { role: "ANNOTATION", colour: "cadmium-900" },
  keyBackground: "cadmium-50",
  keyText: "cadmium-900",
  keyBorder: "cadmium-50",
};

export type SheetLook = {
  background: Step;
  number: Part;
  title: Part;
  by: Part;
  tabBackground: Step;
  tabLetter: Part;
  visit: Step;
};

export const SHEET_LOOK: SheetLook = {
  background: "cadmium-100",
  number: { role: "MICRO", colour: "graphite-700" },
  title: { role: "TITLE", colour: "graphite-900" },
  by: { role: "ANNOTATION", colour: "graphite-700" },
  tabBackground: "cadmium-50",
  tabLetter: { role: "MICRO", colour: "graphite-600" },
  visit: "graphite-900",
};

export const look = ({ role, colour }: Part) =>
  `${ROLES[role]} ${TEXT[colour]}`;
