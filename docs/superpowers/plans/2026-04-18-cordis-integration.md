# CORDIS Live Data Integration — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace all mock project data with live data from the CORDIS public search API, cached server-side for 24 hours via Next.js `fetch` revalidation.

**Architecture:** A single `src/lib/cordis.ts` module fetches from CORDIS, maps raw JSON to a typed `Project` shape, and exports two functions used by server components. Client components (`ProjectsExplorer`) receive pre-fetched data as props. Stats are derived from the same CORDIS response.

**Tech Stack:** Next.js 16 App Router, TypeScript strict, `fetch` with `next: { revalidate: 86400 }`, Fuse.js for client-side fuzzy search.

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `src/lib/cordis.ts` | **Create** | Fetch, map, export `getCordisProjects()` + `getCordisProject(rcn)` |
| `src/data/projects.ts` | **Delete** | Replaced by `src/lib/cordis.ts` |
| `src/data/stats.ts` | **Update** | Export `deriveCordisStats(projects)` instead of static array |
| `src/components/marketing/project-card.tsx` | **Update** | Import `Project` from `@/lib/cordis`; use `programme` for colour; remove `topicArea`/`trl`/`callRef` |
| `src/components/marketing/projects-explorer.tsx` | **Update** | Accept `projects: Project[]` prop; remove TRL slider + topic filter; add programme + country filters |
| `src/components/marketing/featured-projects.tsx` | **Update** | Async server component; call `getCordisProjects()` directly |
| `src/components/marketing/stats-row.tsx` | **Update** | Accept `stats: HeroStat[]` prop instead of importing from `@/data/stats` |
| `src/app/(marketing)/page.tsx` | **Update** | Fetch projects + derive stats; pass to `StatsRow` |
| `src/app/(marketing)/projects/page.tsx` | **Update** | Fetch projects; pass to `ProjectsExplorer` |
| `src/app/(marketing)/projects/[slug]/page.tsx` | **Update** | Call `getCordisProject(rcn)`; remove `topicArea`/`trl`/`outcomes`/consortium type column |

---

## Task 1: Create the CORDIS data layer

**Files:**
- Create: `src/lib/cordis.ts`

- [ ] **Step 1: Write `src/lib/cordis.ts`**

