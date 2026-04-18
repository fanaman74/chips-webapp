"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  Loader2, ChevronRight, AlertCircle, CheckCircle2, Target,
  BarChart3, Lightbulb, Users, ArrowRight, Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Call } from "@/lib/calls";
import type { CallMatchResult } from "@/app/api/call-match/route";

const FIT_COLOR = {
  "High Fit": "bg-emerald-500/15 text-emerald-600 border-emerald-500/30",
  "Medium Fit": "bg-amber/15 text-amber border-amber/30",
  "Weak Fit": "bg-rose/15 text-rose border-rose/30",
};

function scoreColor(n: number) {
  if (n >= 4) return "text-emerald-600 bg-emerald-500/15 border-emerald-500/30";
  if (n === 3) return "text-amber border-amber/30 bg-amber/10";
  return "text-rose border-rose/30 bg-rose/10";
}

function ScoreCard({ label, score, analysis }: { label: string; score: number; analysis: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface-1 p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">{label}</span>
        <span className={cn("rounded-full border px-2.5 py-0.5 font-display text-sm font-bold", scoreColor(score))}>
          {score}/5
        </span>
      </div>
      <div className="mb-3 flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className={cn("h-1.5 flex-1 rounded-full", i < score ? (score >= 4 ? "bg-emerald-500" : score === 3 ? "bg-amber" : "bg-rose") : "bg-border")}
          />
        ))}
      </div>
      <p className="text-xs leading-relaxed text-muted-foreground">{analysis}</p>
    </div>
  );
}

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-2 border-b border-border pb-2 text-foreground">
        {icon}
        <span className="font-display text-sm font-semibold uppercase tracking-widest">{title}</span>
      </div>
      {children}
    </div>
  );
}

