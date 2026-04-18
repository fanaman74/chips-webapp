export type NewsCategory =
  | "Announcement"
  | "Call"
  | "Project"
  | "Policy"
  | "Event";

export type NewsArticle = {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: NewsCategory;
  publishedAt: string;
  readingMinutes: number;
  author: string;
  featured?: boolean;
};

export const NEWS: NewsArticle[] = [
  {
    slug: "work-programme-2026-adopted",
    title: "Chips JU Governing Board adopts the 2026 Work Programme",
    excerpt:
      "The Governing Board approves €2.4B of calls opening across February and June — with Europe's first sub-2nm pilot line the headline action.",
    body: `The Chips Joint Undertaking Governing Board today adopted the 2026 Work Programme, unlocking €2.4 billion in new calls across the Chips for Europe Initiative and ECS R&I pillars.

The programme is dominated by a single flagship — the second-phase pilot line for sub-2nm logic at a budget of €1.4 billion. This call, co-financed by the participating states, will run from March through September and is expected to lead to a single consortium award.

Alongside the pilot line, the programme includes €300M in innovation actions for sovereign edge AI compute, €60M in research grants for quantum and photonic silicon, and €85M for a new round of competence centres anchored in member states that currently lack a national semiconductor specialism.

Executive Director Andreas Weber said: "2026 is when Europe moves from pilots to production. The sub-2nm action is historic, but it is the coherence of the full portfolio — from edge AI to sustainable manufacturing — that will define our competitiveness for the decade."`,
    category: "Announcement",
    publishedAt: "2026-04-14",
    readingMinutes: 4,
    author: "Programme Office",
    featured: true,
  },
  {
    slug: "eurohpc-edge-tapeout",
    title: "EUROHPC-EDGE consortium announces first reference tape-out",
    excerpt:
      "The 24-partner flagship will deliver its first open AI-inference silicon from the FD-SOI pilot line this summer.",
    body: `IMEC today confirmed the reference tape-out schedule for EUROHPC-EDGE — the flagship project that will deliver an open, certifiable platform for AI inference at the network edge.

The design, based on a RISC-V core cluster and a custom neural accelerator, has cleared its final design review. Masks will be shipped to the pilot line before 30 June 2026, with first silicon expected at the end of Q3.

"This is the first time a European consortium has taken a full-stack AI accelerator from RTL to FD-SOI in under two years," said project coordinator Dr. Petra Lensen.

The RTL will be released under the EU Public Licence once qualification is complete, enabling derivative designs across automotive, smart-grid and industrial segments.`,
    category: "Project",
    publishedAt: "2026-04-10",
    readingMinutes: 3,
    author: "Communications Team",
    featured: true,
  },
  {
    slug: "open-calls-spring-2026",
    title: "Spring 2026 calls now open: €260M across edge AI, quantum and sustainability",
    excerpt:
      "Three ECS R&I calls open on 15 February with a single deadline of 21 May. Submit through the new applicant portal.",
    body: `Three calls are now open for submissions through the Chips JU applicant portal. Combined budget: €260 million.

Full topic descriptions, expected outcomes and evaluation criteria are available in each call's detail page. Deadlines are binding and there are no extensions.`,
    category: "Call",
    publishedAt: "2026-02-15",
    readingMinutes: 2,
    author: "Programme Office",
    featured: true,
  },
  {
    slug: "green-fab-emissions-milestone",
    title: "GREEN-FAB hits 63% direct emissions reduction milestone",
    excerpt:
      "ASML-led consortium confirms it is on track to deliver the 70% target ahead of schedule.",
    body: `The GREEN-FAB consortium has confirmed a 63% reduction in direct process emissions at the Dresden pilot line, ahead of the mid-programme milestone.`,
    category: "Project",
    publishedAt: "2026-03-22",
    readingMinutes: 2,
    author: "Communications Team",
  },
  {
    slug: "cyber-resilience-act-alignment",
    title: "New certification framework aligned with EU Cyber Resilience Act",
    excerpt:
      "CYBER-CERT consortium publishes draft certification scheme for IoT silicon. Public consultation now open.",
    body: `CYBER-CERT has released a draft harmonised certification framework for IoT semiconductors, now open for public consultation through 30 May.`,
    category: "Policy",
    publishedAt: "2026-03-05",
    readingMinutes: 3,
    author: "Policy Team",
  },
  {
    slug: "industry-day-munich",
    title: "Industry Day Munich 2026 — registration open",
    excerpt:
      "Join 1,200+ representatives from European semiconductor industry, member states and EU institutions on 12 June in Munich.",
    body: `Registration is open for Industry Day 2026, the premier annual gathering of the Chips JU ecosystem.`,
    category: "Event",
    publishedAt: "2026-03-01",
    readingMinutes: 2,
    author: "Events Team",
  },
  {
    slug: "five-new-member-states",
    title: "Five new member states join Chips JU",
    excerpt:
      "Bulgaria, Croatia, Cyprus, Malta and Slovenia have ratified their participation, bringing the JU to 27 states.",
    body: `Five additional member states have joined the Chips Joint Undertaking.`,
    category: "Announcement",
    publishedAt: "2026-02-28",
    readingMinutes: 2,
    author: "Programme Office",
  },
  {
    slug: "competence-centre-madrid",
    title: "New competence centre inaugurated in Madrid",
    excerpt:
      "The Spanish national competence centre opens to SMEs, offering design services, training and pilot line access.",
    body: `The Madrid competence centre is now fully operational.`,
    category: "Event",
    publishedAt: "2026-02-20",
    readingMinutes: 2,
    author: "Events Team",
  },
];

export function latestNews(n = 4) {
  return [...NEWS]
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, n);
}

export function getArticle(slug: string) {
  return NEWS.find((n) => n.slug === slug);
}
