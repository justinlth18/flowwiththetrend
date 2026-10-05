export type Trend = {
  id: string;
  index: string;
  name: string;
  blurb: string;
  fits: string;
};

export const trends: Trend[] = [
  {
    id: "vibrant",
    index: "01",
    name: "Vibrant color",
    blurb: "Saturated fields, sticker type, and stars. The 2026 dopamine palette, for work that should feel like a poster.",
    fits: "Chefs, stylists, and brands that want to be sent in a group chat.",
  },
  {
    id: "kinetic",
    index: "02",
    name: "Kinetic type",
    blurb: "The name is the layout. Words scale, slide, and carry the projects. A portfolio with almost no boxes.",
    fits: "Art directors and anyone whose point of view is the work.",
  },
  {
    id: "broken",
    index: "03",
    name: "Broken grid",
    blurb: "Overlapping blocks, crooked type, and a collage that refuses a template. Organic, not messy.",
    fits: "Photographers and stylists with pictures that should collide.",
  },
  {
    id: "glass",
    index: "04",
    name: "Liquid glass",
    blurb: "Frosted panels over a moving gradient. The 2026 glass look, used on a few cards, not the whole page.",
    fits: "Pastry, beauty, and product work that wants light.",
  },
  {
    id: "retro",
    index: "05",
    name: "Retro future",
    blurb: "Chrome type, acid color, and a little Y2K. A portfolio that feels like a title sequence.",
    fits: "Motion, music, and nightlife.",
  },
  {
    id: "dark",
    index: "06",
    name: "Dark mode",
    blurb: "Near-black, one warm accent, and an index you can actually read. Quiet, on purpose.",
    fits: "Chefs and photographers who want the pictures to sit in the dark.",
  },
];

export function getTrend(id: string | undefined) {
  if (!id) return undefined;
  return trends.find((trend) => trend.id === id);
}
