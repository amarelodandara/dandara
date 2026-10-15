import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { ELSEWHERE } from "../src/content/elsewhere.ts";
import { TAGS, type Tag } from "../src/badges/tags.ts";
import { readPosts } from "../src/lib/writing/meta-source.ts";
import { hash, seeded } from "../src/badges/seeded.ts";

const ROOT = process.cwd();
const CONTENT = path.join(ROOT, "src", "content", "writing");
const OUT = path.join(ROOT, "src", "badges", "data.ts");

const FEWEST_LOBES = 5;
const MOST_LOBES = 8;
const LOBE_DEPTH = 0.16;
const LOBE_DRIFT = 0.35;

const SMALLEST_AT_WORDS = 100;
const LARGEST_AT_WORDS = 1600;
const SMALLEST_SCALE = 0.4;
const LARGEST_SCALE = 0.8;

const INK_LIGHTNESS_ON_LIGHT = 0.42;
const INK_LIGHTNESS_ON_DARK = 0.97;
const INK_CHROMA_ON_LIGHT = 0.09;
const INK_CHROMA_ON_DARK = 0.02;
const DARK_GROUND_BELOW = 0.6;

const TURN = Math.PI * 2;

const round = (value: number) => Math.round(value * 10_000) / 10_000;

function lobesFor(slug: string) {
  const next = seeded(hash(slug));
  const count =
    FEWEST_LOBES + Math.floor(next() * (MOST_LOBES - FEWEST_LOBES + 1));
  return Array.from({ length: count }, (_, index) => {
    const drift =
      index === 0 ? 0 : (next() - 0.5) * LOBE_DRIFT * (TURN / count);
    const angle = -Math.PI / 2 + (index / count) * TURN + drift;
    const depth = 1 + (next() * 2 - 1) * LOBE_DEPTH;
    const phase = next() * TURN;
    return [round(angle), round(depth), round(phase)] as const;
  });
}

function scaleFor(words: number) {
  const reach =
    (Math.log(words) - Math.log(SMALLEST_AT_WORDS)) /
    (Math.log(LARGEST_AT_WORDS) - Math.log(SMALLEST_AT_WORDS));
  const clamped = Math.min(1, Math.max(0, reach));
  return round(SMALLEST_SCALE + (LARGEST_SCALE - SMALLEST_SCALE) * clamped);
}

type Oklch = [number, number, number];

