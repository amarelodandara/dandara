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
          <p className="text-xl font-bold lowercase">Amarelo Dandara</p>
          <p className="text-sm text-foreground-soft">🇧🇷, born 2002</p>
        </div>

        <div>
          <p className="text-lg font-semibold">
            Portfolio
            <span className="ml-2 text-sm font-normal">2026 —</span>
          </p>

          <p className="mt-2 text-[0.85rem] leading-[1.7] text-foreground-soft">
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
