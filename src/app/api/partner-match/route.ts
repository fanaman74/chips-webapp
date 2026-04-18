import { NextRequest, NextResponse } from "next/server";

const CORDIS_API = "https://cordis.europa.eu/api/search/results";
const OPENROUTER = "https://openrouter.ai/api/v1/chat/completions";

const STOP = new Set([
  "the","and","is","are","for","of","to","a","in","with","on","at","by","we",
  "our","this","that","have","has","will","can","it","be","do","not","but",
  "from","they","you","use","new","was","would","which","when","what","how",
  "its","all","also","each","more","than","been","into","over","such","only",
  "some","make","most","these","there","their","were","had","both","about",
  "during","across","between","through","other","using","based","high","low",
  "large","small","novel","advanced","next","generation","european","europe",
]);

export type PartnerResult = {
  orgName: string;
  country: string;
  orgType: string;
  matchScore: number;
  reason: string;
  expertise: string[];
  relevantProjects: string[];
};

function extractKeywords(desc: string): string[] {
  return [
    ...new Set(
      desc
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .split(/\s+/)
        .filter((w) => w.length > 3 && !STOP.has(w))
    ),
  ].slice(0, 6);
}

type CordisProject = {
  title: string;
  acronym: string;
  teaser: string;
  coordinatedIn: string;
  startDate: string;
  endDate: string;
};

async function fetchRelatedProjects(keywords: string[]): Promise<CordisProject[]> {
  // Search CHIPS + KDT projects whose teaser contains any keyword
  const kwQuery = keywords.slice(0, 4).map((k) => `teaser:"${k}"`).join(" OR ");
  const q = encodeURIComponent(
    `contenttype:project AND (programme/code:'CHIPS' OR programme/code:'KDT') AND (${kwQuery})`
  );
  try {
    const res = await fetch(`${CORDIS_API}?q=${q}&p=1&num=30`, {
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return [];
    const json = await res.json();
    return (json.payload?.results ?? []).map((r: Record<string, string>) => ({
      title: r.title ?? "",
      acronym: r.acronym ?? "",
      teaser: r.teaser ?? "",
      coordinatedIn: r.coordinatedIn ?? "",
      startDate: r.startDate ?? "",
      endDate: r.endDate ?? "",
    }));
  } catch {
    return [];
  }
}

async function recommendWithAI(
  description: string,
  country: string | undefined,
  maxResults: number,
  relatedProjects: CordisProject[]
): Promise<PartnerResult[]> {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) throw new Error("OPENROUTER_API_KEY not set");

  const projectContext =
    relatedProjects.length > 0
      ? `\nHere are similar CHIPS JU / KDT projects from CORDIS for reference:\n` +
        relatedProjects
          .slice(0, 20)
          .map(
            (p) =>
              `- ${p.acronym || p.title}${p.coordinatedIn ? ` (coord. ${p.coordinatedIn})` : ""}: ${p.teaser}`
          )
          .join("\n")
      : "";

  const countryClause = country
    ? `Prioritise organisations based in ${country}, but you may include others if they are a strong fit.`
    : "Consider organisations from any EU member state or associated country.";

  const prompt = `You are an expert in the European semiconductor research and innovation ecosystem, with deep knowledge of universities, research institutes, technology companies, and their specialisations across EU countries.

A researcher needs consortium partners for this CHIPS JU project:
"${description}"

${countryClause}
${projectContext}

Based on your knowledge of the European R&I ecosystem, recommend ${maxResults} specific, real organisations that would make excellent consortium partners. Include a mix of universities, research institutes, and companies. Focus on organisations with proven expertise in semiconductor R&I.

Return ONLY a JSON array — no markdown, no explanation:
[
  {
    "orgName": "Full official name of a real organisation",
    "country": "Country name",
    "orgType": "University | Research Institute | Company | Pilot Line",
    "matchScore": 88,
    "reason": "One specific sentence explaining why this org is a strong fit for this project",
    "expertise": ["tag1", "tag2", "tag3"],
    "relevantProjects": ["Project or programme name they are known for"]
  }
]`;

  const res = await fetch(OPENROUTER, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://chips-ju.eu",
      "X-Title": "Chips JU Consortium Builder",
    },
    body: JSON.stringify({
      model: "google/gemma-4-26b-a4b-it:free",
      max_tokens: 3000,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) throw new Error(`OpenRouter ${res.status}: ${await res.text()}`);
  const json = await res.json();
  const content: string = json.choices?.[0]?.message?.content ?? "[]";
  const match = content.match(/\[[\s\S]*\]/);
  if (!match) return [];

  const results: PartnerResult[] = JSON.parse(match[0]);
  return results.sort((a, b) => b.matchScore - a.matchScore);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { description, country, maxResults = 10 } = body as {
    description: string;
    country?: string;
    maxResults?: number;
  };

  if (!description || description.trim().length < 20) {
    return NextResponse.json(
      { error: "Description must be at least 20 characters." },
      { status: 400 }
    );
  }

  const keywords = extractKeywords(description);
  const relatedProjects = await fetchRelatedProjects(keywords);

  try {
    const results = await recommendWithAI(
      description,
      country || undefined,
      Math.min(maxResults, 15),
      relatedProjects
    );
    return NextResponse.json({
      results,
      keywords,
      relatedProjectCount: relatedProjects.length,
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 502 });
  }
}
