"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  Loader2, AlertCircle, CheckCircle2, Target,
  BarChart3, Lightbulb, Users, ArrowRight, Zap, Printer,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Call } from "@/lib/calls";
import type { CallMatchResult } from "@/app/api/call-match/route";

const FIT_COLOR = {
  "High Fit":   { badge: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30", bar: "bg-emerald-500", banner: "border-emerald-500/40 bg-emerald-500/5" },
  "Medium Fit": { badge: "bg-amber/15 text-amber border-amber/30",                   bar: "bg-amber",       banner: "border-amber/40 bg-amber/5" },
  "Weak Fit":   { badge: "bg-rose/15 text-rose border-rose/30",                      bar: "bg-rose",        banner: "border-rose/40 bg-rose/5" },
};

function scoreBarColor(n: number) {
  if (n >= 4) return "bg-emerald-500";
  if (n === 3) return "bg-amber";
  return "bg-rose";
}
function scoreBadgeColor(n: number) {
  if (n >= 4) return "text-emerald-600 bg-emerald-500/15 border-emerald-500/30";
  if (n === 3) return "text-amber border-amber/30 bg-amber/10";
  return "text-rose border-rose/30 bg-rose/10";
}

function ScoreCard({ label, score, analysis }: { label: string; score: number; analysis: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-1 flex items-start justify-between gap-2">
        <span className="font-mono text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</span>
        <span className={cn("shrink-0 rounded-full border px-3 py-0.5 font-display text-lg font-bold leading-none", scoreBadgeColor(score))}>
          {score}<span className="text-sm font-normal">/5</span>
        </span>
      </div>
      <div className="mb-3 flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className={cn("h-2 flex-1 rounded-full transition-all", i < score ? scoreBarColor(score) : "bg-border")} />
        ))}
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">{analysis}</p>
    </div>
  );
}

