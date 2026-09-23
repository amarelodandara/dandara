import type { Metadata } from "next";
import Link from "next/link";
import { LINK } from "@/components/link";
import { UPCOMING } from "@/content/upcoming";
import { WritingNav } from "@/components/writing/writing-nav";
import { formatPostDate, loadWritingList } from "@/lib/writing/posts";
import { ANNOTATION, PAGE_HEADING, PROSE, SECTION_HEADING } from "@/lib/type";

export const metadata: Metadata = {
  title: "Writing",
  description: "Essays on design, and on the things built alongside it.",
};

export default async function WritingIndex() {
  const entries = await loadWritingList();

  return (
    <>
      <WritingNav />

      <main className="mx-auto w-full max-w-[1400px] flex-1 px-[7vw] pt-[9vh] pb-[14vh] sm:pt-[12vh]">
        <div data-landing className="mx-auto w-full max-w-2xl">
          <h1 className={PAGE_HEADING}>Writing</h1>

          <ul className="mt-12 space-y-10">
            {UPCOMING.map(({ title }) => (
              <li key={title}>
                <p data-quiet className={`${ANNOTATION} text-graphite-400`}>
                  Coming soon
                </p>
                <h2 className={`mt-1.5 ${SECTION_HEADING} text-graphite-500`}>
                  {title}
                </h2>
              </li>
            ))}

            {entries.map(({ key, title, deck, date, href, venue }) => (
              <li key={key}>
                <p data-quiet className={`${ANNOTATION} text-graphite-400`}>
                  <time dateTime={date}>{formatPostDate(date)}</time>
                  {venue && <> · {venue}</>}
                </p>
                <h2 className={`mt-1.5 ${SECTION_HEADING}`}>
                  {venue ? (
                    <a href={href} className={LINK}>
                      {title}
                    </a>
                  ) : (
                    <Link href={href} className={LINK}>
                      {title}
                    </Link>
                  )}
                </h2>
                <p className={`mt-1.5 ${PROSE} text-graphite-700`}>{deck}</p>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </>
  );
}
