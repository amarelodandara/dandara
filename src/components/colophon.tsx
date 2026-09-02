import { ANNOTATION, LABEL, SECTION_HEADING, TITLE } from "@/lib/type";

export function Colophon() {
  return (
    <footer
      data-dim-on-focus
      className="mx-auto w-full max-w-[1400px] px-[7vw] pt-[6vh] pb-[10vh]"
    >
      <div
        data-recessed
        className="space-y-4 ml-auto max-w-120 rounded-md bg-background px-6 py-10 md:px-8 md:py-12"
      >
        <div>
          <p className={`${SECTION_HEADING} lowercase`}>Amarelo Dandara</p>
          <p className={LABEL}>🇧🇷, born 2002</p>
        </div>

        <div>
          <p className={TITLE}>
            Portfolio
            <span className={`ml-2 ${ANNOTATION} text-foreground-soft`}>
              2026 —
            </span>
          </p>

          <p className={`mt-2 ${LABEL}`}>
            Next.js+TypeScript website hosted on Vercel.
            <br />
            Tailwind over a hand-picked color palette.
            <br />
            Claude Code dutifully listening to Agentation.
            <br />
            ESLint over ESLint keeping the slop at bay.
          </p>
        </div>
      </div>
    </footer>
  );
}
