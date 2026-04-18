import Link from "next/link";
import { ArrowLeft, ArrowRight, ExternalLink, Clock } from "lucide-react";
import { getCalls } from "@/lib/calls";
import { PageHero } from "@/components/marketing/page-hero";
import { Container, Section } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { formatDate, daysUntil, relativeDeadline } from "@/lib/format";
import { INSTRUMENT_COLOR, colorFor } from "@/lib/colors";
import { cn } from "@/lib/utils";

export const metadata = { title: "CHIPS open calls" };
export const revalidate = 3600;

export default async function ChipsOpenCallsPage() {
  const all = await getCalls();
  // Only truly open: status=open AND deadline is future (or unknown)
  const calls = all.filter(
    (c) => c.status === "open" && (!c.deadline || daysUntil(c.deadline) >= 0)
  );

  return (
    <>
      <PageHero
        eyebrow="Step 01 — Find a matching call"
        title="Open calls for proposals."
        description={`${calls.length} funding ${calls.length === 1 ? "opportunity" : "opportunities"} currently open under the Chips Joint Undertaking — sourced live from the EU Funding & Tenders Portal.`}
      >
        <Link
          href="/participate"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Participate
        </Link>
      </PageHero>

      <Section>
        <Container>
          {calls.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card p-16 text-center">
              <p className="text-muted-foreground">No open calls at this time.</p>
              <a
                href="https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/opportunities/topic-search"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:underline"
              >
                Browse the EU Funding & Tenders Portal
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {calls.map((c) => {
                const instrColor = colorFor(
                  INSTRUMENT_COLOR[c.instrument as keyof typeof INSTRUMENT_COLOR] ?? "brand"
                );
                const days = c.deadline ? daysUntil(c.deadline) : null;
                const urgency =
                  days !== null && days <= 14
                    ? "urgent"
                    : days !== null && days <= 30
                    ? "soon"
                    : "normal";

                return (
                  <div
                    key={c.id}
                    className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-all hover:shadow-elevated"
                  >
                    {/* coloured top strip */}
                    <span
                      aria-hidden
                      className={cn("absolute inset-x-0 top-0 h-1", instrColor.dot)}
                    />

                    {/* subtle gradient wash */}
                    <div
                      aria-hidden
                      className={cn(
                        "pointer-events-none absolute -top-20 -right-20 h-52 w-52 rounded-full bg-gradient-to-br opacity-30 blur-3xl",
                        instrColor.gradient
                      )}
                    />

                    <div className="relative flex flex-1 flex-col gap-4 p-6 pt-7">
                      {/* badges row */}
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="brand">{c.programme}</Badge>
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium",
                            instrColor.chip
                          )}
                        >
                          {c.instrument}
                        </span>
                        {days !== null && urgency !== "normal" && (
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
                              urgency === "urgent"
                                ? "bg-rose/15 text-rose"
                                : "bg-amber/15 text-amber"
                            )}
                          >
                            <Clock className="h-3 w-3" />
                            {relativeDeadline(c.deadline!)}
                          </span>
                        )}
                      </div>

                      {/* call id */}
                      <span className={cn("font-mono text-xs font-semibold", instrColor.text)}>
                        {c.id}
                      </span>

                      {/* title */}
                      <h3 className="font-display text-lg font-semibold leading-snug tracking-tight">
                        {c.title}
                      </h3>

                      {/* summary */}
                      {c.summary && (
                        <p className="flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                          {c.summary}
                        </p>
                      )}

                      {/* dates row */}
                      <div className="mt-auto grid grid-cols-2 gap-3 border-t border-border pt-4 text-xs">
                        {c.open_date && (
                          <div>
                            <div className="font-mono text-[10px] uppercase text-muted-foreground">
                              Opened
                            </div>
                            <div className="mt-0.5 font-display text-sm font-semibold">
                              {formatDate(c.open_date)}
                            </div>
                          </div>
                        )}
                        {c.deadline ? (
                          <div>
                            <div className="font-mono text-[10px] uppercase text-muted-foreground">
                              Deadline
                            </div>
                            <div className="mt-0.5 font-display text-sm font-semibold">
                              {formatDate(c.deadline)}
                            </div>
                            {urgency === "normal" && (
                              <div className={cn("text-[10px]", instrColor.text)}>
                                {relativeDeadline(c.deadline)}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div />
                        )}
                      </div>

                      {/* CTA */}
                      <a
                        href={c.portal_url ?? "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          "mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-medium transition-colors",
                          "border-border text-foreground/70 hover:border-brand hover:bg-brand hover:text-white"
                        )}
                      >
                        Apply on EU Portal
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Data sourced from the{" "}
            <a
              href="https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/opportunities/topic-search"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground"
            >
              EU Funding & Tenders Portal
            </a>
          </p>
        </Container>
      </Section>
    </>
  );
}
