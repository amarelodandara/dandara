import { LINKS } from "@/links/data";
import { EXPORTS } from "@/links/export";
import { NAME } from "@/lib/site";

export const dynamic = "force-static";

const { render, type } = EXPORTS.csv;

export function GET() {
  return new Response(render(LINKS, `${NAME}'s references`), {
    headers: {
      "content-type": `${type}; charset=utf-8`,
      "cache-control":
        "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
