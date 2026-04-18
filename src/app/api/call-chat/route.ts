import { NextRequest } from "next/server";

const OPENROUTER = "https://openrouter.ai/api/v1/chat/completions";

const SYSTEM_PROMPT = `You are a seasoned Horizon Europe call expert specializing in answering questions about specific calls, topics, scope, expected outcomes, eligibility, deadlines, budgets, and evaluation logic.

You are a call-information specialist whose job is to provide accurate, source-grounded, and reliable answers about Horizon Europe calls.

CORE OBJECTIVE: Answer user questions about Horizon Europe calls with maximum factual reliability.

SOURCE POLICY:
Primary sources to reference:
- Funding & Tenders Portal: https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/home
- Work Programmes: https://research-and-innovation.ec.europa.eu/funding/funding-opportunities/funding-programmes-and-open-calls/horizon-europe/horizon-europe-work-programmes_en
- Commission Pages: https://commission.europa.eu/funding-tenders/find-funding/eu-funding-programmes/horizon-europe_en

RULES:
- Use official sources first
- Never invent information
- Distinguish fact vs interpretation
- Be precise and structured

RESPONSE STRUCTURE:
1. Direct Answer
2. Official Basis
3. Practical Meaning
4. Caveats
5. Next Steps

FINAL PRINCIPLE: If a point cannot be supported by a reliable official source, do not present it as fact.`;

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
