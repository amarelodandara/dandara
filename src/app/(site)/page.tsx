import Image from "next/image";
import { Sheet } from "@/components/sheet";
import { WorkPile } from "@/components/work-pile";

const LINK = [
  "decoration-stone-400 decoration-[0.04em] underline-offset-[0.25em]",
  "transition-opacity duration-(--motion-quick) ease-out-strong",
  "hover:underline hover:opacity-50",
  "focus-visible:underline active:underline",
].join(" ");

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
    href: "#",
    blurb: "an essay podcast",
  },
  {
    title: "crayola",
    blurb: "a remotion tool to create yellow assets",
  },
];

const FIND_ME: { label: string; href: string }[] = [
  { label: "Email", href: "mailto:nicolydndr@gmail.com" },
  { label: "LinkedIn", href: "https://linkedin.com/in/nicolydandara" },
  { label: "Twitter", href: "#" },
  { label: "Bluesky", href: "#" },
  { label: "GitHub", href: "https://github.com/amarelodandara" },
];

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-[1400px] flex-1 px-[7vw] py-[14vh] sm:py-[18vh]">
      <div
        data-dim-on-focus
        data-landing
        className=""
      >
        <header className="grid grid-cols-1 gap-12 md:grid-cols-2">
          <div className="flex flex-col gap-12 md:h-full md:justify-between md:gap-0">
            <div className="h-fit">
            <h1 className="ml-[-0.025em] text-[clamp(3.25rem,8vw,7.5rem)] leading-[0.95] font-bold tracking-[-0.035em]">
              Dandara
            </h1>
            <p className="mt-[0.35em] text-[1.05rem] leading-tight font-semibold">
              Product Designer
              </p>
            </div>

            <div className="h-fit">
            <p className="text-[0.7rem] font-medium tracking-[0.01em] text-foreground-soft">
              Personal work
            </p>
            <ul className="mt-2 space-y-2 text-[1.05rem] leading-tight font-semibold">
              {PERSONAL_WORK.map(({ title, href, blurb }) => (
                <li key={title}>
                  {href ? (
                    <a href={href} className={LINK}>
                      {title}
                    </a>
                  ) : (
                    title
                  )}
                  , <span className="font-normal">{blurb}</span>
                </li>
              ))}
            </ul>

            <p className="mt-8 text-[0.7rem] font-medium tracking-[0.01em] text-foreground-soft">
              Find me
            </p>
            <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-[0.85rem]">
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

          <div className="">
            <blockquote className="text-[clamp(0.95rem,1.15vw,1.0625rem)] leading-[1.32] tracking-[-0.01em] text-balance text-foreground-soft">
              The role of the designer is that of a good, thoughtful host
              anticipating the needs of his guests.
            </blockquote>
            <p className="mt-2 text-[0.85rem] text-foreground-soft">Charles Eames</p>

            <div className="mt-10 space-y-5 text-[clamp(0.95rem,1.15vw,1.0625rem)] leading-normal">
              <p>
                I am a designer with 5+ years of experience. I have designed for
                companies, for myself, for other people. I have designed with
                Figma, with code, with my bare hands and with very weird
                materials during my Graphic Design degree.
              </p>
              <p>
                Most of my professional experience has been designing software
                for credit card machines. You probably have a lot of questions
                about what that means — don&rsquo;t be afraid to ask, I enjoy
                talking about it.
              </p>
              <p>
                More than a designer, I am a human: a human who rides
                motorcycles, models for friends&rsquo; brands and gets paid in
                tattoos, desperately hopes to get a Pantone shade named after her
                someday, and absolutely treasures her girlfriend, Jade.
              </p>
              <p className="text-[0.85rem] text-foreground-soft">
                All work shown is my own unless stated otherwise.
              </p>
            </div>
          </div>
        </header>

      </div>

      <WorkPile>
        <Sheet id="stone" kind="professional" title="Stone Co." size="wide">
          <p className="text-[0.7rem] text-foreground-soft">2022 — 2026</p>
          <h3 className="mt-1 text-[1.05rem] font-semibold">Stone Co.</h3>
          <ul className="mt-3 text-[0.9rem] leading-normal font-semibold">
            {[
              "Activation Flow",
              "Cancelation",
              "Closing",
              "News",
              "Paper Roll Orders",
              "Payment",
              "Pix and Pix NFC",
              "Pre-Authorization",
              "Receipts",
              "Sales Reports",
              "Sales Simulation",
              "Store",
              "System Launcher",
              "Tickets",
            ].map((app) => (
              <li key={app}>{app}</li>
            ))}
          </ul>
        </Sheet>

        <Sheet
          id="stone-talk"
          kind="professional"
          title="Stone Co., on stage"
          size="wide"
        >
          <Image
            src="/work/stone-talk.jpg"
            alt="Nicoly Dandara speaking into a microphone beside a projected slide of a Stone payment terminal running the app store."
            width={3024}
            height={4032}
            sizes="(min-width: 768px) 24rem, 88vw"
            draggable={false}
            className="pointer-events-none clear-right mt-6 h-auto w-full select-none"
          />
          <p className="mt-3 text-[0.7rem] text-foreground-soft">
            Presenting the Stone Terminal Store
          </p>
        </Sheet>

        <Sheet
          id="in-service-of-museums"
          kind="personal"
          title="In Service of Museums"
          size="wide"
        >
          <p className="text-[0.7rem] text-foreground-soft">
            Graphic Design thesis · UEMG
          </p>
          <h3 className="mt-1 text-[1.05rem] font-semibold">
            In Service of Museums
          </h3>
          <video
            src="/work/in-service-of-museums.mp4"
            aria-label="A screen recording of the In Service of Museums thesis work."
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="pointer-events-none clear-right mt-6 aspect-1956/1322 h-auto w-full select-none"
          />
          <p className="mt-3">
            A service design framework for museum user experience: what the
            visit asks of a visitor before, during and after the room, and where
            the institution keeps dropping its half of the exchange.
          </p>
        </Sheet>

        <Sheet
          id="links-amarelos"
          kind="personal"
          title="links amarelos"
          size="feature"
        >
          <p className="text-[0.7rem] text-foreground-soft">Monthly newsletter</p>
          <h3 className="mt-1 text-[1.05rem] font-semibold">links amarelos</h3>
          <video
            src="/work/links-amarelos.mp4"
            aria-label="A screen recording of the links amarelos site: a yellow page promising monthly recommendations of texts, books, documentaries and things with no taxonomy yet."
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="pointer-events-none clear-right mt-6 aspect-2166/1492 h-auto w-full select-none"
          />
          <p className="mt-3">
            <a
              href="https://linksamarelos.com"
              className="underline decoration-stone-400 decoration-[0.04em] underline-offset-[0.25em] transition-opacity duration-(--motion-quick) ease-out-strong hover:opacity-50"
            >
              linksamarelos.com
            </a>
          </p>
        </Sheet>

        <Sheet id="ondas-amarelas" kind="personal" title="ondas amarelas">
          <p className="text-[0.7rem] text-foreground-soft">Podcast cover</p>
          <h3 className="mt-1 text-[1.05rem] font-semibold">ondas amarelas</h3>
          <Image
            src="/work/ondas-amarelas.png"
            alt="Cover art for the ondas amarelas podcast: the title set in heavy type over a field of yellow ripples."
            width={2000}
            height={2000}
            sizes="(min-width: 768px) 18rem, 88vw"
            draggable={false}
            className="pointer-events-none clear-right mt-6 h-auto w-full select-none"
          />
          <p className="mt-3">
            <a
              href="https://open.spotify.com/show/043Gs7eyY2KOlotEWSTSxB?si=651fe644a3234022"
              className="underline decoration-stone-400 decoration-[0.04em] underline-offset-[0.25em] transition-opacity duration-(--motion-quick) ease-out-strong hover:opacity-50"
            >
              Listen on Spotify
            </a>
          </p>
        </Sheet>

        <Sheet
          id="ondas-amarelas-episode"
          kind="personal"
          title="ondas amarelas, episode cover"
        >
          <p className="text-[0.7rem] text-foreground-soft">Episode cover</p>
          <h3 className="mt-1 text-[1.05rem] font-semibold">ondas amarelas</h3>
          <Image
            src="/work/ondas-amarelas-episode.png"
            alt="Episode cover for ondas amarelas number three: a figure falling through a close-up of the sun, on yellow."
            width={1000}
            height={1000}
            sizes="(min-width: 768px) 18rem, 88vw"
            draggable={false}
            className="pointer-events-none clear-right mt-6 h-auto w-full select-none"
          />
        </Sheet>

        <Sheet
          id="obsidian-graph"
          kind="personal"
          title="Obsidian graph"
          size="wide"
        >
          <p className="text-[0.7rem] text-foreground-soft">Notes</p>
          <h3 className="mt-1 text-[1.05rem] font-semibold">Obsidian graph</h3>
          <Image
            src="/work/obsidian-graph.png"
            alt="The graph view of a personal Obsidian vault: thousands of notes as pale dots, linked into one dense sphere with a few bright hubs."
            width={2000}
            height={1446}
            sizes="(min-width: 768px) 24rem, 88vw"
            draggable={false}
            className="pointer-events-none clear-right mt-6 h-auto w-full select-none"
          />
        </Sheet>
      </WorkPile>
    </main>
  );
}
