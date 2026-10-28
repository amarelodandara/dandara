"use client";

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  FALL_RANGES,
  FALL_SETTINGS,
  SHEET_RANGES,
  SHEET_SETTINGS,
  type FallSettings,
  type Settings,
} from "./controls";
import { Fall, SLOT } from "@/links/drum";
import { Intro } from "@/links/intro";
import { fileKey } from "@/links/keys";
import {
  INTRO_LOOK,
  ROLES,
  SHEET_LOOK,
  TEXT,
  type IntroLook,
  type Part,
  type Role,
  type SheetLook,
  type Step,
} from "@/links/look";
import { Sheet, type SheetLink } from "@/links/sheet";
import { paintSlot } from "@/links/use-roll";
import { Visit } from "@/links/visit";
import { ANNOTATION, LABEL, MICRO } from "@/lib/type";

const STORE = "dev:intro-sheet";

type Saved = {
  sheet?: Partial<Settings>;
  fall?: Partial<FallSettings>;
  intro?: Partial<IntroLook>;
  parts?: Partial<IntroLook>;
  link?: Partial<SheetLook>;
};

const STEPS = Object.keys(TEXT) as Step[];
const ROLE_NAMES = Object.keys(ROLES) as Role[];
const LETTERS = Array.from({ length: 26 }, (_, at) =>
  String.fromCodePoint(97 + at),
);

type Specimen = { count: number; link: SheetLink; index: number };

function stored(): Saved {
  try {
    const raw = localStorage.getItem(STORE);
    return raw ? (JSON.parse(raw) as Saved) : {};
  } catch {
    return {};
  }
}

const TUNED = [
  "[&>div]:[aspect-ratio:var(--tune-aspect)]",
  "[&>div]:[border-radius:var(--tune-rx)/var(--tune-ry)]",
  "[&>div]:[padding:var(--tune-padding)]",
  "[&>div]:[box-shadow:0_0_0_1px_oklch(0_0_0/var(--tune-ring))]",
].join(" ");

const TUNED_SHEET = [
  "[&>div>div]:[aspect-ratio:var(--tune-aspect)]",
  "[&>div>div]:[border-radius:var(--tune-rx)/var(--tune-ry)]",
  "[&>div>div]:[padding:var(--tune-padding)]",
  "[&>div>div]:[box-shadow:0_0_0_1px_oklch(0_0_0/var(--tune-ring))]",
].join(" ");

function Row({ name, children }: { name: string; children: ReactNode }) {
  return (
    <label className="grid grid-cols-[7rem_1fr] items-center gap-2">
      <span className={`truncate ${ANNOTATION} text-graphite-700`}>{name}</span>
      {children}
    </label>
  );
}

function Slider({
  name,
  value,
  range,
  onChange,
}: {
  name: string;
  value: number;
  range: { min: number; max: number; step: number };
  onChange: (value: number) => void;
}) {
  return (
    <Row name={name}>
      <span className="flex items-center gap-2">
        <input
          type="range"
          {...range}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          className="min-w-0 flex-1 accent-graphite-900"
        />
        <input
          type="number"
          {...range}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          className={`w-14 rounded-sm bg-graphite-100 px-1 py-0.5 ${MICRO} text-graphite-900 tabular-nums`}
        />
      </span>
    </Row>
  );
}

function Choice({
  name,
  value,
  options,
  onChange,
}: {
  name: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <Row name={name}>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`rounded-sm bg-graphite-100 px-1 py-0.5 ${ANNOTATION} text-graphite-900`}
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </Row>
  );
}