```ts
// src/lib/cordis.ts

export type Project = {
  slug: string;         // rcn as string, used in URLs
  rcn: string;
  name: string;
  acronym: string;
  budgetEur: number;
  fundingEur: number;
  startDate: string;    // "YYYY-MM-DD"
  endDate: string;
  status: "active" | "completed" | "upcoming";
  coordinator: { name: string; country: string };
  consortiumSize: number;
  consortium: { name: string; country: string }[];
  summary: string;
  description: string;
  programme: "CHIPS" | "KDT";
  website?: string;
};

export type HeroStat = {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  note?: string;
};

// Raw shape returned by CORDIS search API (partial — only fields we use)
type CordisRaw = {
  rcn: string;
  acronym?: string;
  title?: string;
  startDate?: string;
  endDate?: string;
  totalCost?: number;
  ecMaxContribution?: number;
  status?: string;
  teaser?: string;
  objective?: string;
  coordinatorCompany?: string;
  coordinatedIn?: string;
  numberOfParticipants?: number;
  programme?: { code: string }[];
  relations?: {
    associations?: { name: string; country?: string }[];
    organizations?: { name: string; shortName?: string; country?: string; role?: string }[];
  };
};

type CordisSearchResponse = {
  payload?: {
    results?: {
      result?: CordisRaw[];
      numFound?: number;
    };
  };
};

const CORDIS_API = "https://cordis.europa.eu/api/search/results";
const QUERY =
  "contenttype%3Dproject%20AND%20(programme%2Fcode%3D%27CHIPS%27%20OR%20programme%2Fcode%3D%27KDT%27)";

function mapStatus(raw?: string): Project["status"] {
  switch (raw?.toUpperCase()) {
    case "ONGOING": return "active";
    case "SIGNED":  return "upcoming";
    default:        return "completed";  // CLOSED, TERMINATED, etc.
  }
}

function mapProgramme(raw?: { code: string }[]): Project["programme"] {
  const codes = raw?.map((p) => p.code) ?? [];
  return codes.includes("CHIPS") ? "CHIPS" : "KDT";
}

function mapProject(r: CordisRaw): Project {
  const orgs = r.relations?.organizations ?? [];
  const coordOrg = orgs.find((o) => o.role?.toLowerCase() === "coordinator");
  const coordinatorName =
    coordOrg?.name ??
    r.coordinatorCompany ??
    r.relations?.associations?.[0]?.name ??
    "Unknown";
  const coordinatorCountry =
    coordOrg?.country ?? r.coordinatedIn ?? "";

  const consortium = orgs.map((o) => ({
    name: o.name ?? o.shortName ?? "Unknown",
    country: o.country ?? "",
  }));

  return {
    slug: String(r.rcn),
    rcn: String(r.rcn),
    name: r.title ?? r.acronym ?? "",
    acronym: r.acronym ?? "",
    budgetEur: r.totalCost ?? 0,
    fundingEur: r.ecMaxContribution ?? 0,
    startDate: r.startDate ?? "",
    endDate: r.endDate ?? "",
    status: mapStatus(r.status),
    coordinator: { name: coordinatorName, country: coordinatorCountry },
    consortiumSize: r.numberOfParticipants ?? orgs.length,
    consortium,
    summary: r.teaser ?? "",
    description: r.objective ?? r.teaser ?? "",
    programme: mapProgramme(r.programme),
  };
}

async function fetchCordis(query: string, num = 100): Promise<CordisRaw[]> {
  const url = `${CORDIS_API}?q=${query}&p=1&num=${num}&archived=true`;
  const res = await fetch(url, { next: { revalidate: 86400 } });
  if (!res.ok) throw new Error(`CORDIS API error: ${res.status}`);
  const json: CordisSearchResponse = await res.json();
  return json.payload?.results?.result ?? [];
}

let _cache: Project[] | null = null;

export async function getCordisProjects(): Promise<Project[]> {
  if (_cache) return _cache;
  const raw = await fetchCordis(QUERY);
  _cache = raw.map(mapProject);
  return _cache;
}

export async function getCordisProject(rcn: string): Promise<Project | null> {
  // For detail pages: fetch individual project to get full consortium list
  const singleQuery = `contenttype%3Dproject%20AND%20rcn%3D${rcn}`;
  const raw = await fetchCordis(singleQuery, 1);
  if (!raw[0]) return null;
  return mapProject(raw[0]);
}

export function deriveCordisStats(projects: Project[]): HeroStat[] {
  const active = projects.filter((p) => p.status === "active").length;
  const totalFunding = projects.reduce((s, p) => s + p.fundingEur, 0);
  const participations = projects.reduce((s, p) => s + (p.consortiumSize || 0), 0);
  return [
    {
      label: "Total EC funding",
      value: Math.round(totalFunding / 1e9 * 10) / 10,
      prefix: "€",
      suffix: "B",
      note: "Across CHIPS + KDT programmes",
    },
    {
      label: "Active projects",
      value: active,
      note: `Of ${projects.length} total`,
    },
    {
      label: "Participations",
      value: participations,
      note: "Org × project (may overlap)",
    },
    {
      label: "Programmes",
      value: 2,
      note: "CHIPS JU + KDT predecessor",
    },
  ];
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /Users/fredanaman/Documents/claudecode/chips-ju-webapp
npx tsc --noEmit 2>&1 | head -40
```

Expected: errors only in files that still import from `@/data/projects` (not yet fixed) — none from `cordis.ts` itself.

- [ ] **Step 3: Commit**

```bash
git add src/lib/cordis.ts
git commit -m "feat: add CORDIS data layer with 24h cache"
```

---

## Task 2: Update `src/data/stats.ts`

**Files:**
- Modify: `src/data/stats.ts`

- [ ] **Step 1: Replace file content**

Replace the entire file:

