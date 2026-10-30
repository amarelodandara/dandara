import { useEffect, useRef, useState } from "react";
import type { Ref } from "./export";
import { LINK_UNDERLINED } from "@/components/link";
import { openOverlay, SHOP_OVERLAY } from "@/lib/exclusive-overlay";
import { ACCENT_PROSE, ANNOTATION, PROSE } from "@/lib/type";

const still = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const ARRIVES =
  "transition-[opacity,translate,filter] duration-(--motion-enter) ease-out-strong starting:translate-y-3 starting:opacity-0 starting:blur-[4px] motion-reduce:transition-opacity";

const ENTERS =
  "transition-[opacity,translate] duration-(--motion-quick) ease-out-strong starting:translate-y-1 starting:opacity-0 motion-reduce:transition-none";

const STAYS = `mt-3 first:mt-0 ${ENTERS}`;

const LATE = "delay-(--motion-quick)";

const RISES_AWAY =
  "-translate-y-3 opacity-0 blur-[4px] transition-[opacity,translate,filter] duration-(--motion-quick) ease-out-strong";

const SLOT = "col-start-1 row-start-1";

const INTRO =
  "Consume all or select the references you want to export into your notes.";

const LEAVES =
  "mt-0 opacity-0 transition-[opacity,margin] duration-(--motion-exit) ease-out-strong";

const REMOVE = `relative ml-2 inline-flex rounded-sm px-1.5 py-1 text-graphite-700 ${ANNOTATION} leading-none transition-[background-color,color,opacity,scale] duration-(--motion-quick) ease-out-strong after:absolute after:-inset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-graphite-900/50 motion-safe:enabled:active:scale-[0.96] active:duration-(--press) can-hover:opacity-0 can-hover:group-hover:opacity-100 can-hover:group-has-focus-visible:opacity-100 can-hover:hover:bg-graphite-100 can-hover:hover:text-graphite-900`;

function focusAfter(item: HTMLElement) {
  const sibling = (from: Element | null, next: boolean): HTMLElement | null => {
    let at = from;
    while (at) {
      at = next ? at.nextElementSibling : at.previousElementSibling;
      const button = at?.matches("[data-leaving]")
        ? null
        : at?.querySelector<HTMLElement>("[data-remove]");
      if (button) return button;
    }
    return null;
  };
  (sibling(item, true) ?? sibling(item, false))?.focus();
}

function Item({
  link: { slug, title, url, tag, by },
  late,
  onRemove,
}: {
  link: Ref;
  late: boolean;
  onRemove?: (slug: string) => void;
}) {
  const [goes, setGoes] = useState(false);

  function remove(button: HTMLElement) {
    const item = button.closest("li");
    if (item) focusAfter(item);
    if (still()) onRemove?.(slug);
    else setGoes(true);
  }

  return (
    <li
      data-leaving={goes || undefined}
      className={`group wrap-anywhere ${goes ? LEAVES : STAYS} ${late ? LATE : ""}`}
    >
      <div
        onTransitionEnd={(event) => {
          if (goes && event.target === event.currentTarget) onRemove?.(slug);
        }}
        className={`grid transition-[grid-template-rows] duration-(--motion-exit) ease-out-strong ${goes ? "grid-rows-[0fr]" : "grid-rows-[1fr]"}`}
      >
        <div className="min-h-0">
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
          {onRemove ? (
            <button
              type="button"
              data-remove
              disabled={goes}
              onClick={(event) => remove(event.currentTarget)}
              aria-label={`Remove ${title}`}
              className={REMOVE}
            >
              Remove
            </button>
          ) : null}
        </div>
      </div>
    </li>
  );
}

export function Selection({
  refs,
  all,
  rushing,
  onRemove,
}: {
  refs: Ref[];
  all: boolean;
  rushing: boolean;
  onRemove?: (slug: string) => void;
}) {
  const seen = useRef(refs.length);
  const empty = refs.length === 0;
  const [wasEmpty, setWasEmpty] = useState(empty);
  const [introShown, setIntroShown] = useState(false);
  const [leaving, setLeaving] = useState(false);

  if (wasEmpty !== empty) {
    setWasEmpty(empty);
    setLeaving(!empty && introShown && !still());
  }

  useEffect(() => {
    if (!empty) return;
    const frame = requestAnimationFrame(() => setIntroShown(true));
    return () => cancelAnimationFrame(frame);
  }, [empty]);

  function gone() {
    setLeaving(false);
    setIntroShown(false);
  }

  useEffect(() => {
    const grew = refs.length > seen.current;
    seen.current = refs.length;
    if (!grew) return;
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: rushing || still() ? "instant" : "smooth",
    });
  }, [refs.length, rushing]);

  return (
    <div className="mx-auto w-full max-w-[1400px] px-[7vw] pb-[10vh]">
      <section
        data-article
        aria-label={all ? "Every reference" : "Your selection"}
        className="mx-auto w-full max-w-5xl"
      >
        <div className="grid">
          {empty || leaving ? (
            <p
              aria-hidden={leaving || undefined}
              onTransitionEnd={(event) => {
                if (leaving && event.propertyName === "opacity") gone();
              }}
              className={`${SLOT} ${ACCENT_PROSE} ${leaving ? RISES_AWAY : ARRIVES}`}
            >
              {INTRO}
            </p>
          ) : null}
          {empty ? null : (
            <header className={`${SLOT} ${ARRIVES} ${leaving ? LATE : ""}`}>
              <p className={ACCENT_PROSE}>
                <button
                  type="button"
                  onClick={() => openOverlay(SHOP_OVERLAY)}
                  aria-haspopup="dialog"
                  className={LINK_UNDERLINED}
                >
                  Export
                </button>{" "}
                {all
                  ? "all my references."
                  : "your selection of my references."}
              </p>
            </header>
          )}
        </div>
        {empty ? null : (
          <ul
            className={`mt-12 list-disc pl-[1.2em] marker:text-graphite-400 ${PROSE}`}
          >
            {refs.map((link) => (
              <Item
                key={link.slug}
                link={link}
                late={leaving}
                onRemove={onRemove}
              />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
