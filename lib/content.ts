export const studio = {
  name: "Flow With The Trend",
  short: "FLOW",
  description:
    "A design studio for restaurant websites and portfolios. Loud color, clear menus, and sites people actually send to a friend.",
};

export const navItems = [
  { href: "/restaurants", label: "restaurant sites", icon: "plate" },
  { href: "/portfolios", label: "portfolios", icon: "cards" },
  { href: "/#packages", label: "packages", icon: "stars" },
  { href: "/#process", label: "the process", icon: "path" },
  { href: "/work", label: "recent work", icon: "frames" },
  { href: "/start", label: "start a project", icon: "spark" },
] as const;

export const packages = [
  {
    name: "the amuse",
    tone: "green",
    time: "about 2 weeks",
    summary: "One scrolling page for a new room or a first portfolio.",
    includes: ["Home, story, and a way to book", "Menu or selected work", "Phone-first layout", "A launch checklist"],
  },
  {
    name: "prix fixe",
    tone: "yellow",
    time: "about 4 weeks",
    summary: "The full site. The one guests and clients actually use.",
    includes: ["Home, menu or work, story, visit", "Gallery and private dining or about", "Editable specials", "Domain and handover"],
  },
  {
    name: "chef's table",
    tone: "pink",
    time: "about 6 weeks",
    summary: "Art direction, words, and a site with a point of view.",
    includes: ["A custom visual direction", "Copy for the pages that matter", "Photography plan", "Inquiry or reservation path"],
  },
] as const;

export const process = [
  {
    step: "01",
    title: "Tasting call",
    text: "Thirty minutes. We learn the room, the guest, and the date you want to open the link.",
  },
  {
    step: "02",
    title: "Direction",
    text: "Type, color, and the three pages that have to work. You see the mood before the build.",
  },
  {
    step: "03",
    title: "Design",
    text: "The site, in the palette, on a phone. We revise until it feels like the work.",
  },
  {
    step: "04",
    title: "Build",
    text: "Real menu or real projects, loaded in. We test the small screen, the map, and the button.",
  },
  {
    step: "05",
    title: "Launch",
    text: "Domain, handover, and a short guide so you can change the specials without calling us.",
  },
] as const;

export type Project = {
  slug: string;
  name: string;
  kind: "Restaurant" | "Portfolio";
  summary: string;
  tagline: string;
  domain: string;
  canvas: string;
  ink: string;
  accent: string;
  highlights: string[];
  pages: string[];
  note: string;
};

export const projects: Project[] = [
  {
    slug: "marea-nights",
    name: "Marea Nights",
    kind: "Restaurant",
    summary: "A late seafood room. The site feels like the bar lights just came on.",
    tagline: "Seafood after dark",
    domain: "marea.example",
    canvas: "#08243f",
    ink: "#fff200",
    accent: "#7fd4ff",
    highlights: ["Crudo", "Charcoal prawns", "Lemon ice"],
    pages: ["Arrival", "Tonight's menu", "The bar", "Visit"],
    note: "Built for a phone in a loud room: huge type, a short menu, and one button that books a table.",
  },
  {
    slug: "casa-lumen",
    name: "Casa Lumen",
    kind: "Restaurant",
    summary: "Neighborhood Italian with the volume turned up. Sunday gravy, not a template.",
    tagline: "Sunday gravy, louder",
    domain: "casalumen.example",
    canvas: "#fff200",
    ink: "#161616",
    accent: "#ff4fa0",
    highlights: ["Sunday gravy", "Chili oil", "Olive oil cake"],
    pages: ["The table", "Menu", "Private dining", "Find us"],
    note: "A warm room still gets a loud site. The menu is the hero, and the private dining page answers the questions people actually ask.",
  },
  {
    slug: "little-lantern",
    name: "Little Lantern",
    kind: "Restaurant",
    summary: "A dumpling counter that retired the PDF menu.",
    tagline: "Dumplings, no PDF",
    domain: "lantern.example",
    canvas: "#ff4fa0",
    ink: "#161616",
    accent: "#fff200",
    highlights: ["Chili wontons", "Peanut cucumber", "Cold noodles"],
    pages: ["Counter", "Menu", "Catering", "Hours"],
    note: "Specials change weekly. The page is built so the owner can swap a dish without opening a design file.",
  },
  {
    slug: "rye-room",
    name: "Rye Room",
    kind: "Restaurant",
    summary: "A cocktail bar site that can take a booking and explain the door.",
    tagline: "The bar, booked",
    domain: "ryeroom.example",
    canvas: "#37e85c",
    ink: "#161616",
    accent: "#161616",
    highlights: ["Rye sour", "Tomato highball", "Olive oil cake"],
    pages: ["Tonight", "List", "Booths", "Door policy"],
    note: "The door policy, the booth, and the list live on the site, so the Instagram bio can finally just be a link.",
  },
  {
    slug: "ada-cho",
    name: "Ada Cho",
    kind: "Portfolio",
    summary: "A chef's portfolio with heat. One link for pop-ups, pastry, and the diary.",
    tagline: "A chef, on one link",
    domain: "adacho.example",
    canvas: "#fff200",
    ink: "#161616",
    accent: "#c77dff",
    highlights: ["Tasting menus", "Pop-ups", "Pastry diary"],
    pages: ["Selected plates", "Story", "Press", "Write Ada"],
    note: "The work comes first. The bio is short. The contact path is a note, not a tax form.",
  },
  {
    slug: "june-park",
    name: "June Park",
    kind: "Portfolio",
    summary: "Photographs of dining rooms, hands, and the pass.",
    tagline: "Rooms and plates",
    domain: "junepark.example",
    canvas: "#24143a",
    ink: "#fff200",
    accent: "#c77dff",
    highlights: ["Dining rooms", "Hands", "The pass"],
    pages: ["Index", "Restaurants", "Portraits", "Commission"],
    note: "A quiet grid would undersell the pictures. The site uses the same color nerve as the studios she shoots.",
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export const marquee = [
  "restaurant sites",
  "portfolios",
  "menus",
  "private dining",
  "galleries",
  "reservations",
  "chef portfolios",
  "launch weeks",
];
