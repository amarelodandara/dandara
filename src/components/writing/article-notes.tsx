"use client";

import { useEffect } from "react";
import {
  publishArticle,
  withdrawArticle,
  type ArticleNote,
} from "@/lib/article-notes";

export function ArticleNotes({
  slug,
  title,
  notes,
}: {
  slug: string;
  title: string;
  notes: ArticleNote[];
}) {
  useEffect(() => {
    publishArticle({ slug, title, notes });
    return withdrawArticle;
  }, [slug, title, notes]);

  return null;
}
