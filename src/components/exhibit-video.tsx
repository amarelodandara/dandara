"use client";

import { type RefObject, useEffect, useRef, useState } from "react";
import { play } from "cuelume";
import { PRESS_BASE } from "@/lib/pressable";

const IN_VIEW = 0.25;
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

const TOGGLE = [
  PRESS_BASE,
  "absolute right-2 bottom-2 flex size-7 items-center justify-center rounded-sm",
  "bg-cadmium-50 text-graphite-700 shadow-chip",
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
    play("toggle", { direction: video.paused ? "forward" : "back" });
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
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause video" : "Play video"}
        className={TOGGLE}
      >
        <svg
          viewBox="0 0 16 16"
          aria-hidden="true"
          className="size-3 fill-current"
        >
          {playing ? (
            <>
              <rect x="3.5" y="2.5" width="3" height="11" rx="1" />
              <rect x="9.5" y="2.5" width="3" height="11" rx="1" />
            </>
          ) : (
            <path d="M4.5 2.75v10.5L13 8Z" />
          )}
        </svg>
      </button>
    </div>
  );
}
