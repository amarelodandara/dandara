import type { CSSProperties } from "react";
import {
  darkest,
  lightest,
  midtones,
  withAlpha,
  type Palette,
} from "./palettes";

export type SkinVars = {
  ink: string;
  paper: string;
  accent: string;
  accent2: string;
  rule: string;
  radius: string;
  headerFill: string;
  headerInk: string;
  headerNote: string;
  headerRule: string;
  headerImage: string;
  barFill: string;
  barInk: string;
  barRule: string;
  barUnderline: string;
  barRadius: string;
  barImage: string;
  barFilter: string;
  barPad: string;
  barGap: string;
  barCellPad: string;
  barCellRule: string;
  badgeFill: string;
  badgeInk: string;
  avatar: string;
  codeFill: string;
  codeInk: string;
  codeRule: string;
  codeUnderline: string;
  codeRadius: string;
  codeImage: string;
  graphPaper?: string;
  graphInk: string;
  graphAccent: string;
  graphMuted: string;
  graphFrame: string;
  graphMark?: string;
  keyword: string;
  string: string;
  number: string;
  title: string;
  comment: string;
};

const IDOL_GREEN = "oklch(0.979 0.096 111.2)";
const IDOL_GOLD = "oklch(0.925 0.194 102.9)";
const IDOL_BLACK = "oklch(0.261 0.004 84.6)";
const IDOL_WHITE = "oklch(0.991 0.000 89.9)";

function fade(color: string, alpha: number) {
  return color.replace(")", ` / ${alpha})`);
}

const PATELA_DEEP = "oklch(0.190 0.111 284.8)";
const PATELA_VIOLET = "oklch(0.454 0.255 285.4)";
const PATELA_GREEN = "oklch(0.955 0.216 114.6)";
const PATELA_BLUE = "oklch(0.605 0.217 257.2)";
const PATELA_WHITE = "oklch(0.97 0.014 258)";

const CARANX_RULE = "oklch(0.82 0.01 240)";
const CARANX_STEEL = "oklch(0.62 0.015 235)";
const CARANX_CREAM = "oklch(0.9 0.03 95)";
const CARANX_GOLD = "oklch(0.906 0.143 94.0)";

const MOON_PEACH = "oklch(0.912 0.066 69.8)";
const MOON_SALMON = "oklch(0.815 0.137 67.3)";
const MOON_GREY = "oklch(0.949 0.024 259.8)";
const MOON_INK = "oklch(0.44 0.021 264)";
const MOON_DEEP = "oklch(0.55 0.157 42)";
const MOON_WASH = `radial-gradient(120% 140% at 16% 10%, ${fade(MOON_SALMON, 0.55)} 0%, transparent 64%), radial-gradient(110% 130% at 92% 88%, ${fade(MOON_PEACH, 0.6)} 0%, transparent 70%)`;

const LION_BLACK = "oklch(0.260 0.000 89.9)";
const LION_RUST = "oklch(0.446 0.126 45.5)";
const LION_TAN = "oklch(0.858 0.094 74.9)";
const LION_TEAL = "oklch(0.729 0.146 168.1)";
const LION_OUTLINE = fade(LION_RUST, 0.45);