```ts
// src/data/stats.ts
// Stats are now derived from live CORDIS data — see src/lib/cordis.ts deriveCordisStats()
// This file is kept only for the HeroStat type re-export.
export type { HeroStat } from "@/lib/cordis";
```

- [ ] **Step 2: Commit**

```bash
git add src/data/stats.ts
git commit -m "chore: redirect stats type to cordis lib"
```

---

## Task 3: Update `StatsRow` to accept props

**Files:**
- Modify: `src/components/marketing/stats-row.tsx`

- [ ] **Step 1: Replace file content**

```tsx
// src/components/marketing/stats-row.tsx
import type { HeroStat } from "@/lib/cordis";
import { Counter } from "./counter";
import { colorFor, type ColorKey } from "@/lib/colors";
import { cn } from "@/lib/utils";

const STAT_COLORS: ColorKey[] = ["brand", "fuchsia", "emerald", "amber"];

export function StatsRow({ stats }: { stats: HeroStat[] }) {
  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-4">
      {stats.map((s, i) => {
        const decimals = Number.isInteger(s.value) ? 0 : 1;
        const color = colorFor(STAT_COLORS[i % STAT_COLORS.length]);
        return (
          <div
            key={s.label}
            className="relative overflow-hidden bg-card px-5 py-6 md:px-7 md:py-8"
          >
            <div
              aria-hidden
              className={cn(
                "pointer-events-none absolute -top-14 -right-14 h-36 w-36 rounded-full bg-gradient-to-br opacity-60 blur-3xl",
                color.gradient,
              )}
            />
            <span
              aria-hidden
              className={cn("absolute inset-x-0 top-0 h-0.5", color.dot)}
            />
            <div className="relative font-display text-3xl font-bold tracking-tight md:text-4xl">
              {s.prefix ?? ""}
              <Counter value={s.value} decimals={decimals} />
              {s.suffix ?? ""}
            </div>
            <div className="relative mt-1 text-sm font-medium text-foreground/80">
              {s.label}
            </div>
            {s.note && (
              <div className="relative mt-0.5 text-xs text-muted-foreground">{s.note}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/marketing/stats-row.tsx
git commit -m "refactor: StatsRow accepts stats prop instead of importing static data"
```

---

## Task 4: Update `ProjectCard` — remove topicArea/TRL, use programme colour

**Files:**
- Modify: `src/components/marketing/project-card.tsx`

- [ ] **Step 1: Replace file content**

```tsx
// src/components/marketing/project-card.tsx
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/cordis";
import { Badge } from "@/components/ui/badge";
import { formatEur } from "@/lib/format";
import { colorFor, type ColorKey } from "@/lib/colors";
import { cn } from "@/lib/utils";

const PROGRAMME_COLOR: Record<Project["programme"], ColorKey> = {
  CHIPS: "brand",
  KDT: "fuchsia",
};

export function ProjectCard({ project }: { project: Project }) {
  const color = colorFor(PROGRAMME_COLOR[project.programme]);
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card p-6 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-elevated"
    >
      <span aria-hidden className={cn("absolute inset-x-0 top-0 h-1", color.dot)} />
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-gradient-to-br opacity-50 blur-2xl transition-opacity group-hover:opacity-80",
          color.gradient,
        )}
      />

      <div className="relative flex items-start justify-between gap-3">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
            color.chip,
          )}
        >
          <span className={cn("h-1.5 w-1.5 rounded-full", color.dot)} />
          {project.programme}
        </span>
        <Badge variant={project.status === "active" ? "success" : "outline"}>
          {project.status}
        </Badge>
      </div>

      <div className="relative mt-4">
        <span className={cn("font-mono text-xs font-semibold", color.text)}>
          {project.acronym}
        </span>
      </div>
      <h3 className="relative mt-1 font-display text-lg font-semibold leading-snug tracking-tight">
        {project.name}
      </h3>
      <p className="relative mt-3 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-3">
        {project.summary}
      </p>

      <div className="relative mt-6 grid grid-cols-3 gap-4 border-t border-border pt-4 text-xs">
        <div>
          <div className="font-mono text-[10px] uppercase text-muted-foreground">Funding</div>
          <div className="mt-0.5 font-display text-sm font-semibold">
            {project.fundingEur ? formatEur(project.fundingEur, { compact: true }) : "—"}
          </div>
        </div>
        <div>
          <div className="font-mono text-[10px] uppercase text-muted-foreground">Partners</div>
          <div className="mt-0.5 font-display text-sm font-semibold">
            {project.consortiumSize || "—"}
          </div>
        </div>
        <div>
          <div className="font-mono text-[10px] uppercase text-muted-foreground">Lead</div>
          <div className="mt-0.5 font-display text-sm font-semibold truncate">
            {project.coordinator.name}
          </div>
        </div>
      </div>

      <div className="relative mt-5 flex items-center justify-between text-sm text-foreground/60 transition group-hover:text-brand">
        <span>View project</span>
        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>
    </Link>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/marketing/project-card.tsx
git commit -m "refactor: ProjectCard uses programme colour and live Project type"
```

