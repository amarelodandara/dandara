import Image from "next/image";

export const CAPTION = "mt-3 text-[0.7rem] leading-normal text-foreground-soft";

export function Figure({
  src,
  alt,
  width,
  height,
  caption,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
}) {
  return (
    <figure className="my-12">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes="(min-width: 60rem) 56rem, 92vw"
        className="h-auto w-full"
      />
      {caption ? <figcaption className={CAPTION}>{caption}</figcaption> : null}
    </figure>
  );
}
