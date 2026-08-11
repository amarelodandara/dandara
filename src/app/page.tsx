export default function Home() {
  return (
    <main className="flex-1 px-[7vw] py-[14vh] sm:py-[18vh]">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-y-16 md:grid-cols-12 md:gap-x-[6%] md:gap-y-0">
        {/* Title block — the vinyl lettering on the left of the wall. */}
        <header className="md:col-span-5">
          <h1 className="text-[clamp(3.25rem,8vw,7.5rem)] font-bold leading-[0.95] tracking-[-0.035em]">
            Nicoly
            <br />
            Dandara
          </h1>
          <p className="mt-[0.35em] text-[clamp(1.5rem,3.2vw,3rem)] font-semibold leading-[1.05] tracking-[-0.02em]">
            Product Designer
          </p>

          <div className="mt-16 md:mt-24">
            <p className="text-[0.7rem] font-medium tracking-[0.01em] text-ink-soft">
              Personal work
            </p>
            <ul className="mt-2 text-[1.05rem] font-semibold leading-tight space-y-2">
              <li>
                In Service of Museums,{" "}
                <span className="font-normal">an academic research</span>
              </li>
              <li className="flex flex-wrap gap-x-2">
                {["links amarelos", "ondas amarelas", "hyperlinks"].map(
                  (label, i, all) => (
                    <span key={label}>
                      <a
                        href="https://linksamarelos.com"
                        className="underline decoration-[0.06em] underline-offset-[0.25em] transition-opacity hover:opacity-50"
                      >
                        {label}
                      </a>
                      {i < all.length - 1 && ","}
                    </span>
                  ),
                )}
              </li>
            </ul>

            <p className="mt-8 text-[0.7rem] font-medium tracking-[0.01em] text-ink-soft">
              Find me
            </p>
            <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-[0.85rem]">
              {[
                { label: "Email", href: "mailto:nicolysantos51@gmail.com" },
                { label: "LinkedIn", href: "#" },
                { label: "Twitter", href: "#" },
                { label: "Bluesky", href: "#" },
                { label: "GitHub", href: "https://github.com/amarelodandara" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="underline decoration-[0.06em] underline-offset-[0.25em] transition-opacity hover:opacity-50"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </header>

        {/* Wall text — quote, then the exhibition copy. */}
        <div className="max-w-[46ch] md:col-span-6 md:col-start-7">
          <blockquote className="text-[clamp(1.15rem,1.7vw,1.4rem)] font-medium italic leading-[1.32] tracking-[-0.01em]">
            The role of the designer is that of a good, thoughtful host
            anticipating the needs of his guests.
          </blockquote>
          <p className="mt-4 text-[0.85rem] text-ink-soft">Charles Eames</p>

          <div className="mt-10 space-y-5 text-[clamp(0.95rem,1.15vw,1.0625rem)] leading-[1.5]">
            <p>
              I design and build interfaces. Most of my work sits in the seam
              between the two disciplines — close enough to the type and the
              spacing to be opinionated about them, close enough to the code to
              ship the result myself rather than hand it over.
            </p>
            <p>
              The work here spans product interfaces, design systems, and the
              occasional editorial piece. Recurring concerns: restraint over
              decoration, typography carrying the hierarchy instead of colour,
              and layouts that hold their composure from a phone to a wide
              display.
            </p>
            <p>
              Recently: a component library rebuilt around a single type scale,
              a marketing site that loads in under a second on a cold cache, and
              a long-running experiment in how little chrome an application can
              survive with.
            </p>
            <p className="text-ink-soft">
              All work shown is my own unless stated otherwise.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
