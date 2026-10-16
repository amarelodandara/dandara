import { LostWall } from "@/components/lost-wall";
import type { Sign } from "@/components/signposts";
import { PROSE } from "@/lib/type";

const PAGES: Sign[] = [
  { href: "/", name: "Home", area: "home" },
  { href: "/work", name: "Work", area: "work" },
  { href: "/work/sketchbook", name: "Sketchbook", area: "site" },
  { href: "/work/photography", name: "Photography", area: "site" },
  { href: "/writing", name: "Writing", area: "blog" },
  { href: "/changelog", name: "Changelog", area: "site" },
];

export function NotFoundWall() {
  return (
    <LostWall
      signs={PAGES}
      hero={
        <>
          <h1 className="sr-only">Page not found</h1>
          <p className={`text-balance ${PROSE}`}>
            It seems like you&rsquo;re lost, follow the signs back to the
            exhibition.
          </p>
        </>
      }
    />
  );
}
