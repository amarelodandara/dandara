import { usePathname } from "next/navigation";
import { useNoteEverRequested } from "./article-notes";
import { useAtArticleEnd } from "./article-end";
import { usePastLanding } from "./past-landing";

const NEVER_OUT = new Set(["/links"]);

export function usePlaqueWanted(inAnArticle: boolean) {
  const pathname = usePathname();
  const pastLanding = usePastLanding();
  const atArticleEnd = useAtArticleEnd();
  const askedForANote = useNoteEverRequested();

  if (NEVER_OUT.has(pathname)) return false;
  if (inAnArticle) return atArticleEnd || askedForANote;
  return pastLanding;
}
