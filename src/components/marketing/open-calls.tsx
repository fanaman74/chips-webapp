import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { getOpenCalls, type Call } from "@/lib/calls";
import { Container, Eyebrow, Section } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate, relativeDeadline } from "@/lib/format";
import { INSTRUMENT_COLOR, colorFor } from "@/lib/colors";
import { cn } from "@/lib/utils";

export async function OpenCallsSection() {
  const calls = await getOpenCalls();

  return (
    <Section>
      <Container>
        <div className="mb-10 text-center">
          <Eyebrow className="justify-center">Open calls</Eyebrow>
          <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl text-balance">
            Apply for funding.
          </h2>
          <div className="section-green-line" />
          <div className="mt-4 flex justify-center">
            <Button variant="outline" asChild>
              <Link href="/calls">
                All calls
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        {calls.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-10 text-center text-muted-foreground text-sm">
            No open calls at this time. Check back soon or{" "}
            <a
              href="https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/opportunities/topic-search"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              browse the EU portal
            </a>
            .
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {calls.map((c) => (
              <CallCard key={c.id} call={c} />
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}

function CallCard({ call: c }: { call: Call }) {
  const instrColor = colorFor(INSTRUMENT_COLOR[c.instrument as keyof typeof INSTRUMENT_COLOR] ?? "brand");

  return (
    <a
      href={c.portal_url ?? "/calls"}
      target={c.portal_url ? "_blank" : undefined}
      rel={c.portal_url ? "noopener noreferrer" : undefined}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card p-6 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-elevated"
    >
      <span aria-hidden className={cn("absolute inset-x-0 top-0 h-1", instrColor.dot)} />
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-gradient-to-br opacity-50 blur-2xl transition-opacity group-hover:opacity-80",
          instrColor.gradient,
        )}
      />

      <div className="relative flex flex-wrap items-center gap-2">
        <Badge variant="brand">{c.programme}</Badge>
        <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium", instrColor.chip)}>
          {c.instrument}
        </span>
      </div>

      <div className="relative mt-4">
        <span className={cn("font-mono text-xs font-semibold", instrColor.text)}>{c.id}</span>
      </div>
      <h3 className="relative mt-1 font-display text-lg font-semibold leading-snug tracking-tight">
        {c.title}
      </h3>
      {c.summary && (
        <p className="relative mt-3 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-3">
          {c.summary}
        </p>
      )}

      {(c.deadline || c.open_date) && (
        <div className="relative mt-6 grid grid-cols-2 gap-4 border-t border-border pt-4 text-xs">
          {c.open_date && (
            <div>
              <div className="font-mono text-[10px] uppercase text-muted-foreground">Opened</div>
              <div className="mt-0.5 font-display text-sm font-semibold">{formatDate(c.open_date)}</div>
            </div>
          )}
          {c.deadline && (
            <div>
              <div className="font-mono text-[10px] uppercase text-muted-foreground">Deadline</div>
              <div className="mt-0.5 font-display text-sm font-semibold">{formatDate(c.deadline)}</div>
              <div className="text-[10px] text-amber">{relativeDeadline(c.deadline)}</div>
            </div>
          )}
        </div>
      )}

      <div className="relative mt-5 flex items-center justify-between text-sm text-foreground/60 transition group-hover:text-brand">
        <span>View call</span>
        <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </div>
    </a>
  );
}
