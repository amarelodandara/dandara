import type { Link } from "./link";

export type Ref = Pick<Link, "slug" | "title" | "url" | "tag" | "by">;

export type Format = "markdown" | "bookmarks" | "csv";

const escape = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const cell = (value = "") =>
  /[",\n]/.test(value) ? `"${value.replaceAll('"', '""')}"` : value;

const byline = (ref: Ref) => (ref.by ? ` — ${ref.by}` : "");

const named = (ref: Ref) =>
  ref.url ? `[${ref.title}](${ref.url})` : ref.title;

const checkbox = (ref: Ref) => `- [ ] ${named(ref)}${byline(ref)}`;

export const toMarkdown = (refs: Ref[]) =>
  refs.map((ref) => checkbox(ref)).join("\n") + "\n";

export const toBookmarks = (
  refs: Ref[],
  folder: string,
) => `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>
<DL><p>
    <DT><H3>${escape(folder)}</H3>
    <DL><p>
${refs
  .filter((ref) => ref.url)
  .map(
    (ref) =>
      `        <DT><A HREF="${escape(ref.url ?? "")}" TAGS="${ref.tag}">${escape(ref.title)}</A>`,
  )
  .join("\n")}
    </DL><p>
</DL><p>
`;

export const toCsv = (refs: Ref[]) =>
  `Title,URL,Tag,By\n${refs.map((ref) => [ref.title, ref.url, ref.tag, ref.by].map((value) => cell(value)).join(",")).join("\n")}\n`;

const credit = (ref: Ref) =>
  ref.by
    ? "      <description>" + escape("By " + ref.by) + "</description>\n"
    : "";

const address = (ref: Ref) =>
  ref.url
    ? `      <link>${escape(ref.url)}</link>\n      <guid isPermaLink="true">${escape(ref.url)}</guid>\n`
    : `      <guid isPermaLink="false">${ref.slug}</guid>\n`;

const item = (ref: Ref) => `    <item>
      <title>${escape(ref.title)}</title>
${address(ref)}      <category>${ref.tag}</category>
${credit(ref)}    </item>`;

export const toRss = (
  refs: Ref[],
  channel: { title: string; link: string; self: string; description: string },
) => `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(channel.title)}</title>
    <link>${channel.link}</link>
    <description>${escape(channel.description)}</description>
    <language>en</language>
    <atom:link href="${channel.self}" rel="self" type="application/rss+xml" />
${refs.map((ref) => item(ref)).join("\n")}
  </channel>
</rss>
`;

export const EXPORTS: Record<
  Format,
  {
    file: string;
    type: string;
    render: (refs: Ref[], folder: string) => string;
  }
> = {
  markdown: { file: "links.md", type: "text/markdown", render: toMarkdown },
  bookmarks: { file: "bookmarks.html", type: "text/html", render: toBookmarks },
  csv: { file: "links.csv", type: "text/csv", render: toCsv },
};
