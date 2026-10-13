import type { Exhibit } from "@/content/exhibits";

const WIDTH = 1000;
const SPREAD = 724;

const page = (src: string) => `/work/sketchbook/${src}.webp`;

export const SKETCHES: Exhibit[] = [
  {
    id: "sketchbook-ref-onboarding",
    title: "Ideation on onboarding layouts for ref",
    project: "ref",
    rooms: ["sketchbook"],
    media: {
      kind: "image",
      src: page("ref-onboarding"),
      width: WIDTH,
      height: 1267,
      alt: "A sketchbook page with two drawings of the ref window: one with a tall column of coloured folders beside lines of text, noted as closer to how ref will look in use and maybe resizable, and one with the folders laid across the top, noted as the better text layout. Between them, a note that onboarding should make the philosophy clear: benefits, steps, permissions.",
    },
  },
  {
    id: "sketchbook-link-field",
    title: "Sketching out a space-time field animation",
    project: "field",
    rooms: ["sketchbook"],
    media: {
      kind: "image",
      src: page("link-field"),
      width: WIDTH,
      height: 1301,
      alt: "A sketchbook page with a funnel-shaped grid holding a yellow ball, labelled a rotating distortion field between two marquees of text, one for a motto and one for a link. Below, a second frame shows a web link component, with the field shrunk beneath it and still rotating.",
    },
  },
  {
    id: "sketchbook-ref-folders",
    title: "Pitching a widget folder that peeks on your desktop",
    project: "ref",
    rooms: ["sketchbook"],
    media: {
      kind: "flip",
      frames: [page("ref-1"), page("ref-2")],
      width: WIDTH,
      height: 719,
      alt: "Two sketchbook spreads, shown one after the other. The first, headed designers, et al, sketches a rolodex interaction and Mac-inspired blue folders for an inspiration directory. The second asks what if ref is a desktop app hovering on the screen, that points at any folder of markdown files and peeks from the corner of the screen as a blue folder you can drag open.",
    },
  },
  {
    id: "sketchbook-souvenirs",
    title: "Ideating on making each post more unique",
    rooms: ["sketchbook"],
    media: {
      kind: "flip",
      frames: [page("souvenir-1"), page("souvenir-2")],
      width: WIDTH,
      height: 705,
      alt: "Two sketchbook spreads, shown one after the other. The first proposes a souvenir for each post, since the best thing at museums is taking something home: a poster with a title, a gradient and a date, collected in local storage and shown on the home page. The second tries six yellow gradients, asks what counts as reading, and pictures stamps that snap into fixed places like a Balatro collection.",
    },
  },
  {
    id: "sketchbook-get-a-link",
    title: "Animating a test drive section for linksamarelos.com",
    project: "field",
    rooms: ["sketchbook"],
    media: {
      kind: "image",
      src: page("get-a-link"),
      width: WIDTH,
      height: SPREAD,
      alt: "A loose sheet of notes for an animation section that enlarges as you scroll: a hold-to-confirm get a link button above a space-time grid. Each click drops a yellow drop that disturbs the field, and once too many links come down the field buckles under the pressure.",
    },
  },
  {
    id: "sketchbook-curso",
    title: "Logo explorations for a career exploration platform",
    rooms: ["sketchbook"],
    media: {
      kind: "image",
      src: page("curso"),
      width: WIDTH,
      height: SPREAD,
      alt: "A sketchbook spread in red pen exploring a logo for Cursô: graduation caps drawn as boxes, stars and the circumflex over the o, an eye built from scribbled circles, and the word Cursô bursting from a cluster of small figures beside wireframes of a course page.",
    },
  },
];
