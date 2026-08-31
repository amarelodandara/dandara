"use client";

import { useEffect, useRef, useState } from "react";
import { Frame, type Measure } from "./figure";

const STILLNESS = "(prefers-reduced-motion: reduce)";

export function Clip({
  src,
  alt,
  width,
  height,
  caption,
  codec,
  measure,
  mat,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
  codec?: string;
  measure?: Measure;
  mat?: boolean;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const [held, setHeld] = useState(false);

  useEffect(() => {
    const asked = window.matchMedia(STILLNESS);

    const settle = () => {
      setHeld(asked.matches);
      if (!video.current) return;
      if (asked.matches) video.current.pause();
      else void video.current.play().catch(() => {});
    };

    settle();
    asked.addEventListener("change", settle);
    return () => asked.removeEventListener("change", settle);
  }, []);

  return (
    <Frame measure={measure} mat={mat} caption={caption}>
      <video
        ref={video}
        aria-label={alt}
        width={width}
        height={height}
        autoPlay
        loop
        muted
        playsInline
        controls={held}
        preload="metadata"
        className="h-auto w-full"
      >
        {codec ? (
          <source src={`${src}.av1.mp4`} type={`video/mp4; codecs="${codec}"`} />
        ) : null}
        <source src={`${src}.mp4`} type="video/mp4" />
      </video>
    </Frame>
  );
}
