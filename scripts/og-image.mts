import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { once } from "node:events";
import { access, mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import ffmpeg from "ffmpeg-static";
import { chromium } from "playwright";
import type { Frame, Page } from "playwright";
import { TITLE } from "../src/lib/site.ts";
import { BADGES } from "../src/badges/data.ts";
import {
  badgeMarkup,
  LOOK,
  outlines,
  type Badge,
} from "../src/badges/shape.ts";
import { readPosts } from "../src/lib/writing/meta-source.ts";
import { hash, seeded } from "../src/badges/seeded.ts";
import { scatter, STICKERS } from "../src/badges/scatter.ts";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "public", "og.png");
const POST_DIR = path.join(ROOT, "public", "writing", "og");
const FONT = path.join(ROOT, "src", "fonts", "InterVariable.woff2");
const VIDEO_HASHES = path.join(ROOT, "scripts", "og-videos.json");

const KB = 1024;
const WIDTH = 1200;
const HEIGHT = 630;
export const FPS = 30;
const MS_PER_SECOND = 1000;
const TURN = 360;

const CREAM = "#fef3c7";
const INK = "#111111";
const SOFT = "#5c5751";
const SUN_CORE = "#ff8e00";
const SUN_EDGE = "#ffcc00";

const FEATURES = `"calt" 1, "cv06" 1, "cv10" 1, "ss01" 1, "ss02" 1, "ss03" 1, "zero" 1`;

const CARD = { left: 33, top: 40, width: 293, height: 550, radius: 14 };

const STICKER_OVERHANG = 0.5;
const TEXT_LEFT = 378;
const HOME_DECK = "Product design, design engineering and relentless curation";

export const PEEL = {
  loopMs: 5600,
  startMs: 300,
  staggerMs: 380,
  touch: 0.18,
  touchMs: 220,
  catchMs: 70,
  pressMs: 1150,
  touchCurve: [0.23, 1, 0.32, 1],
  pressCurve: [0.37, 0, 0.63, 1],
  backingFade: 0.6,
  angleShuffle: 2_654_435_769,
  reachMargin: 4,
  centre: LOOK.box / 2,
  plane: 2000,
} as const;

export const SUN = {
  loopMs: 6000,
  rest: { x: 49, y: 44 },
  swing: { x: 22, y: 14 },
} as const;

const BACKING = ["#ffffff", "#f6f3ec", "#dcd5c6"];
const BACKING_CREASE = 0.12;
const LIFT = { dy: 3, blur: 4, ink: "#3a2a00", opacity: 0.28 };

const ENCODE = [
  "-c:v",
  "libx264",
  "-preset",
  "slow",
  "-crf",
  "23",
  "-pix_fmt",
  "yuv420p",
  "-color_primaries",
  "bt709",
  "-color_trc",
  "iec61966-2-1",
  "-colorspace",
  "bt709",
  "-movflags",
  "+faststart",
  "-an",
];

const escape = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

function stickers(slug: string, badge: Badge) {
  const size = LOOK.box * STICKERS.scale;
  const { centre, plane } = PEEL;
  const reach =
    (centre - LOOK.margin) *
      badge.scale *
      STICKERS.deepestLobe *
      (1 + LOOK.breath) +
    PEEL.reachMargin;
  const angle = seeded(hash(slug) ^ PEEL.angleShuffle);
  const backing = BACKING.map(
    (colour, index) =>
      `<stop offset="${[0, BACKING_CREASE, 1][index]}" stop-color="${colour}"/>`,
  ).join("");

  return scatter(slug, {
    badge,
    width: CARD.width,
    height: CARD.height,
    overhang: STICKER_OVERHANG,
  })
    .map(({ x, y, tilt, ms }, index) => {
      const id = `sticker${index}`;
      const turn = angle() * TURN;
      return [
        `<svg class="sticker" data-peel data-angle="${((turn * Math.PI * 2) / TURN).toFixed(4)}" data-reach="${reach.toFixed(1)}" viewBox="0 0 ${LOOK.box} ${LOOK.box}" width="${size}" height="${size}" overflow="visible" style="left:${(x - size / 2).toFixed(1)}px;top:${(y - size / 2).toFixed(1)}px;transform:rotate(${tilt.toFixed(1)}deg)">`,
        "<defs>",
        `<clipPath id="${id}-laid" clipPathUnits="userSpaceOnUse"><rect data-laid x="${centre - plane}" y="${centre - plane}" width="${2 * plane}" height="${2 * plane}" transform="rotate(${turn.toFixed(2)} ${centre} ${centre})"/></clipPath>`,
        `<linearGradient id="${id}-backing" data-backing gradientUnits="userSpaceOnUse">${backing}</linearGradient>`,
        `<filter id="${id}-lift" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="${LIFT.dy}" stdDeviation="${LIFT.blur}" flood-color="${LIFT.ink}" flood-opacity="${LIFT.opacity}"/></filter>`,
        "</defs>",
        `<g clip-path="url(#${id}-laid)">${badgeMarkup(badge, { id, ms })}</g>`,
        `<g data-flap opacity="0" filter="url(#${id}-lift)"><g clip-path="url(#${id}-laid)"><path data-flap-shape fill="url(#${id}-backing)" d="${outlines(badge, ms).blob}"/></g></g>`,
        "</svg>",
      ].join("");
    })
    .join("");
}

