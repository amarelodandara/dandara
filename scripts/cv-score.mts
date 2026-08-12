/**
 * Scores a résumé PDF against the posting it was written for.
 *
 *   npm run cv:score -- public/gift-shop/tailored/linear.en.pdf
 *   npm run cv:score -- <pdf> --keywords src/content/cv/tailored/linear.en.keywords.json
 *
 * `cv:pdf` already prints this after every generate; this is for re-checking
 * an existing PDF without regenerating it, or for scoring the base CV against
 * a posting to get the "before" number.
 */

import path from "node:path";
import process from "node:process";
import {
  formatReport,
  keywordsPathFor,
  loadKeywords,
  pdfText,
  score,
  TARGET,
} from "./cv-keywords.mts";

async function main() {
  const argv = process.argv.slice(2);
  const positional: string[] = [];
  let keywordsArg: string | undefined;

  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--keywords") keywordsArg = argv[++i];
    else if (!argv[i].startsWith("--")) positional.push(argv[i]);
  }

  const pdf = positional[0];
  if (!pdf) throw new Error("usage: cv:score -- <file.pdf> [--keywords <file.json>]");

  // `linear-senior-product-designer.en.pdf` implies its own keyword file, so
  // the ordinary case needs no flag.
  const base = path.basename(pdf, ".pdf");
  const [slug, lang] = [base.replace(/\.(en|pt)$/, ""), base.match(/\.(en|pt)$/)?.[1] ?? "en"];
  const keywordsPath = keywordsArg
    ? path.resolve(process.cwd(), keywordsArg)
    : keywordsPathFor(slug, lang);

  const keywords = await loadKeywords(keywordsPath);
  if (!keywords) {
    throw new Error(
      `no keyword file at ${path.relative(process.cwd(), keywordsPath)} — write one, or pass --keywords`,
    );
  }

  const { text, pages } = await pdfText(path.resolve(process.cwd(), pdf));
  const report = score(text, keywords);

  console.log(formatReport(report));
  if (pages > 1) console.log(`\n  ! ${pages} pages. One is the target.`);

  // Not a failure: a low score is a fact about the fit, and sometimes the
  // honest answer is that the posting wants someone else.
  if (report.score < TARGET) process.exitCode = 0;
}

main().catch((error) => {
  console.error(`✗ ${error instanceof Error ? error.message : error}`);
  process.exit(1);
});