---

## Task 5: Update `ProjectsExplorer` — accept props, simplify filters

**Files:**
- Modify: `src/components/marketing/projects-explorer.tsx`

- [ ] **Step 1: Replace file content**

```tsx
// src/components/marketing/projects-explorer.tsx
"use client";

import * as React from "react";
import { Search } from "lucide-react";
import Fuse from "fuse.js";
import type { Project } from "@/lib/cordis";
import { ProjectCard } from "./project-card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { formatEur } from "@/lib/format";

type Status = "all" | Project["status"];
type Programme = "all" | Project["programme"];

export function ProjectsExplorer({ projects }: { projects: Project[] }) {
  const [query, setQuery] = React.useState("");
  const [status, setStatus] = React.useState<Status>("all");
  const [programme, setProgramme] = React.useState<Programme>("all");
  const [country, setCountry] = React.useState("all");

  const countries = React.useMemo(() => {
    const set = new Set(projects.map((p) => p.coordinator.country).filter(Boolean));
    return Array.from(set).sort();
  }, [projects]);

  const fuse = React.useMemo(
    () =>
      new Fuse(projects, {
        keys: ["name", "acronym", "summary", "coordinator.name"],
        threshold: 0.35,
        ignoreLocation: true,
      }),
    [projects],
  );

  const filtered = React.useMemo(() => {
    let base: Project[] = query
      ? fuse.search(query).map((r) => r.item)
      : projects;
    if (status !== "all") base = base.filter((p) => p.status === status);
    if (programme !== "all") base = base.filter((p) => p.programme === programme);
    if (country !== "all") base = base.filter((p) => p.coordinator.country === country);
    return base;
  }, [fuse, query, projects, status, programme, country]);

  const totalFunding = filtered.reduce((sum, p) => sum + p.fundingEur, 0);

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
        <div>
          <label className="mb-2 flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            <Search className="h-3 w-3" /> Search
          </label>
          <Input
            placeholder="Project, acronym, coordinator…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div>
          <label className="mb-2 block font-mono text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Status
          </label>
          <Select value={status} onChange={(e) => setStatus(e.target.value as Status)}>
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="upcoming">Upcoming</option>
          </Select>
        </div>

        <div>
          <label className="mb-2 block font-mono text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Programme
          </label>
          <Select value={programme} onChange={(e) => setProgramme(e.target.value as Programme)}>
            <option value="all">All programmes</option>
            <option value="CHIPS">CHIPS JU</option>
            <option value="KDT">KDT JU (predecessor)</option>
          </Select>
        </div>

        <div>
          <label className="mb-2 block font-mono text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Coordinator country
          </label>
          <Select value={country} onChange={(e) => setCountry(e.target.value)}>
            <option value="all">All countries</option>
            {countries.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </Select>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setQuery("");
            setStatus("all");
            setProgramme("all");
            setCountry("all");
          }}
        >
          Reset filters
        </Button>
      </aside>

      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-3 justify-between rounded-lg border border-border bg-surface-2/60 p-4 text-sm">
          <div className="flex items-center gap-3">
            <Badge variant="brand">{filtered.length}</Badge>
            <span>projects matching your filters</span>
          </div>
          {totalFunding > 0 && (
            <div className="text-muted-foreground">
              Total EC funding:{" "}
              <span className="font-display font-semibold text-foreground">
                {formatEur(totalFunding, { compact: true })}
              </span>
            </div>
          )}
        </div>

        {filtered.length ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border bg-surface-2 p-12 text-center">
            <p className="font-display text-lg font-semibold">No projects match</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Try widening your filters or clearing the search query.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/marketing/projects-explorer.tsx
git commit -m "refactor: ProjectsExplorer accepts projects prop, simplified filters"
```

