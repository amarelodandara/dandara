"use client";

import {
  useArticleNotes,
  useRequestedNote,
  type ArticleNote,
} from "@/lib/article-notes";
import { ROW, Verb } from "./gift-shop-row";

const NUMBER =
  "w-3.5 shrink-0 text-[0.7rem] leading-tight font-medium tabular-nums text-foreground-hard";

const TITLE = "block text-[0.9rem] leading-tight font-semibold";

const SOURCE = "mt-0.5 block text-[0.7rem] leading-tight text-foreground-hard";

const BODY = "mt-1 block text-[0.7rem] leading-normal text-foreground-hard";

const READING_ROW = [
  "flex w-full rounded-lg px-3 py-3 text-left",
  "transition-[background-color] duration-(--motion-quick) ease-out-strong",
  "outline-none focus:outline-2 focus:outline-offset-2 focus:outline-foreground/40",
].join(" ");

const sourceOf = (href: string) => {
  try {
    return new URL(href).hostname.replace(/^www\./, "");
  } catch {
    return "Reference";
  }
};

function NoteRow({ note, current }: { note: ArticleNote; current: boolean }) {
  const seat = [
    note.href ? ROW : READING_ROW,
    "items-baseline gap-2.5",
    current ? "bg-white/45" : "",
  ]
    .join(" ")
    .trim();

  const marked = (
    <>
      <span aria-hidden="true" className={NUMBER}>
        {note.n}
      </span>
      <span className="min-w-0 flex-1">
        <span className={TITLE}>{note.title}</span>
        {note.href ? (
          <span className={SOURCE}>{sourceOf(note.href)}</span>
        ) : (
          <span className={BODY}>{note.body}</span>
        )}
      </span>
    </>
  );

  if (!note.href) {
    return (
      <div
        tabIndex={-1}
        data-note-row={note.n}
        data-note-current={current || undefined}
        className={seat}
      >
        {marked}
      </div>
    );
  }

  return (
    <a
      href={note.href}
      target="_blank"
      rel="noreferrer"
      data-note-row={note.n}
      data-note-current={current || undefined}
      data-pressable
      className={seat}
    >
      {marked}
      <Verb>Open</Verb>
    </a>
  );
}

export function GiftShopNotes() {
  const notes = useArticleNotes();
  const requested = useRequestedNote();

  if (notes.length === 0) return null;

  return (
    <section className="mt-8">
      <h3 className="px-3 text-[0.7rem] font-medium tracking-[0.01em] text-foreground-hard">
        Notes
      </h3>
      <ul className="mt-2 space-y-0.5">
        {notes.map((note) => (
          <li key={note.n}>
            <NoteRow note={note} current={requested === note.n} />
          </li>
        ))}
      </ul>
    </section>
  );
}
