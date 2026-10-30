import { FALL } from "@/links/use-roll";

export const SHEET_SETTINGS = {
  width: 24,
  tilt: -12,
  aspect: 16 / 9,
  radiusX: 1.4,
  radiusY: 2.5,
  padding: 1.5,
  ring: 0.09,
};

export type Settings = typeof SHEET_SETTINGS;

type Range = { min: number; max: number; step: number };

export const SHEET_RANGES: Partial<Record<keyof Settings, Range>> = {
  width: { min: 12, max: 48, step: 0.5 },
  tilt: { min: -45, max: 45, step: 1 },
  aspect: { min: 1, max: 2.5, step: 0.01 },
  radiusX: { min: 0, max: 10, step: 0.1 },
  radiusY: { min: 0, max: 10, step: 0.1 },
  padding: { min: 0, max: 4, step: 0.125 },
  ring: { min: 0, max: 0.5, step: 0.01 },
};

export const FALL_SETTINGS = { ...FALL, position: -0.35 };

export type FallSettings = typeof FALL_SETTINGS;

export const FALL_RANGES: Record<keyof FallSettings, Range> = {
  position: { min: -1.5, max: 1, step: 0.01 },
  mostBlur: { min: 0, max: 20, step: 0.5 },
  from: { min: 0, max: 1, step: 0.01 },
  over: { min: 0.1, max: 2, step: 0.01 },
  feather: { min: 2, max: 60, step: 1 },
};