const OVERRIDES: Record<string, Partial<SkinVars>> = {
  volitas: {
    barFill: "transparent",
    barRadius: "0 1.25rem 0 1.25rem",
    barRule: LION_OUTLINE,
    barUnderline: LION_OUTLINE,
    barInk: LION_BLACK,
    badgeFill: LION_TAN,
    badgeInk: LION_BLACK,
    avatar: `radial-gradient(circle at 34% 30%, ${LION_TAN} 0%, ${LION_RUST} 100%)`,
    accent2: LION_RUST,
    codeFill: "transparent",
    codeInk: LION_BLACK,
    codeRule: LION_OUTLINE,
    codeUnderline: LION_OUTLINE,
    headerFill: "transparent",
    headerImage: "none",
    headerInk: LION_BLACK,
    headerNote: LION_RUST,
    headerRule: LION_OUTLINE,
    keyword: LION_RUST,
    string: fade(LION_BLACK, 0.75),
    number: LION_RUST,
    title: LION_BLACK,
    comment: fade(LION_BLACK, 0.45),
    graphPaper: "var(--color-background)",
    graphAccent: LION_TEAL,
    graphInk: fade(LION_BLACK, 0.8),
    graphMuted: fade(LION_BLACK, 0.5),
    graphFrame: LION_OUTLINE,
  },
  "pink-moon": {
    barFill: MOON_GREY,
    barImage: MOON_WASH,
    barFilter: "blur(14px) saturate(150%)",
    barRule: fade(MOON_GREY, 0.85),
    barUnderline: fade(MOON_GREY, 0.85),
    barRadius: "0.25rem",
    barInk: MOON_INK,
    badgeFill: MOON_SALMON,
    badgeInk: MOON_INK,
    avatar: `radial-gradient(circle at 34% 28%, ${MOON_PEACH} 0%, ${MOON_SALMON} 100%)`,
    ink: MOON_GREY,
    codeFill: MOON_GREY,
    codeInk: MOON_INK,
    codeRule: fade(MOON_SALMON, 0.45),
    codeUnderline: fade(MOON_SALMON, 0.45),
    codeRadius: "0.25rem",
    headerFill: MOON_GREY,
    headerImage: MOON_WASH,
    headerInk: MOON_INK,
    headerNote: MOON_DEEP,
    headerRule: fade(MOON_DEEP, 0.4),
    keyword: MOON_DEEP,
    string: fade(MOON_INK, 0.75),
    number: MOON_DEEP,
    title: MOON_INK,
    comment: fade(MOON_INK, 0.45),
    graphInk: MOON_INK,
    graphAccent: MOON_DEEP,
    graphMuted: fade(MOON_INK, 0.6),
    graphFrame: fade(MOON_DEEP, 0.35),
  },
  caranx: {
    barPad: "0px",
    barGap: "0px",
    barCellPad: "0.875rem",
    barCellRule: fade(CARANX_RULE, 0.45),
    barRule: fade(CARANX_RULE, 0.45),
    barInk: CARANX_CREAM,
    badgeFill: CARANX_GOLD,
    badgeInk: "oklch(0.28 0.01 90)",
    graphAccent: CARANX_GOLD,
    graphInk: CARANX_CREAM,
    graphMuted: CARANX_RULE,
    graphFrame: fade(CARANX_STEEL, 0.55),
  },
  patela: {
    barRadius: "9999px",
    barPad: "0.75rem",
    barRule: PATELA_BLUE,
    barUnderline: PATELA_BLUE,
    barInk: PATELA_WHITE,
    badgeFill: PATELA_GREEN,
    badgeInk: PATELA_DEEP,
    avatar: `radial-gradient(circle at 50% 45%, ${PATELA_GREEN} 0%, ${PATELA_BLUE} 62%, ${PATELA_VIOLET} 100%)`,
    codeInk: PATELA_WHITE,
    headerInk: PATELA_WHITE,
    headerNote: PATELA_GREEN,
    headerRule: PATELA_BLUE,
    codeRule: PATELA_BLUE,
    codeUnderline: PATELA_BLUE,
    keyword: PATELA_GREEN,
    string: PATELA_BLUE,
    number: PATELA_GREEN,
    title: PATELA_GREEN,
    comment: fade(PATELA_WHITE, 0.45),
    graphInk: fade(PATELA_WHITE, 0.85),
    graphAccent: PATELA_GREEN,
    graphMuted: PATELA_WHITE,
    graphFrame: PATELA_WHITE,
    graphMark: PATELA_BLUE,
  },
  idol: {
    barFill: IDOL_WHITE,
    barInk: IDOL_BLACK,
    barRule: "transparent",
    barUnderline: IDOL_GREEN,
    barRadius: "1rem 1rem 0 0",
    barImage: "none",
    barFilter: "none",
    barPad: "1rem",
    barGap: "0.75rem",
    barCellPad: "0px",
    barCellRule: "transparent",
    badgeFill: IDOL_GOLD,
    badgeInk: IDOL_BLACK,
    avatar: `radial-gradient(circle at 32% 30%, ${IDOL_GREEN} 0%, ${IDOL_GOLD} 100%)`,
    codeFill: IDOL_BLACK,
    codeInk: IDOL_WHITE,
    codeRule: "transparent",
    codeUnderline: IDOL_GREEN,
    codeRadius: "0.5rem 0.5rem 0 0",
    codeImage: "none",
    headerFill: "transparent",
    headerInk: IDOL_WHITE,
    headerNote: IDOL_GOLD,
    headerRule: IDOL_GREEN,
    keyword: IDOL_GOLD,
    string: IDOL_GREEN,
    number: IDOL_GOLD,
    title: IDOL_GREEN,
    comment: fade(IDOL_WHITE, 0.4),
    graphAccent: IDOL_GOLD,
    graphMuted: IDOL_GREEN,
  },
};

