import { Fragment } from "react";
import { BG, BORDER, INTRO_LOOK, look, TEXT, type IntroLook } from "./look";
import { CARD_SHAPE, FACE, number } from "./sheet";
import { Kbd } from "@/components/kbd";

const STEPS: {
  keys: string[];
  spoken: string;
  between?: string;
  does: string;
}[] = [
  { keys: ["↑", "↓"], spoken: "Up or down arrow", does: "navigate" },
  {
    keys: ["A", "Z"],
    spoken: "A to Z",
    between: "–",
    does: "jump to letter",
  },
];

export function Intro({
  count,
  parts = INTRO_LOOK,
}: {
  count: number;
  parts?: IntroLook;
}) {
  const tone = `${BG[parts.keyBackground]} ${TEXT[parts.keyText]} ${BORDER[parts.keyBorder]} shadow-chip`;
  return (
    <div className={`@container ${FACE} ${CARD_SHAPE} ${BG[parts.background]}`}>
      <span className={look(parts.marker)}>
        {number(-1)} — {number(count - 1)}
      </span>

      <div className="min-w-0 can-hover:@min-[19rem]:grid can-hover:@min-[19rem]:grid-cols-[minmax(0,1fr)_auto] can-hover:@min-[19rem]:items-end can-hover:@min-[19rem]:gap-x-6">
        <div className="min-w-0">
          <p className={`text-balance ${look(parts.description)}`}>
            All the links I keep sending friends and revisiting for references.
          </p>
          <p className={`mt-2 ${look(parts.hint)} can-hover:hidden`}>
            Drag to navigate. Tap the circle on a sheet to select it.
          </p>
        </div>
        <ul className="hidden flex-col gap-1 can-hover:@min-[19rem]:flex">
          {STEPS.map(({ keys, spoken, between, does }) => (
            <li
              key={does}
              className={`-ml-2 flex items-baseline ${look(parts.shortcut)}`}
            >
              <span className="sr-only">{spoken}: </span>
              {keys.map((key, at) => (
                <Fragment key={key}>
                  {at > 0 && between ? (
                    <span aria-hidden className="ml-2">
                      {between}
                    </span>
                  ) : null}
                  <Kbd tone={tone}>{key}</Kbd>
                </Fragment>
              ))}
              <span className="ml-1.5">{does}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
