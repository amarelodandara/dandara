import { ANNOTATION, LABEL, SECTION_HEADING, TITLE } from "@/lib/type";

export function Colophon() {
  return (
    <footer
      data-dim-on-focus
      className="mx-auto flex w-full max-w-[1400px] justify-end px-[7vw] pt-[6vh] pb-[10vh]"
    >
      <div
        data-recessed
        className="flex w-full flex-col justify-center gap-4 rounded-md bg-cadmium-50 px-6 py-10 sm:aspect-2/1 sm:h-48 sm:w-auto sm:max-w-120 sm:py-0 md:px-8"
      >
        <div>
          <p className={`${SECTION_HEADING} lowercase`}>Amarelo Dandara</p>
          <p className={`${LABEL} text-graphite-700`}>🇧🇷, born 2002</p>
        </div>

        <div>
          <p className={TITLE}>
            Portfolio
            <span className={`ml-2 ${ANNOTATION} text-graphite-700`}>
              2026 —
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
