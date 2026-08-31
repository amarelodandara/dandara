import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";
import type { Page } from "playwright";
import { DESCRIPTION, TITLE } from "../src/lib/site.ts";
import { readPosts } from "../src/lib/writing/meta-source.ts";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "src", "app", "(site)", "opengraph-image.png");
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
const TEXT_LEFT = 378;
const ROLE_SECOND_LINE = "and relentless taste";

const escape = (value: string) =>
  value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

function roleMarkup(description: string) {
  if (!description.endsWith(ROLE_SECOND_LINE)) {
    throw new Error(
      `The role no longer ends with "${ROLE_SECOND_LINE}", so the card cannot place its line break. Update ROLE_SECOND_LINE to match src/lib/site.ts.`,
    );
  }
  const first = description.slice(0, -ROLE_SECOND_LINE.length).trimEnd();
  return `${escape(first)}<br />${escape(ROLE_SECOND_LINE)}`;
}

function shell(font: string, sizes: string, text: string) {
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
    <div class="card"></div>
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

const postCard = (font: string, meta: { title: string; deck: string }) =>
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
  );

async function shoot(page: Page, card: { markup: string; out: string }) {
  await page.setContent(card.markup, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);

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
  console.log(`✓ ${path.relative(ROOT, card.out)}  ${WIDTH}x${HEIGHT}  ${kb} kB`);
}

async function main() {
  const fontFile = await readFile(FONT);
  const font = fontFile.toString("base64");
  const posts = await readPosts();
  await mkdir(POST_DIR, { recursive: true });

  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({
      viewport: { width: WIDTH, height: HEIGHT },
      deviceScaleFactor: 1,
    });

    await shoot(page, { markup: homeCard(font), out: OUT });

    for (const { slug, meta } of posts) {
      await shoot(page, {
        markup: postCard(font, meta),
        out: path.join(POST_DIR, `${slug}.png`),
      });
    }
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(`✗ ${error instanceof Error ? error.message : error}`);
  process.exit(1);
});
