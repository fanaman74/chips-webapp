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

// Raw shape returned by CORDIS search API (only fields actually present in responses)
type CordisRaw = {
  rcn: string;
  reference?: string;       // Grant agreement number (e.g. "101194458")
  id?: string;              // Same as reference
  acronym?: string;
  title?: string;
  startDate?: string;       // "1 {{month_10}} 2024" — localized template string
  endDate?: string;
  teaser?: string;
  coordinatedIn?: string;   // Coordinator country name
  archivedDate?: string;    // Empty string "" when not archived
  programme?: { code: string; id: string; rcn: string; title: string }[];
  // NOTE: totalCost, ecMaxContribution, numberOfParticipants, coordinatorCompany,
  // objective, relations are NOT returned by the CORDIS search API.
};

type CordisSearchResponse = {
  payload?: {
    results?: CordisRaw[];
  };
};

const CORDIS_API = "https://cordis.europa.eu/api/search/results";

// Combined query for CHIPS JU and KDT predecessor programme projects
const QUERY =
  "contenttype%3Dproject%20AND%20%28programme%2Fcode%3D%27CHIPS%27%20OR%20programme%2Fcode%3D%27KDT%27%29";

// Month index map for CORDIS date template strings like "1 {{month_10}} 2024"
const MONTH_MAP: Record<string, string> = {
  "1": "01", "2": "02", "3": "03", "4": "04", "5": "05", "6": "06",
  "7": "07", "8": "08", "9": "09", "10": "10", "11": "11", "12": "12",
};

/**
 * Parse CORDIS date template string into "YYYY-MM-DD".
 * Input examples: "1 {{month_10}} 2024", "31 {{month_03}} 2027"
 * Returns "" for unparseable input.
 */
function parseCordisDate(raw?: string): string {
  if (!raw) return "";
  // Match: "<day> {{month_<N>}} <year>"
  const m = raw.match(/(\d+)\s*\{\{month_(\d+)\}\}\s*(\d{4})/);
  if (!m) return "";
  const day = m[1].padStart(2, "0");
  const month = MONTH_MAP[m[2]];
  if (!month) return "";
  const year = m[3];
  return `${year}-${month}-${day}`;
}

/**
 * Derive project status from parsed start/end dates relative to today.
 * The search API does not expose a status field directly.
 */
function deriveStatus(startDate: string, endDate: string): Project["status"] {
  const today = new Date().toISOString().slice(0, 10);
  if (startDate && startDate > today) return "upcoming";
  if (endDate && endDate < today) return "completed";
  return "active";
}

/**
 * Derive CHIPS vs KDT from programme entries.
 * The `code` field is always "HORIZON" — KDT projects have a programme entry
 * with id containing "KDT" or title "Key Digital Technologies".
 * CHIPS projects have a programme entry with id containing "CHIPS".
 * Fall back to CHIPS if uncertain.
 */
function mapProgramme(raw?: { code: string; id: string; title: string }[]): Project["programme"] {
  if (!raw) return "CHIPS";
  if (raw.some(p => p.id?.toUpperCase().includes("CHIPS"))) return "CHIPS";
  if (raw.some(p => p.id?.toUpperCase().includes("KDT"))) return "KDT";
  if (raw.some(p => p.title?.toLowerCase().includes("key digital technologies"))) return "KDT";
  return "CHIPS";
}

function mapProject(r: CordisRaw): Project {
  const startDate = parseCordisDate(r.startDate);
  const endDate = parseCordisDate(r.endDate);

  return {
    slug: String(r.rcn),
    rcn: String(r.rcn),
    name: r.title ?? r.acronym ?? "",
    acronym: r.acronym ?? "",
    // Budget and funding are not available from the search API; callers may
    // augment these from a separate source or leave as 0.
    budgetEur: 0,
    fundingEur: 0,
    startDate,
    endDate,
    status: deriveStatus(startDate, endDate),
    coordinator: {
      name: "",                         // Not available in search API
      country: r.coordinatedIn ?? "",
    },
    consortiumSize: 0,                  // Not available in search API
    consortium: [],                     // Not available in search API
    summary: r.teaser ?? "",
    description: r.teaser ?? "",
    programme: mapProgramme(r.programme),
  };
}

async function fetchCordis(
  query: string,
  num = 100,
  page = 1
): Promise<CordisRaw[]> {
  const url = `${CORDIS_API}?q=${query}&p=${page}&num=${num}&archived=true`;
  const res = await fetch(url, { next: { revalidate: 86400 } });
  if (!res.ok) throw new Error(`CORDIS API error: ${res.status}`);
  const json: CordisSearchResponse = await res.json();
  // API returns payload.results as a direct array (not payload.results.result)
  return json.payload?.results ?? [];
}

let _cache: Project[] | null = null;

export async function getCordisProjects(): Promise<Project[]> {
  if (_cache) return _cache;
  // Fetch up to 200 projects (CHIPS ~23, KDT ~51 as of 2026-04)
  const raw = await fetchCordis(QUERY, 200);
  _cache = raw.map((r) => mapProject(r));
  return _cache;
}

export async function getCordisProject(rcn: string): Promise<Project | null> {
  if (_cache) return _cache.find((p) => p.rcn === rcn) ?? null;
  if (!/^\d+$/.test(rcn)) return null;
  const singleQuery = `contenttype%3Dproject%20AND%20rcn%3D${rcn}`;
  const raw = await fetchCordis(singleQuery, 1);
  if (!raw[0]) return null;
  return mapProject(raw[0]);
}

export function deriveCordisStats(projects: Project[]): HeroStat[] {
  const active = projects.filter((p) => p.status === "active").length;
  const chipsCount = projects.filter((p) => p.programme === "CHIPS").length;
  const kdtCount = projects.filter((p) => p.programme === "KDT").length;
  // fundingEur is 0 for all projects (not available from search API);
  // report project counts instead of funding totals.
  return [
    {
      label: "CHIPS JU projects",
      value: chipsCount,
      note: "European Chips Act programme",
    },
    {
      label: "KDT JU projects",
      value: kdtCount,
      note: "Key Digital Technologies predecessor",
    },
    {
      label: "Active projects",
      value: active,
      note: `Of ${projects.length} total`,
    },
    {
      label: "Programmes",
      value: 2,
      note: "CHIPS JU + KDT predecessor",
    },
  ];
}
