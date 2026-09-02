import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleNotes } from "@/components/writing/article-notes";
import { PostFooter } from "@/components/writing/post-footer";
import { WritingNav } from "@/components/writing/writing-nav";
import { formatPostMonth, loadPost, SLUGS } from "@/lib/writing/posts";
import { ACCENT_PROSE, ANNOTATION, PAGE_HEADING } from "@/lib/type";

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

  const card = {
    url: `/writing/og/${slug}.png`,
    width: 1200,
    height: 630,
    alt: `${post.meta.title} — ${post.meta.deck}`,
  };

  return {
    title: post.meta.title,
    description: post.meta.deck,
    alternates: { canonical: `/writing/${slug}` },
    openGraph: {
      type: "article",
      url: `/writing/${slug}`,
      title: post.meta.title,
      description: post.meta.deck,
      publishedTime: post.meta.date,
      images: [card],
    },
    twitter: {
      card: "summary_large_image",
      title: post.meta.title,
      description: post.meta.deck,
      images: [card],
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
    <>
      <WritingNav />

      <main className="mx-auto w-full max-w-[1400px] flex-1 px-[7vw] pt-[9vh] pb-[14vh] sm:pt-[12vh]">
        <ArticleNotes title={meta.title} notes={notes} />

        <article data-article className="mx-auto w-full max-w-5xl">
          <header className="mb-12">
            <p data-quiet className={`${ANNOTATION} text-foreground/35`}>
              <span className="sr-only">Published </span>
              <time dateTime={meta.date}>{formatPostMonth(meta.date)}</time>
            </p>
            <h1 className={`mt-3 ${PAGE_HEADING}`}>{meta.title}</h1>
            <p className={`mt-4 ${ACCENT_PROSE}`}>{meta.deck}</p>
          </header>

          <Article />

          <PostFooter />

          <div data-article-end aria-hidden="true" className="h-px" />
        </article>
      </main>
    </>
  );
}
