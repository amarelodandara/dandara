"use client";

import { useEffect } from "react";
import {
  publishArticleNotes,
  withdrawArticleNotes,
  type ArticleNote,
} from "@/lib/article-notes";

export function ArticleNotes({ notes }: { notes: ArticleNote[] }) {
  useEffect(() => {
    publishArticleNotes(notes);
    return withdrawArticleNotes;
  }, [notes]);

  return null;
}
