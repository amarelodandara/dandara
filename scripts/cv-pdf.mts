/**
 * Prints a résumé to PDF.
 *
 *   npm run cv:pdf -- --lang en --variant linear-product-designer \
 *                     --title "Linear — Senior Product Designer"
 *   npm run cv:pdf -- --lang en --variant base --out public/gift-shop/cv-en.pdf
 *
 * The page at /cv does the rendering and `cv.css` owns the geometry; this file
 * only drives Chrome, scores the result against the posting, and files the
 * output. Run with plain `node` — Node strips the types itself, so there is no
 * build step and no loader to install.
 */

import { spawn, type ChildProcess } from "node:child_process";
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

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, "public", "gift-shop", "tailored");

/**
 * Where a dev server is expected to already be. `localhost` rather than the
 * loopback address on purpose: Next's dev server refuses cross-origin requests
 * for its own chunks, and 127.0.0.1 counts as a different origin.
 */
const DEFAULT_BASE = process.env.CV_BASE_URL ?? "http://localhost:3000";

/**
 * The port we start one on if it is not. Fixed rather than left to Next: it
 * falls back to 3001, 3002 and upward when a port is taken, and a generator
 * that guessed wrong would wait out its whole timeout and then blame the page.
 */
const SPAWN_PORT = 3999;

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

/* -------------------------------------------------------------------------- */
/* The dev server                                                             */
/* -------------------------------------------------------------------------- */

