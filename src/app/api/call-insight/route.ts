import { NextRequest, NextResponse } from "next/server";

const OPENROUTER = "https://openrouter.ai/api/v1/chat/completions";

export type CallInsight = {
  scope: string;
  objectives: string[];
  whoShouldApply: string;
  budgetInfo: string;
  evaluationCriteria: string[];
  keyRequirements: string[];
  tips: string[];
  disclaimer: string;
};

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

  const prompt = `You are an expert advisor on EU Chips Joint Undertaking funding programmes with deep knowledge of the CHIPS JU Strategic Research and Innovation Agenda (SRIA) and the 2026 Work Programme.

A user wants detailed information about this funding call from the EU Funding & Tenders Portal:

Call ID: ${callId}
Title: ${title}
Programme: ${programme}
Instrument: ${instrument}${openDate ? `\nOpened: ${openDate}` : ""}${deadline ? `\nDeadline: ${deadline}` : ""}${summary ? `\nSummary: ${summary}` : ""}

Provide a comprehensive, actionable briefing about this call based on your knowledge of the CHIPS JU 2026 Work Programme, the SRIA, and the EU Horizon Europe rules. Be specific and practical.

Return ONLY a JSON object — no markdown, no explanation:
{
  "scope": "2-3 sentence description of what this call covers and its strategic context within the CHIPS JU programme",
  "objectives": ["Specific objective 1", "Specific objective 2", "Specific objective 3", "Specific objective 4"],
  "whoShouldApply": "1-2 sentences on ideal applicant profiles: organisation types, TRL levels, consortium composition",
  "budgetInfo": "What we know about budget: typical project size, total call budget if known, co-funding rates",
  "evaluationCriteria": ["Excellence criterion", "Impact criterion", "Implementation criterion"],
  "keyRequirements": ["Minimum number of partners", "TRL range", "Any country or sector restrictions", "Co-funding requirements"],
  "tips": ["Actionable tip 1 for writing a strong proposal", "Tip 2", "Tip 3"],
  "disclaimer": "Short note that this is AI-generated from training data and applicants should verify details on the official EU Funding & Tenders Portal."
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
        model: "anthropic/claude-3.5-haiku",
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