---

## Task 6: Update `FeaturedProjects` — async, real data

**Files:**
- Modify: `src/components/marketing/featured-projects.tsx`

- [ ] **Step 1: Make the component async and fetch real data**

Replace the top of `featured-projects.tsx` — the import and function signature:

```tsx
// src/components/marketing/featured-projects.tsx
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getCordisProjects } from "@/lib/cordis";
import { Container, Eyebrow, Section } from "@/components/ui/container";
import { ProjectCard } from "./project-card";
import { Button } from "@/components/ui/button";

export async function FeaturedProjects() {
  const allProjects = await getCordisProjects();
  const projects = allProjects.slice(0, 4);
  return (
    <Section className="bg-surface-2/60 border-t border-b border-border">
      <Container>
        <div className="mb-10 text-center">
          <Eyebrow className="justify-center">Featured projects</Eyebrow>
          <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl text-balance">
            From pilot lines to sovereign platforms.
          </h2>
          <div className="section-green-line" />
          <p className="mt-4 mx-auto max-w-2xl text-muted-foreground">
            A selection of flagship actions funded across the Chips for Europe and
            KDT programmes.
          </p>
          <div className="mt-4 flex justify-center">
            <Button variant="outline" asChild>
              <Link href="/projects">
                All {allProjects.length} projects
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {projects.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/marketing/featured-projects.tsx
git commit -m "feat: FeaturedProjects fetches real CORDIS data"
```

---

## Task 7: Update home page — pass real stats to StatsRow

**Files:**
- Modify: `src/app/(marketing)/page.tsx`

- [ ] **Step 1: Read the current home page**

```bash
cat src/app/(marketing)/page.tsx
```

- [ ] **Step 2: Add stats fetch and pass to StatsRow**

Find the import section and the `<StatsRow />` usage. The home page is a server component. Add:

```tsx
// At the top of the file, add:
import { getCordisProjects, deriveCordisStats } from "@/lib/cordis";

// Change the default export to async:
export default async function HomePage() {
  const projects = await getCordisProjects();
  const stats = deriveCordisStats(projects);
  // ... rest of the page JSX, replacing <StatsRow /> with <StatsRow stats={stats} />
```

The `<Hero />` component embeds `<StatsRow />` internally. Check `src/components/marketing/hero.tsx` — if `StatsRow` is rendered inside Hero, you must either:
- (a) Make `Hero` async and call `getCordisProjects()` internally, OR
- (b) Remove `StatsRow` from `Hero` and render it separately in the page, passing `stats`

Preferred approach: **(b)** — keep Hero simple, render StatsRow in the page directly below Hero.

In `src/components/marketing/hero.tsx`, remove the `<StatsRow />` and its import. In `src/app/(marketing)/page.tsx`, render `<StatsRow stats={stats} />` below `<Hero />`.

- [ ] **Step 3: Commit**

```bash
git add src/app/(marketing)/page.tsx src/components/marketing/hero.tsx
git commit -m "feat: home page derives live stats from CORDIS"
```

---

## Task 8: Update projects list page

**Files:**
- Modify: `src/app/(marketing)/projects/page.tsx`

- [ ] **Step 1: Replace file content**

