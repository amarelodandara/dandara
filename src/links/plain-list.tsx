import type { Link } from "./link";
import { LINK_UNDERLINED } from "@/components/link";
import { PROSE } from "@/lib/type";

export function PlainList({ links }: { links: Link[] }) {
  return (
    <noscript>
      <div className="mx-auto w-full max-w-5xl px-[7vw] pt-[9vh]">
        <ol
          className={`list-decimal pl-[1.2em] marker:text-graphite-400 ${PROSE}`}
        >
          {links.map(({ slug, title, url, tag, by }) => (
            <li key={slug} className="mt-3 wrap-anywhere first:mt-0">
              {url ? (
                <a href={url} className={LINK_UNDERLINED}>
                  {title}
                </a>
              ) : (
                <span>{tag === "quote" ? `“${title}”` : title}</span>
              )}
              {by ? <span className="text-graphite-700"> — {by}</span> : null}
            </li>
          ))}
        </ol>
      </div>
    </noscript>
  );
}
