"use client";

import { useState } from "react";
import {
  X, ExternalLink, Clock, Loader2, Target, Users,
  CheckCircle2, AlertCircle, Lightbulb, ChevronRight, BarChart3, ArrowRight, Download, BotMessageSquare,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDate, daysUntil, relativeDeadline } from "@/lib/format";
import { INSTRUMENT_COLOR, colorFor } from "@/lib/colors";
import { cn } from "@/lib/utils";
import type { Call } from "@/lib/calls";
import type { CallInsight } from "@/app/api/call-insight/route";
import { CallChatModal } from "./call-chat-modal";

export function OpenCallsGrid({ calls }: { calls: Call[] }) {
  const [selected, setSelected] = useState<Call | null>(null);
  const [insight, setInsight] = useState<CallInsight | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chatCall, setChatCall] = useState<Call | null>(null);

  async function openCall(c: Call) {
    setSelected(c);
    setInsight(null);
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/call-insight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          callId: c.id,
          title: c.title,
          programme: c.programme,
          instrument: c.instrument,
          openDate: c.open_date,
          deadline: c.deadline,
          summary: c.summary,
        }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error ?? "Failed to load insight.");
      else setInsight(data);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function close() {
    setSelected(null);
    setInsight(null);
    setError(null);
  }

  return (
    <>
      {chatCall && (
        <CallChatModal call={chatCall} onClose={() => setChatCall(null)} />
      )}

      {/* Card grid */}
      <div className="grid gap-5 md:grid-cols-2">
        {calls.map((c) => (
          <CallCard
            key={c.id}
            call={c}
            onBrief={() => openCall(c)}
            onChat={() => setChatCall(c)}
          />
        ))}
      </div>

      {/* Slide-over overlay */}
      {selected && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm"
            onClick={close}
          />

          {/* Panel */}
          <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-xl flex-col bg-card shadow-2xl">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-border p-6">
              <div className="min-w-0 flex-1">
                <PanelBadges call={selected} />
                <p className="mt-2 font-mono text-xs text-muted-foreground">{selected.id}</p>
                <h2 className="mt-1 font-display text-lg font-semibold leading-snug tracking-tight">
                  {selected.title}
                </h2>
              </div>
              <button
                onClick={close}
                className="mt-0.5 rounded-lg p-1.5 text-muted-foreground hover:bg-surface-2 hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Dates row */}
              <div className="grid grid-cols-2 gap-4 rounded-xl border border-border bg-surface-1 p-4 text-sm">
                {selected.open_date && (
                  <div>
                    <div className="font-mono text-[10px] uppercase text-muted-foreground">Opened</div>
                    <div className="mt-0.5 font-display font-semibold">{formatDate(selected.open_date)}</div>
                  </div>
                )}
                {selected.deadline ? (
                  <div>
                    <div className="font-mono text-[10px] uppercase text-muted-foreground">Deadline</div>
                    <div className="mt-0.5 font-display font-semibold">{formatDate(selected.deadline)}</div>
                    {daysUntil(selected.deadline) >= 0 && <div className="text-[11px] text-amber">{relativeDeadline(selected.deadline)}</div>}
                  </div>
                ) : (
                  <div>
                    <div className="font-mono text-[10px] uppercase text-muted-foreground">Deadline</div>
                    <div className="mt-0.5 text-muted-foreground">TBC</div>
                  </div>
                )}
              </div>

              {/* AI Insight */}
              {loading && (
                <div className="flex flex-col items-center gap-3 py-10 text-muted-foreground">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <p className="text-sm">Generating call briefing…</p>
                </div>
              )}

              {error && (
                <div className="rounded-xl border border-rose/30 bg-rose/5 p-4 text-sm text-rose">
                  {error}
                </div>
              )}

              {insight && <InsightPanel insight={insight} />}
            </div>

            {/* Footer CTA */}
            <div className="border-t border-border p-4 flex items-center gap-2">
              {/* Download call documents */}
              <a
                href={`https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/opportunities/topic-details/${selected.id}`}
                target="_blank"
                rel="noopener noreferrer"
                title="Call documents on EU F&T Portal"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-surface-1 text-muted-foreground transition hover:border-brand hover:text-brand"
              >
                <Download className="h-4 w-4" />
              </a>

              {/* AI Agent Review */}
              <button
                onClick={() => setChatCall(selected)}
                className="flex h-11 flex-1 items-center justify-center gap-1.5 rounded-xl border border-border bg-surface-1 text-sm font-medium text-muted-foreground transition hover:border-brand hover:text-brand"
              >
                <BotMessageSquare className="h-4 w-4" />
                AI Agent Review
              </button>

              {/* Apply */}
              <a
                href={selected.portal_url ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 flex-1 items-center justify-center gap-1.5 rounded-xl bg-brand text-sm font-medium text-white transition hover:bg-brand/90"
              >
                Apply
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </>
      )}
    </>
  );
}

