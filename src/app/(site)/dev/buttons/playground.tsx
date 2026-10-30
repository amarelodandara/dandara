"use client";

import {
  useEffect,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  BUTTON_ROLES,
  buttonClass,
  INKS,
  KEY_LOOK,
  PADS,
  PRESSES,
  RADII,
  REMOVE_LOOK,
  removeClass,
  SHADOWS,
  SURFACES,
  type ButtonLook,
  type ButtonState,
  type RemoveLook,
} from "@/links/buttons";
import type { Ref } from "@/links/export";
import { MorphLabel, Reveal } from "@/links/morph";
import { Selection } from "@/links/selection";
import { Sheet, type SheetLink } from "@/links/sheet";
import { Visit } from "@/links/visit";
import { LINK_UNDERLINED } from "@/components/link";
import { ANNOTATION, LABEL, PROSE, SECTION_HEADING } from "@/lib/type";

const STORE = "dev:buttons:2";
const COPIED_FOR_MS = 1200;
const STATES: ButtonState[] = ["rest", "hover", "pressed", "focus"];
const ROLE_NAMES = Object.keys(BUTTON_ROLES);

type Saved = { key?: Partial<ButtonLook>; remove?: Partial<RemoveLook> };

const CHIP = `rounded-full px-3 py-1.5 ${ANNOTATION} leading-none`;

function stored(): Saved {
  try {
    const raw = localStorage.getItem(STORE);
    return raw ? (JSON.parse(raw) as Saved) : {};
  } catch {
    return {};
  }
}

