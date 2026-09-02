import Image from "next/image";
import Link from "next/link";
import { LINK, LINK_UNDERLINED } from "@/components/link";
import { Sheet } from "@/components/sheet";
import { WorkPile } from "@/components/work-pile";
import { FIND_ME } from "@/content/socials";
import { UPCOMING } from "@/content/upcoming";
import { loadPostList } from "@/lib/writing/posts";
import {
  ACCENT_PROSE,
  ANNOTATION,
  LABEL,
  PAGE_HEADING,
  PROSE,
  SECTION_HEADING,
  STRONG,
  TITLE,
} from "@/lib/type";

const WORK_MEDIA = "pointer-events-none h-auto w-full select-none";
const WORK_SIZES = "(min-width: 1024px) 26rem, (min-width: 480px) 44vw, 88vw";

const PERSONAL_WORK: { title: string; href?: string; blurb: string }[] = [
  {
    title: "In Service of Museums",
    blurb: "academic thesis about service design in museology",
  },
  {
    title: "links amarelos",
    href: "https://linksamarelos.com",
    blurb: "a curated newsletter",
  },
  {
    title: "ondas amarelas",
    href: "https://open.spotify.com/show/043Gs7eyY2KOlotEWSTSxB",
    blurb: "a curated podcast",
  },
  {
    title: "hyperlinks amarelos",
    blurb: "an essay podcast",
  },
  {
    title: "crayola",
    blurb: "a remotion tool to create yellow assets",
  },
];

