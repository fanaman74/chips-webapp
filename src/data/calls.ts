export type CallInstrument = "RIA" | "IA" | "CSA" | "Pilot Line";

export type Call = {
  slug: string;
  ref: string;
  title: string;
  instrument: CallInstrument;
  programme: "Chips for Europe" | "ECS R&I";
  topics: string[];
  openDate: string;
  deadline: string;
  budgetEur: number;
  expectedProjects: number;
  trlRange: [number, number];
  summary: string;
  eligibility: string[];
  status: "open" | "upcoming" | "closed";
  featured?: boolean;
};

export const CALLS: Call[] = [
  {
    slug: "ecs-2026-1-ia-edge",
    ref: "ECS-2026-1-IA",
    title: "Sovereign edge AI compute platforms",
    instrument: "IA",
    programme: "ECS R&I",
    topics: ["AI & Edge", "Cybersecurity"],
    openDate: "2026-02-15",
    deadline: "2026-05-21",
    budgetEur: 120_000_000,
    expectedProjects: 6,
    trlRange: [5, 7],
    summary:
      "Large-scale innovation actions delivering reference edge AI platforms with European accelerators and verifiable supply chains.",
    eligibility: [
      "Consortia of ≥ 5 legal entities from ≥ 3 participating states",
      "Industry-led with at least one RTO",
      "Must address at least one sovereignty-critical vertical",
    ],
    status: "open",
    featured: true,
  },
  {
    slug: "cfe-2026-pl-sub2nm",
    ref: "CFE-2026-PL",
    title: "Sub-2nm logic pilot line — phase II",
    instrument: "Pilot Line",
    programme: "Chips for Europe",
    topics: ["Advanced nodes", "EUV lithography"],
    openDate: "2026-03-10",
    deadline: "2026-09-30",
    budgetEur: 1_400_000_000,
    expectedProjects: 1,
    trlRange: [7, 8],
    summary:
      "Ramp-up phase of Europe's leading-edge logic pilot line — sub-2nm node capabilities, open access, and shuttle services.",
    eligibility: [
      "One consortium per proposal, led by a fab operator",
      "Open-access commitment for SMEs and academia",
      "Co-investment by national authorities required",
    ],
    status: "open",
    featured: true,
  },
  {
    slug: "ecs-2026-1-ria-quantum",
    ref: "ECS-2026-1-RIA",
    title: "Quantum computing and sensing silicon",
    instrument: "RIA",
    programme: "ECS R&I",
    topics: ["Quantum", "Photonics"],
    openDate: "2026-02-15",
    deadline: "2026-05-21",
    budgetEur: 60_000_000,
    expectedProjects: 4,
    trlRange: [2, 5],
    summary:
      "Research actions on scalable qubit control electronics, photonic quantum sources and room-temperature sensors.",
    eligibility: [
      "Consortia of ≥ 3 legal entities from ≥ 3 participating states",
      "Eligible for SME, academic and RTO leadership",
    ],
    status: "open",
    featured: true,
  },
  {
    slug: "cfe-2026-cc",
    ref: "CFE-2026-CC",
    title: "Competence centres — expansion round",
    instrument: "CSA",
    programme: "Chips for Europe",
    topics: ["Design services", "Training", "SME support"],
    openDate: "2026-04-01",
    deadline: "2026-07-15",
    budgetEur: 85_000_000,
    expectedProjects: 12,
    trlRange: [4, 8],
    summary:
      "Establish or scale national competence centres that offer design services, training and access brokerage to European SMEs.",
    eligibility: [
      "One proposal per participating state",
      "Co-financed by the member state",
    ],
    status: "open",
  },
  {
    slug: "ecs-2026-2-ia-automotive",
    ref: "ECS-2026-2-IA",
    title: "Trusted automotive electronics & software-defined vehicles",
    instrument: "IA",
    programme: "ECS R&I",
    topics: ["Automotive", "Cybersecurity"],
    openDate: "2026-06-15",
    deadline: "2026-09-18",
    budgetEur: 95_000_000,
    expectedProjects: 5,
    trlRange: [5, 7],
    summary:
      "Innovation actions on zonal ECUs, E/E architectures and trusted-compute platforms for L3/L4 autonomy.",
    eligibility: [
      "Industry-led consortia of ≥ 7 legal entities",
      "Active OEM participation required",
    ],
    status: "upcoming",
  },
  {
    slug: "ecs-2026-2-ria-green",
    ref: "ECS-2026-2-RIA",
    title: "Sustainable semiconductor manufacturing",
    instrument: "RIA",
    programme: "ECS R&I",
    topics: ["Green Tech", "Materials"],
    openDate: "2026-06-15",
    deadline: "2026-09-18",
    budgetEur: 45_000_000,
    expectedProjects: 4,
    trlRange: [2, 5],
    summary:
      "PFAS-free chemistry, closed-loop water systems and ultra-low-GWP abatement for European fabs.",
    eligibility: [
      "Consortia of ≥ 3 legal entities",
      "Fab participation strongly encouraged",
    ],
    status: "upcoming",
  },
  {
    slug: "ecs-2025-1-ia-hpc",
    ref: "ECS-2025-1-IA",
    title: "Exascale and post-exascale interconnect",
    instrument: "IA",
    programme: "ECS R&I",
    topics: ["HPC", "Photonics"],
    openDate: "2025-02-15",
    deadline: "2025-05-21",
    budgetEur: 70_000_000,
    expectedProjects: 3,
    trlRange: [5, 7],
    summary:
      "Innovation actions delivering exascale interconnect ASICs and photonic chiplets.",
    eligibility: ["Industry-led consortia of ≥ 5 legal entities"],
    status: "closed",
  },
  {
    slug: "cfe-2025-pl-heterogeneous",
    ref: "CFE-2025-PL",
    title: "Heterogeneous integration pilot line",
    instrument: "Pilot Line",
    programme: "Chips for Europe",
    topics: ["Heterogeneous integration", "Advanced packaging"],
    openDate: "2025-03-01",
    deadline: "2025-09-15",
    budgetEur: 700_000_000,
    expectedProjects: 1,
    trlRange: [7, 8],
    summary:
      "Full-stack heterogeneous integration pilot line — chiplets, 3D stacking, fan-out wafer-level packaging.",
    eligibility: ["Industry-led consortium, open-access commitment"],
    status: "closed",
  },
];

export function openCalls() {
  return CALLS.filter((c) => c.status === "open");
}

export function upcomingCalls() {
  return CALLS.filter((c) => c.status === "upcoming");
}

export function getCall(slug: string) {
  return CALLS.find((c) => c.slug === slug);
}
