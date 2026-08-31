import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleNotes } from "@/components/writing/article-notes";
import { formatPostDate, loadPost, SLUGS } from "@/lib/writing/posts";

export const dynamicParams = false;

export function generateStaticParams() {
  return SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/writing/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await loadPost(slug);
  if (!post) return {};

  return {
    title: post.meta.title,
    description: post.meta.deck,
    openGraph: {
      type: "article",
      title: post.meta.title,
      description: post.meta.deck,
      publishedTime: post.meta.date,
    },
  };
}

export default async function ArticlePage({
  params,
}: PageProps<"/writing/[slug]">) {
  const { slug } = await params;
  const post = await loadPost(slug);
  if (!post) notFound();

  const { default: Article, meta, notes } = post;

  return (
    <main className="mx-auto w-full max-w-[1400px] flex-1 px-[7vw] py-[14vh] sm:py-[18vh]">
      <ArticleNotes notes={notes} />

      <article data-article className="mx-auto w-full max-w-4xl">
        <header data-landing>
          <p className="text-[0.7rem] font-medium tracking-[0.01em] text-foreground-soft">
            Writing
            <span className="sr-only">, published </span>
            <span aria-hidden="true"> · </span>
            <time dateTime={meta.date}>{formatPostDate(meta.date)}</time>
          </p>
          <h1 className="mt-3 ml-[-0.02em] text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.05] font-bold tracking-[-0.03em] text-balance">
            {meta.title}
          </h1>
          <p className="mt-4 text-[clamp(1.05rem,1.4vw,1.25rem)] leading-snug text-balance text-foreground-soft">
            {meta.deck}
          </p>
        </header>

        <Article />
      </article>
    </main>
  );
}
