export default function Home() {
  return (
    <main className="flex-1 px-[7vw] py-[14vh] sm:py-[18vh]">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-y-16 md:grid-cols-12 md:gap-x-[6%] md:gap-y-0">
        {/* Title block — the vinyl lettering on the left of the wall. */}
        <header className="md:col-span-5">
          <h1 className="text-[clamp(3.25rem,8vw,7.5rem)] font-extrabold leading-[0.88] tracking-[-0.035em]">
            Nicoly
            <br />
            Dandara
          </h1>
          <p className="mt-[0.35em] text-[clamp(1.5rem,3.2vw,3rem)] font-semibold leading-[1.05] tracking-[-0.02em]">
            Selected Work
          </p>

          <div className="mt-16 md:mt-24">
            <p className="text-[0.7rem] font-medium tracking-[0.01em] text-ink-soft">
              Currently
            </p>
            <p className="mt-2 text-[1.05rem] font-semibold leading-tight">
              Design Engineer
              <br />
              <span className="font-normal">Independent, São Paulo</span>
            </p>

            <p className="mt-8 text-[0.7rem] font-medium tracking-[0.01em] text-ink-soft">
              Elsewhere
            </p>
            <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-[0.85rem]">
              {[
                { label: "GitHub", href: "https://github.com/amarelodandara" },
                { label: "Email", href: "mailto:nicolysantos51@gmail.com" },
                { label: "LinkedIn", href: "#" },
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
            I would like the interface to disappear, so that what is left is the
            thing itself and the person using it.
          </blockquote>
          <p className="mt-4 text-[0.85rem] text-ink-soft">Nicoly Dandara</p>

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
            <p>All work shown is my own unless stated otherwise.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
