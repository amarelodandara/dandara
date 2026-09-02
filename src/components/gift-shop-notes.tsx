"use client";

import {
  useArticleNotes,
  useRequestedNote,
  type ArticleNote,
} from "@/lib/article-notes";
import {
  Announcement,
  COPIED_ANNOUNCEMENT,
  ROW,
  useCopy,
  Verb,
} from "./gift-shop-row";

const NUMBER =
  "w-3.5 shrink-0 text-[0.7rem] leading-tight tabular-nums text-foreground-hard";

const TITLE = "block text-[0.9rem] leading-tight font-semibold";

const SOURCE = "mt-0.5 block text-[0.7rem] leading-tight text-foreground-hard";

const BODY = "mt-1 block text-[0.7rem] leading-normal text-foreground-hard";

const QUOTED = "mt-4 block text-[0.7rem] leading-normal text-foreground-hard";

const CHIP = [
  "-my-1.5 -mr-1.5 flex shrink-0 items-center rounded-md px-2.5 py-1.5",
  "transition-[background-color] duration-(--motion-quick) ease-out-strong",
  "can-hover:group-hover:bg-white/50 group-focus-visible:bg-white/50",
].join(" ");

const SEAT = [
  "flex w-full rounded-lg px-3 py-3 text-left",
  "transition-[background-color] duration-(--motion-quick) ease-out-strong",
].join(" ");

const sourceOf = (href: string) => {
  try {
    return new URL(href).hostname.replace(/^www\./, "");
  } catch {
    return "Reference";
  }
};

const seatFor = (current: boolean, pressable: boolean) =>
  [
    pressable ? ROW : SEAT,
    "items-baseline gap-2.5",
    current ? "bg-white/45" : "",
  ]
    .join(" ")
    .trim();

function Marked({ note, meta }: { note: ArticleNote; meta?: string }) {
  return (
    <>
      <span aria-hidden="true" className={NUMBER}>
        {note.n}
      </span>
      <span className="min-w-0 flex-1">
        <span className={TITLE}>{note.title}</span>
        {meta ? (
          <span className={note.href ? SOURCE : BODY}>{meta}</span>
        ) : null}
      </span>
    </>
  );
}

function LinkedNote({
  note,
  current,
}: {
  note: ArticleNote;
  current: boolean;
}) {
  return (
    <a
      href={note.href}
      target="_blank"
      rel="noreferrer"
      data-note-row={note.n}
      data-note-current={current || undefined}
      data-pressable
      className={seatFor(current, true)}
    >
      <Marked note={note} meta={sourceOf(note.href as string)} />
      <span className={`${CHIP} self-center`}>
        <Verb>Open</Verb>
      </span>
    </a>
  );
}

function QuotedNote({
  note,
  current,
}: {
  note: ArticleNote;
  current: boolean;
}) {
  const body = note.body as string;
  const [outcome, copy] = useCopy(body);
  const copied = outcome === "done";

  return (
    <>
      <button
        type="button"
        onClick={copy}
        data-note-row={note.n}
        data-note-current={current || undefined}
        data-pressable
        className={seatFor(current, true)}
      >
        <span aria-hidden="true" className={NUMBER}>
          {note.n}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-baseline justify-between gap-3">
            <span className={TITLE}>{note.title}</span>
            <span className={CHIP}>
              <Verb shown={copied}>{copied ? "✓" : "Copy"}</Verb>
            </span>
          </span>
          <span className={QUOTED}>{body}</span>
        </span>
      </button>
      <Announcement>
        {outcome ? COPIED_ANNOUNCEMENT[outcome](note.title) : ""}
      </Announcement>
    </>
  );
}

function NoteRow({ note, current }: { note: ArticleNote; current: boolean }) {
  if (note.href) return <LinkedNote note={note} current={current} />;
  if (note.body) return <QuotedNote note={note} current={current} />;

  return (
    <div
      tabIndex={-1}
      data-note-row={note.n}
      data-note-current={current || undefined}
      className={seatFor(current, false)}
    >
      <Marked note={note} />
    </div>
  );
}

export function GiftShopNotes({ titled = true }: { titled?: boolean }) {
  const notes = useArticleNotes();
  const requested = useRequestedNote();

  if (notes.length === 0) return null;

  return (
    <section className={titled ? "mt-8" : "mt-6"}>
      {titled ? (
        <h3 className="px-3 text-[0.7rem] text-foreground-hard">Notes</h3>
      ) : null}
      <ul className={titled ? "mt-2 space-y-0.5" : "space-y-0.5"}>
        {notes.map((note) => (
          <li key={note.n}>
            <NoteRow note={note} current={requested === note.n} />
          </li>
        ))}
      </ul>
    </section>
  );
}
