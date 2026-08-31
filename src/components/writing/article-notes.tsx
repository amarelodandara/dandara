"use client";

import { useEffect } from "react";
import {
  publishArticle,
  withdrawArticle,
  type ArticleNote,
} from "@/lib/article-notes";

export function ArticleNotes({
  title,
  notes,
}: {
  title: string;
  notes: ArticleNote[];
}) {
  useEffect(() => {
    publishArticle({ title, notes });
    return withdrawArticle;
  }, [title, notes]);

  return null;
}
