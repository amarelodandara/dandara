import { LINKS } from "@/links/data";
import { toRss } from "@/links/export";
import { SITE_URL, TITLE } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  const body = toRss(LINKS, {
    title: `${TITLE} — Links`,
    link: `${SITE_URL}/links`,
    self: `${SITE_URL}/links/feed.xml`,
    description: "The references I keep reaching for.",
  });
  return new Response(body, {
    headers: {
      "content-type": "application/rss+xml; charset=utf-8",
      "cache-control":
        "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