function Looks<T extends Record<string, Step | Part>>({
  title,
  base,
  value,
  onChange,
}: {
  title: string;
  base: T;
  value: T;
  onChange: (next: T) => void;
}) {
  const keys = Object.keys(base) as (keyof T & string)[];
  const set = (key: keyof T, next: Step | Part) =>
    onChange({ ...value, [key]: next });
  return (
    <>
      <Group title={`${title} · colour`}>
        {keys
          .filter((key) => typeof base[key] === "string")
          .map((key) => (
            <Choice
              key={key}
              name={key}
              value={value[key] as Step}
              options={STEPS}
              onChange={(next) => set(key, next as Step)}
            />
          ))}
      </Group>
      {keys
        .filter((key) => typeof base[key] !== "string")
        .map((key) => {
          const part = value[key] as Part;
          return (
            <Group key={key} title={`${title} · ${key}`}>
              <Choice
                name="role"
                value={part.role}
                options={ROLE_NAMES}
                onChange={(next) => set(key, { ...part, role: next as Role })}
              />
              <Choice
                name="colour"
                value={part.colour}
                options={STEPS}
                onChange={(next) => set(key, { ...part, colour: next as Step })}
              />
            </Group>
          );
        })}
    </>
  );
}

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className={`mb-2 ${LABEL} text-graphite-900`}>{title}</legend>
      {children}
    </fieldset>
  );
}

