export type Lobe = readonly [angle: number, depth: number, phase: number];

export type Badge = {
  title: string;
  href: string;
  words: number;
  scale: number;
  lobes: readonly Lobe[];
  stops: readonly string[];
  ink: string;
};

export const LOOK = {
  box: 260,
  margin: 16,
  roundness: 1.15,
  breath: 0.1,
  breathPeriodMs: 900,
  textGap: 10,
  textSize: 12.6,
  textWeight: 500,
  tracking: -0.03,
  driftPxPerSecond: 15,
  lineWeight: 1.2,
  lineGap: 7,
  lineLift: 0.33,
  baselineShare: 0.72,
  gradientAngle: 225,
  glossStrength: 0.5,
  glossSpread: 0.94,
  glossMid: 0.35,
  glossRest: [0.34, 0.26],
  rim: 0.6,
  rimWidth: 5,
  rimFade: 0.55,
  drop: 0.15,
  dropY: 10,
  dropBlur: 12,
  dropInk: "#3a2a00",
} as const;

type Point = readonly [number, number];

const fixed = (value: number) => value.toFixed(2);

function spline(points: readonly Point[]) {
  const n = points.length;
  const at = (index: number) => points[(index + n) % n];
  const pull = LOOK.roundness / 6;
  let d = `M${fixed(at(0)[0])} ${fixed(at(0)[1])}`;

  for (let index = 0; index < n; index++) {
    const [p0, p1, p2, p3] = [
      at(index - 1),
      at(index),
      at(index + 1),
      at(index + 2),
    ];
    const c1 = [p1[0] + (p2[0] - p0[0]) * pull, p1[1] + (p2[1] - p0[1]) * pull];
    const c2 = [p2[0] - (p3[0] - p1[0]) * pull, p2[1] - (p3[1] - p1[1]) * pull];
    d += `C${fixed(c1[0])} ${fixed(c1[1])} ${fixed(c2[0])} ${fixed(c2[1])} ${fixed(p2[0])} ${fixed(p2[1])}`;
  }

  return `${d}Z`;
}

export const twice = (d: string) =>
  d.replace(/Z$/, "") + d.replace(/^M[^C]*/, "");

export function outlines(badge: Pick<Badge, "lobes" | "scale">, ms: number) {
  const centre = LOOK.box / 2;
  const radius = (LOOK.box / 2 - LOOK.margin) * badge.scale;
  const radii = badge.lobes.map(
    ([, depth, phase]) =>
      radius *
      depth *
      (1 + LOOK.breath * Math.sin(ms / LOOK.breathPeriodMs + phase)),
  );
  const around = (shift: number) =>
    spline(
      badge.lobes.map(([angle], index): Point => [
        centre + Math.cos(angle) * (radii[index] + shift),
        centre + Math.sin(angle) * (radii[index] + shift),
      ]),
    );
  const inset = -(LOOK.textGap + LOOK.textSize * LOOK.baselineShare);

  return {
    blob: around(0),
    text: twice(around(inset)),
    line: twice(around(inset + LOOK.textSize * LOOK.lineLift)),
  };
}

export function lineDash({
  length,
  lineLength,
  textLength,
  start,
}: {
  length: number;
  lineLength: number;
  textLength: number;
  start: number;
}) {
  const scale = lineLength / length;
  const from = (start + textLength + LOOK.lineGap) * scale;
  const to = (start + length - LOOK.lineGap) * scale;
  if (to <= from)
    return { array: `0 ${(4 * lineLength).toFixed(1)}`, offset: "0" };
  return {
    array: `${(to - from).toFixed(2)} ${(4 * lineLength).toFixed(2)}`,
    offset: (-from).toFixed(2),
  };
}

const escapeText = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

