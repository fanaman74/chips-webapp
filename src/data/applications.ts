export type ApplicationStatus =
  | "draft"
  | "submitted"
  | "in-evaluation"
  | "awarded"
  | "rejected"
  | "resubmission";

export type Application = {
  id: string;
  acronym: string;
  title: string;
  callRef: string;
  callTitle: string;
  status: ApplicationStatus;
  lastEdited: string;
  dueDate: string;
  completeness: number; // 0..100
  consortiumSize: number;
  requestedFundingEur: number;
  lead: string;
};

export const APPLICATIONS: Application[] = [
  {
    id: "app-2026-01",
    acronym: "EDGE-CORTEX",
    title: "Sovereign edge AI cortex — reference silicon + runtime",
    callRef: "ECS-2026-1-IA",
    callTitle: "Sovereign edge AI compute platforms",
    status: "draft",
    lastEdited: "2026-04-17",
    dueDate: "2026-05-21",
    completeness: 68,
    consortiumSize: 9,
    requestedFundingEur: 22_500_000,
    lead: "ETH Zurich",
  },
  {
    id: "app-2026-02",
    acronym: "QSILICON",
    title: "Room-temperature silicon spin qubit control",
    callRef: "ECS-2026-1-RIA",
    callTitle: "Quantum computing and sensing silicon",
    status: "draft",
    lastEdited: "2026-04-15",
    dueDate: "2026-05-21",
    completeness: 34,
    consortiumSize: 5,
    requestedFundingEur: 8_200_000,
    lead: "ETH Zurich",
  },
  {
    id: "app-2025-a1",
    acronym: "CHIRP",
    title: "Chiplet runtime for post-exascale HPC",
    callRef: "ECS-2025-1-IA",
    callTitle: "Exascale and post-exascale interconnect",
    status: "in-evaluation",
    lastEdited: "2025-05-21",
    dueDate: "2025-05-21",
    completeness: 100,
    consortiumSize: 12,
    requestedFundingEur: 18_400_000,
    lead: "ETH Zurich",
  },
  {
    id: "app-2024-b2",
    acronym: "GREENSOC",
    title: "Ultra-low-power SoC for battery-free IoT",
    callRef: "ECS-2024-2-IA",
    callTitle: "IoT & low-power edge",
    status: "awarded",
    lastEdited: "2024-05-21",
    dueDate: "2024-05-21",
    completeness: 100,
    consortiumSize: 7,
    requestedFundingEur: 6_300_000,
    lead: "ETH Zurich",
  },
];

export type Milestone = {
  id: string;
  title: string;
  dueDate: string;
  status: "done" | "in-progress" | "upcoming" | "overdue";
  deliverables: number;
  deliverablesDone: number;
};

export type ProjectWorkspace = {
  slug: string;
  acronym: string;
  name: string;
  grantRef: string;
  period: string;
  budgetEur: number;
  fundingEur: number;
  coordinator: string;
  consortiumSize: number;
  progressPct: number;
  nextReportingDate: string;
  milestones: Milestone[];
};

export const MY_PROJECTS: ProjectWorkspace[] = [
  {
    slug: "greensoc",
    acronym: "GREENSOC",
    name: "Ultra-low-power SoC for battery-free IoT",
    grantRef: "ECS-GA-2024-0831",
    period: "2024-10-01 → 2027-09-30",
    budgetEur: 12_800_000,
    fundingEur: 6_300_000,
    coordinator: "ETH Zurich",
    consortiumSize: 7,
    progressPct: 42,
    nextReportingDate: "2026-06-30",
    milestones: [
      { id: "M1", title: "Architecture frozen", dueDate: "2025-04-30", status: "done", deliverables: 4, deliverablesDone: 4 },
      { id: "M2", title: "First tape-out (TS1)", dueDate: "2025-10-31", status: "done", deliverables: 6, deliverablesDone: 6 },
      { id: "M3", title: "Silicon characterisation complete", dueDate: "2026-05-31", status: "in-progress", deliverables: 5, deliverablesDone: 2 },
      { id: "M4", title: "Pilot deployment (3 sites)", dueDate: "2026-12-15", status: "upcoming", deliverables: 7, deliverablesDone: 0 },
      { id: "M5", title: "Industrialisation handover", dueDate: "2027-06-30", status: "upcoming", deliverables: 4, deliverablesDone: 0 },
    ],
  },
  {
    slug: "eurohpc-edge",
    acronym: "EUROHPC-EDGE",
    name: "European Heterogeneous Edge Compute Platform",
    grantRef: "ECS-GA-2024-0147",
    period: "2024-05-01 → 2027-04-30",
    budgetEur: 48_200_000,
    fundingEur: 28_900_000,
    coordinator: "IMEC",
    consortiumSize: 24,
    progressPct: 58,
    nextReportingDate: "2026-06-30",
    milestones: [
      { id: "M1", title: "Architecture freeze", dueDate: "2024-11-30", status: "done", deliverables: 5, deliverablesDone: 5 },
      { id: "M2", title: "PDK integration complete", dueDate: "2025-06-30", status: "done", deliverables: 4, deliverablesDone: 4 },
      { id: "M3", title: "Reference tape-out", dueDate: "2026-06-30", status: "in-progress", deliverables: 8, deliverablesDone: 5 },
      { id: "M4", title: "Certification kit ready", dueDate: "2027-01-31", status: "upcoming", deliverables: 6, deliverablesDone: 0 },
    ],
  },
];

export const NOTIFICATIONS = [
  {
    id: "n1",
    kind: "call" as const,
    title: "Call ECS-2026-1-IA opens in 4 days",
    description: "Sovereign edge AI compute platforms · budget €120M · deadline 21 May 2026",
    time: "just now",
    unread: true,
  },
  {
    id: "n2",
    kind: "project" as const,
    title: "EUROHPC-EDGE milestone M3 — 65% complete",
    description: "Reference tape-out on schedule for 30 June",
    time: "2h ago",
    unread: true,
  },
  {
    id: "n3",
    kind: "admin" as const,
    title: "Financial reporting period Q2 opens",
    description: "Submit progress reports by 15 July",
    time: "yesterday",
    unread: false,
  },
  {
    id: "n4",
    kind: "event" as const,
    title: "Industry Day 2026 registration open",
    description: "12 June 2026 · Munich · 1,200+ attendees expected",
    time: "2d ago",
    unread: false,
  },
];

export const STATUS_LABEL: Record<ApplicationStatus, string> = {
  draft: "Draft",
  submitted: "Submitted",
  "in-evaluation": "In evaluation",
  awarded: "Awarded",
  rejected: "Not awarded",
  resubmission: "Resubmission",
};
