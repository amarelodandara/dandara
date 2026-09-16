"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

import { Graph, GraphBody } from "./graph-frame";
import { fadeUp, type GraphPalette } from "./graph-motion";

type GraphCountdownProps = {
  title: string;
  to: string;
  done: string;
  caption?: string;
  palette?: GraphPalette;
  corner?: string;
  className?: string;
};

const MINUTE = 60_000;
const PENDING = "--d --h --m";

function remaining(to: string, now: number) {
  const left = new Date(to).getTime() - now;
  if (Number.isNaN(left) || left <= 0) return null;

  const minutes = Math.floor(left / MINUTE);
  return {
    days: Math.floor(minutes / (60 * 24)),
    hours: Math.floor((minutes / 60) % 24),
    minutes: minutes % 60,
  };
}

export function GraphCountdown({
  title,
  to,
  done,
  caption,
  corner,
  className,
}: GraphCountdownProps) {
  const reduce = useReducedMotion();
  const item = fadeUp(reduce);
  const [reading, setReading] = useState(PENDING);

  useEffect(() => {
    function read() {
      const left = remaining(to, Date.now());
      setReading(
        left === null ? done : `${left.days}d ${left.hours}h ${left.minutes}m`,
      );
    }

    const tick = setInterval(read, MINUTE);
    const first = setTimeout(read, 0);
    return () => {
      clearInterval(tick);
      clearTimeout(first);
    };
  }, [done, to]);

  return (
    <Graph title={title} className={className} corner={corner}>
      <GraphBody>
        <motion.div
          className="flex flex-col gap-2"
          initial={reduce ? false : "hidden"}
          variants={item}
          viewport={{ once: true, amount: 0.5 }}
          whileInView="show"
        >
          <p className="tabular-nums text-(--graph-accent)">{reading}</p>
          {caption ? (
            <p className="truncate text-(--graph-muted)">{caption}</p>
          ) : null}
        </motion.div>
      </GraphBody>
    </Graph>
  );
}
