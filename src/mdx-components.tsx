import type { MDXComponents } from "mdx/types";
import { isValidElement } from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { LINK_UNDERLINED } from "@/components/link";
import { PROSE, SECTION_HEADING, STRONG } from "@/lib/type";
import { Clip } from "@/components/writing/clip";
import { Figure } from "@/components/writing/figure";
import { Note } from "@/components/writing/note-ref";

const textOf = (node: ReactNode): string => {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map((child) => textOf(child)).join("");
  if (isValidElement<{ children?: ReactNode }>(node))
    return textOf(node.props.children);
  return "";
};

const slug = (node: ReactNode) =>
  textOf(node)
    .normalize("NFD")
    .replaceAll(/[\u0300-\u036F]/g, "")
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, "-")
    .replaceAll(/^-|-$/g, "");

function Heading({ children, ...rest }: ComponentPropsWithoutRef<"h2">) {
  return (
    <h2
      id={slug(children) || undefined}
      {...rest}
      className={`mt-12 scroll-mt-16 ${SECTION_HEADING}`}
    >
      {children}
    </h2>
  );
}

function Paragraph({ children, ...rest }: ComponentPropsWithoutRef<"p">) {
  return (
    <p {...rest} className={`mt-5 ${PROSE}`}>
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
    <strong {...rest} className={STRONG}>
      {children}
    </strong>
  );
}

function Quote({ children, ...rest }: ComponentPropsWithoutRef<"blockquote">) {
  return (
    <blockquote
      {...rest}
      className="mt-8 border-l border-foreground/15 pl-5 text-foreground-soft [&>*:first-child]:mt-0"
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
  p: Paragraph,
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
