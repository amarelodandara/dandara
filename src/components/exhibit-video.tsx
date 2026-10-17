"use client";

import { type RefObject, useEffect, useRef, useState } from "react";
import { PRESS_BASE } from "@/lib/pressable";
import { ANNOTATION } from "@/lib/type";

const IN_VIEW = 0.25;
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

const TOGGLE = [
  PRESS_BASE,
  "absolute right-2 bottom-2 rounded-sm bg-cadmium-50 px-2 py-1 shadow-chip",
  `${ANNOTATION} leading-none text-graphite-700`,
  "can-hover:hover:bg-cadmium-200 focus-visible:bg-cadmium-200",
  "can-hover:opacity-0 can-hover:group-hover:opacity-100 focus-visible:opacity-100",
].join(" ");

const playWhileInView = (video: HTMLVideoElement, held: RefObject<boolean>) => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting && !held.current) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    },
    { threshold: IN_VIEW },
  );
  observer.observe(video);
  return observer;
};

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
  const held = useRef(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    const still = window.matchMedia(REDUCED_MOTION);
    let observer: IntersectionObserver | null = null;

    const settle = () => {
      observer?.disconnect();
      observer = null;
      if (still.matches) {
        video.pause();
        return;
      }

      observer = playWhileInView(video, held);
    };

    settle();
    still.addEventListener("change", settle);
    return () => {
      still.removeEventListener("change", settle);
      observer?.disconnect();
    };
  }, []);

  const toggle = () => {
    const video = ref.current;
    if (!video) return;
    held.current = !video.paused;
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  };

  return (
    <div className="group relative">
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
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      >
        {sources.map(({ src, type }) => (
          <source key={src} src={src} type={type} />
        ))}
      </video>
      <button type="button" onClick={toggle} className={TOGGLE}>
        {playing ? "Pause" : "Play"}
        <span className="sr-only"> video</span>
      </button>
    </div>
  );
}
