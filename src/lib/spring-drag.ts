import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";

const TETHER_LENGTH_PX = 70;
const TETHER_RESISTANCE = 0.55;
const TETHER_SNAP_PX = 260;
const TETHER_LIMIT_SHARE = 0.999;

const DRAG_START_THRESHOLD_PX = 4;

const TILT_DEGREES_PER_PX = 0.06;
const MAX_TILT_DEGREES = 7;

const SPRING_RESPONSE_SECONDS = 0.4;
const SPRING_DAMPING_RATIO = 0.8;
const ANGULAR_FREQUENCY = (2 * Math.PI) / SPRING_RESPONSE_SECONDS;
const STIFFNESS = ANGULAR_FREQUENCY * ANGULAR_FREQUENCY;
const DAMPING = 2 * SPRING_DAMPING_RATIO * ANGULAR_FREQUENCY;

const INTEGRATION_STEPS_PER_SECOND = 240;
const INTEGRATION_STEP_SECONDS = 1 / INTEGRATION_STEPS_PER_SECOND;
const LONGEST_TRUSTED_FRAME_SECONDS = 0.064;

const REST_DISTANCE_PX = 0.1;
const REST_SPEED_PX_PER_SECOND = 0.5;
const MS_PER_SECOND = 1000;

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

type Offset = { x: number; y: number };

const resistedTravel = (pull: number) =>
  (pull * TETHER_LENGTH_PX * TETHER_RESISTANCE) /
  (TETHER_LENGTH_PX + TETHER_RESISTANCE * Math.abs(pull));

const pullBehindTravel = (travel: number) => {
  const reach = Math.min(
    Math.abs(travel),
    TETHER_LENGTH_PX * TETHER_LIMIT_SHARE,
  );
  return (
    (Math.sign(travel) * reach * TETHER_LENGTH_PX) /
    (TETHER_RESISTANCE * (TETHER_LENGTH_PX - reach))
  );
};

function springToRest({
  from,
  velocity,
  onFrame,
  onRest,
}: {
  from: Offset;
  velocity: Offset;
  onFrame: (x: number, y: number) => void;
  onRest: () => void;
}) {
  let { x, y } = from;
  let vx = velocity.x;
  let vy = velocity.y;
  let previousTime = performance.now();
  let frame = 0;

  const advance = (now: number) => {
    const elapsed = Math.min(
      (now - previousTime) / MS_PER_SECOND,
      LONGEST_TRUSTED_FRAME_SECONDS,
    );
    previousTime = now;

    for (let t = 0; t < elapsed; t += INTEGRATION_STEP_SECONDS) {
      const step = Math.min(INTEGRATION_STEP_SECONDS, elapsed - t);
      vx += (-STIFFNESS * x - DAMPING * vx) * step;
      vy += (-STIFFNESS * y - DAMPING * vy) * step;
      x += vx * step;
      y += vy * step;
    }

    const settled =
      Math.hypot(x, y) < REST_DISTANCE_PX &&
      Math.hypot(vx, vy) < REST_SPEED_PX_PER_SECOND;

    if (settled) {
      onFrame(0, 0);
      onRest();
      return;
    }

    onFrame(x, y);
    frame = requestAnimationFrame(advance);
  };

  frame = requestAnimationFrame(advance);
  return () => cancelAnimationFrame(frame);
}

type Grab = {
  pointerId: number;
  originX: number;
  originY: number;
  x: number;
  y: number;
  at: number;
  previousX: number;
  previousY: number;
  previousAt: number;
  travelled: boolean;
};

export function useSpringDrag() {
  const ref = useRef<HTMLDivElement>(null);
  const grab = useRef<Grab | null>(null);
  const travel = useRef<Offset>({ x: 0, y: 0 });
  const stopSpring = useRef<(() => void) | null>(null);
  const [lifted, setLifted] = useState(false);

  useEffect(() => () => stopSpring.current?.(), []);

  const paint = useCallback((x: number, y: number) => {
    travel.current = { x, y };
    const el = ref.current;
    if (!el) return;

    const home = x === 0 && y === 0;
    const tilt = Math.max(
      -MAX_TILT_DEGREES,
      Math.min(MAX_TILT_DEGREES, x * TILT_DEGREES_PER_PX),
    );
    el.style.translate = home ? "" : `${x}px ${y}px`;
    el.style.rotate = home ? "" : `${tilt}deg`;
  }, []);

  const letGo = useCallback(() => {
    const held = grab.current;
    if (!held) return;

    grab.current = null;
    setLifted(false);
    ref.current?.releasePointerCapture?.(held.pointerId);
    if (!held.travelled) return;

    const seconds = (held.at - held.previousAt) / MS_PER_SECOND;
    const velocity = seconds
      ? {
          x: (held.x - held.previousX) / seconds,
          y: (held.y - held.previousY) / seconds,
        }
      : { x: 0, y: 0 };

    stopSpring.current = springToRest({
      from: travel.current,
      velocity,
      onFrame: paint,
      onRest: () => {
        stopSpring.current = null;
      },
    });
  }, [paint]);

  useEffect(() => {
    const bailOutOfReachOfThisDocument = () => letGo();
    window.addEventListener("blur", bailOutOfReachOfThisDocument);
    document.addEventListener("pointerup", bailOutOfReachOfThisDocument);
    document.addEventListener("pointercancel", bailOutOfReachOfThisDocument);
    document.addEventListener("pointerleave", bailOutOfReachOfThisDocument);
    return () => {
      window.removeEventListener("blur", bailOutOfReachOfThisDocument);
      document.removeEventListener("pointerup", bailOutOfReachOfThisDocument);
      document.removeEventListener(
        "pointercancel",
        bailOutOfReachOfThisDocument,
      );
      document.removeEventListener(
        "pointerleave",
        bailOutOfReachOfThisDocument,
      );
    };
  }, [letGo]);

  const onPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (event.button !== 0) return;
      if (window.matchMedia(REDUCED_MOTION).matches) return;

      stopSpring.current?.();
      stopSpring.current = null;

      const now = performance.now();
      grab.current = {
        pointerId: event.pointerId,
        originX: event.clientX - pullBehindTravel(travel.current.x),
        originY: event.clientY - pullBehindTravel(travel.current.y),
        x: travel.current.x,
        y: travel.current.y,
        at: now,
        previousX: travel.current.x,
        previousY: travel.current.y,
        previousAt: now,
        travelled: false,
      };
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    [],
  );

  const onPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const held = grab.current;
      if (!held || held.pointerId !== event.pointerId) return;

      const pullX = event.clientX - held.originX;
      const pullY = event.clientY - held.originY;
      const pull = Math.hypot(pullX, pullY);

      if (!held.travelled && pull < DRAG_START_THRESHOLD_PX) return;
      if (!held.travelled) setLifted(true);
      held.travelled = true;

      if (pull > TETHER_SNAP_PX) {
        letGo();
        return;
      }

      const x = resistedTravel(pullX);
      const y = resistedTravel(pullY);

      held.previousX = held.x;
      held.previousY = held.y;
      held.previousAt = held.at;
      held.x = x;
      held.y = y;
      held.at = performance.now();

      paint(x, y);
    },
    [letGo, paint],
  );

  return { ref, lifted, onPointerDown, onPointerMove };
}
