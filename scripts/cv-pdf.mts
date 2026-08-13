import { type ChildProcess } from "node:child_process";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";
import { getDocumentProxy } from "unpdf";
import {
  formatReport,
  keywordsPathFor,
  loadKeywords,
  pdfText,
  score,
} from "./cv-keywords.mts";
import { reachable, startServer, stopServer } from "./cv-server.mts";

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, "public", "gift-shop", "tailored");

const DEFAULT_BASE = process.env.CV_BASE_URL ?? "http://localhost:3000";

const PAGE_LOAD_TIMEOUT = 30_000;
const BYTES_PER_KB = 1024;

type Args = Record<string, string | true>;

function parseArgs(argv: string[]): Args {
  const args: Args = {};
  for (let i = 0; i < argv.length; i++) {
    const token = argv[i];
    if (!token.startsWith("--")) continue;
    const key = token.slice(2);
    const next = argv[i + 1];
    if (next === undefined || next.startsWith("--")) args[key] = true;
    else {
      args[key] = next;
      i++;
    }
  }
  return args;
}

function required(args: Args, key: string): string {
  const value = args[key];
  if (typeof value !== "string" || value === "") {
    throw new Error(`missing --${key}`);
  }
  return value;
}

type Sidecar = {
  id: string;
  lang: string;
  title: string;
  meta: string;
  href: string;
  download: string;
  score?: number;
  pages: number;
  generatedAt: string;
};

const LANG_LABEL: Record<string, string> = { en: "English", pt: "Português" };

function downloadName(title: string): string {
  const parts = title
    .split(/[—–-]/)
    .map((part) => part.trim().replaceAll(/[^\p{L}\p{N} ]/gu, ""))
    .filter(Boolean)
    .map((part) => part.split(/\s+/).map((word) => capitalise(word)).join(""));
  return ["Nicoly_Dandara", ...parts].join("_") + ".pdf";
}

const capitalise = (word: string) => word.charAt(0).toUpperCase() + word.slice(1);

async function rebuildManifest() {
  const files = await readdir(OUT_DIR).catch(() => [] as string[]);
  const items: Sidecar[] = [];

  for (const file of files) {
    if (!file.endsWith(".json") || file === "manifest.json") continue;
    const pdf = file.replace(/\.json$/, ".pdf");
    if (!files.includes(pdf)) continue;
    items.push(JSON.parse(await readFile(path.join(OUT_DIR, file), "utf8")));
  }

  items.sort((a, b) => b.generatedAt.localeCompare(a.generatedAt));
  await writeFile(
    path.join(OUT_DIR, "manifest.json"),
    JSON.stringify({ items }, null, 2) + "\n",
  );
  return items.length;
}

type Job = {
  lang: string;
  variant: string;
  title?: string;
  outPath: string;
  explicitOut?: string;
  baseUrl: string;
};

function readJob(argv: string[]): Job {
  const args = parseArgs(argv);

  const lang = required(args, "lang");
  const variant = required(args, "variant");
  const explicitOut = typeof args.out === "string" ? args.out : undefined;

  if (!explicitOut && variant === "base") {
    throw new Error("refusing to file the base CV as a tailored variant — pass --out");
  }

  const baseFromArg = typeof args["base-url"] === "string" ? args["base-url"] : undefined;

  return {
    lang,
    variant,
    title: typeof args.title === "string" ? args.title : undefined,
    outPath: explicitOut
      ? path.resolve(ROOT, explicitOut)
      : path.join(OUT_DIR, `${variant}.${lang}.pdf`),
    explicitOut,
    baseUrl: (baseFromArg ?? DEFAULT_BASE).replace(/\/$/, ""),
  };
}

async function connectServer(
  baseUrl: string,
): Promise<{ resolved: string; child?: ChildProcess }> {
  if (await reachable(baseUrl)) {
    console.log(`• reusing the dev server at ${baseUrl}`);
    return { resolved: baseUrl };
  }
  const started = await startServer();
  return { resolved: started.baseUrl, child: started.child };
}

