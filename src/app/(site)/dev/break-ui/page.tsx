import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleBadge } from "@/badges/badge";
import { ExhibitionGrid } from "@/components/exhibition-grid";
import { Changelog } from "@/components/graph/changelog";
import { Signpost, SmallSignpost } from "@/components/signposts";
import { deal, loadExhibition } from "@/lib/exhibition";
import {
  ACCENT_PROSE,
  ANNOTATION,
  LABEL,
  PAGE_HEADING,
  SECTION_HEADING,
} from "@/lib/type";
import { DATASETS, fixtureFor, type Dataset } from "./fixtures";
import { Picked, Sheets } from "./links";

const BADGE_SIZE = 195;

const isDataset = (value: string | undefined): value is Dataset =>
  DATASETS.some(({ id }) => id === value);

function Toggle({ current }: { current: Dataset }) {
  return (
    <nav
      aria-label="Dataset"
      className="fixed bottom-4 left-1/2 z-50 flex max-w-[calc(100vw-2rem)] -translate-x-1/2 gap-1 overflow-x-auto rounded-full bg-graphite-100 p-1 whitespace-nowrap"
    >
      {DATASETS.map(({ id, label }) => (
        <Link
          key={id}
          href={`?data=${id}`}
          aria-current={id === current ? "true" : undefined}
          className={`rounded-full px-3 py-1.5 ${ANNOTATION} leading-none text-graphite-700 aria-current:bg-graphite-50 aria-current:text-graphite-900 aria-current:shadow-chip`}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}

export default async function BreakUi({
  searchParams,
}: {
  searchParams: Promise<{ data?: string }>;
}) {
  if (process.env.NODE_ENV !== "development") notFound();

  const { data } = await searchParams;
  const dataset = isDataset(data) ? data : "demo";
  const { tiles } = await loadExhibition("main");
  const fixture = fixtureFor(dataset, tiles);

  return (
    <main className="mx-auto w-full max-w-[1400px] flex-1 px-[7vw] pt-[9vh] pb-[18vh]">
      <h2 className={SECTION_HEADING}>Post heading</h2>
      <div className="mt-6 max-w-5xl space-y-12">
        {fixture.headings.map(({ title, deck }) => (
          <header key={title}>
            <h1 className={PAGE_HEADING}>{title}</h1>
            {deck ? <p className={`mt-4 ${ACCENT_PROSE}`}>{deck}</p> : null}
          </header>
        ))}
      </div>

      <h2 className={`mt-16 ${SECTION_HEADING}`}>Badges</h2>
      <ul className="mt-6 flex flex-wrap gap-8">
        {fixture.badges.map(({ note, badge }) => (
          <li key={note} className="flex w-60 flex-col items-center gap-2">
            <ArticleBadge badge={badge} size={BADGE_SIZE} />
            <span className={`${ANNOTATION} text-graphite-500`}>{note}</span>
          </li>
        ))}
      </ul>

      <h2 className={`mt-16 ${SECTION_HEADING}`}>Signposts</h2>
      <ul className="mt-6 w-full space-y-3 sm:max-w-120">
        {fixture.signs.map((sign) => (
          <li key={sign.name}>
            <Signpost {...sign} />
          </li>
        ))}
      </ul>
      <ul className="mt-8 w-56 space-y-2">
        {fixture.signs.map((sign) => (
          <li key={sign.name}>
            <SmallSignpost {...sign} />
          </li>
        ))}
      </ul>

      <h2 className={`mt-16 ${SECTION_HEADING}`}>Changelog card</h2>
      {fixture.changelog ? (
        <div className="mt-6 max-w-120 bg-cadmium-50 p-4 shadow-label md:p-8">
          <Changelog
            className="@container text-left"
            version={fixture.changelog.version}
          >
            <ul>
              {fixture.changelog.lines.map((line, index) => (
                <li key={`${index}-${line}`}>{line}</li>
              ))}
            </ul>
          </Changelog>
        </div>
      ) : null}

      <h2 className={`mt-16 ${SECTION_HEADING}`}>Exhibition wall</h2>
      <p className={`mt-2 ${LABEL} text-graphite-500`}>
        {fixture.tiles.length} pieces
      </p>
      <div className="mt-6">
        <ExhibitionGrid
          tiles={fixture.tiles}
          columns={deal(fixture.tiles, false)}
        />
      </div>

      <h2 className={`mt-16 ${SECTION_HEADING}`}>Rolodex sheets</h2>
      <p className={`mt-2 ${LABEL} text-graphite-500`}>
        {fixture.sheets.length} sheets, at the drum’s width
      </p>
      <div className="mt-12">
        <Sheets key={dataset} sheets={fixture.sheets} />
      </div>

      <h2 className={`mt-16 ${SECTION_HEADING}`}>Picked list</h2>
      <p className={`mt-2 ${LABEL} text-graphite-500`}>
        {fixture.refs.length} picked
      </p>
      <div className="mt-6">
        <Picked refs={fixture.refs} />
      </div>

      <Toggle current={dataset} />
    </main>
  );
}
