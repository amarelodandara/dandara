import Link from "next/link";
import { BadgeHover } from "@/badges/hover";
import { badgesFor } from "@/badges/pick";
import { Exhibition } from "@/components/exhibition";
import { LINK, LINK_UNDERLINED } from "@/components/link";
import { PersonSchema } from "@/components/person-schema";
import { ExperienceList } from "@/components/experience-list";
import { FIND_ME } from "@/content/socials";
import { loadWritingList } from "@/lib/writing/posts";
import {
  ACCENT_PROSE,
  ANNOTATION,
  LABEL,
  PAGE_HEADING,
  PROSE,
  SECTION_HEADING,
  STRONG,
} from "@/lib/type";

const HOME_WRITING = 3;

const MUSEUMS = {
  href: "https://servico-museu.vercel.app",
  label: "servico-museu.vercel.app",
};

const PERSONAL_WORK: { title: string; href?: string; blurb: string }[] = [
  {
    title: "in service of museums",
    href: MUSEUMS.href,
    blurb: "academic thesis",
  },
  {
    title: "linksamarelos.com",
    href: "https://linksamarelos.com",
    blurb: "a curated website",
  },
  {
    title: "ondas amarelas",
    href: "https://open.spotify.com/show/043Gs7eyY2KOlotEWSTSxB",
    blurb: "a curated podcast",
  },
];

function SectionLink({ href, name }: { href: string; name: string }) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-0.5 ${LINK}`}
    >
      {name}
      <svg
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
        className="size-3 -translate-x-1 opacity-0 transition-[opacity,translate] duration-(--motion-quick) ease-out-strong group-focus-visible:translate-x-0 group-focus-visible:opacity-100 motion-reduce:transition-none max-md:translate-x-0 max-md:opacity-100 can-hover:group-hover:translate-x-0 can-hover:group-hover:opacity-100"
      >
        <path
          d="M6 3.5 10.5 8 6 12.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Link>
  );
}

export default async function Home() {
  const writing = await loadWritingList();

  return (
    <main className="flex-1 pt-[9vh] sm:pt-[12vh] md:pb-[12vh]">
      <PersonSchema />

      <div className="mx-auto w-full max-w-[1400px] px-[7vw]">
        <div data-landing>
          <header className="grid grid-cols-1 gap-[18vh] md:grid-cols-2 md:gap-12">
            <div className="flex flex-col gap-[18vh] md:h-full md:justify-between">
              <div data-appear="1" className="h-fit">
                <h1 className={PAGE_HEADING}>Dandara</h1>
                <p className={`mt-[0.08em] ${PAGE_HEADING}`}>Product Design</p>
              </div>

              <div data-appear="2" className="h-fit">
                <h2 className={`${ANNOTATION} text-graphite-700`}>
                  Personal work
                </h2>
                <ul className={`mt-2 space-y-1 ${PROSE}`}>
                  {PERSONAL_WORK.map(({ title, href, blurb }) => (
                    <li key={title}>
                      <strong className={STRONG}>
                        {href ? (
                          <a href={href} className={LINK_UNDERLINED}>
                            {title}
                          </a>
                        ) : (
                          title
                        )}
                      </strong>
                      , {blurb}
                    </li>
                  ))}
                </ul>

                <div className="mt-8 flex items-center gap-2">
                  <h2 className={`${ANNOTATION} text-graphite-700`}>Find me</h2>
                  <span
                    className={`rounded-sm bg-cadmium-100 px-1.5 py-1 leading-none ${ANNOTATION} text-cadmium-900`}
                  >
                    Open for work
                  </span>
                </div>
                <ul
                  className={`mt-2 flex flex-wrap gap-x-4 gap-y-1 ${LABEL} text-graphite-700`}
                >
                  {FIND_ME.map(({ label, href }) => (
                    <li key={label}>
                      <a href={href} className={LINK}>
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex flex-col gap-16 md:h-full md:justify-between md:gap-[18vh]">
              <div data-appear="3" className="h-fit">
                <blockquote className={ACCENT_PROSE}>
                  The role of the designer is that of a good, thoughtful host
                  anticipating the needs of his guests.
                </blockquote>
                <p className={`mt-2 ${LABEL} text-graphite-700`}>
                  Charles Eames
                </p>
              </div>

              <div
                data-appear="4"
                className={`h-fit space-y-4 text-pretty ${PROSE} max-md:leading-relaxed`}
              >
                <p>
                  I am a designer with 5+ years of experience. I designed
                  software for credit card machines at Brazil&rsquo;s biggest
                  acquirer,{" "}
                  <a
                    href="https://www.stone.com.br/"
                    className={LINK_UNDERLINED}
                  >
                    Stone
                  </a>
                  , and you probably have a lot of questions about what that
                  means — don&rsquo;t be afraid to ask, I love to talk about it.
                </p>
                <p>
                  More than a designer I am a human. I love riding my
                  motorcycle, absolutely treasure my girlfriend Jade, am a
                  museology enthusiast and will surely get a shade of yellow
                  named after me.
                </p>
              </div>
            </div>
          </header>
        </div>

        <section className="mt-[18vh] grid grid-cols-1 gap-12 md:grid-cols-2">
          <div className="md:col-start-2">
            <h2 className={`${ANNOTATION} leading-none text-graphite-700`}>
              <SectionLink href="/work" name="Experience" />
            </h2>

            <ExperienceList className="mt-6 md:mt-8" />

            <h2
              className={`mt-16 ${ANNOTATION} leading-none text-graphite-700`}
            >
              <SectionLink href="/writing" name="Writing" />
            </h2>

            <BadgeHover badges={badgesFor(writing.slice(0, HOME_WRITING))}>
              <ul className="mt-6 space-y-2 md:mt-8">
                {writing
                  .slice(0, HOME_WRITING)
                  .map(({ key, title, href, venue, badge }) => (
                    <li key={key} data-badge={badge}>
                      <h3 className={SECTION_HEADING}>
                        {venue ? (
                          <a href={href} className={LINK}>
                            {title}
                            <span
                              className={`ml-2.5 inline-block ${ANNOTATION} text-graphite-600 max-md:hidden`}
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
                    </li>
                  ))}
              </ul>
            </BadgeHover>
          </div>
        </section>
      </div>

      <div id="work" className="mt-[18vh]">
        <Exhibition room="main" label="Work" featured />
      </div>
    </main>
  );
}