```tsx
// src/app/(marketing)/projects/page.tsx
import { getCordisProjects } from "@/lib/cordis";
import { PageHero } from "@/components/marketing/page-hero";
import { ProjectsExplorer } from "@/components/marketing/projects-explorer";
import { Container, Section } from "@/components/ui/container";

export const metadata = { title: "Projects" };

export default async function ProjectsPage() {
  const projects = await getCordisProjects();
  return (
    <>
      <PageHero
        eyebrow="Projects"
        title={`${projects.length} projects shaping Europe's chip industry.`}
        description="Explore every project funded by the Chips JU and its predecessor KDT JU — filter by status, country or programme."
      />
      <Section className="pt-14">
        <Container>
          <ProjectsExplorer projects={projects} />
        </Container>
      </Section>
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/(marketing)/projects/page.tsx
git commit -m "feat: projects page uses live CORDIS data"
```

---

## Task 9: Update project detail page

**Files:**
- Modify: `src/app/(marketing)/projects/[slug]/page.tsx`

- [ ] **Step 1: Replace file content**

```tsx
// src/app/(marketing)/projects/[slug]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, ExternalLink, Users } from "lucide-react";
import { getCordisProjects, getCordisProject } from "@/lib/cordis";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/container";
import { formatDate, formatDateRange, formatEur } from "@/lib/format";

