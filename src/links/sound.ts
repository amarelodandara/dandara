import { seeded } from "@/badges/seeded";

const CLICK_SECONDS = 0.018;
const WHIRR_FROM_TICKS_PER_SECOND = 22;
const WHIRR_GAIN = 0.05;
const WHIRR_FADE_SECONDS = 0.08;
const TICK_GAIN = 0.16;
const LOUDER_PER_CARD_PER_SECOND = 0.004;

const NOISE_SEED = 7;
const LOWEST_TICK_HZ = 1800;
const HIGHER_PER_CARD_PER_SECOND = 40;
const HIGHEST_TICK_HZ = 4200;
const LAND_HZ = 320;
const LAND_GAIN = 0.22;
const LAND_SECONDS = 0.09;
const WHIRR_RATE_PER_CARD_PER_SECOND = 0.012;
const SLOWEST_WHIRR = 0.6;
const FASTEST_WHIRR = 2.4;

let context: AudioContext | null = null;
let noise: AudioBuffer | null = null;
let offset = 0;
let whirr: { source: AudioBufferSourceNode; gain: GainNode } | null = null;

function ready() {
  if (typeof AudioContext === "undefined") return null;
  context ??= new AudioContext();
  if (context.state === "suspended") void context.resume();
  if (!noise) {
    noise = context.createBuffer(1, context.sampleRate, context.sampleRate);
    const samples = noise.getChannelData(0);
    const next = seeded(NOISE_SEED);
    for (let i = 0; i < samples.length; i++) samples[i] = next() * 2 - 1;
  }
  return context;
}

function burst(audio: AudioContext, hz: number, gain: number, seconds: number) {
  const source = audio.createBufferSource();
  source.buffer = noise;
  const filter = audio.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = hz;
  const envelope = audio.createGain();
  envelope.gain.setValueAtTime(gain, audio.currentTime);
  envelope.gain.exponentialRampToValueAtTime(
    0.0001,
    audio.currentTime + seconds,
  );
  source.connect(filter).connect(envelope).connect(audio.destination);
  offset = (offset + seconds * 7) % 1;
  source.start(audio.currentTime, offset, seconds);
}

function hum(audio: AudioContext, cardsPerSecond: number) {
  if (!whirr) {
    const source = audio.createBufferSource();
    source.buffer = noise;
    source.loop = true;
    const filter = audio.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = LOWEST_TICK_HZ;
    const gain = audio.createGain();
    gain.gain.value = 0;
    source.connect(filter).connect(gain).connect(audio.destination);
    source.start();
    whirr = { source, gain };
  }
  whirr.source.playbackRate.value = Math.min(
    FASTEST_WHIRR,
    Math.max(SLOWEST_WHIRR, cardsPerSecond * WHIRR_RATE_PER_CARD_PER_SECOND),
  );
  whirr.gain.gain.setTargetAtTime(
    WHIRR_GAIN,
    audio.currentTime,
    WHIRR_FADE_SECONDS,
  );
}

function hush() {
  if (!whirr || !context) return;
  whirr.gain.gain.setTargetAtTime(0, context.currentTime, WHIRR_FADE_SECONDS);
}

export function unlockTicks() {
  ready();
}

export function tick(cardsPerSecond: number) {
  const audio = ready();
  if (!audio) return;
  const speed = Math.abs(cardsPerSecond);
  if (speed > WHIRR_FROM_TICKS_PER_SECOND) {
    hum(audio, speed);
    return;
  }
  hush();
  burst(
    audio,
    Math.min(
      HIGHEST_TICK_HZ,
      LOWEST_TICK_HZ + speed * HIGHER_PER_CARD_PER_SECOND,
    ),
    TICK_GAIN + speed * LOUDER_PER_CARD_PER_SECOND,
    CLICK_SECONDS,
  );
}

export function land() {
  hush();
  const audio = ready();
  if (!audio) return;
  burst(audio, LAND_HZ, LAND_GAIN, LAND_SECONDS);
}

export function quiet() {
  hush();
}
