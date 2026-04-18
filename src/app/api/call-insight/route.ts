import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

const OPENROUTER = "https://openrouter.ai/api/v1/chat/completions";
const WORK_PROGRAMME_PDF =
  "https://www.chips-ju.europa.eu/GB_2025.125_Appendix8_2026_CEIv1.pdf";
const STORAGE_BUCKET = "call-docs";

export type CallInsight = {
  context: string;
  scope: string;
  expectedOutcomes: string[];
  fitLevel: "High" | "Medium" | "Weak";
  fitJustification: string;
  evaluationExcellence: string;
  evaluationImpact: string;
  evaluationImplementation: string;
  positioningAdvice: string[];
  nextSteps: string[];
};

async function ensureBucket() {
  const { data: buckets } = await supabaseAdmin.storage.listBuckets();
  if (!buckets?.find((b) => b.name === STORAGE_BUCKET)) {
    await supabaseAdmin.storage.createBucket(STORAGE_BUCKET, { public: false });
  }
}

async function getCachedText(callId: string): Promise<string | null> {
  const { data, error } = await supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .download(`${callId}.txt`);
  if (error || !data) return null;
  return data.text();
}

async function fetchAndCacheText(callId: string, title: string): Promise<string> {
  try {
    const pdfRes = await fetch(WORK_PROGRAMME_PDF, {
      signal: AbortSignal.timeout(30_000),
    });
    if (!pdfRes.ok) return "";

    const buffer = Buffer.from(await pdfRes.arrayBuffer());
    const { PDFParse } = await import("pdf-parse");
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    const fullText: string = result.text;

    const searchTerms = [
      callId,
      callId.replace(/^HORIZON-JU-/, ""),
      ...title.split(/\s+/).filter((w) => w.length > 5).slice(0, 3),
    ];

    let relevantText = "";
    for (const term of searchTerms) {
      const idx = fullText.indexOf(term);
      if (idx !== -1) {
        const start = Math.max(0, idx - 300);
        const end = Math.min(fullText.length, idx + 6000);
        relevantText = fullText.slice(start, end);
        break;
      }
    }

    if (!relevantText) relevantText = fullText.slice(0, 6000);

    await ensureBucket();
    await supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .upload(`${callId}.txt`, new Blob([relevantText], { type: "text/plain" }), {
        upsert: true,
      });

    return relevantText;
  } catch {
    return "";
  }
}

export async function POST(req: NextRequest) {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) {
    return NextResponse.json({ error: "OpenRouter not configured." }, { status: 500 });
  }

  const body = await req.json();
  const { callId, title, programme, instrument, openDate, deadline, summary } = body as {
    callId: string;
    title: string;
    programme: string;
    instrument: string;
    openDate?: string;
    deadline?: string;
    summary?: string;
  };

  if (!callId) {
    return NextResponse.json({ error: "callId is required." }, { status: 400 });
  }

  const topicText =
    (await getCachedText(callId).catch(() => null)) ??
    (await fetchAndCacheText(callId, title));

  const topicContext = topicText
    ? `\n\nOFFICIAL CALL TEXT (from CHIPS JU 2026 Work Programme):\n"""\n${topicText}\n"""\n`
    : "";

  const prompt = `You are a senior Horizon Europe funding strategist and EU evaluator-level expert with deep knowledge of:
- Horizon Europe structure (Pillars, Clusters, Destinations)
- CHIPS JU / ECS R&I programme and its 2026 Work Programme
- Proposal evaluation criteria (Excellence, Impact, Implementation)
- EU policy priorities (Green Deal, Digital, Industrial Strategy)

You operate as an EU Commission evaluator AND a top-tier strategy consultant. Your goal is NOT to summarise — your goal is to INTERPRET the call strategically and help applicants WIN funding.

Analyse this specific CHIPS JU funding call:
Call ID: ${callId}
Title: ${title}
Programme: ${programme}
Instrument: ${instrument}${openDate ? `\nOpened: ${openDate}` : ""}${deadline ? `\nDeadline: ${deadline}` : ""}${summary ? `\nPortal summary: ${summary}` : ""}${topicContext}

Think like an evaluator. Analyse through:
A. CONTEXT — Programme/cluster, policy objective (WHY the EU funds this)
B. CALL BREAKDOWN — Scope, expected outcomes, impact requirements
C. EVALUATION LOGIC — What evaluators look for under Excellence, Impact, Implementation

Return ONLY a JSON object — no markdown, no explanation:
{
  "context": "2-3 sentences: programme cluster, EU policy driver, WHY this call exists",
  "scope": "What is in scope and explicitly out of scope — be specific",
  "expectedOutcomes": ["Concrete deliverable or outcome expected 1", "Outcome 2", "Outcome 3", "Outcome 4"],
  "fitLevel": "High",
  "fitJustification": "1-2 sentences on what type of project/consortium has strong natural fit — TRL range, sector, actor type",
  "evaluationExcellence": "What evaluators specifically look for under Excellence: innovation level, technical credibility, SoA beyond",
  "evaluationImpact": "What evaluators look for under Impact: EU priority alignment, market/societal value, measurable KPIs",
  "evaluationImplementation": "What evaluators look for under Implementation: consortium strength, feasibility, milestone credibility",
  "positioningAdvice": ["Specific tip 1 to frame a winning proposal", "Tip 2 — common mistake to avoid", "Tip 3 — strategic angle"],
  "nextSteps": ["First concrete action the applicant should take", "Second action", "Where to validate or find more info"]
}`;

  try {
    const res = await fetch(OPENROUTER, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://chips-ju.eu",
        "X-Title": "Chips JU Call Insight",
      },
      body: JSON.stringify({
        model: "google/gemma-4-26b-a4b-it:free",
        max_tokens: 2000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!res.ok) throw new Error(`OpenRouter ${res.status}`);
    const json = await res.json();
    const content: string = json.choices?.[0]?.message?.content ?? "{}";
    const match = content.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("No JSON in response");

    const insight: CallInsight = JSON.parse(match[0]);
    return NextResponse.json(insight);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 502 });
  }
}
