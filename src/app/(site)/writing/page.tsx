import type { Metadata } from "next";
import Link from "next/link";
import { LINK } from "@/components/link";
import { formatPostDate, loadPostList } from "@/lib/writing/posts";

export const metadata: Metadata = {
  title: "Writing",
  description: "Essays on design, and on the things built alongside it.",
};

export default async function WritingIndex() {
  const posts = await loadPostList();

  return (
    <main className="mx-auto w-full max-w-[1400px] flex-1 px-[7vw] py-[14vh] sm:py-[18vh]">
      <div data-landing className="mx-auto w-full max-w-xl">
        <h1 className="ml-[-0.02em] text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.05] font-bold tracking-[-0.03em]">
          Writing
        </h1>

        <ul className="mt-12 space-y-10">
          {posts.map(({ slug, meta }) => (
            <li key={slug}>
              <p className="text-[0.7rem] font-medium tracking-[0.01em] text-foreground-soft">
                <time dateTime={meta.date}>{formatPostDate(meta.date)}</time>
              </p>
              <h2 className="mt-1.5 text-[1.05rem] leading-tight font-semibold text-balance">
                <Link href={`/writing/${slug}`} className={LINK}>
                  {meta.title}
                </Link>
              </h2>
              <p className="mt-1.5 text-[clamp(0.95rem,1.15vw,1.0625rem)] leading-normal text-foreground-soft">
                {meta.deck}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