function derive(palette: Palette): SkinVars {
  const ink = darkest(palette);
  const paper = lightest(palette);
  const accents = midtones(palette);
  const accent = accents[0] ?? paper;
  const accent2 = accents[1] ?? accent;

  return {
    ink,
    paper,
    accent,
    accent2,
    rule: accent,
    radius: "0px",
    headerFill: ink,
    headerInk: paper,
    headerNote: accent,
    headerRule: accent,
    headerImage: "none",
    barFill: ink,
    barInk: paper,
    barRule: accent,
    barUnderline: accent,
    barRadius: "0px",
    barImage: "none",
    barFilter: "none",
    barPad: "1rem",
    barGap: "0.75rem",
    barCellPad: "0px",
    barCellRule: "transparent",
    badgeFill: accent,
    badgeInk: paper,
    avatar: `linear-gradient(135deg, ${accent} 0%, ${accent} 55%, ${paper} 100%)`,
    codeFill: ink,
    codeInk: paper,
    codeRule: accent,
    codeUnderline: accent,
    codeRadius: "0px",
    codeImage: "none",
    graphInk: withAlpha(paper, 0.8),
    graphAccent: paper,
    graphMuted: accent,
    graphFrame: withAlpha(paper, 0.4),
    keyword: accent,
    string: accent2,
    number: accents[2] ?? accent,
    title: accent2,
    comment: accents.at(-1) ?? accent,
  };
}

export function skinFor(palette: Palette): CSSProperties {
  const skin = { ...derive(palette), ...OVERRIDES[palette.slug] };

  return {
    "--fish-ink": skin.ink,
    "--fish-paper": skin.paper,
    "--fish-accent": skin.accent,
    "--fish-accent-2": skin.accent2,
    "--fish-rule": skin.rule,
    "--fish-radius": skin.radius,
    "--fish-header-fill": skin.headerFill,
    "--fish-header-ink": skin.headerInk,
    "--fish-header-note": skin.headerNote,
    "--fish-header-rule": skin.headerRule,
    "--fish-header-image": skin.headerImage,
    "--fish-bar-fill": skin.barFill,
    "--fish-bar-ink": skin.barInk,
    "--fish-bar-rule": skin.barRule,
    "--fish-bar-underline": skin.barUnderline,
    "--fish-bar-radius": skin.barRadius,
    "--fish-bar-image": skin.barImage,
    "--fish-bar-filter": skin.barFilter,
    "--fish-bar-pad": skin.barPad,
    "--fish-bar-gap": skin.barGap,
    "--fish-bar-cell-pad": skin.barCellPad,
    "--fish-bar-cell-rule": skin.barCellRule,
    "--fish-badge-fill": skin.badgeFill,
    "--fish-badge-ink": skin.badgeInk,
    "--fish-avatar": skin.avatar,
    "--fish-code-fill": skin.codeFill,
    "--fish-code-ink": skin.codeInk,
    "--fish-code-rule": skin.codeRule,
    "--fish-code-underline": skin.codeUnderline,
    "--fish-code-radius": skin.codeRadius,
    "--fish-code-image": skin.codeImage,
    "--graph-paper": skin.graphPaper ?? skin.ink,
    "--graph-ink": skin.graphInk,
    "--graph-accent": skin.graphAccent,
    "--graph-accent-2": skin.accent2,
    "--graph-muted": skin.graphMuted,
    "--graph-frame": skin.graphFrame,
    "--graph-mark": skin.graphMark ?? skin.graphFrame,
    "--hljs-keyword": skin.keyword,
    "--hljs-string": skin.string,
    "--hljs-number": skin.number,
    "--hljs-title": skin.title,
    "--hljs-comment": skin.comment,
  } as CSSProperties;
}
