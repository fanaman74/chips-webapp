# CORDIS Live Data Integration — Design Spec

**Date:** 2026-04-18  
**Project:** chips-ju-webapp  
**Status:** Approved

---

## Goal

Replace all mock project data with real data from the CORDIS public search API. Every project-related page, the stats counters, and the featured projects section will serve live data. No mock data files remain after this change.

---

## Data Source

**CORDIS Search API** — unauthenticated, JSON, no API key required.

Base URL:
```
https://cordis.europa.eu/api/search/results
```

Query to fetch all Chips JU projects (CHIPS + KDT predecessor programme):
```
q=contenttype%3Dproject%20AND%20(programme%2Fcode%3D%27CHIPS%27%20OR%20programme%2Fcode%3D%27KDT%27)&p=1&num=100&archived=true
```

Expected result set: ~23 CHIPS + ~51 KDT projects (~74 total).

**Caching:** `fetch(..., { next: { revalidate: 86400 } })` — Next.js server-side cache, refreshed every 24 hours automatically.

---

## Architecture

### New file: `src/lib/cordis.ts`

Single module responsible for:
1. Fetching from CORDIS API with 24h revalidation
2. Mapping raw CORDIS JSON → typed `Project` shape
3. Exporting two functions: `getCordisProjects()` and `getCordisProject(rcn: string)`

No other file touches the CORDIS API directly.

### Field Mapping

| CORDIS field | App field | Notes |
|---|---|---|
| `rcn` (string) | `slug` | Used as URL segment |
| `acronym` | `acronym` | |
| `title` | `name` | |
| `startDate` | `startDate` | ISO date string |
| `endDate` | `endDate` | ISO date string |
| `totalCost` | `budgetEur` | Number, may be null → 0 |
| `ecMaxContribution` | `fundingEur` | Number, may be null → 0 |
| `status` | `status` | Map: `CLOSED` → `completed`, `ONGOING` → `active`, `SIGNED` → `upcoming` |
| `coordinatedIn` (country code) | `coordinator.country` | From search API |
| `relations.associations[0].name` | `coordinator.name` | Coordinator org name |
| `consortiumSize` (derived) | `consortiumSize` | From `numberOfParticipants` field if present, else 0 |
| `relations.organizations[]` | `consortium[]` | Only available on per-project fetch (detail pages); list pages show coordinator only |
| `teaser` | `summary` | Short description |
| `objective` | `description` | Full text, may be long |
| `programme[0].code` | internal only | Used to label KDT vs CHIPS |

Fields removed from the `Project` type (not available from CORDIS search API):
- `trl` — dropped
- `topicArea` — dropped
- `callRef` — replaced with `legalBasis` if available
- `consortium[].type` — dropped (industry/academic/RTO not in API)
- `outcomes` — dropped (not in search API response)
- `featured` — first 4 results treated as featured

### Updated `Project` type (in `src/lib/cordis.ts`)

```ts
export type Project = {
  slug: string;
  name: string;
  acronym: string;
  budgetEur: number;
  fundingEur: number;
  startDate: string;
  endDate: string;
  status: "active" | "completed" | "upcoming";
  coordinator: { name: string; country: string };
  consortiumSize: number;
  consortium: { name: string; country: string }[];
  summary: string;
  description: string;
  website?: string;
  programme: "CHIPS" | "KDT";
};
```

---

## Files Changed

| File | Action |
|---|---|
| `src/lib/cordis.ts` | **Create** — fetch + map + export |
| `src/data/projects.ts` | **Delete** — fully replaced |
| `src/data/stats.ts` | **Update** — derive counts from live CORDIS response |
| `src/app/(marketing)/projects/page.tsx` | **Update** — import `getCordisProjects()`, simplify filters |
| `src/app/(marketing)/projects/[slug]/page.tsx` | **Update** — import `getCordisProject(rcn)` |
| `src/components/marketing/featured-projects.tsx` | **Update** — use first 4 from `getCordisProjects()` |
| `src/components/marketing/projects-explorer.tsx` | **Update** — remove TRL slider + type filter, keep keyword/status/country |
| `src/components/marketing/stats-row.tsx` | **Update** — accept live stats derived from CORDIS |

---

## Project Explorer Filters (simplified)

After removing TRL and consortium-type filters, the explorer will support:

- **Keyword search** — matches acronym + title + summary
- **Status** — All / Active / Completed / Upcoming
- **Country** — coordinator country, derived from CORDIS data
- **Programme** — CHIPS / KDT (new filter, free from CORDIS data)

---

## Stats Row

Derived from the CORDIS response at fetch time:

| Stat | Source |
|---|---|
| Total projects | `results.length` |
| Active projects | count where `status === "active"` |
| Partner organisations | sum of `consortiumSize` across all projects (may double-count orgs in multiple projects — noted in UI as "participations") |
| Total EC funding | sum of `fundingEur` across all projects |

The existing animated counter component remains unchanged — only the source values change.

---

## Error Handling

- If CORDIS API returns a non-200 or times out: throw an error, let Next.js error boundary handle it (shows the existing `not-found.tsx` or a basic error state).
- If a project `rcn` is not found in `getCordisProject()`: return `null`, page calls `notFound()`.
- Detail page fetches individual project from `https://cordis.europa.eu/api/search/results?q=contenttype%3Dproject%20AND%20rcn%3D{rcn}` to get full consortium data.
- Fields that may be `null` in the API (totalCost, ecMaxContribution, teaser): default to `0` / `""`.

---

## Out of Scope

- Project detail pages for KDT-era projects with very long descriptions (no truncation logic added)
- Pagination (all ~74 projects fit in one API call with `num=100`)
- CORDIS DET API or bulk download — not needed for this scope
- Calls, news, events, members data — remain mocked for now