function Row({ name, children }: { name: string; children: ReactNode }) {
  return (
    <label className="grid grid-cols-[6rem_1fr] items-center gap-2">
      <span className={`${ANNOTATION} text-graphite-700`}>{name}</span>
      {children}
    </label>
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
  options: readonly string[];
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

const KNOBS: [keyof ButtonLook, readonly string[]][] = [
  ["role", ROLE_NAMES],
  ["ink", INKS],
  ["hoverInk", INKS],
  ["surface", SURFACES],
  ["hover", SURFACES],
  ["shadow", SHADOWS],
  ["hoverShadow", SHADOWS],
  ["radius", RADII],
  ["x", PADS],
  ["y", PADS],
  ["press", PRESSES],
];

const REMOVE_KNOBS: [keyof RemoveLook, readonly string[]][] = [
  ["shows", ["hover", "always"]],
  ["label", ["Remove", "×"]],
  ["place", ["inline", "end"]],
];

function valid<T extends ButtonLook>(
  base: T,
  saved: Partial<T> | undefined,
  knobs: [keyof T, readonly string[]][],
): T {
  const allowed = new Map(knobs);
  const kept = Object.entries(saved ?? {}).filter(([key, value]) =>
    allowed.get(key as keyof T)?.includes(String(value)),
  );
  return { ...base, ...Object.fromEntries(kept) };
}

function Knobs<T extends ButtonLook>({
  title,
  value,
  knobs,
  onChange,
}: {
  title: string;
  value: T;
  knobs: [keyof T, readonly string[]][];
  onChange: (next: T) => void;
}) {
  return (
    <section className="flex flex-col gap-2">
      <h2 className={`${LABEL} text-graphite-900`}>{title}</h2>
      {knobs.map(([key, options]) => (
        <Choice
          key={String(key)}
          name={String(key)}
          value={String(value[key])}
          options={options}
          onChange={(next) => onChange({ ...value, [key]: next })}
        />
      ))}
    </section>
  );
}

function Figure({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-6">
      <h2 className={SECTION_HEADING}>{title}</h2>
      {children}
    </section>
  );
}

function States({ render }: { render: (state: ButtonState) => ReactNode }) {
  return (
    <div className="flex flex-wrap items-end gap-8">
      {STATES.map((state) => (
        <figure key={state} className="flex flex-col items-start gap-2">
          {render(state)}
          <figcaption className={`${ANNOTATION} text-graphite-500`}>
            {state}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

function Editor({ link, refs }: { link: SheetLink; refs: Ref[] }) {
  const [key, setKey] = useState<ButtonLook>(() => ({
    ...valid(KEY_LOOK, stored().key, KNOBS),
  }));
  const [remove, setRemove] = useState<RemoveLook>(() => ({
    ...valid(REMOVE_LOOK, stored().remove, [...KNOBS, ...REMOVE_KNOBS]),
  }));
  const [rolled, setRolled] = useState(false);
  const [picked, setPicked] = useState(false);
  const [list, setList] = useState(refs);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORE, JSON.stringify({ key, remove }));
    } catch {}
  }, [key, remove]);

  async function copy() {
    await navigator.clipboard.writeText(
      JSON.stringify({ key, remove }, null, 2),
    );
    setCopied(true);
    setTimeout(() => setCopied(false), COPIED_FOR_MS);
  }

  const keyClass = buttonClass(key);
  const [first] = refs;

  return (
    <div className="flex min-h-dvh w-full flex-col md:flex-row">
      <main className="flex flex-1 flex-col gap-16 px-[7vw] py-[9vh] sm:py-[12vh]">
        <Figure title="Above the drum">
          <div className="flex flex-col items-center gap-12">
            <div className="flex justify-center gap-2">
              <button
                type="button"
                onClick={() => setRolled((now) => !now)}
                className={keyClass}
              >
                <MorphLabel>
                  {rolled ? "Roll it back up" : "Roll all"}
                </MorphLabel>
              </button>
              <button type="button" className={keyClass}>
                Get random
              </button>
              <Reveal shown={picked}>
                <button type="button" className={keyClass}>
                  Export
                </button>
              </Reveal>
            </div>
            <div className="w-[min(24rem,86vw)]">
              <Sheet
                link={link}
                index={0}
                picked={picked}
                onPick={() => setPicked((now) => !now)}
                corner={<Visit link={link} />}
              >
                <div className="relative -mx-2 mt-2 flex max-sm:hidden">
                  <Visit link={link} />
                </div>
              </Sheet>
            </div>
          </div>
          <States
            render={(state) => (
              <span className={buttonClass(key, state)}>Roll all</span>
            )}
          />
        </Figure>

        <Figure title="Remove">
          <States
            render={(state) => (
              <p className={`group ${PROSE}`}>
                <span className={LINK_UNDERLINED}>{first.title}</span>
                {first.by ? (
                  <span className="text-graphite-700"> — {first.by}</span>
                ) : null}
                <span className={removeClass(remove, state)}>
                  {remove.label}
                </span>
              </p>
            )}
          />
        </Figure>

        <Figure title="Picked list">
          <div>
            <button
              type="button"
              onClick={() => setList(refs)}
              className={`${CHIP} bg-graphite-100 text-graphite-900`}
            >
              Refill
            </button>
          </div>
          <Selection
            refs={list}
            all={false}
            rushing={false}
            remove={remove}
            onRemove={(slug) =>
              setList((now) => now.filter((ref) => ref.slug !== slug))
            }
          />
        </Figure>
      </main>

      <aside className="flex w-full flex-col gap-8 overflow-y-auto bg-graphite-50 p-6 shadow-label md:sticky md:top-0 md:h-dvh md:w-80">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => void copy()}
            className={`${CHIP} bg-graphite-900 text-graphite-50`}
          >
            {copied ? "Copied" : "Copy values"}
          </button>
          <button
            type="button"
            onClick={() => {
              setKey(KEY_LOOK);
              setRemove(REMOVE_LOOK);
            }}
            className={`${CHIP} bg-graphite-100 text-graphite-900`}
          >
            Reset
          </button>
        </div>
        <Knobs
          title="Action buttons"
          value={key}
          knobs={KNOBS}
          onChange={setKey}
        />
        <Knobs
          title="Remove"
          value={remove}
          knobs={[...KNOBS, ...REMOVE_KNOBS]}
          onChange={setRemove}
        />
      </aside>
    </div>
  );
}

const unsubscribe = () => {};
const nothing = () => unsubscribe;
const onClient = () => true;
const onServer = () => false;

export function Playground(props: { link: SheetLink; refs: Ref[] }) {
  const mounted = useSyncExternalStore(nothing, onClient, onServer);
  return mounted ? <Editor {...props} /> : null;
}
