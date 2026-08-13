import { readFile } from "node:fs/promises";
import path from "node:path";
import { parseCv } from "./parse";
import type { CvDoc, CvLang } from "./types";

const LANGS = new Set<string>(["en", "pt"] satisfies CvLang[]);

const SLUG = /^[a-z0-9][a-z0-9-]{0,63}$/;

const ROOT = path.join(process.cwd(), "src", "content", "cv");

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

  if (doc.meta.lang !== lang) {
    throw new Error(
      `${file}: frontmatter says lang "${doc.meta.lang}" but was loaded as "${lang}"`,
    );
  }

  return doc;
}
