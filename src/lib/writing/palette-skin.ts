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
  barFill: string;
  barInk: string;
  barRule: string;
  barUnderline: string;
  barRadiusTop: string;
  barRadiusBottom: string;
  barImage: string;
  badgeFill: string;
  badgeInk: string;
  avatar: string;
  codeFill: string;
  codeInk: string;
  codeRule: string;
  codeUnderline: string;
  codeRadiusTop: string;
  codeRadiusBottom: string;
  codeImage: string;
  graphInk: string;
  graphAccent: string;
  graphMuted: string;
  graphFrame: string;
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

const OVERRIDES: Record<string, Partial<SkinVars>> = {
  idol: {
    barFill: IDOL_WHITE,
    barInk: IDOL_BLACK,
    barRule: "transparent",
    barUnderline: IDOL_GREEN,
    barRadiusTop: "1rem",
    barRadiusBottom: "0px",
    barImage: "none",
    badgeFill: IDOL_GOLD,
    badgeInk: IDOL_BLACK,
    avatar: `radial-gradient(circle at 32% 30%, ${IDOL_GREEN} 0%, ${IDOL_GOLD} 100%)`,
    codeFill: IDOL_BLACK,
    codeInk: IDOL_WHITE,
    codeRule: "transparent",
    codeUnderline: IDOL_GREEN,
    codeRadiusTop: "0.5rem",
    codeRadiusBottom: "0px",
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
    barFill: ink,
    barInk: paper,
    barRule: accent,
    barUnderline: accent,
    barRadiusTop: "0px",
    barRadiusBottom: "0px",
    barImage: "none",
    badgeFill: accent,
    badgeInk: paper,
    avatar: `linear-gradient(135deg, ${accent} 0%, ${accent} 55%, ${paper} 100%)`,
    codeFill: ink,
    codeInk: paper,
    codeRule: accent,
    codeUnderline: accent,
    codeRadiusTop: "0px",
    codeRadiusBottom: "0px",
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
    "--fish-bar-fill": skin.barFill,
    "--fish-bar-ink": skin.barInk,
    "--fish-bar-rule": skin.barRule,
    "--fish-bar-underline": skin.barUnderline,
    "--fish-bar-radius-top": skin.barRadiusTop,
    "--fish-bar-radius-bottom": skin.barRadiusBottom,
    "--fish-bar-image": skin.barImage,
    "--fish-badge-fill": skin.badgeFill,
    "--fish-badge-ink": skin.badgeInk,
    "--fish-avatar": skin.avatar,
    "--fish-code-fill": skin.codeFill,
    "--fish-code-ink": skin.codeInk,
    "--fish-code-rule": skin.codeRule,
    "--fish-code-underline": skin.codeUnderline,
    "--fish-code-radius-top": skin.codeRadiusTop,
    "--fish-code-radius-bottom": skin.codeRadiusBottom,
    "--fish-code-image": skin.codeImage,
    "--graph-paper": skin.ink,
    "--graph-ink": skin.graphInk,
    "--graph-accent": skin.graphAccent,
    "--graph-accent-2": skin.accent2,
    "--graph-muted": skin.graphMuted,
    "--graph-frame": skin.graphFrame,
    "--hljs-keyword": skin.keyword,
    "--hljs-string": skin.string,
    "--hljs-number": skin.number,
    "--hljs-title": skin.title,
    "--hljs-comment": skin.comment,
  } as CSSProperties;
}
