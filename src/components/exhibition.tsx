import { ExhibitionGrid } from "@/components/exhibition-grid";
import { Signpost } from "@/components/signposts";
import { ROOMS, type Room } from "@/content/exhibits";
import { loadExhibition } from "@/lib/exhibition";

export async function Exhibition({
  room,
  label,
  column,
  featured = false,
  series,
}: {
  room: Room;
  label?: string;
  column?: string;
  featured?: boolean;
  series?: string;
}) {
  const { tiles, columns } = await loadExhibition(room, { featured, series });
  if (tiles.length === 0) return null;
  return (
    <ExhibitionGrid
      label={label}
      column={column}
      tiles={tiles}
      columns={columns}
      coda={
        featured ? (
          <Signpost
            href={ROOMS[room].href}
            name="All work"
            area="work"
          />
        ) : null
      }
    />
  );
}
