"use client";

import { ErrorWall } from "@/components/error-wall";

export default function SiteError({ retry }: { retry: () => void }) {
  return (
    <>
      <title>Something broke — Nicoly Dandara</title>
      <ErrorWall retry={retry} />
    </>
  );
}
