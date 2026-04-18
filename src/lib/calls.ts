import { supabase, supabaseAdmin } from "./supabase";

export type Call = {
  id: string;
  title: string;
  summary: string;
  instrument: string;
  programme: string;
  open_date: string | null;
  deadline: string | null;
  budget_eur: number | null;
  portal_url: string | null;
  status: "open" | "forthcoming" | "closed";
};

export async function getCalls(): Promise<Call[]> {
  const { data, error } = await supabase
    .from("calls")
    .select("*")
    .order("deadline", { ascending: true, nullsFirst: false });

  if (error || !data) return [];
  return data as Call[];
}

export async function getOpenCalls(): Promise<Call[]> {
  const { data, error } = await supabase
    .from("calls")
    .select("*")
    .eq("status", "open")
    .order("deadline", { ascending: true, nullsFirst: false });

  if (error || !data) return [];
  return data as Call[];
}

// ── EU Funding & Tenders sync ──────────────────────────────────────────────

const SEDIA_API = "https://api.tech.ec.europa.eu/search-api/prod/rest/search";

type SediaResult = {
  metadata: Record<string, string[]>;
};

function first(arr?: string[]): string {
  return arr?.[0] ?? "";
}

function deriveInstrument(id: string): string {
  if (id.includes("-RIA")) return "RIA";
  if (id.includes("-IA-") || id.endsWith("-IA")) return "IA";
  if (id.includes("-CSA")) return "CSA";
  if (id.toLowerCase().includes("pilot") || id.includes("-PL")) return "Pilot Line";
  return "Grant";
}

function deriveProgramme(fp: string): string {
  if (fp === "43108390") return "ECS R&I";
  if (fp === "43152860") return "Digital Europe";
  return "Chips for Europe";
}

function deriveStatus(sortStatus: string): Call["status"] {
  if (sortStatus === "1") return "open";
  if (sortStatus === "2") return "forthcoming";
  return "closed";
}

function toIsoDate(raw: string): string | null {
  const d = raw?.slice(0, 10);
  return d?.match(/^\d{4}-\d{2}-\d{2}$/) ? d : null;
}

export async function syncCallsFromEU(): Promise<{ inserted: number; updated: number; error?: string }> {
  const body = new URLSearchParams({
    apiKey: "SEDIA",
    text: "HORIZON-JU-CHIPS OR DIGITAL-JU-CHIPS",
    dataSet: "callForProposal",
    pageSize: "50",
    sortBy: "deadlineDate",
    sortOrder: "DESC",
  });

  let raw: SediaResult[];
  try {
    const res = await fetch(SEDIA_API, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    if (!res.ok) throw new Error(`SEDIA ${res.status}`);
    const json = await res.json();
    raw = json.results ?? [];
  } catch (e) {
    return { inserted: 0, updated: 0, error: String(e) };
  }

  const seen = new Set<string>();
  const rows: Omit<Call, "budget_eur">[] = [];

  for (const r of raw) {
    const m = r.metadata ?? {};
    const id = first(m.callIdentifier).trim();
    if (!id || seen.has(id)) continue;
    if (!id.startsWith("HORIZON-JU-CHIPS") && !id.startsWith("DIGITAL-JU-CHIPS")) continue;
    seen.add(id);

    const rawUrl = first(m.esST_URL) || first(m.url);
    const portalUrl = rawUrl.includes("portal/screen")
      ? rawUrl
      : `https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/opportunities/topic-search;callCode=${id}`;

    rows.push({
      id,
      title: first(m.title) || id,
      summary: first(m.description) || "",
      instrument: deriveInstrument(id),
      programme: deriveProgramme(first(m.frameworkProgramme)),
      open_date: toIsoDate(first(m.startDate)),
      deadline: toIsoDate(first(m.deadlineDate)),
      status: deriveStatus(first(m.sortStatus)),
      portal_url: portalUrl,
    });
  }

  if (!rows.length) return { inserted: 0, updated: 0 };

  const { error } = await supabaseAdmin.from("calls").upsert(
    rows.map((r) => ({ ...r, synced_at: new Date().toISOString() })),
    { onConflict: "id" }
  );

  if (error) return { inserted: 0, updated: 0, error: error.message };
  return { inserted: rows.length, updated: 0 };
}
