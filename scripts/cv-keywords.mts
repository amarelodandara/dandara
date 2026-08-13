import { readFile } from "node:fs/promises";
import path from "node:path";
import { extractText, getDocumentProxy } from "unpdf";

export type Keyword = {
  label: string;
  match?: string;
};

export type KeywordFile = {
  role: string;
  critical: Keyword[];
  important: Keyword[];
};

export type Scored = Keyword & { tier: "critical" | "important"; count: number };

export type Report = {
  role: string;
  rows: Scored[];
  critical: { hit: number; total: number };
  important: { hit: number; total: number };
  score: number;
};

export function keywordsPathFor(slug: string, lang: string): string {
  return path.join(
    process.cwd(),
    "src/content/cv/tailored",
    `${slug}.${lang}.keywords.json`,
  );
}

export async function loadKeywords(file: string): Promise<KeywordFile | null> {
  let raw: string;
  try {
    raw = await readFile(file, "utf8");
  } catch {
    return null;
  }

  const parsed = JSON.parse(raw) as KeywordFile;
  if (!Array.isArray(parsed.critical) || !Array.isArray(parsed.important)) {
    throw new TypeError(`${file}: needs \`critical\` and \`important\` arrays`);
  }
  return parsed;
}

export async function pdfText(file: string): Promise<{ text: string; pages: number }> {
  const doc = await getDocumentProxy(new Uint8Array(await readFile(file)));
  const { text } = await extractText(doc, { mergePages: true });
  return { text: text.replaceAll(/\s+/g, " "), pages: doc.numPages };
}

export function score(text: string, keywords: KeywordFile): Report {
  const low = text.toLowerCase();

  const count = (keyword: Keyword) => {
    const source = keyword.match ?? escapeRegExp(keyword.label);
    return (low.match(new RegExp(source, "gi")) ?? []).length;
  };

  const rows: Scored[] = [
    ...keywords.critical.map((k) => ({ ...k, tier: "critical" as const, count: count(k) })),
    ...keywords.important.map((k) => ({ ...k, tier: "important" as const, count: count(k) })),
  ];

  const tally = (tier: Scored["tier"]) => {
    const of = rows.filter((r) => r.tier === tier);
    return { hit: of.filter((r) => r.count > 0).length, total: of.length };
  };

  const critical = tally("critical");
  const important = tally("important");
  const hit = critical.hit + important.hit;
  const total = critical.total + important.total;

  return {
    role: keywords.role,
    rows,
    critical,
    important,
    score: total === 0 ? 0 : Math.round((hit / total) * 100),
  };
}

const escapeRegExp = (s: string) => s.replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);

export const TARGET = 80;

export function formatReport(report: Report): string {
  const lines: string[] = [];
  const width = Math.max(...report.rows.map((r) => r.label.length), 10);

  const section = (tier: Scored["tier"], heading: string) => {
    lines.push(`\n  ${heading}`);
    for (const row of report.rows.filter((r) => r.tier === tier)) {
      const mark = row.count > 0 ? "✓" : "✗";
      const times = row.count > 0 ? `${row.count}×` : "missing";
      lines.push(`    ${mark} ${row.label.padEnd(width)}  ${times}`);
    }
  };

  lines.push(`\nATS match — ${report.role}`);
  section("critical", `Critical  ${report.critical.hit}/${report.critical.total}`);
  section("important", `Important ${report.important.hit}/${report.important.total}`);

  const verdict = report.score >= TARGET ? "at or above" : "below";
  lines.push(
    `\n  Score ${report.score}% — ${verdict} the ${TARGET}% mark.`,
  );

  const missing = report.rows.filter((r) => r.count === 0);
  if (missing.length > 0) {
    lines.push(
      `  Missing: ${missing.map((r) => r.label).join(", ")}.`,
      "  Add only what is true. A miss you cannot honestly close is information, not a defect.",
    );
  }

  return lines.join("\n");
}
