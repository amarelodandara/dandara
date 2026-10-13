import { Exhibition } from "@/components/exhibition";
import { Signpost } from "@/components/signposts";
import { ROOMS, type Room } from "@/content/exhibits";
import { roomsWithWork, seriesIn } from "@/lib/exhibition";
import { ANNOTATION, PAGE_HEADING, PROSE, SECTION_HEADING } from "@/lib/type";

const COLUMN = "mx-auto w-full max-w-[calc(42rem+14vw)] px-[7vw]";

export function ExhibitionRoom({ room }: { room: Room }) {
  const { title, intro } = ROOMS[room];
  const elsewhere = roomsWithWork().filter((other) => other !== room);
  const series = seriesIn(room);

  return (
    <>
      <main className="flex-1 pt-[9vh] sm:pt-[12vh]">
        <header data-landing className={COLUMN}>
          <h1 className={PAGE_HEADING}>{title}</h1>
          {intro?.map((line, index) => (
            <p
              key={line}
              className={`${index === 0 ? "mt-6" : "mt-4"} ${PROSE} text-graphite-700`}
            >
              {line}
            </p>
          ))}
        </header>

        {series.length > 0 ? (
          <div className="pb-[12vh]">
            {series.map(({ id, title: name, lines }) => (
              <section key={id} className="mt-[10vh]">
                <header className={COLUMN}>
                  <h2 className={SECTION_HEADING}>{name}</h2>
                  <p className={`mt-2 ${PROSE} text-graphite-700`}>
                    {lines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </p>
                </header>
                <div className="mt-6">
                  <Exhibition
                    room={room}
                    series={id}
                    column={COLUMN}
                    loose={false}
                  />
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="mt-[10vh] pb-[12vh]">
            <Exhibition room={room} column={COLUMN} loose={room === "main"} />
          </div>
        )}

        {elsewhere.length > 0 ? (
          <nav
            aria-labelledby="more-work"
            className="mx-auto flex w-full max-w-[1400px] justify-end px-[7vw]"
          >
            <div className="w-full sm:max-w-120">
              <h2
                id="more-work"
                className={`${ANNOTATION} leading-none text-graphite-700`}
              >
                More work
              </h2>
              <ul className="mt-6 space-y-3">
                {elsewhere.map((other) => (
                  <li key={other}>
                    <Signpost
                      href={ROOMS[other].href}
                      name={other === "main" ? "Main work" : ROOMS[other].title}
                      area={other === "main" ? "work" : "site"}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        ) : null}
      </main>
    </>
  );
}
