import type { MDXComponents } from "mdx/types";
import type { ComponentPropsWithoutRef } from "react";
import { LINK_UNDERLINED } from "@/components/link";
import { Clip } from "@/components/writing/clip";
import { Figure } from "@/components/writing/figure";
import { Note } from "@/components/writing/note-ref";

const PROSE = "mt-5 text-[clamp(1rem,1.2vw,1.125rem)] leading-[1.6]";

const HEADING =
  "mt-12 text-[clamp(1.15rem,1.7vw,1.4rem)] leading-tight font-semibold tracking-[-0.01em]";

function Heading({ children, ...rest }: ComponentPropsWithoutRef<"h2">) {
  return (
    <h2 {...rest} className={HEADING}>
      {children}
    </h2>
  );
}

function Paragraph({ children, ...rest }: ComponentPropsWithoutRef<"p">) {
  return (
    <p {...rest} className={PROSE}>
      {children}
    </p>
  );
}

function Anchor({ children, ...rest }: ComponentPropsWithoutRef<"a">) {
  return (
    <a {...rest} className={LINK_UNDERLINED}>
      {children}
    </a>
  );
}

function Strong({ children, ...rest }: ComponentPropsWithoutRef<"strong">) {
  return (
    <strong {...rest} className="font-semibold">
      {children}
    </strong>
  );
}

function Quote({ children, ...rest }: ComponentPropsWithoutRef<"blockquote">) {
  return (
    <blockquote
      {...rest}
      className="mt-8 border-l border-foreground/15 pl-5 text-foreground-soft"
    >
      {children}
    </blockquote>
  );
}

function Rule() {
  return <hr className="mt-14 border-0 border-t border-foreground/10" />;
}

const components: MDXComponents = {
  h2: Heading,
  "p": Paragraph,
  a: Anchor,
  strong: Strong,
  blockquote: Quote,
  hr: Rule,
  Figure,
  Clip,
  Note,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
