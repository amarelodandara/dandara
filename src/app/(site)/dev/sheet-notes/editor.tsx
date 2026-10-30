"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { BY_CHARACTERS, misfits, roomFor, type Field } from "@/links/fit";
import { fileKey } from "@/links/keys";
import type { Link } from "@/links/link";
import { Sheet } from "@/links/sheet";
import { Visit } from "@/links/visit";
import { ANNOTATION, LABEL, PROSE, SECTION_HEADING } from "@/lib/type";

const STORE = "dev:sheet-notes";
const COPIED_FOR_MS = 1200;

type Draft = Pick<Link, "title" | "by" | "note">;
type Drafts = Record<string, Draft>;
type Filter = "misfit" | "bare" | "edited" | "all";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "misfit", label: "Too long" },
  { id: "bare", label: "No note" },
  { id: "edited", label: "Edited" },
  { id: "all", label: "All" },
];

const CHIP = `rounded-full px-3 py-1.5 ${ANNOTATION} leading-none`;

function stored(): Drafts {
  try {
    const raw = localStorage.getItem(STORE);
    return raw ? (JSON.parse(raw) as Drafts) : {};
  } catch {
    return {};
  }
}

const tidy = (value = "") => value.replaceAll(/\s+/g, " ").trim() || undefined;

const changed = (link: Link, draft: Draft | undefined) =>
  draft !== undefined &&
  (tidy(draft.title) !== link.title ||
    tidy(draft.by) !== link.by ||
    tidy(draft.note) !== link.note);

function Counter({ left, id }: { left: number; id: string }) {
  return (
    <span
      id={id}
      className={`${ANNOTATION} tabular-nums ${left < 0 ? "text-cadmium-800" : "text-graphite-500"}`}
    >
      {left < 0 ? `${-left} over` : `${left} left`}
    </span>
  );
}

function Text({
  id,
  name,
  value,
  left,
  lines,
  onChange,
}: {
  id: string;
  name: string;
  value: string;
  left: number;
  lines: number;
  onChange: (value: string) => void;
}) {
  const counter = `${id}-counter`;
  return (
    <label className="flex flex-col gap-1">
      <span className="flex items-baseline justify-between gap-2">
        <span className={`${LABEL} text-graphite-700`}>{name}</span>
        <Counter left={left} id={counter} />
      </span>
      <textarea
        value={value}
        rows={lines}
        aria-invalid={left < 0 || undefined}
        aria-describedby={counter}
        onChange={(event) => onChange(event.target.value)}
        className={`resize-y rounded-sm bg-graphite-50 px-2 py-1.5 text-graphite-900 shadow-label aria-invalid:outline-2 aria-invalid:outline-cadmium-600 ${PROSE}`}
      />
    </label>
  );
}

function Card({
  link,
  index,
  draft,
  onChange,
}: {
  link: Link;
  index: number;
  draft: Draft;
  onChange: (draft: Draft) => void;
}) {
  const shown = {
    ...link,
    title: tidy(draft.title) ?? "",
    by: tidy(draft.by),
    note: tidy(draft.note),
  };
  const left = (field: Field) => roomFor(shown, field);
  const set = (field: keyof Draft) => (value: string) =>
    onChange({ ...draft, [field]: value });

  return (
    <li className="grid gap-6 md:grid-cols-[24rem_minmax(0,1fr)] md:gap-12">
      <div className="w-[86vw] sm:w-[min(24rem,76vw)]">
        <Sheet
          link={shown}
          index={index}
          letter={fileKey(shown.title).charAt(0)}
          corner={shown.url ? <Visit link={shown} /> : null}
        >
          {shown.url ? (
            <div className="relative -mx-2 mt-2 flex max-sm:hidden">
              <Visit link={shown} />
            </div>
          ) : null}
        </Sheet>
      </div>
      <div className="flex flex-col gap-4">
        <Text
          id={`title-${link.slug}`}
          name="Title"
          value={draft.title}
          left={left("title")}
          lines={2}
          onChange={set("title")}
        />
        <label className="flex flex-col gap-1">
          <span className="flex items-baseline justify-between gap-2">
            <span className={`${LABEL} text-graphite-700`}>By</span>
            <Counter
              left={BY_CHARACTERS - (shown.by?.length ?? 0)}
              id={`by-${link.slug}`}
            />
          </span>
          <input
            value={draft.by ?? ""}
            aria-invalid={(shown.by?.length ?? 0) > BY_CHARACTERS || undefined}
            aria-describedby={`by-${link.slug}`}
            onChange={(event) => set("by")(event.target.value)}
            className={`rounded-sm bg-graphite-50 px-2 py-1.5 text-graphite-900 shadow-label aria-invalid:outline-2 aria-invalid:outline-cadmium-600 ${PROSE}`}
          />
        </label>
        <Text
          id={`note-${link.slug}`}
          name="Note"
          value={draft.note ?? ""}
          left={left("note")}
          lines={4}
          onChange={set("note")}
        />
      </div>
    </li>
  );
}

