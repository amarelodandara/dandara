"use client";

import {
  Announcement,
  COPIED_ANNOUNCEMENT,
  COPIED_NOTE,
  useCopy,
  useOutcome,
  Verb,
} from "@/components/copy";
import {
  Label,
  SAVED_ANNOUNCEMENT,
  SAVED_NOTE,
} from "@/components/gift-shop-row";
import { ROW } from "@/lib/pressable";
import { EXPORTS, type Format } from "./export";
import { usePicked } from "./picked";
import { useTotal } from "./total";

const FOLDER = "Picked at adandara.com/links";

function save(file: string, type: string, body: string) {
  const url = URL.createObjectURL(new Blob([body], { type }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = file;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url));
}

const PLURAL = new Intl.PluralRules("en");

const REFERENCES: Partial<Record<Intl.LDMLPluralRule, string>> = {
  one: "reference",
};

export function ShelfCount({ of }: { of: "picked" | "all" }) {
  const { length } = usePicked();
  const total = useTotal();
  const count = of === "picked" ? length : total;
  if (count === 0) return null;
  return ` (${count} ${REFERENCES[PLURAL.select(count)] ?? "references"})`;
}

export function PickedRow({
  title,
  meta,
  format,
}: {
  title: string;
  meta: string;
  format: Format;
}) {
  const picked = usePicked();
  const [saved, report] = useOutcome();
  const { file, type, render } = EXPORTS[format];
  const body = render(picked, FOLDER);
  const [copied, copy] = useCopy(body);
  const copies = format === "markdown";
  const outcome = copies ? copied : saved;
  const empty = picked.length === 0;

  function download() {
    try {
      save(`picked-${file}`, type, body);
      report("done");
    } catch {
      report("failed");
    }
  }

  const note = (() => {
    if (outcome) return (copies ? COPIED_NOTE : SAVED_NOTE)[outcome];
    if (empty) return "Select a sheet first";
    return meta;
  })();
  const announced = copies ? COPIED_ANNOUNCEMENT : SAVED_ANNOUNCEMENT;

  return (
    <>
      <button
        type="button"
        onClick={copies ? copy : download}
        disabled={empty}
        data-pressable
        className={`${ROW} w-full items-center gap-3 disabled:cursor-default disabled:text-cadmium-900`}
      >
        <Label title={title} meta={note} />
        <Verb
          idle={copies ? "Copy" : "Download"}
          done="✓"
          shown={outcome === "done"}
        />
      </button>
      <Announcement>{outcome ? announced[outcome](title) : ""}</Announcement>
    </>
  );
}
