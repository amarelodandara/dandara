"use client";

import { useEffect, useRef } from "react";

const IN_VIEW = 0.25;
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

export function ExhibitVideo({
  sources,
  poster,
  width,
  height,
  label,
  className,
}: {
  sources: { src: string; type: string }[];
  poster?: string;
  width: number;
  height: number;
  label: string;
  className: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (window.matchMedia(REDUCED_MOTION).matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: IN_VIEW },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      aria-label={label}
      loop
      muted
      playsInline
      preload="metadata"
      poster={poster}
      width={width}
      height={height}
      className={className}
    >
      {sources.map(({ src, type }) => (
        <source key={src} src={src} type={type} />
      ))}
    </video>
  );
}
