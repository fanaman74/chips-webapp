export type Program = {
  slug: string;
  name: string;
  tagline: string;
  summary: string;
  budgetEur: number;
  focus: string[];
  href: string;
  icon: "cpu" | "flask" | "factory";
};

export const PROGRAMS: Program[] = [
  {
    slug: "chips-for-europe",
    name: "Chips for Europe Initiative",
    tagline: "Pilot lines for advanced semiconductor technologies",
    summary:
      "Open-access infrastructure that lets European industry, researchers and startups design, prototype and validate next-generation chips — from FD-SOI and wide-bandgap materials through to sub-2nm nodes.",
    budgetEur: 6_200_000_000,
    focus: ["Pilot lines", "Design platforms", "Competence centres", "Quantum & neuromorphic"],
    href: "/programs/chips-for-europe",
    icon: "factory",
  },
  {
    slug: "ecs-calls",
    name: "ECS R&I Calls",
    tagline: "Research and innovation across TRLs 1–8",
    summary:
      "Annual competitive calls for collaborative R&I projects in electronic components and systems. Grants span early exploration through to industrial pilot deployment, with deep focus on AI, cybersecurity, mobility and sustainability.",
    budgetEur: 2_800_000_000,
    focus: ["AI & edge compute", "Cybersecurity", "Automotive & mobility", "Green & sustainable"],
    href: "/programs/ecs-calls",
    icon: "flask",
  },
  {
    slug: "pilot-lines",
    name: "Pilot Lines",
    tagline: "Five shared fabrication platforms across Europe",
    summary:
      "Flagship pilot lines covering FD-SOI, heterogeneous integration, wide bandgap, photonics, and leading-edge logic. Operated by the strongest European RTOs and open to every eligible participant.",
    budgetEur: 3_300_000_000,
    focus: ["FD-SOI / 22nm–10nm", "Wide bandgap", "Photonics", "Heterogeneous integration"],
    href: "/programs/pilot-lines",
    icon: "cpu",
  },
];
