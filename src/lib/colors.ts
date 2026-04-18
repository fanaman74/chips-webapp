export type TopicArea =
  | "AI & Edge"
  | "HPC"
  | "Cybersecurity"
  | "Automotive"
  | "Green Tech"
  | "Photonics"
  | "Quantum"
  | "Health";

export type ColorKey =
  | "brand"
  | "accent"
  | "amber"
  | "violet"
  | "rose"
  | "emerald"
  | "fuchsia"
  | "sky"
  | "orange"
  | "teal"
  | "indigo"
  | "lime";

export const TOPIC_COLOR: Record<TopicArea, ColorKey> = {
  "AI & Edge": "violet",
  HPC: "sky",
  Cybersecurity: "rose",
  Automotive: "orange",
  "Green Tech": "emerald",
  Photonics: "fuchsia",
  Quantum: "indigo",
  Health: "teal",
};

export const INSTRUMENT_COLOR: Record<string, ColorKey> = {
  RIA: "violet",
  IA: "sky",
  CSA: "teal",
  "Pilot Line": "amber",
};

export const NEWS_CATEGORY_COLOR: Record<string, ColorKey> = {
  Announcement: "brand",
  Call: "amber",
  Project: "accent",
  Policy: "violet",
  Event: "emerald",
};

// Tailwind utility classes for each color — static strings so Tailwind can tree-shake.
export const COLOR_CLASSES: Record<
  ColorKey,
  {
    chip: string; // badge-like pill
    dot: string; // small solid dot
    ring: string; // left accent strip / ring
    soft: string; // soft tinted background
    text: string;
    gradient: string;
  }
> = {
  brand: {
    chip: "bg-brand/10 text-brand border-brand/30",
    dot: "bg-brand",
    ring: "ring-brand/40",
    soft: "bg-brand/5",
    text: "text-brand",
    gradient: "from-brand/15 via-brand/5 to-transparent",
  },
  accent: {
    chip: "bg-accent/10 text-accent-600 border-accent/30",
    dot: "bg-accent",
    ring: "ring-accent/40",
    soft: "bg-accent/5",
    text: "text-accent-600",
    gradient: "from-accent/15 via-accent/5 to-transparent",
  },
  amber: {
    chip: "bg-amber/15 text-amber border-amber/30",
    dot: "bg-amber",
    ring: "ring-amber/40",
    soft: "bg-amber/5",
    text: "text-amber",
    gradient: "from-amber/15 via-amber/5 to-transparent",
  },
  violet: {
    chip: "bg-violet/15 text-violet border-violet/30",
    dot: "bg-violet",
    ring: "ring-violet/40",
    soft: "bg-violet/5",
    text: "text-violet",
    gradient: "from-violet/15 via-violet/5 to-transparent",
  },
  rose: {
    chip: "bg-rose/15 text-rose border-rose/30",
    dot: "bg-rose",
    ring: "ring-rose/40",
    soft: "bg-rose/5",
    text: "text-rose",
    gradient: "from-rose/15 via-rose/5 to-transparent",
  },
  emerald: {
    chip: "bg-emerald/15 text-emerald border-emerald/30",
    dot: "bg-emerald",
    ring: "ring-emerald/40",
    soft: "bg-emerald/5",
    text: "text-emerald",
    gradient: "from-emerald/15 via-emerald/5 to-transparent",
  },
  fuchsia: {
    chip: "bg-fuchsia/15 text-fuchsia border-fuchsia/30",
    dot: "bg-fuchsia",
    ring: "ring-fuchsia/40",
    soft: "bg-fuchsia/5",
    text: "text-fuchsia",
    gradient: "from-fuchsia/15 via-fuchsia/5 to-transparent",
  },
  sky: {
    chip: "bg-sky/15 text-sky border-sky/30",
    dot: "bg-sky",
    ring: "ring-sky/40",
    soft: "bg-sky/5",
    text: "text-sky",
    gradient: "from-sky/15 via-sky/5 to-transparent",
  },
  orange: {
    chip: "bg-orange/15 text-orange border-orange/30",
    dot: "bg-orange",
    ring: "ring-orange/40",
    soft: "bg-orange/5",
    text: "text-orange",
    gradient: "from-orange/15 via-orange/5 to-transparent",
  },
  teal: {
    chip: "bg-teal/15 text-teal border-teal/30",
    dot: "bg-teal",
    ring: "ring-teal/40",
    soft: "bg-teal/5",
    text: "text-teal",
    gradient: "from-teal/15 via-teal/5 to-transparent",
  },
  indigo: {
    chip: "bg-indigo/15 text-indigo border-indigo/30",
    dot: "bg-indigo",
    ring: "ring-indigo/40",
    soft: "bg-indigo/5",
    text: "text-indigo",
    gradient: "from-indigo/15 via-indigo/5 to-transparent",
  },
  lime: {
    chip: "bg-lime/15 text-lime border-lime/30",
    dot: "bg-lime",
    ring: "ring-lime/40",
    soft: "bg-lime/5",
    text: "text-lime",
    gradient: "from-lime/15 via-lime/5 to-transparent",
  },
};

export function colorFor(key: ColorKey) {
  return COLOR_CLASSES[key];
}
