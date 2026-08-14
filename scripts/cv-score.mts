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

  if (report.score < TARGET) process.exitCode = 0;
}

main().catch((error) => {
  console.error(`✗ ${error instanceof Error ? error.message : error}`);
  process.exit(1);
});
