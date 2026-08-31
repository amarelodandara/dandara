import Image from "next/image";
import type { ReactNode } from "react";

export const CAPTION = "mt-3 text-[0.7rem] leading-normal text-foreground-soft";

export type Measure = "wide" | "body" | "three-quarters";

const MAT = "rounded-md bg-background p-3 md:p-5";

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