function Panel({ count, link, index }: Specimen) {
  const root = useRef<HTMLDivElement>(null);
  const introSlot = useRef<HTMLDivElement>(null);
  const sheetSlot = useRef<HTMLDivElement>(null);
  const [settings, setSettings] = useState<Settings>(() => ({
    ...SHEET_SETTINGS,
    ...stored().sheet,
  }));
  const [fall, setFall] = useState<FallSettings>(() => ({
    ...FALL_SETTINGS,
    ...stored().fall,
  }));
  const [intro, setIntro] = useState<IntroLook>(() => ({
    ...INTRO_LOOK,
    ...(stored().intro ?? stored().parts),
  }));
  const [parts, setParts] = useState<SheetLook>(() => ({
    ...SHEET_LOOK,
    ...stored().link,
  }));
  const [letter, setLetter] = useState(() => fileKey(link.title).charAt(0));
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORE,
        JSON.stringify({ sheet: settings, fall, intro, link: parts }),
      );
    } catch {}
    const look = settings;
    const vars: Record<string, string> = {
      "--tune-width": `${look.width}rem`,
      "--tune-tilt": `${look.tilt}deg`,
      "--tune-aspect": String(look.aspect),
      "--tune-rx": `${look.radiusX}%`,
      "--tune-ry": `${look.radiusY}%`,
      "--tune-padding": `${look.padding}rem`,
      "--tune-ring": String(look.ring),
    };
    for (const [name, value] of Object.entries(vars))
      root.current?.style.setProperty(name, value);
  }, [settings, fall, intro, parts]);

  useEffect(() => {
    const { position, ...tuning } = fall;
    for (const slot of [introSlot.current, sheetSlot.current])
      if (slot) paintSlot(slot, position, tuning);
  }, [fall]);

  const setSheet = <K extends keyof Settings>(key: K, value: Settings[K]) =>
    setSettings((now) => ({ ...now, [key]: value }));

  async function copy() {
    await navigator.clipboard.writeText(
      JSON.stringify({ sheet: settings, fall, intro, link: parts }, null, 2),
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  }

  const look = settings;

  const sheet = (
    <Sheet link={link} index={index} letter={letter} parts={parts}>
      <div className={`relative -mx-2 mt-2 flex ${TEXT[parts.visit]}`}>
        <Visit link={link} />
      </div>
    </Sheet>
  );

  return (
    <div
      ref={root}
      data-links
      className="flex min-h-dvh w-full flex-col md:flex-row"
    >
      <main className="flex flex-1 flex-col items-center gap-16 px-[7vw] py-[9vh] sm:py-[12vh]">
        <figure className="flex flex-col gap-3">
          <div className="flex flex-wrap items-end justify-center gap-8">
            <div className={`relative w-(--tune-width) ${TUNED}`}>
              <Intro count={count} parts={intro} />
            </div>
            <div className={`relative w-(--tune-width) ${TUNED_SHEET}`}>
              {sheet}
            </div>
          </div>
          <figcaption className={`${ANNOTATION} text-graphite-600`}>
            flat
          </figcaption>
        </figure>
        <figure className="flex flex-col gap-3">
          <div className="flex flex-wrap items-end justify-center gap-8">
            <div className="pb-16 perspective-distant perspective-origin-[50%_20%]">
              <div className="relative aspect-(--tune-aspect) w-(--tune-width) rotate-x-(--tune-tilt) transform-3d">
                <div ref={introSlot} className={`${SLOT} ${TUNED}`}>
                  <Intro count={count} parts={intro} />
                  <Fall />
                </div>
              </div>
            </div>
            <div className="pb-16 perspective-distant perspective-origin-[50%_20%]">
              <div className="relative aspect-(--tune-aspect) w-(--tune-width) rotate-x-(--tune-tilt) transform-3d">
                <div ref={sheetSlot} className={`${SLOT} ${TUNED_SHEET}`}>
                  {sheet}
                  <Fall />
                </div>
              </div>
            </div>
          </div>
          <figcaption className={`${ANNOTATION} text-graphite-600`}>
            in the drum · rolled to {fall.position}
          </figcaption>
        </figure>
        <figure className="flex flex-col gap-3">
          <div className="flex flex-wrap items-end justify-center gap-8">
            <div className={`relative w-(--tune-width) zoom-[2] ${TUNED}`}>
              <Intro count={count} parts={intro} />
            </div>
            <div
              className={`relative w-(--tune-width) zoom-[2] ${TUNED_SHEET}`}
            >
              {sheet}
            </div>
          </div>
          <figcaption className={`${ANNOTATION} text-graphite-600`}>
            2×
          </figcaption>
        </figure>
      </main>

      <aside className="flex w-full flex-col gap-8 overflow-y-auto bg-graphite-50 p-6 shadow-label md:sticky md:top-0 md:h-dvh md:w-88">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => void copy()}
            className={`rounded-full bg-graphite-900 px-3 py-1.5 ${ANNOTATION} leading-none text-graphite-50`}
          >
            {copied ? "Copied" : "Copy values"}
          </button>
          <button
            type="button"
            onClick={() => {
              setSettings(SHEET_SETTINGS);
              setFall(FALL_SETTINGS);
              setIntro(INTRO_LOOK);
              setParts(SHEET_LOOK);
            }}
            className={`rounded-full bg-graphite-100 px-3 py-1.5 ${ANNOTATION} leading-none text-graphite-900`}
          >
            Reset
          </button>
        </div>

        <Group title="Tab">
          <Choice
            name="letter"
            value={letter}
            options={LETTERS}
            onChange={setLetter}
          />
        </Group>

        <Group title="Sheet">
          {Object.entries(SHEET_RANGES).map(([key, range]) => (
            <Slider
              key={key}
              name={key}
              range={range}
              value={look[key as keyof typeof SHEET_RANGES] as number}
              onChange={(value) =>
                setSheet(key as keyof typeof SHEET_RANGES, value)
              }
            />
          ))}
        </Group>

        <Looks
          title="Intro"
          base={INTRO_LOOK}
          value={intro}
          onChange={setIntro}
        />

        <Looks
          title="Link sheet"
          base={SHEET_LOOK}
          value={parts}
          onChange={setParts}
        />

        <Group title="Rolling down">
          {Object.entries(FALL_RANGES).map(([key, range]) => (
            <Slider
              key={key}
              name={key}
              range={range}
              value={fall[key as keyof FallSettings]}
              onChange={(value) => setFall((now) => ({ ...now, [key]: value }))}
            />
          ))}
        </Group>
      </aside>
    </div>
  );
}

const unsubscribe = () => {};
const nothing = () => unsubscribe;
const onClient = () => true;
const onServer = () => false;

export function Tuner(specimen: Specimen) {
  const mounted = useSyncExternalStore(nothing, onClient, onServer);
  return mounted ? <Panel {...specimen} /> : null;
}
