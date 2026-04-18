import { NextRequest, NextResponse } from "next/server";

const OPENROUTER = "https://openrouter.ai/api/v1/chat/completions";

const SYSTEM_PROMPT = `You are a senior Horizon Europe evaluator and funding strategist.

You combine three roles:
- Call expert → understands and explains the call precisely
- Evaluator → judges proposals using EU criteria
- Strategist → improves positioning and competitiveness

CORE OBJECTIVE:
Your mission is to answer: "Does this project fit the call — and would it score well?"

SOURCE POLICY (STRICT):
PRIMARY SOURCES:
- Funding & Tenders Portal: https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/home
- Horizon Europe Work Programmes: https://research-and-innovation.ec.europa.eu/funding/funding-opportunities/funding-programmes-and-open-calls/horizon-europe/horizon-europe-work-programmes_en
- European Commission pages: https://commission.europa.eu/funding-tenders/find-funding/eu-funding-programmes/horizon-europe_en

RULES:
- Always base facts on official sources
- Distinguish fact vs interpretation
- Never invent eligibility or conditions

EVALUATION FRAMEWORK:

Excellence:
- Innovation level
- Technical credibility

Impact:
- EU policy alignment
- Market / societal relevance

Implementation:
- Feasibility
- Consortium strength

ANALYSIS DIMENSIONS:
- Call understanding
- Eligibility
- Idea–call fit
- TRL / maturity fit
- Consortium fit
- Impact fit

FIT VERDICT: High Fit | Medium Fit | Weak Fit

SCORING: Score each criterion Excellence, Impact, Implementation from 1 to 5.

RESPONSE STRUCTURE:
1. Direct Verdict
2. Call Interpretation
3. Eligibility Check
4. Evaluation (Scoring with analysis)
5. Gap Analysis
6. Recommendations
7. Competitiveness Outlook
8. Next Steps

FINAL PRINCIPLE: Act as an evaluator deciding if the proposal is worth funding. Be honest and direct — if the fit is weak, say so clearly and explain exactly how to fix it. Be the advisor the applicant needs, not the one they want.`;

export type CallMatchResult = {
  fitVerdict: "High Fit" | "Medium Fit" | "Weak Fit";
  directVerdict: string;
  callInterpretation: string;
  eligibilityCheck: string;
  excellenceScore: number;
  excellenceAnalysis: string;
  impactScore: number;
  impactAnalysis: string;
  implementationScore: number;
  implementationAnalysis: string;
  gapAnalysis: string[];
  recommendations: string[];
  competitivenessOutlook: string;
  nextSteps: string[];
};

export async function POST(req: NextRequest) {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) {
    return NextResponse.json({ error: "OpenRouter not configured." }, { status: 500 });
  }

  const body = await req.json() as {
    callId: string;
    title: string;
    programme: string;
    instrument: string;
    deadline?: string;
    summary?: string;
    projectDescription: string;
    consortiumDescription?: string;
  };

  const { callId, title, programme, instrument, deadline, summary, projectDescription, consortiumDescription } = body;

  if (!callId || !projectDescription?.trim()) {
    return NextResponse.json({ error: "callId and projectDescription are required." }, { status: 400 });
  }

  const prompt = `Evaluate the following project idea against this CHIPS JU call.

CALL:
ID: ${callId}
Title: ${title}
Programme: ${programme}
Instrument: ${instrument}${deadline ? `\nDeadline: ${deadline}` : ""}${summary ? `\nSummary: ${summary}` : ""}

PROJECT IDEA:
${projectDescription}${consortiumDescription ? `\n\nCONSORTIUM:\n${consortiumDescription}` : ""}

Return ONLY a JSON object with no markdown or explanation:
{
  "fitVerdict": "High Fit" | "Medium Fit" | "Weak Fit",
  "directVerdict": "2-3 sentence overall verdict on the fit",
  "callInterpretation": "What this call is really asking for and the EU policy objective behind it",
  "eligibilityCheck": "Analysis of whether the project/consortium meets the basic eligibility requirements",
  "excellenceScore": <1-5>,
  "excellenceAnalysis": "Innovation level and technical credibility assessment",
  "impactScore": <1-5>,
  "impactAnalysis": "EU policy alignment and market/societal relevance assessment",
  "implementationScore": <1-5>,
  "implementationAnalysis": "Feasibility and consortium strength assessment",
  "gapAnalysis": ["Gap 1 that weakens the proposal", "Gap 2", "Gap 3"],
  "recommendations": ["Specific recommendation to strengthen the proposal", "Rec 2", "Rec 3", "Rec 4"],
  "competitivenessOutlook": "How competitive would this proposal be against typical submissions to this call",
  "nextSteps": ["First concrete action to take", "Second action", "Third action"]
}`;

  try {
    const res = await fetch(OPENROUTER, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://chips-ju.eu",
        "X-Title": "Chips JU Call Match",
      },
      body: JSON.stringify({
        model: "google/gemma-4-26b-a4b-it:free",
        max_tokens: 2500,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!res.ok) throw new Error(`OpenRouter ${res.status}`);
    const json = await res.json();
    const content: string = json.choices?.[0]?.message?.content ?? "{}";
    const match = content.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("No JSON in response");

    const result: CallMatchResult = JSON.parse(match[0]);
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 502 });
  }
}
