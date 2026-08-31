import { DESCRIPTION, NAME, SITE_URL, TITLE } from "@/lib/site";
import { loadPostList } from "@/lib/writing/posts";

export const dynamic = "force-static";

const escape = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const asRfc822 = (date: string) =>
  new Date(`${date}T00:00:00Z`).toUTCString();

function item({
  slug,
  meta,
}: Awaited<ReturnType<typeof loadPostList>>[number]) {
  const url = `${SITE_URL}/writing/${slug}`;
  return `    <item>
      <title>${escape(meta.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escape(meta.deck)}</description>
      <pubDate>${asRfc822(meta.date)}</pubDate>
    </item>`;
}

export async function GET() {
  const posts = await loadPostList();
  const updated = posts[0]?.meta.date;

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(`${TITLE} — Writing`)}</title>
    <link>${SITE_URL}/writing</link>
    <description>${escape(DESCRIPTION)}</description>
    <language>en</language>
    <managingEditor>${escape(NAME)}</managingEditor>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
${updated ? `    <lastBuildDate>${asRfc822(updated)}</lastBuildDate>\n` : ""}${posts.map((post) => item(post)).join("\n")}
  </channel>
</rss>
`;

  return new Response(body, {
    headers: {
      "content-type": "application/rss+xml; charset=utf-8",
      "cache-control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
