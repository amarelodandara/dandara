export const COLOR_FORMATS = ["oklch", "hex", "hsl", "variables"] as const;

export type ColorFormat = (typeof COLOR_FORMATS)[number];

export const FORMAT_LABELS: Record<ColorFormat, string> = {
  oklch: "oklch",
  hex: "hex codes",
  hsl: "hsl",
  variables: "CSS variables",
};

type Rgb = { red: number; green: number; blue: number };

function parse(color: string) {
  const parts = color
    .replace("oklch(", "")
    .replace(")", "")
    .trim()
    .split(/\s+/)
    .map((part) => Number.parseFloat(part));
  return { lum: parts[0], chroma: parts[1], hue: parts[2] };
}

function linear(lum: number, chroma: number, hue: number): Rgb {
  const radians = (hue * Math.PI) / 180;
  const alpha = chroma * Math.cos(radians);
  const beta = chroma * Math.sin(radians);
  const long = (lum + 0.3963377774 * alpha + 0.2158037573 * beta) ** 3;
  const medium = (lum - 0.1055613458 * alpha - 0.0638541728 * beta) ** 3;
  const short = (lum - 0.0894841775 * alpha - 1.291485548 * beta) ** 3;
  return {
    red: 4.0767416621 * long - 3.3077115913 * medium + 0.2309699292 * short,
    green: -1.2684380046 * long + 2.6097574011 * medium - 0.3413193965 * short,
    blue: -0.0041960863 * long - 0.7034186147 * medium + 1.707614701 * short,
  };
}

function inGamut({ red, green, blue }: Rgb) {
  const low = -0.0001;
  const high = 1.0001;
  return [red, green, blue].every((one) => one >= low && one <= high);
}

function encode(channel: number) {
  const clamped = Math.min(1, Math.max(0, channel));
  const encoded =
    clamped <= 0.0031308
      ? 12.92 * clamped
      : 1.055 * clamped ** (1 / 2.4) - 0.055;
  return Math.round(encoded * 255);
}

function fit(lum: number, chroma: number, hue: number) {
  if (inGamut(linear(lum, chroma, hue))) return chroma;
  let low = 0;
  let high = chroma;
  for (let step = 0; step < 24; step += 1) {
    const middle = (low + high) / 2;
    if (inGamut(linear(lum, middle, hue))) low = middle;
    else high = middle;
  }
  return low;
}

function pair(channel: number) {
  return channel.toString(16).padStart(2, "0");
}

function toRgb(color: string): Rgb {
  const { lum, chroma, hue } = parse(color);
  const mapped = linear(lum, fit(lum, chroma, hue), hue);
  return {
    red: encode(mapped.red),
    green: encode(mapped.green),
    blue: encode(mapped.blue),
  };
}

function toHex(color: string) {
  const { red, green, blue } = toRgb(color);
  return `#${pair(red)}${pair(green)}${pair(blue)}`;
}

function toHsl(color: string) {
  const { red, green, blue } = toRgb(color);
  const scaled = [red / 255, green / 255, blue / 255];
  const high = Math.max(...scaled);
  const low = Math.min(...scaled);
  const span = high - low;
  const light = (high + low) / 2;
  const saturation = span === 0 ? 0 : span / (1 - Math.abs(2 * light - 1));

  let hue = 0;
  if (span !== 0) {
    const [redPart, greenPart, bluePart] = scaled;
    if (high === redPart) hue = ((greenPart - bluePart) / span) % 6;
    else if (high === greenPart) hue = (bluePart - redPart) / span + 2;
    else hue = (redPart - greenPart) / span + 4;
    hue *= 60;
    if (hue < 0) hue += 360;
  }

  const round = (value: number) => Math.round(value * 10) / 10;
  return `hsl(${round(hue)} ${round(saturation * 100)}% ${round(light * 100)}%)`;
}

export function formatColor(
  color: string,
  format: ColorFormat,
  name: string,
): string {
  if (format === "hex") return toHex(color);
  if (format === "hsl") return toHsl(color);
  if (format === "variables") return `--${name}: ${color};`;
  return color;
}

export function formatPalette(
  colors: string[],
  format: ColorFormat,
  slug: string,
): string {
  return colors
    .map((color, index) => formatColor(color, format, `${slug}-${index + 1}`))
    .join("\n");
}
