const STILLNESS = "(prefers-reduced-motion: reduce)";

const REST = { x: 50, y: 44 };
const PULL = 26;
const REACH = 900;
const CHASE_PER_FRAME = 0.14;
const FRAMES_PER_SECOND = 60;
const MS_PER_SECOND = 1000;
const LONGEST_FRAME_SECONDS = 1 / 30;
const SETTLED = 0.05;

const gravitate = (distance: number) => {
  const share = Math.min(Math.abs(distance) / REACH, 1);
  return Math.sign(distance) * share * PULL;
};

export function chaseThePointer(sun: HTMLElement) {
  const held = window.matchMedia(STILLNESS);
  const at = { ...REST };
  const wanted = { ...REST };
  let frame = 0;
  let previous = 0;

  const paint = () => {
    sun.style.setProperty("--sun-x", `${at.x}%`);
    sun.style.setProperty("--sun-y", `${at.y}%`);
  };

  const chase = (now: number) => {
    const elapsed = Math.min(
      (now - previous) / MS_PER_SECOND,
      LONGEST_FRAME_SECONDS,
    );
    previous = now;
    const share = 1 - (1 - CHASE_PER_FRAME) ** (elapsed * FRAMES_PER_SECOND);
    const offX = wanted.x - at.x;
    const offY = wanted.y - at.y;
    at.x += offX * share;
    at.y += offY * share;
    paint();

    const arrived = Math.abs(offX) < SETTLED && Math.abs(offY) < SETTLED;
    frame = arrived ? 0 : requestAnimationFrame(chase);
  };

  const follow = (event: PointerEvent) => {
    if (held.matches) return;
    const seat = sun.getBoundingClientRect();
    wanted.x = REST.x + gravitate(event.clientX - (seat.left + seat.width / 2));
    wanted.y = REST.y + gravitate(event.clientY - (seat.top + seat.height / 2));
    if (frame) return;
    previous = performance.now();
    frame = requestAnimationFrame(chase);
  };

  const settle = () => {
    if (!held.matches) return;
    cancelAnimationFrame(frame);
    frame = 0;
    Object.assign(wanted, REST);
    Object.assign(at, REST);
    sun.style.removeProperty("--sun-x");
    sun.style.removeProperty("--sun-y");
  };

  settle();
  window.addEventListener("pointermove", follow, { passive: true });
  held.addEventListener("change", settle);

  return () => {
    cancelAnimationFrame(frame);
    window.removeEventListener("pointermove", follow);
    held.removeEventListener("change", settle);
  };
}
