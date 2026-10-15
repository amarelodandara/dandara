import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";
import type { Page } from "playwright";
import { DESCRIPTION, TITLE } from "../src/lib/site.ts";
import { BADGES } from "../src/badges/data.ts";
import { badgeMarkup, LOOK, type Badge } from "../src/badges/shape.ts";
import { readPosts } from "../src/lib/writing/meta-source.ts";
import { scatter, STICKERS } from "../src/badges/scatter.ts";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "public", "og.png");
const POST_DIR = path.join(ROOT, "public", "writing", "og");
const FONT = path.join(ROOT, "src", "fonts", "InterVariable.woff2");

const KB = 1024;
const WIDTH = 1200;
const HEIGHT = 630;

const CREAM = "#fef3c7";
const INK = "#111111";
const SOFT = "#5c5751";
const SUN_CORE = "#ff8e00";
const SUN_EDGE = "#ffcc00";

const FEATURES = `"calt" 1, "cv06" 1, "cv10" 1, "ss01" 1, "ss02" 1, "ss03" 1, "zero" 1`;

const CARD = { left: 33, top: 40, width: 293, height: 550, radius: 14 };

const STICKER_OVERHANG = 0.5;
const TEXT_LEFT = 378;
const ROLE_SECOND_LINE = "and relentless taste";

const escape = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

function roleMarkup(description: string) {
  if (!description.endsWith(ROLE_SECOND_LINE)) {
    throw new Error(
      `The role no longer ends with "${ROLE_SECOND_LINE}", so the card cannot place its line break. Update ROLE_SECOND_LINE to match src/lib/site.ts.`,
    );
  }
  const first = description.slice(0, -ROLE_SECOND_LINE.length).trimEnd();
  return `${escape(first)}<br />${escape(ROLE_SECOND_LINE)}`;
}

function stickers(slug: string, badge: Badge) {
  const size = LOOK.box * STICKERS.scale;
  return scatter(slug, {
    badge,
    width: CARD.width,
    height: CARD.height,
    overhang: STICKER_OVERHANG,
  })
    .map(({ x, y, tilt, ms }, index) => {
      const inner = badgeMarkup(badge, { id: `sticker${index}`, ms });
      return `<svg class="sticker" viewBox="0 0 ${LOOK.box} ${LOOK.box}" width="${size}" height="${size}" overflow="visible" style="left:${(x - size / 2).toFixed(1)}px;top:${(y - size / 2).toFixed(1)}px;transform:rotate(${tilt.toFixed(1)}deg)">${inner}</svg>`;
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
          ellipse farthest-side at 49% 44%,
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
      ${sizes}
    </style>
  </head>
  <body>
    <div class="card">${card}</div>
    <div class="text">${text}</div>
  </body>
</html>`;
}

const homeCard = (font: string) =>
  shell(
    font,
    `.title { font-size: 123px; line-height: 0.95; }
     .role {
       margin-top: 0.35em;
       font-size: 44px;
       font-weight: 600;
       line-height: 1.364;
       letter-spacing: -0.01em;
     }`,
    `<div class="title">${escape(TITLE)}</div>
     <div class="role">${roleMarkup(DESCRIPTION)}</div>`,
  );

const postCard = (
  font: string,
  { slug, meta }: { slug: string; meta: { title: string; deck: string } },
) =>
  shell(
    font,
    `.title { font-size: 76px; line-height: 1.02; }
     .deck {
       margin-top: 0.5em;
       font-size: 34px;
       line-height: 1.3;
       letter-spacing: -0.01em;
       color: ${SOFT};
     }`,
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

function setLines(gap: number) {
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

async function shoot(page: Page, card: { markup: string; out: string }) {
  await page.setContent(card.markup, { waitUntil: "load" });
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

  const shot = await page.screenshot({ type: "png" });
  await writeFile(card.out, shot);

  const kb = (shot.byteLength / KB).toFixed(1);
  console.log(
    `✓ ${path.relative(ROOT, card.out)}  ${WIDTH}x${HEIGHT}  ${kb} kB`,
  );
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
  for (const card of cards) {
    if (!(await there(card))) missing.push(path.relative(ROOT, card));
  }

  if (missing.length > 0) {
    throw new Error(
      `No browser to render with, and these cards are not committed: ${missing.join(", ")}. Run "npm run og:image" where Chromium is installed and commit the result.`,
    );
  }

  console.log(`· no browser here — keeping ${cards.length} committed cards`);
}

async function render(cards: Map<string, string>) {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({
      viewport: { width: WIDTH, height: HEIGHT },
      deviceScaleFactor: 1,
    });

    for (const [out, markup] of cards) {
      await shoot(page, { markup, out });
    }
  } finally {
    await browser.close();
  }
}

async function main() {
  const fontFile = await readFile(FONT);
  const font = fontFile.toString("base64");
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

main().catch((error) => {
  console.error(`✗ ${error instanceof Error ? error.message : error}`);
  process.exit(1);
});
