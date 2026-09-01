const ICON = "h-4 w-4";

export function WallIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={ICON}>
      <g stroke="currentColor" strokeWidth="0.9" strokeLinejoin="round">
        <rect x="1.75" y="1.75" width="5" height="7.5" rx="0.5" />
        <rect x="1.75" y="10.5" width="5" height="3.75" rx="0.5" />
        <rect x="9.25" y="1.75" width="5" height="3.75" rx="0.5" />
        <rect x="9.25" y="6.75" width="5" height="7.5" rx="0.5" />
      </g>
    </svg>
  );
}

export function PileIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={ICON}>
      <g
        fill="var(--color-background)"
        stroke="currentColor"
        strokeWidth="0.9"
        strokeLinejoin="round"
      >
        <rect x="6" y="2" width="7.5" height="5.5" rx="0.5" transform="rotate(9 9.75 4.75)" />
        <rect x="2.25" y="4.5" width="7.5" height="5.5" rx="0.5" transform="rotate(-6 6 7.25)" />
        <rect x="5.25" y="8" width="7.5" height="5.5" rx="0.5" transform="rotate(4 9 10.75)" />
      </g>
    </svg>
  );
}

