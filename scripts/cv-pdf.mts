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

const DEFAULT_BASE = process.env.CV_BASE_URL ?? "http://localhost:3000";

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

async function reachable(baseUrl: string, timeoutMs = 1500): Promise<boolean> {
  try {
    const response = await fetch(`${baseUrl}/cv?lang=en&variant=base`, {
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (response.ok) return true;
    throw new Error(
      `${baseUrl}/cv answered ${response.status}. If the site is running in production mode, /cv is a 404 by design — start \`npm run dev\`.`,
    );
  } catch (error) {
    if (error instanceof Error && error.message.includes("/cv answered")) throw error;
    return false;
  }
}

async function startServer(): Promise<{ baseUrl: string; child?: ChildProcess }> {
  const child = spawn("npx", ["next", "dev", "--port", String(SPAWN_PORT)], {
    cwd: ROOT,
    stdio: ["ignore", "pipe", "pipe"],
  });

  let output = "";
  let elsewhere: string | undefined;

  const REFUSED = "Another next dev server is already running";

  const collect = (chunk: Buffer) => {
    output += chunk.toString();
    const marker = output.indexOf(REFUSED);
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

async function main() {
  const args = parseArgs(process.argv.slice(2));

  const lang = required(args, "lang");
  const variant = required(args, "variant");
  const title = typeof args.title === "string" ? args.title : undefined;

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
      const sourceFile =
        variant === "base" ? `base.${lang}.md` : `tailored/${variant}.${lang}.md`;
      throw new Error(
        `${url} answered ${response?.status() ?? "nothing"} — is src/content/cv/${sourceFile} there, and does it parse?`,
      );
    }

    await page.evaluate(() => document.fonts.ready);

    await mkdir(path.dirname(outPath), { recursive: true });
    await page.pdf({
      path: outPath,
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
  const doc = await getDocumentProxy(new Uint8Array(bytes));
  const pages = doc.numPages;

  console.log(`✓ ${path.relative(ROOT, outPath)}  ${(bytes.byteLength / 1024).toFixed(1)} kB  ${pages} page${pages === 1 ? "" : "s"}`);
  if (pages > 1) {
    console.log("  ! more than one page. Tighten the copy — never the type size.");
  }

  if (explicitOut) return;

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
    meta: [`PDF · ${label}`, matched === undefined ? undefined : `${matched}% match`]
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
