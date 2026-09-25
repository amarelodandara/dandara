"use client";

import { useLayoutEffect, useRef } from "react";
import { LINK } from "@/components/link";
import { EXPERIENCE } from "@/content/experience";
import { ANNOTATION, LABEL, SECTION_HEADING } from "@/lib/type";

function hidePeriodsIfAnyWraps(list: HTMLElement) {
  const periods = list.querySelectorAll<HTMLElement>("[data-period]");
  const anyWrapped = [...periods].some(
    (period) =>
      period.getBoundingClientRect().top >=
      (period.parentElement?.getBoundingClientRect().bottom ?? Infinity),
  );
  if (anyWrapped) list.dataset.compact = "";
  else delete list.dataset.compact;
}

export function ExperienceList({ className }: { className?: string }) {
  const listRef = useRef<HTMLUListElement>(null);

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const measure = () => hidePeriodsIfAnyWraps(list);

    measure();
    void document.fonts.ready.then(measure);

    const observer = new ResizeObserver(measure);
    observer.observe(list);
    return () => observer.disconnect();
  }, []);

  return (
    <ul ref={listRef} className={`group space-y-2 ${className ?? ""}`}>
      {EXPERIENCE.map(({ company, href, role, period }) => (
        <li key={company} className="flex items-baseline gap-6">
          <h3
            className={`flex h-[calc(1lh+0.2em)] min-w-0 flex-wrap items-baseline gap-x-2.5 gap-y-[1lh] overflow-hidden whitespace-nowrap ${SECTION_HEADING}`}
          >
            {href ? (
              <a href={href} className={LINK}>
                {company}
              </a>
            ) : (
              company
            )}
            <span
              data-period
              className={`shrink-0 ${ANNOTATION} text-graphite-500 group-data-compact:invisible`}
            >
              {period}
            </span>
          </h3>
          <span
            className={`ml-auto shrink-0 whitespace-nowrap ${LABEL} text-graphite-700`}
          >
            {role}
          </span>
        </li>
      ))}
    </ul>
  );
}