function PanelBadges({ call: c }: { call: Call }) {
  const instrColor = colorFor(INSTRUMENT_COLOR[c.instrument as keyof typeof INSTRUMENT_COLOR] ?? "brand");
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="brand">{c.programme}</Badge>
      <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium", instrColor.chip)}>
        {c.instrument}
      </span>
    </div>
  );
}

const FIT_COLOR = {
  High: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30",
  Medium: "bg-amber/15 text-amber border-amber/30",
  Weak: "bg-rose/15 text-rose border-rose/30",
};

function InsightPanel({ insight }: { insight: CallInsight }) {
  const fitColor = FIT_COLOR[insight.fitLevel] ?? FIT_COLOR["Medium"];

  return (
    <div className="space-y-5">
      {/* Context */}
      {insight.context && (
        <Section icon={<Target className="h-4 w-4" />} title="Strategic Context">
          <p className="text-sm leading-relaxed text-muted-foreground">{insight.context}</p>
        </Section>
      )}

      {/* Scope */}
      {insight.scope && (
        <Section icon={<CheckCircle2 className="h-4 w-4" />} title="Scope">
          <p className="text-sm leading-relaxed text-muted-foreground">{insight.scope}</p>
        </Section>
      )}

      {/* Expected outcomes */}
      {insight.expectedOutcomes?.length > 0 && (
        <Section icon={<ChevronRight className="h-4 w-4" />} title="Expected Outcomes">
          <ul className="space-y-1.5">
            {insight.expectedOutcomes.map((o, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" />
                {o}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Fit level */}
      {insight.fitLevel && (
        <div className="rounded-xl border border-border bg-surface-1 p-4">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2 text-foreground">
              <BarChart3 className="h-4 w-4" />
              <span className="font-display text-sm font-semibold tracking-tight">Fit Assessment</span>
            </div>
            <span className={cn("rounded-full border px-2.5 py-0.5 text-xs font-semibold", fitColor)}>
              {insight.fitLevel} Fit
            </span>
          </div>
          {insight.fitJustification && (
            <p className="text-sm leading-relaxed text-muted-foreground">{insight.fitJustification}</p>
          )}
        </div>
      )}

      {/* Evaluation */}
      {(insight.evaluationExcellence || insight.evaluationImpact || insight.evaluationImplementation) && (
        <Section icon={<AlertCircle className="h-4 w-4" />} title="Evaluation Criteria">
          <div className="space-y-3">
            {insight.evaluationExcellence && (
              <div>
                <p className="mb-0.5 text-[11px] font-semibold uppercase tracking-wide text-brand">Excellence</p>
                <p className="text-sm leading-relaxed text-muted-foreground">{insight.evaluationExcellence}</p>
              </div>
            )}
            {insight.evaluationImpact && (
              <div>
                <p className="mb-0.5 text-[11px] font-semibold uppercase tracking-wide text-amber">Impact</p>
                <p className="text-sm leading-relaxed text-muted-foreground">{insight.evaluationImpact}</p>
              </div>
            )}
            {insight.evaluationImplementation && (
              <div>
                <p className="mb-0.5 text-[11px] font-semibold uppercase tracking-wide text-emerald-600">Implementation</p>
                <p className="text-sm leading-relaxed text-muted-foreground">{insight.evaluationImplementation}</p>
              </div>
            )}
          </div>
        </Section>
      )}

      {/* Positioning */}
      {insight.positioningAdvice?.length > 0 && (
        <Section icon={<Lightbulb className="h-4 w-4 text-amber" />} title="Positioning Advice">
          <ul className="space-y-1.5">
            {insight.positioningAdvice.map((t, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <ChevronRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber" />
                {t}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Next steps */}
      {insight.nextSteps?.length > 0 && (
        <Section icon={<Users className="h-4 w-4" />} title="Next Steps">
          <ul className="space-y-1.5">
            {insight.nextSteps.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand/15 text-[10px] font-bold text-brand">
                  {i + 1}
                </span>
                {s}
              </li>
            ))}
          </ul>
        </Section>
      )}

      <p className="rounded-lg border border-border bg-surface-1 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
        ⚠ AI-generated analysis. Always verify requirements, budget, and deadlines on the official{" "}
        <a
          href="https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/opportunities/topic-search"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-foreground"
        >
          EU Funding &amp; Tenders Portal
        </a>
        .
      </p>
    </div>
  );
}

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-center gap-2 border-b border-border pb-2 text-foreground">
        {icon}
        <span className="font-display text-sm font-semibold uppercase tracking-widest">{title}</span>
      </div>
      {children}
    </div>
  );
}

function CallCard({ call: c, onBrief, onChat }: { call: Call; onBrief: () => void; onChat: () => void }) {
  const instrColor = colorFor(INSTRUMENT_COLOR[c.instrument as keyof typeof INSTRUMENT_COLOR] ?? "brand");
  const days = c.deadline ? daysUntil(c.deadline) : null;
  const urgency = days !== null && days >= 0 && days <= 14 ? "urgent" : days !== null && days >= 0 && days <= 30 ? "soon" : "normal";

  return (
    <div className="relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card text-left transition-all hover:shadow-elevated hover:border-brand/40 w-full">
      <span aria-hidden className={cn("absolute inset-x-0 top-0 h-1", instrColor.dot)} />
      <div aria-hidden className={cn("pointer-events-none absolute -top-20 -right-20 h-52 w-52 rounded-full bg-gradient-to-br opacity-30 blur-3xl", instrColor.gradient)} />

      <div className="relative flex flex-1 flex-col gap-4 p-6 pt-7">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="brand">{c.programme}</Badge>
          <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium", instrColor.chip)}>
            {c.instrument}
          </span>
          {days !== null && urgency !== "normal" && (
            <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium", urgency === "urgent" ? "bg-rose/15 text-rose" : "bg-amber/15 text-amber")}>
              <Clock className="h-3 w-3" />
              {relativeDeadline(c.deadline!)}
            </span>
          )}
        </div>

        <span className={cn("font-mono text-xs font-semibold", instrColor.text)}>{c.id}</span>

        <h3 className="font-display text-lg font-semibold leading-snug tracking-tight">
          {c.title}
        </h3>

        {c.summary && (
          <p className="flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-3">{c.summary}</p>
        )}

        <div className="mt-auto grid grid-cols-2 gap-3 border-t border-border pt-4 text-xs">
          {c.open_date && (
            <div>
              <div className="font-mono text-[10px] uppercase text-muted-foreground">Opened</div>
              <div className="mt-0.5 font-display text-sm font-semibold">{formatDate(c.open_date)}</div>
            </div>
          )}
          {c.deadline ? (
            <div>
              <div className="font-mono text-[10px] uppercase text-muted-foreground">Deadline</div>
              <div className="mt-0.5 font-display text-sm font-semibold">{formatDate(c.deadline)}</div>
              {urgency === "normal" && days !== null && days >= 0 && <div className={cn("text-[10px]", instrColor.text)}>{relativeDeadline(c.deadline)}</div>}
            </div>
          ) : <div />}
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-3 gap-2 border-t border-border pt-4">
          <button
            onClick={onBrief}
            className="flex flex-col items-center gap-1.5 rounded-xl border border-border bg-surface-1 px-2 py-3 text-[11px] font-medium text-muted-foreground transition hover:border-brand hover:bg-brand/5 hover:text-brand"
          >
            <Zap className="h-4 w-4" />
            Quick Brief
          </button>
          <button
            onClick={onChat}
            className="flex flex-col items-center gap-1.5 rounded-xl border border-border bg-surface-1 px-2 py-3 text-[11px] font-medium text-muted-foreground transition hover:border-brand hover:bg-brand/5 hover:text-brand"
          >
            <BotMessageSquare className="h-4 w-4" />
            ChatBot
          </button>
          <a
            href={`/participate/consortium?call=${c.id}`}
            className="flex flex-col items-center gap-1.5 rounded-xl border border-border bg-surface-1 px-2 py-3 text-[11px] font-medium text-muted-foreground transition hover:border-brand hover:bg-brand/5 hover:text-brand"
          >
            <Users className="h-4 w-4" />
            Call Match
          </a>
        </div>
      </div>
    </div>
  );
}
