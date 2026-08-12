import { readFile } from "node:fs/promises";
import path from "node:path";
import { parseCv } from "./parse";
import type { CvDoc, CvLang } from "./types";

const LANGS = new Set<string>(["en", "pt"] satisfies CvLang[]);

/**
 * Tailored variants are named after the company and role they were written
 * for. The pattern is narrow on purpose: this string reaches the filesystem
 * from a query parameter, and the route it feeds reads whatever it is handed.
 */
const SLUG = /^[a-z0-9][a-z0-9-]{0,63}$/;

const ROOT = path.join(process.cwd(), "src", "content", "cv");

/**
 * Reads and parses one résumé. Returns `null` for anything it will not serve —
 * an unknown language, a slug that fails the pattern, a file that is not there
 * — so the caller can answer with a 404 rather than an error page.
 *
 * Parse failures are *not* swallowed. A malformed document is a bug in the
 * markdown that someone needs to see and fix, and the dev overlay is the right
 * place to see it.
 */
export async function loadCv(
  lang: string,
  variant: string,
): Promise<CvDoc | null> {
  if (!LANGS.has(lang)) return null;
  if (variant !== "base" && !SLUG.test(variant)) return null;

  const file =
    variant === "base"
      ? path.join(ROOT, `base.${lang}.md`)
      : path.join(ROOT, "tailored", `${variant}.${lang}.md`);

  let source: string;
  try {
    source = await readFile(file, "utf8");
  } catch {
    return null;
  }

  const doc = parseCv(source, path.relative(process.cwd(), file));

  // The document declares its own language; disagreeing with the URL means one
  // of the two is wrong, and guessing which would be the worse answer.
  if (doc.meta.lang !== lang) {
    throw new Error(
      `${file}: frontmatter says lang "${doc.meta.lang}" but was loaded as "${lang}"`,
    );
  }

  return doc;
}
