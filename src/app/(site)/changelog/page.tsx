import type { Metadata } from "next";
import { INLINE_CODE } from "@/components/code";
import { PostFooter } from "@/components/writing/post-footer";
import { WritingNav } from "@/components/writing/writing-nav";
import {
  loadChangelog,
  type Area,
  type ChangeGroup,
  type Run,
} from "@/lib/changelog";
import { CARD, NAME } from "@/lib/site";
import { ANNOTATION, PAGE_HEADING, PROSE, STRONG, TITLE } from "@/lib/type";

const AREA_TAG = `mr-2 inline-block rounded-sm px-1.5 py-1 align-[0.1em] ${ANNOTATION} leading-none`;

const AREA_COLOR: Record<Area, string> = {
  Home: "bg-area-home text-area-home-ink",
  Work: "bg-area-work text-area-work-ink",
  Blog: "bg-area-blog text-area-blog-ink",
  "Gift shop": "bg-area-shop text-area-shop-ink",
  "Site-wide": "bg-area-site text-area-site-ink",
};

const description = "What changed on the site, week by week.";

export const metadata: Metadata = {
  title: "Changelog",
  description,
  alternates: { canonical: "/changelog" },
  robots: { index: false, follow: false },
  openGraph: {
    type: "website",
    url: "/changelog",
    siteName: NAME,
    locale: "en_US",
    title: "Changelog",
    description,
    images: [CARD],
  },
  twitter: { title: "Changelog", description, images: [CARD] },
};

function Line({ runs }: { runs: Run[] }) {
  return runs.map((run, index) => {
    const key = `${index}-${run.kind}`;
    if (run.kind === "strong") {
      return (
        <strong key={key} className={STRONG}>
          {run.text}
        </strong>
      );
    }
    if (run.kind === "code") {
      return (
        <code key={key} className={INLINE_CODE}>
          {run.text}
        </code>
      );
    }
    return run.text;
  });
}

function Group({ title, items }: ChangeGroup) {
  return (
    <div className="mt-6">
      <h3 className={TITLE}>{title}</h3>
      <ul
        className={`mt-3 list-disc space-y-2 pl-5 ${PROSE} marker:text-graphite-400`}
      >
        {items.map(({ area, runs }, index) => (
          <li key={`${title}-${index}`} className="leading-relaxed">
            <span className={`${AREA_TAG} ${AREA_COLOR[area]}`}>{area}</span>
            <Line runs={runs} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default async function ChangelogPage() {
  const { weeks } = await loadChangelog();

  return (
    <>
      <WritingNav />

      <main className="mx-auto w-full max-w-[1400px] flex-1 px-[7vw] pt-[9vh] sm:pt-[12vh]">
        <div data-landing className="mx-auto w-full max-w-2xl">
          <h1 className={PAGE_HEADING}>Changelog</h1>

          {weeks.map((week) => (
            <section
              key={week.id}
              id={week.id}
              aria-labelledby={`${week.id}-heading`}
              className="mt-16 scroll-mt-8"
            >
              <h2
                id={`${week.id}-heading`}
                className={`${ANNOTATION} leading-none text-graphite-700`}
              >
                {week.title}
              </h2>

              {week.groups.map((group) => (
                <Group key={group.title} {...group} />
              ))}
            </section>
          ))}
        </div>
      </main>

      <div className="mx-auto w-full max-w-[1400px] px-[7vw] pb-[10vh]">
        <div className="mx-auto w-full max-w-2xl">
          <PostFooter />
        </div>
      </div>
    </>
  );
}
