const FRICTION_PER_SECOND = 2.6;
const SETTLE_BELOW_CARDS_PER_SECOND = 2.5;
const LONGEST_TRUSTED_FRAME_SECONDS = 0.064;
const MS_PER_SECOND = 1000;

const SHORTEST_TRAVEL_MS = 100;
const TRAVEL_MS_PER_ROOT_CARD = 140;
const LONGEST_TRAVEL_MS = 2600;
const CRUISING_FROM_CARDS = 3;
const SHORTEST_SETTLE_MS = 160;
const LONGEST_SETTLE_MS = 420;
const EASE_OUT_START_SLOPE = 3;

type Travel = {
  from: number;
  to: number;
  start: number;
  duration: number;
  ease: (t: number) => number;
};

export type RollEvents = {
  onFrame: (position: number, speed: number) => void;
  onLand: (position: number) => void;
};

const easeOut = (t: number) => 1 - (1 - t) ** 3;

const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2;

export const travelMs = (cards: number) =>
  Math.min(
    LONGEST_TRAVEL_MS,
    SHORTEST_TRAVEL_MS + TRAVEL_MS_PER_ROOT_CARD * Math.sqrt(Math.abs(cards)),
  );

export const randomIndex = (count: number) =>
  crypto.getRandomValues(new Uint32Array(1))[0] % count;

export const wrap = (index: number, count: number) =>
  ((index % count) + count) % count;

const IDLE: RollEvents = { onFrame: () => {}, onLand: () => {} };

export function createRoll() {
  let events = IDLE;
  let position = 0;
  let velocity = 0;
  let travel: Travel | null = null;
  let frame = 0;
  let last = 0;

  const travelTo = (to: number, duration: number, ease = easeInOut) => {
    velocity = 0;
    travel = { from: position, to, start: performance.now(), duration, ease };
    wake();
  };

  const settle = () => {
    const to = Math.round(position + velocity / FRICTION_PER_SECOND);
    const distance = to - position;
    const carried =
      velocity !== 0 && Math.sign(distance) === Math.sign(velocity)
        ? ((EASE_OUT_START_SLOPE * Math.abs(distance)) / Math.abs(velocity)) *
          MS_PER_SECOND
        : SHORTEST_SETTLE_MS;
    travelTo(
      to,
      Math.min(LONGEST_SETTLE_MS, Math.max(SHORTEST_SETTLE_MS, carried)),
      easeOut,
    );
  };

  const advance = (now: number, seconds: number) => {
    if (travel) {
      const t = Math.min(1, (now - travel.start) / travel.duration);
      position = travel.from + (travel.to - travel.from) * travel.ease(t);
      if (t < 1) return true;
      travel = null;
      events.onLand(position);
      return false;
    }
    position += velocity * seconds;
    velocity *= Math.exp(-FRICTION_PER_SECOND * seconds);
    if (Math.abs(velocity) < SETTLE_BELOW_CARDS_PER_SECOND) settle();
    return true;
  };

  const tick = (now: number) => {
    const seconds = Math.min(
      LONGEST_TRUSTED_FRAME_SECONDS,
      (now - last) / MS_PER_SECOND,
    );
    const before = position;
    last = now;
    const moving = advance(now, seconds);
    events.onFrame(position, seconds > 0 ? (position - before) / seconds : 0);
    frame = moving ? requestAnimationFrame(tick) : 0;
  };

  function wake() {
    if (frame) return;
    last = performance.now();
    frame = requestAnimationFrame(tick);
  }

  return {
    listen(next: RollEvents) {
      events = next;
    },
    get position() {
      return position;
    },
    get heading() {
      return travel ? travel.to : Math.round(position);
    },
    fling(cardsPerSecond: number) {
      travel = null;
      velocity += cardsPerSecond;
      wake();
    },
    drag(cards: number) {
      travel = null;
      velocity = 0;
      position += cards;
      events.onFrame(position, 0);
    },
    goTo(to: number) {
      const cards = to - position;
      travelTo(
        to,
        travelMs(cards),
        Math.abs(cards) < CRUISING_FROM_CARDS ? easeOut : easeInOut,
      );
    },
    travel(to: number, duration: number) {
      travelTo(to, duration);
    },
    jump(to: number) {
      travel = null;
      velocity = 0;
      position = to;
      events.onFrame(position, 0);
      events.onLand(position);
    },
    release(cardsPerSecond: number) {
      velocity = cardsPerSecond;
      wake();
    },
    rest() {
      velocity = 0;
      settle();
    },
    stop() {
      cancelAnimationFrame(frame);
      frame = 0;
    },
  };
}

export type Roll = ReturnType<typeof createRoll>;