export function CallMatchClient({ calls }: { calls: Call[] }) {
  const searchParams = useSearchParams();
  const preselected = searchParams.get("call") ?? "";

  const [callId, setCallId] = useState(preselected || (calls[0]?.id ?? ""));

  const EXAMPLES = [
    {
      label: "Chiplet Integration",
      project: "We are developing a heterogeneous integration platform for chiplet-based SoCs targeting advanced semiconductor packaging at TRL 4–6. The technology combines 2.5D/3D die stacking with silicon photonics interconnects to achieve 10× better power efficiency for AI inference accelerators. Our innovation directly addresses Europe's dependency on non-EU packaging infrastructure and positions European fabs at the forefront of next-generation chip assembly. Target markets: data centres, automotive AI, and edge computing.",
      consortium: "Lead: European semiconductor foundry (Germany). Partners: University research institute (Netherlands), photonics SME (France), automotive Tier-1 supplier (Italy). 4 countries, 4 partners.",
    },
    {
      label: "AI-Assisted EDA",
      project: "Our project builds an AI-assisted EDA toolchain for automated IC layout verification and physical design optimisation, targeting TRL 5–7. Using transformer-based ML models trained on tape-out datasets, our tool reduces design rule checking cycles by 40% and cuts tape-out costs for European fabless companies. The platform targets 3nm and below process nodes. We address the critical gap in European EDA sovereignty and reduce reliance on US-dominated tooling.",
      consortium: "Lead: EDA software company (UK). Partners: Semiconductor IP provider (Sweden), fabless design house (Belgium), two universities (Spain, Austria). 5 partners, 5 countries.",
    },
    {
      label: "GaN Power Electronics",
      project: "We are establishing a pilot line for GaN-on-Si wide-bandgap power semiconductor manufacturing at TRL 6–8. Our process targets 650V devices for automotive inverters and industrial motor drives, with a roadmap to 1200V for grid-edge energy storage. The pilot line will produce wafers at 200mm scale, enabling European volume production of power chips currently sourced from Asia. The project directly supports EU Green Deal objectives by enabling high-efficiency electrification.",
      consortium: "Lead: Power semiconductor manufacturer (Germany). Partners: Tier-1 automotive supplier (France), national research lab (Portugal), equipment supplier (Denmark). 4 partners.",
    },
  ];
  const [projectDescription, setProjectDescription] = useState("");
  const [consortiumDescription, setConsortiumDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CallMatchResult | null>(null);

  useEffect(() => {
    if (preselected) setCallId(preselected);
  }, [preselected]);

  const selectedCall = calls.find((c) => c.id === callId);

  async function evaluate() {
    if (!callId || !projectDescription.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/call-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          callId,
          title: selectedCall?.title ?? "",
          programme: selectedCall?.programme ?? "",
          instrument: selectedCall?.instrument ?? "",
          deadline: selectedCall?.deadline ?? undefined,
          summary: selectedCall?.summary ?? undefined,
          projectDescription,
          consortiumDescription: consortiumDescription.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error ?? "Evaluation failed.");
      else setResult(data);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[420px_1fr]">
      {/* ── Form ── */}
      <div className="space-y-5">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-5">
          {/* Call selector */}
          <div>
            <label className="mb-1.5 block font-mono text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Select Call
            </label>
            <select
              value={callId}
              onChange={(e) => setCallId(e.target.value)}
              className="w-full rounded-xl border border-border bg-surface-1 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
            >
              {calls.map((c) => (
                <option key={c.id} value={c.id}>{c.id} — {c.title.slice(0, 60)}{c.title.length > 60 ? "…" : ""}</option>
              ))}
            </select>
            {selectedCall && (
              <p className="mt-1.5 text-[11px] text-muted-foreground">
                {selectedCall.programme} · {selectedCall.instrument}
                {selectedCall.deadline ? ` · Deadline ${selectedCall.deadline}` : ""}
              </p>
            )}
          </div>

          {/* Project description */}
          <div>
            <div className="mb-1.5 flex items-center justify-between gap-2">
              <label className="font-mono text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                Your Project Idea <span className="text-rose">*</span>
              </label>
              <div className="flex gap-1.5">
                {EXAMPLES.map((ex) => (
                  <button
                    key={ex.label}
                    type="button"
                    onClick={() => { setProjectDescription(ex.project); setConsortiumDescription(ex.consortium); }}
                    className="rounded-lg border border-border bg-surface-1 px-2 py-1 text-[10px] font-medium text-muted-foreground transition hover:border-brand hover:text-brand"
                  >
                    {ex.label}
                  </button>
                ))}
              </div>
            </div>
            <textarea
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              rows={8}
              placeholder="Describe your project — technology, innovation, objectives, target outcomes, TRL level, and what problem it solves…"
              className="w-full resize-none rounded-xl border border-border bg-surface-1 px-4 py-3 text-sm leading-relaxed placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand/40"
            />
            <p className="mt-1 text-right text-[10px] text-muted-foreground">{projectDescription.length} chars</p>
          </div>

          {/* Consortium */}
          <div>
            <label className="mb-1.5 block font-mono text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Consortium <span className="text-muted-foreground font-normal normal-case tracking-normal">(optional)</span>
            </label>
            <textarea
              value={consortiumDescription}
              onChange={(e) => setConsortiumDescription(e.target.value)}
              rows={3}
              placeholder="Partners, organisations, countries, roles, existing collaborations…"
              className="w-full resize-none rounded-xl border border-border bg-surface-1 px-4 py-3 text-sm leading-relaxed placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand/40"
            />
          </div>

          <button
            onClick={evaluate}
            disabled={!projectDescription.trim() || loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-brand/90 disabled:opacity-40"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
            {loading ? "Evaluating…" : "Evaluate Fit"}
          </button>
        </div>

        <p className="text-center text-[10px] text-muted-foreground">
          AI-generated. Verify on the{" "}
          <a href="https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/home" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground whitespace-nowrap">
            EU F&amp;T Portal
          </a>.
        </p>
      </div>

      {/* ── Results ── */}
      <div>
        {!result && !loading && !error && (
          <div className="flex h-full min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface-1 p-12 text-center">
            <Target className="mb-4 h-10 w-10 text-muted-foreground/40" />
            <p className="font-display text-base font-semibold text-muted-foreground">No evaluation yet</p>
            <p className="mt-1 text-sm text-muted-foreground/70">Describe your project and click Evaluate Fit</p>
          </div>
        )}

        {loading && (
          <div className="flex h-full min-h-[400px] flex-col items-center justify-center rounded-2xl border border-border bg-card p-12 text-center">
            <Loader2 className="mb-4 h-8 w-8 animate-spin text-brand" />
            <p className="font-display text-base font-semibold">Evaluating your project…</p>
            <p className="mt-1 text-sm text-muted-foreground">Analysing fit, eligibility, and scoring against EU criteria</p>
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-rose/30 bg-rose/5 p-4 text-sm text-rose">{error}</div>
        )}

        {result && (
          <div className="space-y-6">
            {/* Verdict header */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <span className={cn("rounded-full border px-3 py-1 text-sm font-bold", FIT_COLOR[result.fitVerdict] ?? FIT_COLOR["Medium Fit"])}>
                  {result.fitVerdict}
                </span>
                {selectedCall && (
                  <span className="font-mono text-xs text-muted-foreground">{selectedCall.id}</span>
                )}
              </div>
              <p className="text-sm leading-relaxed text-foreground">{result.directVerdict}</p>
            </div>

            {/* Score grid */}
            <div className="grid gap-4 sm:grid-cols-3">
              <ScoreCard label="Excellence" score={result.excellenceScore} analysis={result.excellenceAnalysis} />
              <ScoreCard label="Impact" score={result.impactScore} analysis={result.impactAnalysis} />
              <ScoreCard label="Implementation" score={result.implementationScore} analysis={result.implementationAnalysis} />
            </div>

            {/* Detail sections */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-6">
              {result.callInterpretation && (
                <Section icon={<Target className="h-4 w-4" />} title="Call Interpretation">
                  <p className="text-sm leading-relaxed text-muted-foreground">{result.callInterpretation}</p>
                </Section>
              )}

              {result.eligibilityCheck && (
                <Section icon={<CheckCircle2 className="h-4 w-4" />} title="Eligibility Check">
                  <p className="text-sm leading-relaxed text-muted-foreground">{result.eligibilityCheck}</p>
                </Section>
              )}

              {result.gapAnalysis?.length > 0 && (
                <Section icon={<AlertCircle className="h-4 w-4 text-rose" />} title="Gap Analysis">
                  <ul className="space-y-1.5">
                    {result.gapAnalysis.map((g, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="mt-0.5 h-3.5 w-3.5 shrink-0 rounded-full bg-rose/20 text-center text-[9px] font-bold leading-3.5 text-rose">!</span>
                        {g}
                      </li>
                    ))}
                  </ul>
                </Section>
              )}

              {result.recommendations?.length > 0 && (
                <Section icon={<Lightbulb className="h-4 w-4 text-amber" />} title="Recommendations">
                  <ul className="space-y-1.5">
                    {result.recommendations.map((r, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </Section>
              )}

              {result.competitivenessOutlook && (
                <Section icon={<BarChart3 className="h-4 w-4" />} title="Competitiveness Outlook">
                  <p className="text-sm leading-relaxed text-muted-foreground">{result.competitivenessOutlook}</p>
                </Section>
              )}

              {result.nextSteps?.length > 0 && (
                <Section icon={<Users className="h-4 w-4" />} title="Next Steps">
                  <ul className="space-y-1.5">
                    {result.nextSteps.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand/15 text-[10px] font-bold text-brand">{i + 1}</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </Section>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
