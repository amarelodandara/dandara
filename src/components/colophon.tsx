/**
 * The wall label, and the last thing on every page. It borrows a museum
 * caption's exact running order — maker, then role, then the work with its
 * date, then what it is made of, then the credit line — and the joke only
 * lands if the materials are read as flatly as glass and steel would be.
 *
 * The type is the landing page's, scaled down: the name takes the h1's weight
 * and tracking, the role takes the subtitle's, the work line takes the
 * personal-work list's semibold-with-a-normal-tail, and the credit takes the
 * small section-label treatment.
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
        className="ml-auto max-w-[30rem] rounded-sm border border-foreground/12 bg-white px-6 py-6 md:px-8 md:py-7"
      >
        <p className="text-[clamp(1.5rem,3.2vw,2rem)] font-bold leading-[0.95] tracking-[-0.035em]">
          Nicoly Dandara
        </p>
        <p className="mt-[0.35em] text-[0.95rem] font-semibold leading-[1.05] tracking-[-0.02em]">
          Product Designer, working in the open
        </p>

        <p className="mt-6 text-[1.05rem] font-semibold leading-tight">
          Amarelo Dandara{" "}
          <span className="font-normal text-foreground-soft">2026 —</span>
        </p>
        <p className="mt-2 text-[0.85rem] leading-[1.45] text-foreground-soft">
          Next.js, React, and TypeScript; Tailwind over a hand-written cascade;
          Inter Variable, self-hosted and fully featured; one flat colour per
          sheet; and rather more restraint than was comfortable.
        </p>

        <p className="mt-6 text-[0.7rem] font-medium tracking-[0.01em] text-foreground-soft">
          Courtesy the designer
        </p>
      </div>
    </footer>
  );
}