function ReportSection({
  number, icon, title, children,
}: {
  number: number; icon: React.ReactNode; title: string; children: React.ReactNode;
}) {
  return (
    <div className="border-b border-border pb-8 last:border-0 last:pb-0">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand/10 font-mono text-xs font-bold text-brand">
          {number}
        </span>
        <div className="flex items-center gap-2 text-foreground">
          {icon}
          <span className="font-display text-base font-semibold tracking-tight">{title}</span>
        </div>
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

  const fitColors = result ? (FIT_COLOR[result.fitVerdict] ?? FIT_COLOR["Medium Fit"]) : null;
  const avgScore = result
    ? ((result.excellenceScore + result.impactScore + result.implementationScore) / 3).toFixed(1)
    : null;

  return (
    <div className="grid gap-8 lg:grid-cols-[400px_1fr]">
      {/* ── Form (hidden when printing) ── */}
      <div className="print:hidden space-y-5">
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
            <div className="mb-1.5 flex items-center justify-between gap-2 flex-wrap">
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
          <div className="flex h-full min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface-1 p-12 text-center print:hidden">
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
          <div className="rounded-xl border border-rose/30 bg-rose/5 p-4 text-sm text-rose print:hidden">{error}</div>
        )}

        {result && fitColors && (
          <div className="space-y-6">

            {/* ── Report header ── */}
            <div className={cn("rounded-2xl border-2 p-6 shadow-card", fitColors.banner)}>
              {/* Print-only title */}
              <div className="hidden print:block mb-4">
                <p className="font-mono text-xs text-gray-400 uppercase tracking-widest">CHIPS JU — Call Match Evaluation Report</p>
                <p className="font-mono text-xs text-gray-400">{new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
              </div>

              <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className={cn("rounded-full border-2 px-4 py-1 font-display text-base font-bold", fitColors.badge)}>
                      {result.fitVerdict}
                    </span>
                    {selectedCall && (
                      <span className="font-mono text-xs text-muted-foreground">{selectedCall.id}</span>
                    )}
                  </div>
                  {selectedCall && (
                    <p className="font-display text-sm font-medium text-foreground/70 max-w-lg">{selectedCall.title}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {/* Overall score */}
                  <div className="text-center">
                    <div className={cn("rounded-xl border-2 px-4 py-2 font-display font-bold", fitColors.badge)}>
                      <span className="text-2xl">{avgScore}</span>
                      <span className="text-sm font-normal">/5</span>
                    </div>
                    <p className="mt-1 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Overall</p>
                  </div>
                  {/* Print button */}
                  <button
                    onClick={() => window.print()}
                    title="Save / Print report"
                    className="print:hidden flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition hover:border-brand hover:text-brand"
                  >
                    <Printer className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Direct verdict */}
              <p className="text-base leading-relaxed text-foreground font-medium">{result.directVerdict}</p>
            </div>

            {/* ── Score grid ── */}
            <div className="grid gap-4 sm:grid-cols-3">
              <ScoreCard label="Excellence" score={result.excellenceScore} analysis={result.excellenceAnalysis} />
              <ScoreCard label="Impact" score={result.impactScore} analysis={result.impactAnalysis} />
              <ScoreCard label="Implementation" score={result.implementationScore} analysis={result.implementationAnalysis} />
            </div>

            {/* ── Detailed report ── */}
            <div className="rounded-2xl border border-border bg-card p-8 shadow-card space-y-8">
              <div className="border-b border-border pb-4">
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Detailed Analysis</p>
                <h2 className="font-display text-lg font-semibold tracking-tight mt-0.5">Evaluation Report</h2>
              </div>

              {result.callInterpretation && (
                <ReportSection number={1} icon={<Target className="h-4 w-4 text-brand" />} title="Call Interpretation">
                  <p className="text-sm leading-loose text-muted-foreground">{result.callInterpretation}</p>
                </ReportSection>
              )}

              {result.eligibilityCheck && (
                <ReportSection number={2} icon={<CheckCircle2 className="h-4 w-4 text-emerald-600" />} title="Eligibility Check">
                  <p className="text-sm leading-loose text-muted-foreground">{result.eligibilityCheck}</p>
                </ReportSection>
              )}

              {result.gapAnalysis?.length > 0 && (
                <ReportSection number={3} icon={<AlertCircle className="h-4 w-4 text-rose" />} title="Gap Analysis">
                  <ul className="space-y-3">
                    {result.gapAnalysis.map((g, i) => (
                      <li key={i} className="flex items-start gap-3 rounded-lg border border-rose/20 bg-rose/5 px-4 py-3 text-sm text-foreground">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose/20 text-[10px] font-bold text-rose">!</span>
                        {g}
                      </li>
                    ))}
                  </ul>
                </ReportSection>
              )}

              {result.recommendations?.length > 0 && (
                <ReportSection number={4} icon={<Lightbulb className="h-4 w-4 text-amber" />} title="Strategic Recommendations">
                  <ul className="space-y-3">
                    {result.recommendations.map((r, i) => (
                      <li key={i} className="flex items-start gap-3 rounded-lg border border-brand/20 bg-brand/5 px-4 py-3 text-sm text-foreground">
                        <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </ReportSection>
              )}

              {result.competitivenessOutlook && (
                <ReportSection number={5} icon={<BarChart3 className="h-4 w-4 text-brand" />} title="Competitiveness Outlook">
                  <div className="rounded-lg border border-border bg-surface-1 px-5 py-4">
                    <p className="text-sm leading-loose text-muted-foreground">{result.competitivenessOutlook}</p>
                  </div>
                </ReportSection>
              )}

              {result.nextSteps?.length > 0 && (
                <ReportSection number={6} icon={<Users className="h-4 w-4 text-brand" />} title="Next Steps">
                  <ol className="space-y-3">
                    {result.nextSteps.map((s, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-foreground">
                        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand text-[11px] font-bold text-white">{i + 1}</span>
                        <span className="pt-0.5 leading-relaxed">{s}</span>
                      </li>
                    ))}
                  </ol>
                </ReportSection>
              )}
            </div>

            <p className="print:hidden text-center text-[10px] text-muted-foreground">
              ⚠ AI-generated evaluation. Always verify eligibility and requirements on the official{" "}
              <a href="https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/home" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
                EU Funding &amp; Tenders Portal
              </a>.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
