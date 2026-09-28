import Image from "next/image";
import type { ReactNode } from "react";
import { ANNOTATION } from "@/lib/type";

export const CAPTION = `mt-3 ${ANNOTATION} leading-normal text-graphite-700`;

export type Measure = "wide" | "body" | "three-quarters";

const MAT = "rounded-md bg-cadmium-50 p-3 md:p-5";

const SIZES: Record<Measure, string> = {
  wide: "(min-width: 68rem) 64rem, 92vw",
  body: "(min-width: 46rem) 42rem, 92vw",
  "three-quarters": "(min-width: 46rem) 32rem, 70vw",
};

export function Frame({
  measure = "wide",
  mat,
  caption,
  children,
}: {
  measure?: Measure;
  mat?: boolean;
  caption?: string;
  children: ReactNode;
}) {
  return (
    <figure className="my-12" data-measure={measure}>
      {mat ? (
        <div data-recessed className={MAT}>
          {children}
        </div>
      ) : (
        children
      )}
      {caption ? <figcaption className={CAPTION}>{caption}</figcaption> : null}
    </figure>
  );
}

export function Figure({
  src,
  alt,
  width,
  height,
  caption,
  measure = "wide",
  mat,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
  measure?: Measure;
  mat?: boolean;
}) {
  return (
    <Frame measure={measure} mat={mat} caption={caption}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={SIZES[measure]}
        className="h-auto w-full"
      />
    </Frame>
  );
}

type Panel = {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
};

export function FigurePair({ panels }: { panels: [Panel, Panel] }) {
  return (
    <figure className="my-12" data-measure="wide">
      <div className="mx-auto grid max-w-4xl gap-8 sm:grid-cols-2 sm:gap-5">
        {panels.map((panel) => (
          <figure key={panel.src}>
            <Image
              src={panel.src}
              alt={panel.alt}
              width={panel.width}
              height={panel.height}
              sizes="(min-width: 60rem) 28rem, (min-width: 40rem) 46vw, 92vw"
              className="h-auto w-full"
            />
            {panel.caption ? (
              <figcaption className={CAPTION}>{panel.caption}</figcaption>
            ) : null}
          </figure>
        ))}
      </div>
    </figure>
  );
}
