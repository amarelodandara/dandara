import { LINK, LINK_UNDERLINED } from "@/components/link";
import { FIND_ME, TWITTER } from "@/content/socials";

const ELSEWHERE = FIND_ME.filter((one) => one !== TWITTER);

export function PostFooter() {
  return (
    <footer className="mt-20 border-t border-foreground/10 pt-8">
      <p className="text-[clamp(1rem,1.2vw,1.125rem)] leading-[1.6]">
        I talk a lot more on{" "}
        <a
          href={TWITTER.href}
          target="_blank"
          rel="noreferrer"
          className={LINK_UNDERLINED}
        >
          Twitter
        </a>
        , come hang out there.
      </p>

      <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-[0.85rem] text-foreground-soft">
        {ELSEWHERE.map(({ label, href }) => (
          <li key={label}>
            <a href={href} className={LINK}>
              {label}
            </a>
          </li>
        ))}
      </ul>
    </footer>
  );
}
