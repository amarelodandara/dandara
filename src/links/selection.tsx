import { useEffect, useRef } from "react";
import type { Ref } from "./export";
import { LINK_UNDERLINED } from "@/components/link";
import { openOverlay, SHOP_OVERLAY } from "@/lib/exclusive-overlay";
import { ACCENT_PROSE, PROSE } from "@/lib/type";

const still = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const ARRIVES =
  "transition-[opacity,translate] duration-(--motion-enter) ease-out-strong starting:translate-y-2 starting:opacity-0 motion-reduce:transition-none";

const ENTERS =
  "transition-[opacity,translate] duration-(--motion-quick) ease-out-strong starting:translate-y-1 starting:opacity-0 motion-reduce:transition-none";

export function Selection({
  refs,
  all,
  rushing,
}: {
  refs: Ref[];
  all: boolean;
  rushing: boolean;
}) {
  const seen = useRef(refs.length);

  useEffect(() => {
    const grew = refs.length > seen.current;
    seen.current = refs.length;
    if (!grew) return;
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: rushing || still() ? "instant" : "smooth",
    });
  }, [refs.length, rushing]);

  if (refs.length === 0) return null;

  return (
    <div className="mx-auto w-full max-w-[1400px] px-[7vw] pb-[10vh]">
      <section
        data-article
        aria-label={all ? "Every reference" : "Your selection"}
        className="mx-auto w-full max-w-5xl"
      >
        <header className={`mb-12 ${ARRIVES}`}>
          <p className={ACCENT_PROSE}>
            <button
              type="button"
              onClick={() => openOverlay(SHOP_OVERLAY)}
              aria-haspopup="dialog"
              className={LINK_UNDERLINED}
            >
              Export
            </button>{" "}
            {all ? "all my references." : "your curation of my references."}
          </p>
        </header>
        <ul
          className={`list-disc pl-[1.2em] marker:text-graphite-400 ${PROSE}`}
        >
          {refs.map(({ slug, title, url, tag, by }) => (
            <li key={slug} className={`mt-3 first:mt-0 ${ENTERS}`}>
              {url ? (
                <a
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className={LINK_UNDERLINED}
                >
                  {title}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              ) : (
                <span>{tag === "quote" ? `“${title}”` : title}</span>
              )}
              {by ? <span className="text-graphite-700"> — {by}</span> : null}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
