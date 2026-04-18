"use client";

import { useState } from "react";
import { Search, Loader2, Star, MapPin, Building2, ChevronDown } from "lucide-react";
import { Container, Section } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { PartnerResult } from "@/app/api/partner-match/route";

const EU_COUNTRIES = [
  "Austria","Belgium","Bulgaria","Croatia","Cyprus","Czech Republic","Denmark",
  "Estonia","Finland","France","Germany","Greece","Hungary","Ireland","Italy",
  "Latvia","Lithuania","Luxembourg","Malta","Netherlands","Poland","Portugal",
  "Romania","Slovakia","Slovenia","Spain","Sweden",
  "Norway","Switzerland","Israel","Turkey","Ukraine",
];

const MAX_RESULTS_OPTIONS = [5, 10, 15];

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 80 ? "bg-emerald-500" : score >= 60 ? "bg-amber-400" : "bg-rose-400";
  const stars = Math.round(score / 20);
  return (
    <div className="flex items-center gap-2">
      <div className={cn("h-2 w-2 rounded-full", color)} />
      <span className="font-display text-sm font-semibold">{score}%</span>
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              "h-3 w-3",
              i < stars ? "fill-amber-400 text-amber-400" : "fill-none text-border"
            )}
          />
        ))}
      </div>
    </div>
  );
}

function PartnerCard({ partner, index }: { partner: PartnerResult; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-shadow hover:shadow-elevated">
      <div className="flex items-start gap-4 p-5">
        {/* rank */}
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-surface-1 font-mono text-xs font-semibold text-muted-foreground">
          {String(index + 1).padStart(2, "0")}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-display text-base font-semibold leading-snug tracking-tight">
                {partner.orgName}
              </h3>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                {partner.country && (
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {partner.country}
                  </span>
                )}
                {partner.orgType && (
                  <span className="rounded-full border border-border bg-surface-1 px-2 py-0.5 text-[11px] text-muted-foreground">
                    {partner.orgType}
                  </span>
                )}
              </div>
            </div>
            <ScoreBadge score={partner.matchScore} />
          </div>

          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{partner.reason}</p>

          {/* expertise tags */}
          {partner.expertise.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {partner.expertise.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-brand/30 bg-brand/10 px-2 py-0.5 text-[11px] font-medium text-brand"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* expandable known projects */}
      {partner.relevantProjects && partner.relevantProjects.length > 0 && (
        <div className="border-t border-border">
          <button
            onClick={() => setExpanded((v) => !v)}
            className="flex w-full items-center justify-between px-5 py-2.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <span className="inline-flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5" />
              Known projects & programmes
            </span>
            <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", expanded && "rotate-180")} />
          </button>
          {expanded && (
            <ul className="divide-y divide-border border-t border-border">
              {partner.relevantProjects.map((proj) => (
                <li key={proj} className="px-5 py-2 text-xs text-muted-foreground">
                  {proj}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export function ConsortiumForm() {
  const [description, setDescription] = useState("");
  const [country, setCountry] = useState("");
  const [maxResults, setMaxResults] = useState(10);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<PartnerResult[] | null>(null);
  const [meta, setMeta] = useState<{ keywords: string[]; relatedProjectCount: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResults(null);
    setMeta(null);

    try {
      const res = await fetch("/api/partner-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description, country: country || undefined, maxResults }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
      } else if (data.message) {
        setError(data.message);
      } else {
        setResults(data.results ?? []);
        setMeta({ keywords: data.keywords ?? [], relatedProjectCount: data.relatedProjectCount ?? 0 });
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const canSubmit = description.trim().length >= 20 && !loading;

  return (
    <>
      <Section>
        <Container className="max-w-3xl">
          <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-border bg-card p-8 shadow-card">
            <div>
              <label className="block font-display text-sm font-semibold tracking-tight">
                Describe your project
                <span className="ml-1 font-normal text-muted-foreground">(min 20 chars)</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. We are developing a novel AI-accelerator chip using FDSOI technology for edge inference applications in automotive. We need partners with experience in low-power circuit design and advanced packaging..."
                rows={5}
                className="mt-2 w-full resize-none rounded-xl border border-border bg-surface-1 px-4 py-3 text-sm leading-relaxed placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-brand/50 transition"
              />
              <div className="mt-1 text-right text-xs text-muted-foreground">
                {description.length} chars
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block font-display text-sm font-semibold tracking-tight">
                  Country filter
                  <span className="ml-1 font-normal text-muted-foreground">(optional)</span>
                </label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-border bg-surface-1 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50"
                >
                  <option value="">Any country</option>
                  {EU_COUNTRIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-display text-sm font-semibold tracking-tight">
                  Number of partners
                </label>
                <select
                  value={maxResults}
                  onChange={(e) => setMaxResults(Number(e.target.value))}
                  className="mt-2 w-full rounded-xl border border-border bg-surface-1 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50"
                >
                  {MAX_RESULTS_OPTIONS.map((n) => (
                    <option key={n} value={n}>{n} partners</option>
                  ))}
                </select>
              </div>
            </div>

            <Button type="submit" disabled={!canSubmit} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Searching CORDIS & scoring with AI…
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  Find partners
                </>
              )}
            </Button>
          </form>
        </Container>
      </Section>

      {(results || error) && (
        <section className="border-t border-border bg-surface-2/40 py-14">
          <Container>
            {error && (
              <div className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
                {error}
              </div>
            )}

            {results && results.length > 0 && (
              <>
                {meta && (
                  <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h2 className="font-display text-xl font-semibold tracking-tight">
                        {results.length} recommended partners
                      </h2>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {meta.relatedProjectCount > 0
                          ? `Based on ${meta.relatedProjectCount} related CHIPS JU projects in CORDIS`
                          : "Ranked by AI based on European R&I ecosystem expertise"}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {meta.keywords.map((kw) => (
                        <span
                          key={kw}
                          className="rounded-full bg-surface-1 border border-border px-2.5 py-1 text-xs text-muted-foreground"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="grid gap-4 md:grid-cols-2">
                  {results.map((p, i) => (
                    <PartnerCard key={p.orgName} partner={p} index={i} />
                  ))}
                </div>
              </>
            )}

            {results && results.length === 0 && (
              <div className="rounded-2xl border border-border bg-card p-12 text-center text-muted-foreground">
                No matching partners found. Try broadening your project description.
              </div>
            )}
          </Container>
        </section>
      )}
    </>
  );
}