async function printPage(job: Job, url: string) {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    const response = await page.goto(url, { waitUntil: "load", timeout: PAGE_LOAD_TIMEOUT });

    if (!response || !response.ok()) {
      const sourceFile =
        job.variant === "base"
          ? `base.${job.lang}.md`
          : `tailored/${job.variant}.${job.lang}.md`;
      throw new Error(
        `${url} answered ${response?.status() ?? "nothing"} — is src/content/cv/${sourceFile} there, and does it parse?`,
      );
    }

    await page.evaluate(() => document.fonts.ready);

    await mkdir(path.dirname(job.outPath), { recursive: true });
    await page.pdf({
      path: job.outPath,
      preferCSSPageSize: true,
      printBackground: false,
      displayHeaderFooter: false,
      scale: 1,
    });
  } finally {
    await browser.close();
  }
}

async function renderPdf(job: Job) {
  const url = `${job.baseUrl}/cv?lang=${encodeURIComponent(job.lang)}&variant=${encodeURIComponent(job.variant)}`;
  const { resolved, child } = await connectServer(job.baseUrl);
  const target = url.replace(job.baseUrl, resolved);

  try {
    await printPage(job, target);
  } finally {
    if (child) await stopServer(child);
  }
}

async function reportPdf(job: Job) {
  const bytes = await readFile(job.outPath);
  const doc = await getDocumentProxy(new Uint8Array(bytes));
  const pages = doc.numPages;

  const size = (bytes.byteLength / BYTES_PER_KB).toFixed(1);
  console.log(
    `✓ ${path.relative(ROOT, job.outPath)}  ${size} kB  ${pages} page${pages === 1 ? "" : "s"}`,
  );
  if (pages > 1) {
    console.log("  ! more than one page. Tighten the copy — never the type size.");
  }

  return pages;
}

async function scoreAgainstPosting(job: Job): Promise<number | undefined> {
  const keywordsPath = keywordsPathFor(job.variant, job.lang);
  const keywords = await loadKeywords(keywordsPath);

  if (!keywords) {
    console.log(
      `\n· no ATS check: write ${path.relative(ROOT, keywordsPath)} to score this against the posting.`,
    );
    return;
  }

  const { text } = await pdfText(job.outPath);
  const report = score(text, keywords);
  console.log(formatReport(report));
  return report.score;
}

function buildSidecar(job: Job, result: { pages: number; matched?: number }): Sidecar {
  const label = LANG_LABEL[job.lang] ?? job.lang;
  const title = job.title ?? job.variant;

  return {
    id: `${job.variant}-${job.lang}`,
    lang: job.lang,
    title,
    meta: [
      `PDF · ${label}`,
      result.matched === undefined ? undefined : `${result.matched}% match`,
    ]
      .filter(Boolean)
      .join(" · "),
    href: `/gift-shop/tailored/${job.variant}.${job.lang}.pdf`,
    download: downloadName(title),
    score: result.matched,
    pages: result.pages,
    generatedAt: new Date().toISOString(),
  };
}

async function shelve(job: Job, sidecar: Sidecar) {
  await writeFile(
    job.outPath.replace(/\.pdf$/, ".json"),
    JSON.stringify(sidecar, null, 2) + "\n",
  );
  const count = await rebuildManifest();
  console.log(
    `✓ manifest lists ${count} tailored CV${count === 1 ? "" : "s"} — press g on the dev site`,
  );
}

async function main() {
  const job = readJob(process.argv.slice(2));

  await renderPdf(job);
  const pages = await reportPdf(job);

  if (job.explicitOut) return;

  const matched = await scoreAgainstPosting(job);
  await shelve(job, buildSidecar(job, { pages, matched }));
}

main().catch((error) => {
  console.error(`✗ ${error instanceof Error ? error.message : error}`);
  process.exit(1);
});