function toLinear([lightness, chroma, hue]: Oklch) {
  const a = chroma * Math.cos((hue * Math.PI) / 180);
  const b = chroma * Math.sin((hue * Math.PI) / 180);
  const l = (lightness + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (lightness - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (lightness - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}

function inGamut(lightness: number, chroma: number, hue: number): Oklch {
  let fitted = chroma;
  const outside = () =>
    toLinear([lightness, fitted, hue]).some((v) => v < -0.0005 || v > 1.0005);
  while (fitted > 0 && outside()) fitted -= 0.002;
  return [lightness, Math.max(0, fitted), hue];
}

const css = ([lightness, chroma, hue]: Oklch) =>
  `oklch(${lightness.toFixed(3)} ${chroma.toFixed(3)} ${hue.toFixed(1)})`;

function coloursFor(tags: readonly Tag[]) {
  const first = TAGS[tags[0]];
  const stops: Oklch[] =
    tags.length === 1
      ? [
          inGamut(
            Math.min(0.98, first.lightness + first.spread / 2),
            first.chroma,
            first.hue,
          ),
          inGamut(
            Math.max(0.05, first.lightness - first.spread / 2),
            first.chroma,
            first.aloneHue,
          ),
        ]
      : tags.map((tag) =>
          inGamut(TAGS[tag].lightness, TAGS[tag].chroma, TAGS[tag].hue),
        );

  const darkest = Math.min(...stops.map(([lightness]) => lightness));
  const onLight = darkest > DARK_GROUND_BELOW;
  const ink = inGamut(
    onLight ? INK_LIGHTNESS_ON_LIGHT : INK_LIGHTNESS_ON_DARK,
    onLight ? INK_CHROMA_ON_LIGHT : INK_CHROMA_ON_DARK,
    stops[0][2],
  );

  return { stops: stops.map((stop) => css(stop)), ink: css(ink) };
}

const OPENS_BLOCK = /^export const \w+ = [[{]$/;
const CLOSES_BLOCK = /^[\]}];$/;
const FENCE = "```";
const WORD = /[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu;

function proseLines(source: string) {
  const kept: string[] = [];
  let skipping: "block" | "fence" | null = null;
  for (const line of source.split("\n")) {
    if (skipping === "block") {
      if (CLOSES_BLOCK.test(line)) skipping = null;
    } else if (skipping === "fence") {
      if (line.startsWith(FENCE)) skipping = null;
    } else if (OPENS_BLOCK.test(line)) {
      skipping = "block";
    } else if (line.startsWith(FENCE)) {
      skipping = "fence";
    } else if (!line.startsWith("import ") && !line.startsWith("export ")) {
      kept.push(line);
    }
  }
  return kept.join("\n");
}

async function wordsIn(slug: string) {
  const source = await readFile(path.join(CONTENT, `${slug}.mdx`), "utf8");
  const prose = proseLines(source)
    .replaceAll(/<[^<>]*>/g, " ")
    .replaceAll(/\]\([^()]*\)/g, " ");
  return prose.match(WORD)?.length ?? 0;
}

function badgeFor(entry: {
  slug: string;
  title: string;
  href: string;
  tags: readonly Tag[];
  words: number;
}) {
  if (entry.tags.length === 0 || entry.tags.length > 3) {
    throw new Error(
      `${entry.slug} has ${entry.tags.length} tags; a badge takes one to three.`,
    );
  }
  for (const tag of entry.tags) {
    if (!(tag in TAGS))
      throw new Error(
        `${entry.slug} has an unknown tag "${tag}". Add it to src/badges/tags.ts.`,
      );
  }
  return {
    title: entry.title,
    href: entry.href,
    words: entry.words,
    scale: scaleFor(entry.words),
    lobes: lobesFor(entry.slug),
    ...coloursFor(entry.tags),
  };
}

const key = (name: string) =>
  /^[A-Za-z_]\w*$/.test(name) ? name : JSON.stringify(name);

function literal(slug: string, badge: ReturnType<typeof badgeFor>) {
  const lines = [
    `    title: ${JSON.stringify(badge.title)},`,
    `    href: ${JSON.stringify(badge.href)},`,
    `    words: ${badge.words},`,
    `    scale: ${badge.scale},`,
    "    lobes: [",
    ...badge.lobes.map((lobe) => `      [${lobe.join(", ")}],`),
    "    ],",
    "    stops: [",
    ...badge.stops.map((stop) => `      ${JSON.stringify(stop)},`),
    "    ],",
    `    ink: ${JSON.stringify(badge.ink)},`,
  ];
  return `  ${key(slug)}: {\n${lines.join("\n")}\n  },\n`;
}

async function main() {
  const posts = await readPosts();
  const here = await Promise.all(
    posts.map(async ({ slug, meta }) => ({
      slug,
      title: meta.title,
      href: `/writing/${slug}`,
      tags: meta.tags,
      words: await wordsIn(slug),
    })),
  );
  const entries = [...here, ...ELSEWHERE].toSorted((a, b) =>
    a.slug.localeCompare(b.slug),
  );

  const source = `import type { Badge } from "./shape";

export const BADGES: Record<string, Badge> = {
${entries.map((entry) => literal(entry.slug, badgeFor(entry))).join("")}};
`;
  await writeFile(OUT, source);

  for (const entry of entries) {
    console.log(
      `✓ ${entry.slug}  ${entry.words} words  ${entry.tags.join(" + ")}`,
    );
  }
}

main().catch((error) => {
  console.error(`✗ ${error instanceof Error ? error.message : error}`);
  process.exit(1);
});
