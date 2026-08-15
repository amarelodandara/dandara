export function Colophon() {
  return (
    <footer
      data-dim-on-focus
      className="mx-auto w-full max-w-[1400px] px-[7vw] pt-[6vh] pb-[10vh]"
    >
      <div
        data-colophon
        className="ml-auto max-w-120 rounded-sm bg-white px-6 py-10 md:px-8 md:py-12"
      >
        <p className="text-[clamp(1.15rem,2.2vw,1.5rem)] leading-[0.95] font-bold tracking-[-0.03em]">
          Amarelo Dandara
        </p>

        <p className="mt-5 text-[1.05rem] leading-tight font-semibold">
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