async function reachable(baseUrl: string, timeoutMs = 1500): Promise<boolean> {
  try {
    const response = await fetch(`${baseUrl}/cv?lang=en&variant=base`, {
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (response.ok) return true;
    // Something is answering but not with the page. Say so rather than
    // starting a second server that will not be able to bind either.
    throw new Error(
      `${baseUrl}/cv answered ${response.status}. If the site is running in production mode, /cv is a 404 by design — start \`npm run dev\`.`,
    );
  } catch (error) {
    if (error instanceof Error && error.message.includes("/cv answered")) throw error;
    return false;
  }
}

/**
 * Starts a dev server and waits for it to answer.
 *
 * Next refuses to run two dev servers against the same directory, and says
 * where the first one is when it declines. That message is the useful case,
 * not an error: it means a server exists on a port we did not think to try, so
 * we take the port it names and reuse it.
 */
async function startServer(): Promise<{ baseUrl: string; child?: ChildProcess }> {
  const child = spawn("npx", ["next", "dev", "--port", String(SPAWN_PORT)], {
    cwd: ROOT,
    stdio: ["ignore", "pipe", "pipe"],
  });

  let output = "";
  /** A dev server Next has told us about, running somewhere we did not look. */
  let elsewhere: string | undefined;

  const REFUSED = "Another next dev server is already running";

  const collect = (chunk: Buffer) => {
    output += chunk.toString();
    const marker = output.indexOf(REFUSED);
    // Next prints its own `Local:` line before deciding it cannot start, and
    // the existing server's line after — so only look past the refusal.
    if (marker !== -1) {
      elsewhere ??= output.slice(marker).match(/Local:\s+(http:\/\/\S+)/)?.[1];
    }
  };
  child.stdout?.on("data", collect);
  child.stderr?.on("data", collect);

  const deadline = Date.now() + 90_000;
  const spawned = `http://localhost:${SPAWN_PORT}`;

  while (Date.now() < deadline) {
    if (elsewhere) {
      child.kill("SIGTERM");
      const base = elsewhere.replace(/\/$/, "");
      if (await reachable(base)) {
        console.log(`• reusing the dev server already running at ${base}`);
        return { baseUrl: base };
      }
      throw new Error(
        `Next reports a dev server at ${base} but it did not answer. Stop it and retry.`,
      );
    }
    if (child.exitCode !== null) {
      throw new Error(`next dev exited with code ${child.exitCode}:\n${output}`);
    }
    if (await reachable(spawned, 800)) {
      console.log(`• started a dev server at ${spawned}`);
      return { baseUrl: spawned, child };
    }
    await new Promise((r) => setTimeout(r, 500));
  }

  child.kill("SIGKILL");
  throw new Error(`next dev did not come up within 90s:\n${output}`);
}

async function stopServer(child: ChildProcess) {
  child.kill("SIGTERM");
  await new Promise<void>((resolve) => {
    const timer = setTimeout(() => {
      child.kill("SIGKILL");
      resolve();
    }, 5000);
    child.once("exit", () => {
      clearTimeout(timer);
      resolve();
    });
  });
}

/* -------------------------------------------------------------------------- */
/* Sidecars and the manifest                                                  */
/* -------------------------------------------------------------------------- */

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

/** `Linear — Senior Product Designer` becomes `Linear_SeniorProductDesigner`. */
function downloadName(title: string): string {
  const parts = title
    .split(/[—–-]/)
    .map((part) => part.trim().replace(/[^\p{L}\p{N} ]/gu, ""))
    .filter(Boolean)
    .map((part) => part.split(/\s+/).map(capitalise).join(""));
  return ["Nicoly_Dandara", ...parts].join("_") + ".pdf";
}

const capitalise = (word: string) => word.charAt(0).toUpperCase() + word.slice(1);

/**
 * Rebuilt by scanning the directory rather than appended to. Deleting a stale
 * PDF by hand and running again then produces a manifest that tells the truth,
 * with no second copy of the state to fall out of step.
 */
async function rebuildManifest() {
  const files = await readdir(OUT_DIR).catch(() => [] as string[]);
  const items: Sidecar[] = [];

  for (const file of files) {
    if (!file.endsWith(".json") || file === "manifest.json") continue;
    const pdf = file.replace(/\.json$/, ".pdf");
    if (!files.includes(pdf)) continue; // sidecar outlived its PDF
    items.push(JSON.parse(await readFile(path.join(OUT_DIR, file), "utf8")));
  }

  items.sort((a, b) => b.generatedAt.localeCompare(a.generatedAt));
  await writeFile(
    path.join(OUT_DIR, "manifest.json"),
    JSON.stringify({ items }, null, 2) + "\n",
  );
  return items.length;
}

/* -------------------------------------------------------------------------- */
/* Main                                                                       */
/* -------------------------------------------------------------------------- */

async function main() {
  const args = parseArgs(process.argv.slice(2));

  const lang = required(args, "lang");
  const variant = required(args, "variant");
  const title = typeof args.title === "string" ? args.title : undefined;

  // `--out` is how the tracked base PDFs get written. Everything without it is
  // a tailored version and goes to the git-ignored folder with a sidecar.
  const explicitOut = typeof args.out === "string" ? args.out : undefined;
  const outPath = explicitOut
    ? path.resolve(ROOT, explicitOut)
    : path.join(OUT_DIR, `${variant}.${lang}.pdf`);

  if (!explicitOut && variant === "base") {
    throw new Error("refusing to file the base CV as a tailored variant — pass --out");
  }

  const baseFromArg = typeof args["base-url"] === "string" ? args["base-url"] : undefined;
  const baseUrl = (baseFromArg ?? DEFAULT_BASE).replace(/\/$/, "");

  let child: ChildProcess | undefined;
  let resolved = baseUrl;

  if (await reachable(baseUrl)) {
    console.log(`• reusing the dev server at ${baseUrl}`);
  } else {
    const started = await startServer();
    resolved = started.baseUrl;
    child = started.child;
  }

  const url = `${resolved}/cv?lang=${encodeURIComponent(lang)}&variant=${encodeURIComponent(variant)}`;
  const browser = await chromium.launch();

  try {
    const page = await browser.newPage();
    const response = await page.goto(url, { waitUntil: "load", timeout: 30_000 });

    if (!response || !response.ok()) {
      throw new Error(
        `${url} answered ${response?.status() ?? "nothing"} — is src/content/cv/${variant === "base" ? `base.${lang}.md` : `tailored/${variant}.${lang}.md`} there, and does it parse?`,
      );
    }

    // Printing before the webfont has resolved silently prints the fallback.
    await page.evaluate(() => document.fonts.ready);

    await mkdir(path.dirname(outPath), { recursive: true });
    await page.pdf({
      path: outPath,
      // `@page` in cv.css is the authority on size and margins, which is why
      // no format or margin is passed here — they would be ignored anyway.
      preferCSSPageSize: true,
      printBackground: false,
      displayHeaderFooter: false,
      scale: 1,
    });
  } finally {
    await browser.close();
    if (child) await stopServer(child);
  }

  const bytes = await readFile(outPath);
  const pages = (await getDocumentProxy(new Uint8Array(bytes))).numPages;

  console.log(`✓ ${path.relative(ROOT, outPath)}  ${(bytes.byteLength / 1024).toFixed(1)} kB  ${pages} page${pages === 1 ? "" : "s"}`);
  if (pages > 1) {
    console.log("  ! more than one page. Tighten the copy — never the type size.");
  }

  if (explicitOut) return;

  // The ATS check runs on every generate rather than on request. A tailored CV
  // whose score nobody looked at is the failure this whole pipeline exists to
  // prevent, and the number is measured from the PDF's own text — never
  // asserted by hand, which is how it would drift from the document.
  const keywords = await loadKeywords(keywordsPathFor(variant, lang));
  let matched: number | undefined;

  if (keywords) {
    const { text } = await pdfText(outPath);
    const report = score(text, keywords);
    matched = report.score;
    console.log(formatReport(report));
  } else {
    console.log(
      `\n· no ATS check: write ${path.relative(ROOT, keywordsPathFor(variant, lang))} to score this against the posting.`,
    );
  }

  const label = LANG_LABEL[lang] ?? lang;
  const sidecar: Sidecar = {
    id: `${variant}-${lang}`,
    lang,
    title: title ?? variant,
    meta: [`PDF · ${label}`, matched !== undefined ? `${matched}% match` : undefined]
      .filter(Boolean)
      .join(" · "),
    href: `/gift-shop/tailored/${variant}.${lang}.pdf`,
    download: downloadName(title ?? variant),
    score: matched,
    pages,
    generatedAt: new Date().toISOString(),
  };

  await writeFile(
    outPath.replace(/\.pdf$/, ".json"),
    JSON.stringify(sidecar, null, 2) + "\n",
  );
  const count = await rebuildManifest();
  console.log(`✓ manifest lists ${count} tailored CV${count === 1 ? "" : "s"} — press g on the dev site`);
}

main().catch((error) => {
  console.error(`✗ ${error instanceof Error ? error.message : error}`);
  process.exit(1);
});
