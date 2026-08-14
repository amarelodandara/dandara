import type { CvBlock, CvDoc, CvEntry, Inline } from "@/lib/cv/types";

const PAGE_SIZE: Record<CvDoc["meta"]["pageSize"], string> = {
  letter: "Letter",
  a4: "A4",
};

export function CvDocument({ doc }: { doc: CvDoc }) {
  const { meta, sections } = doc;

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `@page { size: ${PAGE_SIZE[meta.pageSize]}; margin: 12mm 14mm; }`,
        }}
      />

      <article className="cv" lang={meta.lang}>
        <header className="cv-head">
          <h1 className="cv-name">{meta.name}</h1>
          <p className="cv-role">{meta.title}</p>
          <p className="cv-contact">{meta.contact.join(" | ")}</p>
        </header>

        {sections.map((section) => (
          <section key={section.heading} className="cv-section">
            <h2 className="cv-section-title">{section.heading}</h2>
            {section.blocks.map((block, i) => (
              <Block key={i} block={block} />
            ))}
            {section.entries.map((entry, i) => (
              <Entry key={i} entry={entry} />
            ))}
          </section>
        ))}
      </article>
    </>
  );
}

function Block({ block }: { block: CvBlock }) {
  if (block.t === "paragraph") {
    return (
      <p className="cv-prose">
        <Runs runs={block.content} />
      </p>
    );
  }
  return <Bullets items={block.items} />;
}

function Entry({ entry }: { entry: CvEntry }) {
  return (
    <div className="cv-entry">
      <h3 className="cv-entry-title">
        <Runs runs={entry.heading} />
      </h3>
      {entry.meta && <p className="cv-entry-meta">{entry.meta}</p>}
      {entry.bullets.length > 0 && <Bullets items={entry.bullets} />}
    </div>
  );
}

function Bullets({ items }: { items: Inline[][] }) {
  return (
    <ul className="cv-bullets">
      {items.map((runs, i) => (
        <li key={i}>
          <Runs runs={runs} />
        </li>
      ))}
    </ul>
  );
}

function Runs({ runs }: { runs: Inline[] }) {
  return (
    <>
      {runs.map((run, i) => {
        if (run.t === "bold") return <strong key={i}>{run.v}</strong>;
        if (run.t === "link")
          return (
            <a key={i} href={run.href}>
              {run.v}
            </a>
          );
        return <span key={i}>{run.v}</span>;
      })}
    </>
  );
}
