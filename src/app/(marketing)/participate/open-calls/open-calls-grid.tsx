"use client";

import { useState } from "react";
import {
  X, ExternalLink, Clock, Loader2, Target, Users, Euro,
  CheckCircle2, AlertCircle, Lightbulb, ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDate, daysUntil, relativeDeadline } from "@/lib/format";
import { INSTRUMENT_COLOR, colorFor } from "@/lib/colors";
import { cn } from "@/lib/utils";
import type { Call } from "@/lib/calls";
import type { CallInsight } from "@/app/api/call-insight/route";

export function OpenCallsGrid({ calls }: { calls: Call[] }) {
  const [selected, setSelected] = useState<Call | null>(null);
  const [insight, setInsight] = useState<CallInsight | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      {/* Card grid */}
      <div className="grid gap-5 md:grid-cols-2">
        {calls.map((c) => <CallCard key={c.id} call={c} onClick={() => openCall(c)} />)}
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
                    <div className="text-[11px] text-amber">{relativeDeadline(selected.deadline)}</div>
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
            <div className="border-t border-border p-4">
              <a
                href={selected.portal_url ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3 text-sm font-medium text-white transition hover:bg-brand/90"
              >
                Apply on EU Funding & Tenders Portal
                <ExternalLink className="h-4 w-4" />
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

function InsightPanel({ insight }: { insight: CallInsight }) {
  return (
    <div className="space-y-5">
      {/* Scope */}
      <Section icon={<Target className="h-4 w-4" />} title="Scope">
        <p className="text-sm leading-relaxed text-muted-foreground">{insight.scope}</p>
      </Section>

      {/* Objectives */}
      {insight.objectives?.length > 0 && (
        <Section icon={<CheckCircle2 className="h-4 w-4" />} title="Objectives">
          <ul className="space-y-1.5">
            {insight.objectives.map((o, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <ChevronRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" />
                {o}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Who should apply */}
      {insight.whoShouldApply && (
        <Section icon={<Users className="h-4 w-4" />} title="Who should apply">
          <p className="text-sm leading-relaxed text-muted-foreground">{insight.whoShouldApply}</p>
        </Section>
      )}

      {/* Budget */}
      {insight.budgetInfo && (
        <Section icon={<Euro className="h-4 w-4" />} title="Budget">
          <p className="text-sm leading-relaxed text-muted-foreground">{insight.budgetInfo}</p>
        </Section>
      )}

      {/* Evaluation criteria */}
      {insight.evaluationCriteria?.length > 0 && (
        <Section icon={<AlertCircle className="h-4 w-4" />} title="Evaluation criteria">
          <ul className="space-y-1.5">
            {insight.evaluationCriteria.map((c, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <ChevronRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" />
                {c}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Key requirements */}
      {insight.keyRequirements?.length > 0 && (
        <Section icon={<CheckCircle2 className="h-4 w-4" />} title="Key requirements">
          <ul className="space-y-1.5">
            {insight.keyRequirements.map((r, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <ChevronRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-600" />
                {r}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Tips */}
      {insight.tips?.length > 0 && (
        <Section icon={<Lightbulb className="h-4 w-4 text-amber" />} title="Proposal tips">
          <ul className="space-y-1.5">
            {insight.tips.map((t, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <ChevronRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber" />
                {t}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Disclaimer */}
      {insight.disclaimer && (
        <p className="rounded-lg border border-border bg-surface-1 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
          ⚠ {insight.disclaimer}
        </p>
      )}
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
      <div className="mb-2 flex items-center gap-2 text-foreground">
        {icon}
        <span className="font-display text-sm font-semibold tracking-tight">{title}</span>
      </div>
      {children}
    </div>
  );
}

function CallCard({ call: c, onClick }: { call: Call; onClick: () => void }) {
  const instrColor = colorFor(INSTRUMENT_COLOR[c.instrument as keyof typeof INSTRUMENT_COLOR] ?? "brand");
  const days = c.deadline ? daysUntil(c.deadline) : null;
  const urgency = days !== null && days <= 14 ? "urgent" : days !== null && days <= 30 ? "soon" : "normal";

  return (
    <button
      onClick={onClick}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card text-left transition-all hover:-translate-y-0.5 hover:shadow-elevated hover:border-brand/40 w-full"
    >
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

        <h3 className="font-display text-lg font-semibold leading-snug tracking-tight group-hover:text-brand transition-colors">
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
              {urgency === "normal" && <div className={cn("text-[10px]", instrColor.text)}>{relativeDeadline(c.deadline)}</div>}
            </div>
          ) : <div />}
        </div>

        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground group-hover:text-brand transition-colors">
          <span>Click to view call briefing</span>
          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </div>
      </div>
    </button>
  );
}
