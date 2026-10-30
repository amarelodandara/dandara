import type { Metadata } from "next";
import { LINKS } from "@/links/data";
import { PlainList } from "@/links/plain-list";
import { Rolodex } from "@/links/rolodex";
import { LinksSchema } from "@/links/schema";
import { CARD, CARD_VIDEO, NAME, SITE_URL } from "@/lib/site";

const description =
  "References I keep recommending and reaching for creatively.";

const LINKS_CARD = {
  ...CARD,
  url: "/links/og.png",
  alt: "Links: a stack of index cards filed A to Z on a yellow panel.",
};

const LINKS_VIDEO = { ...CARD_VIDEO, url: `${SITE_URL}/links/og.mp4` };

export const metadata: Metadata = {
  title: { absolute: "Links" },
  description,
  alternates: {
    canonical: "/links",
    types: { "application/rss+xml": "/links/feed.xml" },
  },
  openGraph: {
    type: "website",
    url: "/links",
    siteName: NAME,
    locale: "en_US",
    title: "Links",
    description,
    images: [LINKS_CARD],
    videos: [LINKS_VIDEO],
  },
  twitter: { title: "Links", description, images: [LINKS_CARD] },
};

export default function LinksPage() {
  return (
    <main className="flex w-full flex-1 flex-col">
      <h1 className="sr-only">Links: {LINKS.length} references</h1>
      <LinksSchema links={LINKS} description={description} />
      <PlainList links={LINKS} />
      <Rolodex
        links={LINKS.map(({ slug, title, url, tag, by, note }) => ({
          slug,
          title,
          url,
          tag,
          by,
          note,
        }))}
      />
    </main>
  );
}
