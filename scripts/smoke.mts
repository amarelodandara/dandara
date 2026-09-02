import process from "node:process";
import { chromium } from "playwright";
import type { Browser } from "playwright";
import { giftShopSections } from "../src/content/gift-shop.ts";
import { TITLE } from "../src/lib/site.ts";
import { readPosts } from "../src/lib/writing/meta-source.ts";

const DEFAULT_BASE = "https://adandara.com";
const OK = 200;
const GONE = 404;
const SETTLE_MS = 600;
const MIN_ASSET_BYTES = 64;
const MISSING_PATH = "/this-page-does-not-exist";

const IGNORED_CONSOLE = [/_vercel\/(insights|speed-insights)/];

const failures: string[] = [];
const notes: string[] = [];

const check = (ok: boolean, message: string) => {
  if (!ok) failures.push(message);
  return ok;
};

const parseBase = (argv: string[]) => {
  const flag = argv.indexOf("--base");
  const given =
    flag === -1 ? process.env.SMOKE_BASE_URL : argv[flag + 1];
  return (given ?? DEFAULT_BASE).replace(/\/$/, "");
};

const noisy = (text: string) =>
  IGNORED_CONSOLE.some((pattern) => pattern.test(text));

type PageExpectation = {
  path: string;
  contains?: string[];
};

async function visit(browser: Browser, expected: PageExpectation) {
  const { path: route, contains = [] } = expected;
  const page = await browser.newPage();
  const loud: string[] = [];

  page.on("pageerror", (error) => loud.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error" && !noisy(message.text()))
      loud.push(message.text());
  });

  const response = await page.goto(`${parseBase(process.argv)}${route}`);
  await page.waitForTimeout(SETTLE_MS);

  check(
    response?.status() === OK,
    `${route} answered ${response?.status()} — expected ${OK}`,
  );

  const body = await page.content();
  for (const phrase of contains) {
    check(body.includes(phrase), `${route} is missing "${phrase}"`);
  }

  check(loud.length === 0, `${route} logged: ${loud.join(" · ")}`);

  const image = await page
    .locator('meta[property="og:image"]')
    .getAttribute("content")
    .catch(() => null);

  await page.close();
  return image;
}

async function expectStatus(url: string, status: number) {
  const response = await fetch(url).catch((error: Error) => error);
  if (response instanceof Error) {
    return check(false, `${url} did not answer — ${response.message}`);
  }
  return check(
    response.status === status,
    `${url} answered ${response.status} — expected ${status}`,
  );
}

async function fetchAsset(url: string) {
  const response = await fetch(url).catch((error: Error) => error);
  if (response instanceof Error) {
    return check(false, `${url} did not answer — ${response.message}`);
  }

  const type = response.headers.get("content-type") ?? "none";
  const payload = await response.arrayBuffer();
  const bytes = payload.byteLength;

  check(response.status === OK, `${url} answered ${response.status}`);
  check(
    !type.includes("text/html"),
    `${url} served HTML (${type}) — the file is gone and an error page took its place`,
  );
  return check(
    bytes > MIN_ASSET_BYTES,
    `${url} is only ${bytes} bytes — expected a real file`,
  );
}

async function checkFeed(base: string, titles: string[]) {
  const response = await fetch(`${base}/feed.xml`);
  const type = response.headers.get("content-type") ?? "none";
  const body = await response.text();

  check(response.status === OK, `/feed.xml answered ${response.status}`);
  check(type.includes("xml"), `/feed.xml served ${type} — expected XML`);

  const items = (body.match(/<item>/g) ?? []).length;
  check(
    items === titles.length,
    `/feed.xml lists ${items} items — the repo has ${titles.length} posts`,
  );

  for (const title of titles) {
    check(body.includes(title), `/feed.xml is missing "${title}"`);
  }
}

const downloads = () =>
  giftShopSections
    .flatMap((section) => section.items)
    .filter((item) => item.kind === "file")
    .map((item) => item.href);

type Posts = Awaited<ReturnType<typeof readPosts>>;

async function browsePages(posts: Posts) {
  const titles = posts.map((post) => post.meta.title);
  const browser = await chromium.launch();

  const image = await visit(browser, { path: "/", contains: [TITLE] });
  await visit(browser, { path: "/writing", contains: titles });

  for (const post of posts) {
    await visit(browser, {
      path: `/writing/${post.slug}`,
      contains: [post.meta.title],
    });
  }

  await browser.close();
  return image;
}

async function checkSitemap(base: string, posts: Posts) {
  const response = await fetch(`${base}/sitemap.xml`);
  const body = await response.text();

  check(response.status === OK, `/sitemap.xml answered ${response.status}`);
  for (const post of posts) {
    check(
      body.includes(`/writing/${post.slug}`),
      `/sitemap.xml does not list /writing/${post.slug}`,
    );
  }
}

async function fetchEverythingElse(base: string, posts: Posts) {
  await expectStatus(`${base}/cv`, GONE);
  await expectStatus(`${base}${MISSING_PATH}`, GONE);
  await expectStatus(`${base}/robots.txt`, OK);
  await checkSitemap(base, posts);
  await checkFeed(
    base,
    posts.map((post) => post.meta.title),
  );

  for (const href of downloads()) await fetchAsset(`${base}${href}`);
}

async function main() {
  const base = parseBase(process.argv);
  const posts = await readPosts();

  notes.push(
    `base ${base}`,
    `${posts.length} post(s), ${downloads().length} download(s)`,
  );

  const image = await browsePages(posts);
  await fetchEverythingElse(base, posts);

  if (image) await fetchAsset(new URL(image, base).toString());
  else check(false, "the home page declares no og:image");

  for (const note of notes) console.log(`  · ${note}`);

  if (failures.length > 0) {
    console.error(
      `\n✗ ${failures.length} problem${failures.length === 1 ? "" : "s"} on ${base}:`,
    );
    for (const failure of failures) console.error(`  - ${failure}`);
    process.exit(1);
  }
  console.log(`\n✓ ${base} serves every page, feed entry and download.`);
}

main().catch((error) => {
  console.error(`✗ ${error instanceof Error ? error.message : error}`);
  process.exit(1);
});
