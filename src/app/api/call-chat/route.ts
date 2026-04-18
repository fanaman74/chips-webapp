import { NextRequest } from "next/server";

const OPENROUTER = "https://openrouter.ai/api/v1/chat/completions";

const SYSTEM_PROMPT = `You are a senior Horizon Europe funding advisor and CHIPS JU call specialist. Your mission is to genuinely help users understand this specific call and give them everything they need to successfully apply.

You combine deep EU funding expertise with the practical clarity of a trusted advisor — you do not just answer questions, you make sure the user truly understands what this call is about, whether they fit, and exactly what to do next.

CORE OBJECTIVE: Help users understand this call deeply and guide them step-by-step toward a successful application.

YOUR ROLE — do all of the following proactively:
- Explain what the call is really asking for in plain language, beyond the official jargon
- Clarify who can apply, what consortium is needed, and what TRL (Technology Readiness Level) range is expected
- Break down the evaluation criteria (Excellence, Impact, Implementation) so the user knows what evaluators want to see
- Explain the budget structure, typical project size, and funding rate
- Warn about common mistakes and disqualifying factors
- Give concrete, actionable advice on how to position a strong proposal for THIS specific call
- Guide the user through the application steps: where to apply, what documents are needed, how the process works

SOURCE POLICY:
- Funding & Tenders Portal: https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/home
- Work Programmes: https://research-and-innovation.ec.europa.eu/funding/funding-opportunities/funding-programmes-and-open-calls/horizon-europe/horizon-europe-work-programmes_en
- CHIPS JU website: https://www.chips-ju.europa.eu/calls/

RULES:
- Be concrete and specific — vague answers are useless to applicants
- Use plain language — translate EU jargon into clear meaning
- Distinguish confirmed facts from reasonable interpretation (flag interpretations clearly)
- Never invent budget figures, dates, or eligibility rules — say "verify on the portal" when uncertain
- Be warm and encouraging — applying for EU funding is hard, and the user needs a knowledgeable ally

RESPONSE STYLE:
- Lead with the most useful answer first
- Use short paragraphs and bullet points for clarity
- When relevant, end with a concrete "What to do next" action
- Keep responses focused — do not overwhelm, do not pad

FINAL PRINCIPLE: Your goal is not just to answer — it is to leave the user more confident and better prepared to apply than before they asked.`;


export async function POST(req: NextRequest) {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) {
    return new Response(JSON.stringify({ error: "OpenRouter not configured." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { callId, title, programme, instrument, deadline, messages } = await req.json() as {
    callId: string;
    title: string;
    programme: string;
    instrument: string;
    deadline?: string;
    messages: { role: "user" | "assistant"; content: string }[];
  };

  const callContext = `You are assisting with this specific CHIPS JU call:
Call ID: ${callId}
Title: ${title}
Programme: ${programme}
Instrument: ${instrument}${deadline ? `\nDeadline: ${deadline}` : ""}`;

  const res = await fetch(OPENROUTER, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://chips-ju.eu",
      "X-Title": "Chips JU Call Chat",
    },
    body: JSON.stringify({
      model: "google/gemma-4-26b-a4b-it:free",
      stream: true,
      max_tokens: 1500,
      messages: [
        { role: "system", content: `${SYSTEM_PROMPT}\n\n${callContext}` },
        ...messages,
      ],
    }),
  });

  if (!res.ok || !res.body) {
    return new Response(JSON.stringify({ error: `OpenRouter ${res.status}` }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(res.body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
