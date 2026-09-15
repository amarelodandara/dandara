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

const OVERRIDES: Record<string, Partial<SkinVars>> = {};

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
    headerFill: accent,
    headerInk: ink,
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
