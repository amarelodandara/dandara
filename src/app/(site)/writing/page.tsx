import type { Metadata } from "next";
import Link from "next/link";
import { LINK } from "@/components/link";
import { BadgeHover } from "@/badges/hover";
import { badgesFor } from "@/badges/pick";
import { PostFooter } from "@/components/writing/post-footer";
import { ShopCallout } from "@/components/writing/shop-callout";
import { loadWritingList } from "@/lib/writing/posts";
import { CARD, NAME } from "@/lib/site";
import { ANNOTATION, PAGE_HEADING, PROSE, SECTION_HEADING } from "@/lib/type";

const description = "Essays on design, and on the things built alongside it.";

export const metadata: Metadata = {
  title: "Writing",
  description,
  alternates: { canonical: "/writing" },
  openGraph: {
    type: "website",
    url: "/writing",
    siteName: NAME,
    locale: "en_US",
    title: "Writing",
    description,
    images: [CARD],
  },
  twitter: { title: "Writing", description, images: [CARD] },
};

type Entry = Awaited<ReturnType<typeof loadWritingList>>[number];

function byYear(entries: Entry[]) {
  const years = new Map<string, Entry[]>();
  for (const entry of entries) {
    const [year = ""] = entry.date.split("-");
    years.set(year, [...(years.get(year) ?? []), entry]);
  }
  return [...years];
}

function Piece({ title, deck, href, venue, badge }: Entry) {
  return (
    <li data-badge={badge}>
      <h3 className={SECTION_HEADING}>
        {venue ? (
          <a href={href} className={LINK}>
            {title}
            <span
              className={`ml-2.5 inline-block ${ANNOTATION} text-graphite-600`}
            >
              {venue}
            </span>
          </a>
        ) : (
          <Link href={href} className={LINK}>
            {title}
          </Link>
        )}
      </h3>
      <p className={`mt-1.5 ${PROSE} text-graphite-700`}>{deck}</p>
    </li>
  );
}

export default async function WritingIndex() {
  const entries = await loadWritingList();

  return (
    <>
      <main className="mx-auto w-full max-w-[1400px] flex-1 px-[7vw] pt-[9vh] sm:pt-[12vh]">
        <div data-landing className="mx-auto w-full max-w-2xl">
          <h1 className={PAGE_HEADING}>Writing</h1>
          <div className="mt-12">
            <ShopCallout>
              Looking for the RSS feed? It&rsquo;s waiting in the gift shop!
            </ShopCallout>
          </div>

          <BadgeHover badges={badgesFor(entries)}>
            {byYear(entries).map(([year, pieces]) => (
              <section key={year} className="mt-16 first-of-type:mt-8">
                <h2 className={`${ANNOTATION} leading-none text-graphite-700`}>
                  {year}
                </h2>

                <ul className="mt-8 space-y-12">
                  {pieces.map((piece) => (
                    <Piece {...piece} key={piece.key} />
                  ))}
                </ul>
              </section>
            ))}
          </BadgeHover>
        </div>
      </main>

      <div className="mx-auto w-full max-w-[1400px] px-[7vw] pb-[9vh] sm:pb-[12vh]">
        <div className="mx-auto w-full max-w-2xl">
          <PostFooter />
        </div>
      </div>
    </>
  );
}