export default async function Home() {
  const writing = await loadPostList();

  return (
    <main className="mx-auto w-full max-w-[1400px] flex-1 px-[7vw] py-[14vh] sm:py-[18vh]">
      <div data-dim-on-focus data-landing>
        <header className="grid grid-cols-1 gap-12 md:grid-cols-2">
          <div className="flex flex-col gap-20 md:h-full md:justify-between md:gap-24">
            <div className="h-fit">
              <h1 className={PAGE_HEADING}>Dandara</h1>
              <p className={`mt-[0.08em] ${PAGE_HEADING}`}>Product Design</p>
            </div>

            <div className="h-fit">
              <h2 className={`${ANNOTATION} text-foreground-soft`}>
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

              <h2 className={`mt-8 ${ANNOTATION} text-foreground-soft`}>
                Find me
              </h2>
              <ul className={`mt-2 flex flex-wrap gap-x-5 gap-y-1 ${LABEL}`}>
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
            <div className="h-fit">
              <blockquote className={ACCENT_PROSE}>
                The role of the designer is that of a good, thoughtful host
                anticipating the needs of his guests.
              </blockquote>
              <p className={`mt-2 ${LABEL}`}>Charles Eames</p>
            </div>

            <div className={`h-fit space-y-5 ${PROSE}`}>
              <p>
                I am a designer with 5+ years of experience. I have designed for
                companies, for myself, for other people. I have designed with
                Figma, with code, with my bare hands and with very weird
                materials during my Graphic Design degree.
              </p>
              <p>
                Most of my professional experience has been designing software
                for credit card machines, at{" "}
                <a href="https://www.stone.com.br/" className={LINK_UNDERLINED}>
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

      <section
        data-dim-on-focus
        className="mt-[18vh] grid grid-cols-1 gap-12 md:grid-cols-2"
      >
        <div className="md:col-start-2">
          <h2 className={`${ANNOTATION} leading-none text-foreground-soft`}>
            Writing
          </h2>

          <ul className="mt-6 space-y-2 md:mt-8">
            {writing.map(({ slug, meta }) => (
              <li key={slug}>
                <h3 className={SECTION_HEADING}>
                  <Link href={`/writing/${slug}`} className={LINK}>
                    {meta.title}
                  </Link>
                </h3>
              </li>
            ))}

            {UPCOMING.map(({ title }) => (
              <li key={title}>
                <h3
                  className={`flex items-baseline gap-2.5 ${SECTION_HEADING} text-foreground-soft/60`}
                >
                  {title}
                  <span
                    className={`shrink-0 ${ANNOTATION} text-foreground-soft/60`}
                  >
                    soon
                  </span>
                </h3>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <WorkPile>
        <Sheet
          id="in-service-of-museums"
          kind="personal"
          title="In Service of Museums"
          size="wide"
          eyebrow="Graphic Design thesis · UEMG"
          link={{
            href: "https://servico-museu.vercel.app",
            label: "servico-museu.vercel.app",
          }}
          front={
            <video
              aria-label="A screen recording of the In Service of Museums site: a long scrolling essay on service design in museums, set in wide measure on white."
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              className={`${WORK_MEDIA} aspect-video`}
            >
              <source
                src="/work/servico-museu.av1.mp4"
                type='video/mp4; codecs="av01.0.09M.08"'
              />
              <source src="/work/servico-museu.mp4" type="video/mp4" />
            </video>
          }
        >
          <p className="mt-3">
            A service design framework for museum user experience: what the
            visit asks of a visitor before, during and after the room, and where
            the institution keeps dropping its half of the exchange. Published
            as a site rather than a PDF, so the research reads the way it argues
            things should be read.
          </p>
        </Sheet>

        <Sheet
          id="museu-mark"
          kind="personal"
          title="Museum mark"
          eyebrow="Research icon"
          link={{
            href: "https://servico-museu.vercel.app",
            label: "servico-museu.vercel.app",
          }}
          front={
            <video
              aria-label="The mark for In Service of Museums: a white gallery frame holding a grainy field of blue and yellow that rises and settles like a slow wave."
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              className={`${WORK_MEDIA} aspect-square`}
            >
              <source src="/work/museu-mark.mp4" type="video/mp4" />
            </video>
          }
        />

        <Sheet
          id="stone"
          kind="professional"
          title="Stone Co. Product Designer"
          size="wide"
          eyebrow="2022 — 2026"
          frontKind="words"
          front={
            <ul className={TITLE}>
              {[
                "Improvement of Activation flow",
                "Improvement of Cancelation application",
                "Improvement of Reports application",
                "Automation structure of News app",
                "Self-servic of supplies",
                "Pix NFC launch",
                "Homolog and design of new devices",
                "Redesign of Pre-Authorization app",
                "Launch of the App Store",
                "System updates to devices",
                "Launch of the Ticketing app",
              ].map((app) => (
                <li key={app}>{app}</li>
              ))}
            </ul>
          }
        />

        <Sheet
          id="stone-talk"
          kind="professional"
          title="Stone Co., on stage"
          eyebrow="Presenting the Store on stage"
          size="wide"
          front={
            <Image
              src="/work/stone-talk.jpg"
              alt="Nicoly Dandara speaking into a microphone beside a projected slide of a Stone payment terminal running the app store."
              width={3024}
              height={4032}
              sizes={WORK_SIZES}
              draggable={false}
              className={WORK_MEDIA}
            />
          }
        >
          <p className={`mt-3 ${ANNOTATION} text-foreground-soft`}>
            Presenting the Stone Terminal Store
          </p>
        </Sheet>

        <Sheet
          id="links-amarelos"
          kind="personal"
          title="links amarelos"
          size="feature"
          eyebrow="linksamarelos.com"
          link={{
            href: "https://linksamarelos.com",
            label: "linksamarelos.com",
          }}
          front={
            <video
              aria-label="A screen recording of the links amarelos site: a yellow page promising monthly recommendations of texts, books, documentaries and things with no taxonomy yet."
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              className={`${WORK_MEDIA} aspect-video`}
            >
              <source
                src="/work/links-amarelos.av1.mp4"
                type='video/mp4; codecs="av01.0.12M.08"'
              />
              <source src="/work/links-amarelos.mp4" type="video/mp4" />
            </video>
          }
        />

        <Sheet
          id="ondas-amarelas"
          kind="personal"
          title="ondas amarelas"
          eyebrow="Monthly curated podcast"
          link={{
            href: "https://open.spotify.com/show/043Gs7eyY2KOlotEWSTSxB?si=651fe644a3234022",
            label: "Listen on Spotify",
          }}
          front={
            <Image
              src="/work/ondas-amarelas.png"
              alt="Cover art for the ondas amarelas podcast: the title set in heavy type over a field of yellow ripples."
              width={2000}
              height={2000}
              sizes={WORK_SIZES}
              draggable={false}
              className={WORK_MEDIA}
            />
          }
        />

        <Sheet
          id="ondas-amarelas-episode"
          kind="personal"
          title="ondas amarelas, episode three"
          eyebrow="Monthly curated podcast"
          front={
            <Image
              src="/work/ondas-amarelas-episode.png"
              alt="Episode cover for ondas amarelas number three: a figure falling through a close-up of the sun, on yellow."
              width={1000}
              height={1000}
              sizes={WORK_SIZES}
              draggable={false}
              className={WORK_MEDIA}
            />
          }
        />

        <Sheet
          id="obsidian-graph"
          kind="personal"
          title="Obsidian graph"
          size="wide"
          eyebrow="Personal Obsidian graph"
          front={
            <Image
              src="/work/obsidian-graph.png"
              alt="The graph view of a personal Obsidian vault: thousands of notes as pale dots, linked into one dense sphere with a few bright hubs."
              width={2000}
              height={1446}
              sizes={WORK_SIZES}
              draggable={false}
              className={WORK_MEDIA}
            />
          }
        />
      </WorkPile>
    </main>
  );
}
