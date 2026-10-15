export function hash(text: string) {
  let h = 2_166_136_261;
  for (const char of text) {
    h ^= char.codePointAt(0) ?? 0;
    h = Math.imul(h, 16_777_619);
  }
  return h >>> 0;
}

export function seeded(seed: number) {
  let a = seed;
  return () => {
    a = Math.imul(a + 0x6D_2B_79_F5, 1);
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4_294_967_296;
  };
}
