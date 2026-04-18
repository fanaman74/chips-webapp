import Link from "next/link";
import { ArrowRight, Calendar, ExternalLink } from "lucide-react";
import { getCalls, type Call } from "@/lib/calls";
import { PageHero } from "@/components/marketing/page-hero";
import { Container, Section } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { formatDate, relativeDeadline } from "@/lib/format";
import { INSTRUMENT_COLOR, colorFor } from "@/lib/colors";
import { cn } from "@/lib/utils";

export const metadata = { title: "Open calls" };
export const revalidate = 3600;

export default async function CallsPage() {
  const calls = await getCalls();

  const open = calls.filter((c) => c.status === "open");
  const rest = calls
    .filter((c) => c.status !== "open")
    .sort((a, b) => {
      const da = a.deadline ?? a.open_date ?? "";
      const db = b.deadline ?? b.open_date ?? "";
      return da < db ? -1 : da > db ? 1 : 0;
    });

  const forthcoming = calls.filter((c) => c.status === "forthcoming");
  const closed = calls.filter((c) => c.status === "closed");
  const total = calls.length;

  return (
    <>
      <PageHero
        eyebrow="Funding opportunities"
        title="Open calls for European semiconductor R&I."
        description="All funding opportunities under the Chips for Europe Initiative and the ECS R&I pillar, aggregated live from the EU Funding & Tenders Portal."
      >
        <div className="flex flex-wrap gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-1 px-3 py-1.5 text-sm">
            <span className="h-2 w-2 rounded-full bg-success" />
            {open.length} open
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-1 px-3 py-1.5 text-sm">
            <span className="h-2 w-2 rounded-full bg-amber" />
            {forthcoming.length} forthcoming
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-1 px-3 py-1.5 text-sm text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-border" />
            {closed.length} closed
          </div>
        </div>
      </PageHero>

      <Section>
        <Container className="space-y-14">
          {total === 0 ? (
            <div className="rounded-xl border border-border bg-card p-12 text-center text-muted-foreground">
              No calls loaded yet — run the initial sync to populate data.
            </div>
          ) : (
            <>
              <CallGroup title="Open for submission" accent="success" calls={open} />
              {rest.length > 0 && <CallGroup title="All other calls" accent="muted" calls={rest} />}
            </>
          )}
        </Container>
      </Section>
    </>
  );
}

function CallGroup({
  title,
  accent,
  calls,
}: {
  title: string;
  accent: "success" | "amber" | "muted";
  calls: Call[];
}) {
  if (!calls.length) return null;
  const dot =
    accent === "success" ? "bg-success" : accent === "amber" ? "bg-amber" : "bg-border";

  return (
    <section>
      <div className="mb-5 flex items-center gap-3">
        <span className={cn("inline-block h-2 w-2 rounded-full", dot)} />
        <h2 className="font-display text-xl font-semibold tracking-tight">{title}</h2>
        <span className="font-mono text-xs text-muted-foreground">{calls.length}</span>
      </div>
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
        {calls.map((c, i) => {
          const instrColor = colorFor(INSTRUMENT_COLOR[c.instrument as keyof typeof INSTRUMENT_COLOR] ?? "brand");
          return (
            <a
              key={c.id}
              href={c.portal_url ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "group flex flex-col gap-4 p-6 md:grid md:grid-cols-[1fr_auto_auto_auto] md:items-center md:gap-8 transition-colors hover:bg-surface-2",
                i > 0 && "border-t border-border",
              )}
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="brand">{c.programme}</Badge>
                  <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium", instrColor.chip)}>
                    {c.instrument}
                  </span>
                  <span className="font-mono text-[10px] uppercase text-muted-foreground">{c.id}</span>
                </div>
                <h3 className="mt-2 font-display text-base font-semibold tracking-tight md:text-lg group-hover:text-brand transition-colors">
                  {c.title}
                </h3>
                {c.summary && (
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2 max-w-2xl">
                    {c.summary}
                  </p>
                )}
              </div>

              {c.deadline && (
                <div className="min-w-[130px]">
                  <div className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase text-muted-foreground">
                    <Calendar className="h-3 w-3" /> Deadline
                  </div>
                  <div className="mt-0.5 font-display text-sm font-semibold">{formatDate(c.deadline)}</div>
                  {c.status === "open" && (
                    <div className="text-xs text-amber">{relativeDeadline(c.deadline)}</div>
                  )}
                </div>
              )}

              {c.open_date && (
                <div className="min-w-[110px]">
                  <div className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase text-muted-foreground">
                    <Calendar className="h-3 w-3" /> Opened
                  </div>
                  <div className="mt-0.5 font-display text-sm font-semibold">{formatDate(c.open_date)}</div>
                </div>
              )}

              <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border text-foreground/60 transition group-hover:border-brand group-hover:bg-brand group-hover:text-white">
                <ExternalLink className="h-4 w-4" />
              </div>
            </a>
          );
        })}
      </div>
      <p className="mt-3 text-xs text-muted-foreground text-center">
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
    </section>
  );
}
