import type { Metadata } from "next";
import Link from "next/link";
import { LINK } from "@/components/link";
import { UPCOMING } from "@/content/upcoming";
import { WritingNav } from "@/components/writing/writing-nav";
import { formatPostDate, loadPostList } from "@/lib/writing/posts";
import { ANNOTATION, PAGE_HEADING, PROSE, SECTION_HEADING } from "@/lib/type";

export const metadata: Metadata = {
  title: "Writing",
  description: "Essays on design, and on the things built alongside it.",
};

export default async function WritingIndex() {
  const posts = await loadPostList();

  return (
    <>
      <WritingNav />

      <main className="mx-auto w-full max-w-[1400px] flex-1 px-[7vw] pt-[9vh] pb-[14vh] sm:pt-[12vh]">
        <div data-landing className="mx-auto w-full max-w-2xl">
          <h1 className={PAGE_HEADING}>Writing</h1>

          <ul className="mt-12 space-y-10">
            {posts.map(({ slug, meta }) => (
              <li key={slug}>
                <p data-quiet className={`${ANNOTATION} text-foreground/35`}>
                  <time dateTime={meta.date}>{formatPostDate(meta.date)}</time>
                </p>
                <h2 className={`mt-1.5 ${SECTION_HEADING}`}>
                  <Link href={`/writing/${slug}`} className={LINK}>
                    {meta.title}
                  </Link>
                </h2>
                <p className={`mt-1.5 ${PROSE} text-foreground-soft`}>
                  {meta.deck}
                </p>
              </li>
            ))}

            {UPCOMING.map(({ title }) => (
              <li key={title}>
                <p data-quiet className={`${ANNOTATION} text-foreground/35`}>
                  Coming soon
                </p>
                <h2
                  className={`mt-1.5 ${SECTION_HEADING} text-foreground-soft/60`}
                >
                  {title}
                </h2>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </>
  );
}