export function badgeMarkup(
  badge: Badge,
  { id, ms }: { id: string; ms: number },
) {
  const paths = outlines(badge, ms);
  const last = badge.stops.length - 1;
  const stops = badge.stops
    .map(
      (colour, index) =>
        `<stop offset="${(index / last).toFixed(3)}" stop-color="${colour}"/>`,
    )
    .join("");
  const [gx, gy] = LOOK.glossRest;
  const font = `font-family:var(--font-sans,Inter),Inter,system-ui,sans-serif`;

  return [
    "<defs>",
    `<linearGradient id="${id}-fill" gradientTransform="rotate(${LOOK.gradientAngle - 90} .5 .5)">${stops}</linearGradient>`,
    `<radialGradient id="${id}-gloss" data-gloss cx="${gx}" cy="${gy}" fx="${gx}" fy="${gy}" r="${LOOK.glossSpread}">`,
    `<stop offset="0" stop-color="#fff" stop-opacity="${LOOK.glossStrength}"/>`,
    `<stop offset="${LOOK.glossMid}" stop-color="#fff" stop-opacity="${(LOOK.glossStrength * LOOK.glossMid).toFixed(3)}"/>`,
    `<stop offset="1" stop-color="#fff" stop-opacity="0"/>`,
    "</radialGradient>",
    `<linearGradient id="${id}-rim" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="${LOOK.rim}"/><stop offset="${LOOK.rimFade}" stop-color="#fff" stop-opacity="0"/></linearGradient>`,
    `<clipPath id="${id}-clip"><path data-blob d="${paths.blob}"/></clipPath>`,
    `<filter id="${id}-drop" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="${LOOK.dropY}" stdDeviation="${LOOK.dropBlur}" flood-color="${LOOK.dropInk}" flood-opacity="${LOOK.drop}"/></filter>`,
    `<path id="${id}-ring" data-ring d="${paths.text}"/>`,
    "</defs>",
    `<path data-blob filter="url(#${id}-drop)" fill="url(#${id}-fill)" d="${paths.blob}"/>`,
    `<g clip-path="url(#${id}-clip)">`,
    `<path data-blob fill="url(#${id}-gloss)" d="${paths.blob}"/>`,
    `<path data-blob fill="none" stroke="url(#${id}-rim)" stroke-width="${LOOK.rimWidth}" d="${paths.blob}"/>`,
    "</g>",
    `<path data-line fill="none" stroke="${badge.ink}" stroke-width="${LOOK.lineWeight}" stroke-linecap="round" stroke-dasharray="0 ${4 * LOOK.box}" d="${paths.line}"/>`,
    `<text fill="${badge.ink}" font-size="${LOOK.textSize}" font-weight="${LOOK.textWeight}" letter-spacing="${(LOOK.tracking * LOOK.textSize).toFixed(3)}" style="${font}">`,
    `<textPath data-text href="#${id}-ring" startOffset="0">${escapeText(badge.title)}</textPath>`,
    "</text>",
  ].join("");
}

export function placeAlong(
  svg: SVGSVGElement,
  { badge, ms, drift }: { badge: Badge; ms: number; drift: number },
) {
  const paths = outlines(badge, ms);
  for (const blob of svg.querySelectorAll("[data-blob]"))
    blob.setAttribute("d", paths.blob);
  const ring = svg.querySelector<SVGPathElement>("[data-ring]");
  const line = svg.querySelector<SVGPathElement>("[data-line]");
  const text = svg.querySelector<SVGTextContentElement>("[data-text]");
  if (!ring || !line || !text) return;

  ring.setAttribute("d", paths.text);
  line.setAttribute("d", paths.line);
  const length = ring.getTotalLength() / 2;
  const start = ((-drift % length) + length) % length;
  text.setAttribute("startOffset", start.toFixed(2));

  const dash = lineDash({
    length,
    lineLength: line.getTotalLength() / 2,
    textLength: text.getComputedTextLength(),
    start,
  });
  line.setAttribute("stroke-dasharray", dash.array);
  line.setAttribute("stroke-dashoffset", dash.offset);
}
