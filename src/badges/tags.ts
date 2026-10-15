export const TAGS = {
  design: {
    hue: 86,
    aloneHue: 89,
    lightness: 0.97,
    spread: 0.105,
    chroma: 0.104,
  },
  life: { hue: 81, aloneHue: 77, lightness: 0.93, spread: 0.11, chroma: 0.08 },
  engineering: {
    hue: 39,
    aloneHue: 245,
    lightness: 0.84,
    spread: 0.1,
    chroma: 0.07,
  },
  education: {
    hue: 248,
    aloneHue: 123,
    lightness: 0.74,
    spread: 0.13,
    chroma: 0.128,
  },
  career: {
    hue: 149,
    aloneHue: 135,
    lightness: 0.84,
    spread: 0.1,
    chroma: 0.07,
  },
} as const;

export type Tag = keyof typeof TAGS;
