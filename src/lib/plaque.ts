import { useNoteEverRequested } from "./article-notes";
import { useAtArticleEnd } from "./article-end";
import { usePastLanding } from "./past-landing";

export function usePlaqueWanted(inAnArticle: boolean) {
  const pastLanding = usePastLanding();
  const atArticleEnd = useAtArticleEnd();
  const askedForANote = useNoteEverRequested();

  if (inAnArticle) return atArticleEnd || askedForANote;
  return pastLanding;
}
