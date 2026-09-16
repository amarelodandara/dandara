"use client";

import * as React from "react";

import { cn } from "../cn";

function GraphCorners({ mark = "+" }: { mark?: string }) {
  const corner =
    "pointer-events-none absolute z-10 flex size-4 items-center justify-center bg-(--graph-paper) font-mono text-sm leading-none text-(--graph-mark) select-none";

  return (
    <>
      <span
        aria-hidden="true"
        className={cn(corner, "top-0 left-0 -translate-1/2")}
      >
        {mark}
      </span>
      <span
        aria-hidden="true"
        className={cn(corner, "top-0 right-0 translate-x-1/2 -translate-y-1/2")}
      >
        {mark}
      </span>
      <span
        aria-hidden="true"
        className={cn(
          corner,
          "bottom-0 left-0 -translate-x-1/2 translate-y-1/2",
        )}
      >
        {mark}
      </span>
      <span
        aria-hidden="true"
        className={cn(corner, "right-0 bottom-0 translate-1/2")}
      >
        {mark}
      </span>
    </>
  );
}

function GraphTitle({
  className,
  children,
  ...props
}: React.ComponentProps<"figcaption">) {
  return (
    <figcaption
      className={cn(
        "absolute top-0 left-1/2 z-10 -translate-1/2 bg-(--graph-paper) px-2.5 tracking-wide whitespace-nowrap uppercase",
        className,
      )}
      {...props}
    >
      <span className="text-(--graph-accent)">[ {children} ]</span>
    </figcaption>
  );
}

function GraphBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("min-w-0 px-5 py-7 sm:p-8", className)} {...props} />
  );
}

function Graph({
  title,
  corner = "+",
  className,
  children,
  ...props
}: React.ComponentProps<"figure"> & {
  title?: string;
  corner?: string;
}) {
  const captionId = React.useId();

  return (
    <figure
      aria-labelledby={title ? captionId : undefined}
      className={cn(
        "relative w-full min-w-0 graph-frame font-mono text-sm text-(--graph-ink)",
        className,
      )}
      {...props}
    >
      {title ? <GraphTitle id={captionId}>{title}</GraphTitle> : null}
      <GraphCorners mark={corner} />
      {children}
    </figure>
  );
}

export { Graph, GraphBody, GraphCorners, GraphTitle };
