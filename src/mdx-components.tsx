import type { MDXComponents } from "mdx/types";
import { isValidElement } from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { INLINE_CODE } from "@/components/code";
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
      className={`mt-12 scroll-mt-16 [header+&]:mt-0 ${SECTION_HEADING}`}
    >
      {children}
    </h2>
  );
}

function Subheading({ children, ...rest }: ComponentPropsWithoutRef<"h3">) {
  return (
    <h3
      id={slug(children) || undefined}
      {...rest}
      className={`mt-10 scroll-mt-16 text-graphite-700 ${SECTION_HEADING}`}
    >
      {children}
    </h3>
  );
}

function Paragraph({ children, ...rest }: ComponentPropsWithoutRef<"p">) {
  return (
    <p {...rest} className={`mt-5 ${PROSE}`}>
      {children}
    </p>
  );
}

function List({ children, ...rest }: ComponentPropsWithoutRef<"ul">) {
  return (
    <ul
      {...rest}
      className={`mt-5 list-disc pl-5 marker:text-graphite-400 [li>&]:mt-3 ${PROSE}`}
    >
      {children}
    </ul>
  );
}

function Item({ children, ...rest }: ComponentPropsWithoutRef<"li">) {
  return (
    <li {...rest} className="mt-4 pl-1 first:mt-0 [&>p]:mt-0">
      {children}
    </li>
  );
}

function Code({ children, ...rest }: ComponentPropsWithoutRef<"code">) {
  return (
    <code {...rest} className={INLINE_CODE}>
      {children}
    </code>
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
      className="mt-8 border-l border-graphite-200 pl-5 text-graphite-700 [&>*:first-child]:mt-0"
    >
      {children}
    </blockquote>
  );
}

function Rule() {
  return <hr className="mt-14 border-0 border-t border-graphite-200" />;
}

const components: MDXComponents = {
  h2: Heading,
  h3: Subheading,
  p: Paragraph,
  ul: List,
  li: Item,
  code: Code,
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