export async function generateStaticParams() {
  const projects = await getCordisProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await getCordisProject(slug);
  return { title: p ? `${p.acronym} — ${p.name}` : "Project" };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getCordisProject(slug);
  if (!project) notFound();

  return (
    <>
      <section className="border-b border-border bg-surface-2/40">
        <Container className="py-10 md:py-14">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to all projects
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <Badge variant="brand">{project.programme}</Badge>
            <Badge variant={project.status === "active" ? "success" : "default"}>
              {project.status}
            </Badge>
          </div>
          <div className="mt-4">
            <span className="font-mono text-sm font-semibold text-accent-600">
              {project.acronym}
            </span>
          </div>
          <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight md:text-5xl text-balance max-w-4xl">
            {project.name}
          </h1>
          <p className="mt-4 max-w-3xl text-muted-foreground md:text-lg">
            {project.summary}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {project.website && (
              <Button variant="outline" asChild>
                <a href={project.website} target="_blank" rel="noopener noreferrer">
                  Project website
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            )}
            <Button variant="outline" asChild>
              <Link href="/calls">Similar open calls</Link>
            </Button>
          </div>
        </Container>
      </section>

      <Section>
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
            <div className="space-y-10">
              <div>
                <h2 className="font-display text-2xl font-semibold tracking-tight mb-4">
                  About the project
                </h2>
                <p className="text-pretty leading-relaxed text-foreground/85 whitespace-pre-line">
                  {project.description}
                </p>
              </div>

              {project.consortium.length > 0 && (
                <div>
                  <h2 className="font-display text-2xl font-semibold tracking-tight mb-4">
                    Consortium
                  </h2>
                  <div className="overflow-hidden rounded-xl border border-border bg-card">
                    <table className="w-full text-sm">
                      <thead className="bg-surface-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                        <tr>
                          <th className="px-4 py-3 text-left">Organisation</th>
                          <th className="px-4 py-3 text-left">Country</th>
                        </tr>
                      </thead>
                      <tbody>
                        {project.consortium.map((c, i) => (
                          <tr key={`${c.name}-${i}`} className={i > 0 ? "border-t border-border" : ""}>
                            <td className="px-4 py-3 font-medium">
                              {c.name}
                              {c.name === project.coordinator.name && (
                                <Badge variant="brand" className="ml-2">
                                  Coordinator
                                </Badge>
                              )}
                            </td>
                            <td className="px-4 py-3 font-mono text-xs">{c.country}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {project.consortiumSize > project.consortium.length && (
                      <div className="border-t border-border px-4 py-3 text-xs text-muted-foreground">
                        + {project.consortiumSize - project.consortium.length} additional partners
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <aside className="space-y-4">
              <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                <h3 className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  At a glance
                </h3>
                <dl className="mt-4 space-y-4 text-sm">
                  {project.budgetEur > 0 && (
                    <div>
                      <dt className="text-muted-foreground">Total budget</dt>
                      <dd className="mt-0.5 font-display text-xl font-semibold">
                        {formatEur(project.budgetEur)}
                      </dd>
                    </div>
                  )}
                  {project.fundingEur > 0 && (
                    <div>
                      <dt className="text-muted-foreground">EC funding</dt>
                      <dd className="mt-0.5 font-display text-xl font-semibold text-brand">
                        {formatEur(project.fundingEur)}
                      </dd>
                      {project.budgetEur > 0 && (
                        <dd className="mt-0.5 text-xs text-muted-foreground">
                          {Math.round((project.fundingEur / project.budgetEur) * 100)}% co-funding rate
                        </dd>
                      )}
                    </div>
                  )}
                  {project.startDate && (
                    <div className="border-t border-border pt-4">
                      <dt className="text-muted-foreground inline-flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" /> Timeline
                      </dt>
                      <dd className="mt-0.5 font-medium">
                        {formatDateRange(project.startDate, project.endDate)}
                      </dd>
                    </div>
                  )}
                  {project.consortiumSize > 0 && (
                    <div>
                      <dt className="text-muted-foreground inline-flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5" /> Consortium size
                      </dt>
                      <dd className="mt-0.5 font-medium">{project.consortiumSize} partners</dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-muted-foreground">Coordinator</dt>
                    <dd className="mt-0.5 font-medium">
                      {project.coordinator.name}{" "}
                      {project.coordinator.country && (
                        <span className="text-muted-foreground">({project.coordinator.country})</span>
                      )}
                    </dd>
                  </div>
                  {project.startDate && (
                    <div>
                      <dt className="text-muted-foreground">Start date</dt>
                      <dd className="mt-0.5 font-medium">{formatDate(project.startDate)}</dd>
                    </div>
                  )}
                </dl>
              </div>
            </aside>
          </div>
        </Container>
      </Section>
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/(marketing)/projects/[slug]/page.tsx
git commit -m "feat: project detail page uses live CORDIS data"
```

---

## Task 10: Delete `src/data/projects.ts` and verify

**Files:**
- Delete: `src/data/projects.ts`

- [ ] **Step 1: Check nothing imports from `@/data/projects` anymore**

```bash
grep -r "@/data/projects" src/
```

Expected: no output (all imports removed in previous tasks).

- [ ] **Step 2: Delete the file**

```bash
rm src/data/projects.ts
```

- [ ] **Step 3: Verify TypeScript compiles clean**

```bash
npx tsc --noEmit 2>&1
```

Expected: no errors.

- [ ] **Step 4: Start dev server and verify home page loads**

```bash
npm run dev
```

Open `http://localhost:3000` — should load with real CORDIS stats in the counter row and real project cards in "Featured projects".

- [ ] **Step 5: Verify projects explorer**

Open `http://localhost:3000/projects` — should show real projects, status/programme/country filters working, count badge showing real number.

- [ ] **Step 6: Verify a project detail page**

Click any project card — detail page should show real acronym, title, description, and consortium table (or coordinator-only if CORDIS search API doesn't return full org list for that project).

- [ ] **Step 7: Final commit**

```bash
git add -A
git commit -m "feat: remove mock projects data — all project data now live from CORDIS"
```

---

## Notes for implementer

**CORDIS API response shape:** The exact JSON structure must be confirmed by inspecting a live response. Run this in your terminal to see the raw shape before mapping:

```bash
curl -s "https://cordis.europa.eu/api/search/results?q=contenttype%3Dproject%20AND%20programme%2Fcode%3D%27CHIPS%27&p=1&num=2&archived=true" | python3 -m json.tool | head -100
```

Adjust field names in `mapProject()` in `src/lib/cordis.ts` to match the actual response.

**If consortium list is empty:** The search API may not return `relations.organizations` — only the single-project fetch might include it. If `project.consortium` is always `[]`, the "Consortium" section will be hidden (the `project.consortium.length > 0` guard in the detail page handles this gracefully).

**Module-level `_cache`:** The `let _cache` in `cordis.ts` is a module-level cache as a fallback. Next.js's built-in fetch deduplication + `revalidate` is the primary caching mechanism; the module cache just prevents redundant mapping work within a single render pass.
