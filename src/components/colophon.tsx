/**
 * The wall label, and the last thing on every page. It borrows a museum
 * caption's running order — maker, then the work with its date, then what it
 * is made of — and the joke only lands if the materials are read as flatly as
 * glass and steel would be.
 *
 * The type is the landing page's, scaled down: the maker takes the h1's weight
 * and tracking, and the work line takes the personal-work list's
 * semibold-with-a-normal-tail.
 *
 * Kept honest on purpose: everything in the materials line is genuinely in
 * this repository. It stops being funny the moment it starts being a claim.
 */
export function Colophon() {
  return (
    <footer
      data-dim-on-focus
      className="mx-auto w-full max-w-[1400px] px-[7vw] pb-[10vh] pt-[6vh]"
    >
      <div
        data-colophon
        className="ml-auto max-w-[30rem] rounded-sm bg-amber-100 px-6 py-10 md:px-8 md:py-12"
      >
        <p className="text-[clamp(1.15rem,2.2vw,1.5rem)] font-bold leading-[0.95] tracking-[-0.03em]">
          Amarelo Dandara
        </p>

        <p className="mt-5 text-[1.05rem] font-semibold leading-tight">
          Portfolio{" "}
          <span className="font-normal text-foreground-soft">2026 —</span>
        </p>
        <p className="mt-2 text-[0.85rem] leading-[1.7] text-foreground-soft">
          Next.js, React, and TypeScript; Tailwind over a hand-written cascade;
          Inter Variable, self-hosted and fully featured; one flat colour per
          sheet; and rather more restraint than was comfortable.
        </p>
      </div>
    </footer>
  );
}
