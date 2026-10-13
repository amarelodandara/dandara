import Link from "next/link";
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

export default async function Home() {
  const writing = await loadWritingList();

  return (
    <main className="flex-1 pt-[9vh] pb-[14vh] sm:pt-[12vh] sm:pb-[18vh]">
      <PersonSchema />

      <div className="mx-auto w-full max-w-[1400px] px-[7vw]">
        <div data-landing>
          <header className="grid grid-cols-1 gap-12 md:grid-cols-2">
            <div className="flex flex-col gap-20 md:h-full md:justify-between md:gap-24">
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
                  className={`mt-2 flex flex-wrap gap-x-5 gap-y-1 ${LABEL} text-graphite-700`}
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

            <div className="flex flex-col gap-20 md:h-full md:justify-between md:gap-24">
              <div data-appear="3" className="h-fit">
                <blockquote className={ACCENT_PROSE}>
                  The role of the designer is that of a good, thoughtful host
                  anticipating the needs of his guests.
                </blockquote>
                <p className={`mt-2 ${LABEL} text-graphite-700`}>
                  Charles Eames
                </p>
              </div>

              <div data-appear="4" className={`h-fit space-y-5 ${PROSE}`}>
                <p>
                  I am a designer with 5+ years of experience. I have designed
                  for companies, for myself, for other people. I have designed
                  with Figma, with code, with my bare hands and with very weird
                  materials during my Graphic Design degree.
                </p>
                <p>
                  Most of my professional experience has been designing software
                  for credit card machines, at{" "}
                  <a
                    href="https://www.stone.com.br/"
                    className={LINK_UNDERLINED}
                  >
                    Stone
                  </a>
                  . You probably have a lot of questions about what that means —
                  don&rsquo;t be afraid to ask, I enjoy talking about it.
                </p>
                <p>
                  More than a designer, I am a human: a human who rides
                  motorcycles, models for friends&rsquo; brands and gets paid in
                  tattoos, desperately hopes to get a Pantone shade named after
                  her someday, and absolutely treasures her girlfriend, Jade.
                </p>
              </div>
            </div>
          </header>
        </div>

        <section className="mt-[18vh] grid grid-cols-1 gap-12 md:grid-cols-2">
          <div className="md:col-start-2">
            <h2 className={`${ANNOTATION} leading-none text-graphite-700`}>
              Experience
            </h2>

            <ExperienceList className="mt-6 md:mt-8" />

            <h2
              className={`mt-16 ${ANNOTATION} leading-none text-graphite-700 md:mt-20`}
            >
              Writing
            </h2>

            <ul className="mt-6 space-y-2 md:mt-8">
              {writing
                .slice(0, HOME_WRITING)
                .map(({ key, title, href, venue }) => (
                  <li key={key}>
                    <h3 className={SECTION_HEADING}>
                      {venue ? (
                        <a href={href} className={LINK}>
                          {title}
                          <span
                            className={`ml-2.5 inline-block ${ANNOTATION} text-graphite-500`}
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

            <Link
              href="/writing"
              className={`mt-2 inline-block ${LABEL} text-graphite-700 ${LINK}`}
            >
              All writing
            </Link>
          </div>
        </section>
      </div>

      <div id="work" className="mt-[18vh]">
        <Exhibition room="main" label="Selected work" featured />
      </div>
    </main>
  );
}