function Editor({ links }: { links: Link[] }) {
  const [drafts, setDrafts] = useState<Drafts>(stored);
  const [copied, setCopied] = useState(false);
  const draftOf = (link: Link): Draft => drafts[link.slug] ?? link;
  const fixed = (link: Link) => {
    const draft = draftOf(link);
    return {
      ...link,
      title: tidy(draft.title) ?? "",
      by: tidy(draft.by),
      note: tidy(draft.note),
    };
  };
  const misfit = links.filter((link) => misfits(fixed(link)).length > 0);
  const edited = links.filter((link) => changed(link, drafts[link.slug]));
  const bare = links.filter((link) => !fixed(link).note);
  const [filter, setFilter] = useState<Filter>(
    misfit.length > 0 ? "misfit" : "all",
  );
  const [shownSlugs] = useState(() => new Set(misfit.map(({ slug }) => slug)));
  const [bareSlugs] = useState(() => new Set(bare.map(({ slug }) => slug)));

  useEffect(() => {
    try {
      localStorage.setItem(STORE, JSON.stringify(drafts));
    } catch {}
  }, [drafts]);

  const counts: Record<Filter, number> = {
    misfit: misfit.length,
    bare: bareSlugs.size,
    edited: edited.length,
    all: links.length,
  };

  const shown = links.filter((link) => {
    if (filter === "misfit") return shownSlugs.has(link.slug);
    if (filter === "bare") return bareSlugs.has(link.slug);
    if (filter === "edited") return changed(link, drafts[link.slug]);
    return true;
  });

  async function copy() {
    const list = edited.map((link) => {
      const { slug, title, url, tag, by, note } = fixed(link);
      return { slug, title, url, tag, by, note };
    });
    await navigator.clipboard.writeText(JSON.stringify(list, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), COPIED_FOR_MS);
  }

  return (
    <main className="mx-auto w-full max-w-[1400px] flex-1 px-[7vw] pt-[9vh] pb-[18vh]">
      <h1 className={SECTION_HEADING}>Sheet notes</h1>
      <p className={`mt-2 max-w-xl ${PROSE} text-graphite-700`}>
        Write each sheet to fit a 320px phone. The counters count what is left
        before the sheet runs out of room on a phone or a wide screen, whichever
        is tighter. Title and note share the space.
      </p>

      <ul className="mt-12 flex flex-col gap-16">
        {shown.map((link) => (
          <Card
            key={link.slug}
            link={link}
            index={links.indexOf(link)}
            draft={draftOf(link)}
            onChange={(draft) =>
              setDrafts((now) => ({ ...now, [link.slug]: draft }))
            }
          />
        ))}
      </ul>

      <nav
        aria-label="Sheet notes"
        className="fixed bottom-4 left-1/2 z-50 flex max-w-[calc(100vw-2rem)] -translate-x-1/2 items-center gap-1 overflow-x-auto rounded-full bg-graphite-100 p-1 whitespace-nowrap"
      >
        {FILTERS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            aria-pressed={filter === id}
            onClick={() => setFilter(id)}
            className={`${CHIP} text-graphite-700 aria-pressed:bg-graphite-50 aria-pressed:text-graphite-900 aria-pressed:shadow-chip`}
          >
            {label} · {counts[id]}
          </button>
        ))}
        <button
          type="button"
          disabled={edited.length === 0}
          onClick={() => void copy()}
          className={`${CHIP} bg-graphite-900 text-graphite-50 disabled:bg-graphite-300`}
        >
          {copied ? "Copied" : `Copy ${edited.length} edited`}
        </button>
        <button
          type="button"
          disabled={edited.length === 0}
          onClick={() => setDrafts({})}
          className={`${CHIP} text-graphite-700 disabled:text-graphite-400`}
        >
          Reset
        </button>
      </nav>
    </main>
  );
}

const unsubscribe = () => {};
const nothing = () => unsubscribe;
const onClient = () => true;
const onServer = () => false;

export function SheetNotes({ links }: { links: Link[] }) {
  const mounted = useSyncExternalStore(nothing, onClient, onServer);
  return mounted ? <Editor links={links} /> : null;
}