function shell(font: string, sizes: string, text: string, card = "") {
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      @font-face {
        font-family: "Inter";
        src: url(data:font/woff2;base64,${font}) format("woff2");
        font-weight: 100 900;
        font-style: normal;
      }
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body { width: ${WIDTH}px; height: ${HEIGHT}px; }
      body {
        background: ${CREAM};
        font-family: "Inter", system-ui, sans-serif;
        font-feature-settings: ${FEATURES};
        font-optical-sizing: auto;
        color: ${INK};
        -webkit-font-smoothing: antialiased;
        text-rendering: optimizeLegibility;
      }
      .card {
        position: absolute;
        left: ${CARD.left}px;
        top: ${CARD.top}px;
        width: ${CARD.width}px;
        height: ${CARD.height}px;
        border-radius: ${CARD.radius}px;
        background: radial-gradient(
          ellipse farthest-side at var(--sun-x, ${SUN.rest.x}%) var(--sun-y, ${SUN.rest.y}%),
          ${SUN_CORE} 0%,
          ${SUN_EDGE} 100%
        );
      }
      .card { overflow: hidden; }
      .sticker { position: absolute; }
      .text {
        position: absolute;
        left: ${TEXT_LEFT}px;
        right: 64px;
        bottom: 77px;
      }
      .title {
        font-weight: 700;
        letter-spacing: -0.03em;
        margin-left: -0.025em;
      }
      .deck {
        margin-top: 0.5em;
        font-size: 34px;
        line-height: 1.3;
        letter-spacing: -0.01em;
        color: ${SOFT};
        text-wrap: balance;
      }
      ${sizes}
    </style>
  </head>
  <body>
    <div class="card"${card ? "" : " data-sun"}>${card}</div>
    <div class="text">${text}</div>
  </body>
</html>`;
}

export const homeCard = (font: string) =>
  shell(
    font,
    `.title { font-size: 123px; line-height: 0.95; }`,
    `<div class="title">${escape(TITLE)}</div>
     <div class="deck">${escape(HOME_DECK)}</div>`,
  );

export const postCard = (
  font: string,
  { slug, meta }: { slug: string; meta: { title: string; deck: string } },
) =>
  shell(
    font,
    `.title { font-size: 76px; line-height: 1.02; }`,
    `<div class="title">${escape(meta.title)}</div>
     <div class="deck">${escape(meta.deck)}</div>`,
    stickers(slug, badgeOf(slug)),
  );

function badgeOf(slug: string) {
  const badge = BADGES[slug];
  if (!badge) {
    throw new Error(
      `No badge baked for "${slug}". Run "npm run badges" first.`,
    );
  }
  return badge;
}

export function setLines(gap: number) {
  for (const svg of document.querySelectorAll("svg.sticker")) {
    const ring = svg.querySelector<SVGPathElement>("[data-ring]");
    const line = svg.querySelector<SVGPathElement>("[data-line]");
    const text = svg.querySelector<SVGTextContentElement>("[data-text]");
    if (!ring || !line || !text) continue;
    const length = ring.getTotalLength() / 2;
    const lineLength = line.getTotalLength() / 2;
    const scale = lineLength / length;
    const from = (text.getComputedTextLength() + gap) * scale;
    const to = (length - gap) * scale;
    line.setAttribute(
      "stroke-dasharray",
      `${Math.max(0, to - from)} ${4 * lineLength}`,
    );
    line.setAttribute("stroke-dashoffset", `${-from}`);
  }
}

const BEZIER_STEPS = 30;

const cubic = (from: number, to: number, t: number) =>
  3 * from * t * (1 - t) ** 2 + 3 * to * t * t * (1 - t) + t ** 3;

function ease(curve: readonly number[], x: number) {
  const [x1 = 0, y1 = 0, x2 = 1, y2 = 1] = curve;
  let low = 0;
  let high = 1;
  for (let step = 0; step < BEZIER_STEPS; step++) {
    const middle = (low + high) / 2;
    if (cubic(x1, x2, middle) < x) low = middle;
    else high = middle;
  }
  return cubic(y1, y2, (low + high) / 2);
}

const clamp = (t: number) => Math.min(1, Math.max(0, t));

function laid(local: number) {
  if (local <= 0) return 0;
  if (local < PEEL.touchMs)
    return PEEL.touch * ease(PEEL.touchCurve, clamp(local / PEEL.touchMs));
  const pressing = local - PEEL.touchMs - PEEL.catchMs;
  if (pressing < 0) return PEEL.touch;
  return (
    PEEL.touch +
    (1 - PEEL.touch) * ease(PEEL.pressCurve, clamp(pressing / PEEL.pressMs))
  );
}

type Pose = {
  centre: number;
  plane: number;
  stickers: { share: number; flap: number }[];
  sun: { x: number; y: number };
};

export function poseAt(ms: number): Pose {
  const looped = ms % PEEL.loopMs;
  const turn = ((ms % SUN.loopMs) / SUN.loopMs) * 2 * Math.PI;
  return {
    centre: PEEL.centre,
    plane: PEEL.plane,
    stickers: Array.from({ length: STICKERS.count }, (_, index) => {
      const share = laid(looped - PEEL.startMs - index * PEEL.staggerMs);
      const flap =
        share >= 1 ? 0 : clamp(share / (PEEL.touch * PEEL.backingFade));
      return { share, flap };
    }),
    sun: {
      x: SUN.rest.x + SUN.swing.x * Math.sin(turn),
      y: SUN.rest.y + SUN.swing.y * Math.sin(2 * turn),
    },
  };
}

export function pose({ centre, plane, stickers, sun }: Pose) {
  for (const [index, svg] of [
    ...document.querySelectorAll<SVGSVGElement>("[data-peel]"),
  ].entries()) {
    const { share, flap } = stickers[index] ?? { share: 1, flap: 0 };
    const turn = Number(svg.dataset.angle);
    const reach = Number(svg.dataset.reach);
    const edge = -reach + 2 * reach * share;
    const a = Math.cos(turn);
    const b = Math.sin(turn);
    const shift = 2 * (centre * a + centre * b + edge);

    svg
      .querySelector("[data-laid]")
      ?.setAttribute("width", `${Math.max(0, plane + edge)}`);
    svg
      .querySelector("[data-flap-shape]")
      ?.setAttribute(
        "transform",
        `matrix(${1 - 2 * a * a} ${-2 * a * b} ${-2 * a * b} ${1 - 2 * b * b} ${shift * a} ${shift * b})`,
      );
    const backing = svg.querySelector("[data-backing]");
    backing?.setAttribute("x1", `${centre + edge * a}`);
    backing?.setAttribute("y1", `${centre + edge * b}`);
    backing?.setAttribute("x2", `${centre + reach * a}`);
    backing?.setAttribute("y2", `${centre + reach * b}`);
    svg.querySelector("[data-flap]")?.setAttribute("opacity", `${flap}`);
  }

  const card = document.querySelector<HTMLElement>("[data-sun]");
  card?.style.setProperty("--sun-x", `${sun.x}%`);
  card?.style.setProperty("--sun-y", `${sun.y}%`);
}

export const loopOf = (markup: string) =>
  markup.includes("data-peel") ? PEEL.loopMs : SUN.loopMs;

async function load(page: Page, markup: string) {
  await page.setContent(markup, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(setLines, LOOK.lineGap);

  const loaded = await page.evaluate(() => ({
    inter: document.fonts.check('700 88px "Inter"'),
    families: [...document.fonts].map((one) => one.family),
  }));
  if (!loaded.inter) {
    throw new Error(
      `Inter did not load — the card would render in a fallback face. Registered: ${loaded.families.join(", ") || "none"}`,
    );
  }
}

export async function record({
  frame,
  shoot,
  ms,
  fps,
  args,
  out,
}: {
  frame: Frame;
  shoot: () => Promise<Buffer>;
  ms: number;
  fps: number;
  args: string[];
  out: string;
}) {
  if (!ffmpeg)
    throw new Error("ffmpeg-static has no binary for this platform.");
  const encoder = spawn(
    ffmpeg,
    [
      "-y",
      "-loglevel",
      "error",
      "-f",
      "image2pipe",
      "-framerate",
      `${fps}`,
      "-i",
      "-",
      ...args,
      out,
    ],
    { stdio: ["pipe", "inherit", "inherit"] },
  );
  const closed = once(encoder, "close");

  const frames = Math.round((ms * fps) / MS_PER_SECOND);
  for (let index = 0; index < frames; index++) {
    await frame.evaluate(pose, poseAt((index * MS_PER_SECOND) / fps));
    if (!encoder.stdin.write(await shoot())) await once(encoder.stdin, "drain");
  }
  encoder.stdin.end();

  const [code] = await closed;
  if (code !== 0) throw new Error(`ffmpeg exited with ${code} for ${out}`);
}

const videoOf = (card: string) => card.replace(/\.png$/, ".mp4");

const fingerprint = (markup: string) =>
  createHash("sha256")
    .update(
      JSON.stringify({
        markup,
        PEEL,
        SUN,
        FPS,
        ENCODE,
        pose: [pose, poseAt, laid, ease].map(String),
      }),
    )
    .digest("hex")
    .slice(0, 16);

async function readHashes(): Promise<Record<string, string>> {
  try {
    return JSON.parse(await readFile(VIDEO_HASHES, "utf8"));
  } catch {
    return {};
  }
}

async function shoot(page: Page, card: { markup: string; out: string }) {
  await load(page, card.markup);

  const shot = await page.screenshot({ type: "png" });
  await writeFile(card.out, shot);

  const kb = (shot.byteLength / KB).toFixed(1);
  console.log(
    `✓ ${path.relative(ROOT, card.out)}  ${WIDTH}x${HEIGHT}  ${kb} kB`,
  );
}

async function film(
  page: Page,
  card: { markup: string; out: string },
  hashes: Record<string, string>,
) {
  const out = videoOf(card.out);
  const key = path.relative(ROOT, out);
  const print = fingerprint(card.markup);
  if (hashes[key] === print && (await there(out))) {
    console.log(`· ${key}  unchanged`);
    return;
  }

  await load(page, card.markup);
  await record({
    frame: page.mainFrame(),
    shoot: () => page.screenshot({ type: "png" }),
    ms: loopOf(card.markup),
    fps: FPS,
    args: ENCODE,
    out,
  });
  hashes[key] = print;

  const { size } = await stat(out);
  console.log(`✓ ${key}  ${WIDTH}x${HEIGHT}  ${(size / KB).toFixed(1)} kB`);
}

const there = async (file: string) => {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
};

async function verify(cards: string[]) {
  const missing: string[] = [];
  for (const card of [...cards, ...cards.map((card) => videoOf(card))]) {
    if (!(await there(card))) missing.push(path.relative(ROOT, card));
  }

  if (missing.length > 0) {
    throw new Error(
      `No browser to render with, and these cards are not committed: ${missing.join(", ")}. Run "npm run og:image" where Chromium is installed and commit the result.`,
    );
  }

  console.log(
    `· no browser here — keeping ${cards.length} committed cards and their videos`,
  );
}

async function render(cards: Map<string, string>) {
  const browser = await chromium.launch();
  const hashes = await readHashes();
  try {
    const page = await browser.newPage({
      viewport: { width: WIDTH, height: HEIGHT },
      deviceScaleFactor: 1,
    });

    for (const [out, markup] of cards) {
      await shoot(page, { markup, out });
      await film(page, { markup, out }, hashes);
    }
  } finally {
    await browser.close();
    await writeFile(VIDEO_HASHES, `${JSON.stringify(hashes, null, 2)}\n`);
  }
}

export async function readFont() {
  const file = await readFile(FONT);
  return file.toString("base64");
}

async function main() {
  const font = await readFont();
  const posts = await readPosts();
  await mkdir(POST_DIR, { recursive: true });

  const cards = new Map<string, string>([[OUT, homeCard(font)]]);
  for (const { slug, meta } of posts) {
    cards.set(
      path.join(POST_DIR, `${slug}.png`),
      postCard(font, { slug, meta }),
    );
  }

  const browserIsThere = await there(chromium.executablePath());
  await (browserIsThere ? render(cards) : verify([...cards.keys()]));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(`✗ ${error instanceof Error ? error.message : error}`);
    process.exit(1);
  });
}
