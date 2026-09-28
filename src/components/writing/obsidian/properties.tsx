import { LABEL } from "@/lib/type";
import { TAG } from "./tag";

const TYPES = ["link", "movie", "book", "quote", "person", "project"] as const;

type Kind = (typeof TYPES)[number];

type Cell = { wikilink?: boolean };

const PROPERTIES: { name: string; in: Partial<Record<Kind, Cell>> }[] = [
  {
    name: "author",
    in: {
      link: { wikilink: true },
      movie: { wikilink: true },
      book: { wikilink: true },
      quote: { wikilink: true },
    },
  },
  {
    name: "url",
    in: { link: {}, movie: {}, book: {}, quote: {}, person: {}, project: {} },
  },
  { name: "rating", in: { movie: {}, book: {} } },
  { name: "cover", in: { movie: {}, book: {} } },
  { name: "status", in: { project: {} } },
];

function Mark({ cell }: { cell: Cell }) {
  return (
    <span className="flex justify-center">
      <span
        aria-hidden="true"
        className={`size-2 rounded-xs ${cell.wikilink ? "bg-cadmium-400" : "bg-graphite-900"}`}
      />
      <span className="sr-only">
        {cell.wikilink ? "yes, as a wikilink" : "yes"}
      </span>
    </span>
  );
}

export function Properties() {
  return (
    <figure className="my-12 overflow-x-auto" data-measure="body">
      <table className="w-full min-w-136 border-collapse">
        <thead>
          <tr>
            <td />
            {TYPES.map((kind) => (
              <th
                key={kind}
                scope="col"
                className="px-1 pb-3 [font-weight:inherit]"
              >
                <span className={TAG}>{kind}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {PROPERTIES.map((property) => (
            <tr key={property.name} className="border-t border-graphite-200">
              <th
                scope="row"
                className={`py-2.5 pr-3 text-left [font-weight:inherit] text-graphite-700 ${LABEL}`}
              >
                {property.name}
              </th>
              {TYPES.map((kind) => {
                const cell = property.in[kind];
                return (
                  <td
                    key={kind}
                    className={`px-1 py-2.5 text-center align-middle ${cell?.wikilink ? "bg-cadmium-100" : ""}`}
                  >
                    {cell ? <Mark cell={cell} /> : null}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
