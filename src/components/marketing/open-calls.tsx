import Link from "next/link";
import { ArrowRight, Calendar, Users } from "lucide-react";
import { openCalls } from "@/data/calls";
import { Container, Eyebrow, Section } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate, formatEur, relativeDeadline } from "@/lib/format";
import { INSTRUMENT_COLOR, colorFor } from "@/lib/colors";
import { cn } from "@/lib/utils";

export function OpenCallsSection() {
  const calls = openCalls().slice(0, 3);
  return (
    <Section>
      <Container>
        <div className="mb-10 text-center">
          <Eyebrow className="justify-center">Open calls</Eyebrow>
          <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl text-balance">
            Apply for funding — €260M across three calls.
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

        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
          {calls.map((c, i) => {
            const instrColor = colorFor(INSTRUMENT_COLOR[c.instrument] ?? "brand");
            return (
            <Link
              key={c.slug}
              href={`/calls/${c.slug}`}
              className={`group relative flex flex-col gap-4 p-6 md:flex-row md:items-center md:gap-6 md:p-7 ${
                i > 0 ? "border-t border-border" : ""
              } transition-colors hover:bg-surface-2`}
            >
              <span aria-hidden className={cn("absolute inset-y-0 left-0 w-0.5", instrColor.dot)} />
              <div className="flex min-w-0 flex-1 flex-col gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="brand">{c.programme}</Badge>
                  <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium", instrColor.chip)}>
                    {c.instrument}
                  </span>
                  <span className="font-mono text-[10px] uppercase text-muted-foreground">
                    {c.ref}
                  </span>
                </div>
                <h3 className="font-display text-lg font-semibold leading-snug tracking-tight">
                  {c.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{c.summary}</p>
              </div>

              <div className="grid shrink-0 grid-cols-3 items-center gap-6 md:gap-8">
                <div>
                  <div className="font-mono text-[10px] uppercase text-muted-foreground">
                    Budget
                  </div>
                  <div className="mt-0.5 font-display text-base font-semibold">
                    {formatEur(c.budgetEur, { compact: true })}
                  </div>
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase text-muted-foreground">
                    <Calendar className="h-3 w-3" /> Deadline
                  </div>
                  <div className="mt-0.5 text-sm">
                    <span className="font-semibold">{formatDate(c.deadline)}</span>
                    <span className="ml-2 text-amber">{relativeDeadline(c.deadline)}</span>
                  </div>
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase text-muted-foreground">
                    <Users className="h-3 w-3" /> Projects
                  </div>
                  <div className="mt-0.5 font-display text-base font-semibold">
                    ~{c.expectedProjects}
                  </div>
                </div>
              </div>

              <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border text-foreground/60 transition group-hover:border-brand group-hover:bg-brand group-hover:text-white">
                <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
