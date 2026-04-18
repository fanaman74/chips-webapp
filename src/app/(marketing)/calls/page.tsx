import Link from "next/link";
import { ArrowRight, Calendar, Euro, Users } from "lucide-react";
import { CALLS } from "@/data/calls";
import { PageHero } from "@/components/marketing/page-hero";
import { Container, Section } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatEur, relativeDeadline } from "@/lib/format";

export const metadata = { title: "Open calls" };

export default function CallsPage() {
  const groups = {
    open: CALLS.filter((c) => c.status === "open"),
    upcoming: CALLS.filter((c) => c.status === "upcoming"),
    closed: CALLS.filter((c) => c.status === "closed"),
  };

  return (
    <>
      <PageHero
        eyebrow="Funding opportunities"
        title="Open calls for European semiconductor R&I."
        description="All funding opportunities under the Chips for Europe Initiative and the ECS R&I pillar. Submit applications directly through the applicant portal."
      >
        <div className="flex flex-wrap gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-1 px-3 py-1.5 text-sm">
            <span className="h-2 w-2 rounded-full bg-success" />
            {groups.open.length} calls open
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-1 px-3 py-1.5 text-sm">
            <span className="h-2 w-2 rounded-full bg-amber" />
            {groups.upcoming.length} upcoming
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-1 px-3 py-1.5 text-sm text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-border" />
            {groups.closed.length} closed
          </div>
        </div>
      </PageHero>

      <Section>
        <Container className="space-y-14">
          <CallGroup title="Open for submission" accent="success" calls={groups.open} />
          <CallGroup title="Opening soon" accent="amber" calls={groups.upcoming} />
          <CallGroup title="Recently closed" accent="muted" calls={groups.closed} />
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
  calls: typeof CALLS;
}) {
  if (!calls.length) return null;
  const dot =
    accent === "success" ? "bg-success" : accent === "amber" ? "bg-amber" : "bg-border";
  return (
    <section>
      <div className="mb-5 flex items-center gap-3">
        <span className={`inline-block h-2 w-2 rounded-full ${dot}`} />
        <h2 className="font-display text-xl font-semibold tracking-tight">{title}</h2>
        <span className="font-mono text-xs text-muted-foreground">
          {calls.length}
        </span>
      </div>
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
        {calls.map((c, i) => (
          <Link
            key={c.slug}
            href={`/calls/${c.slug}`}
            className={`group flex flex-col gap-4 p-6 md:grid md:grid-cols-[1fr_auto_auto_auto_auto] md:items-center md:gap-8 ${
              i > 0 ? "border-t border-border" : ""
            } transition-colors hover:bg-surface-2`}
          >
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="brand">{c.programme}</Badge>
                <Badge variant="outline">{c.instrument}</Badge>
                <span className="font-mono text-[10px] uppercase text-muted-foreground">
                  {c.ref}
                </span>
              </div>
              <h3 className="mt-2 font-display text-base font-semibold tracking-tight md:text-lg">
                {c.title}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2 max-w-2xl">
                {c.summary}
              </p>
            </div>

            <MetaCell icon={<Euro className="h-3 w-3" />} label="Budget">
              {formatEur(c.budgetEur, { compact: true })}
            </MetaCell>
            <MetaCell icon={<Calendar className="h-3 w-3" />} label="Deadline">
              <div className="text-sm font-semibold">{formatDate(c.deadline)}</div>
              {c.status === "open" && (
                <div className="text-xs text-amber">{relativeDeadline(c.deadline)}</div>
              )}
            </MetaCell>
            <MetaCell icon={<Users className="h-3 w-3" />} label="TRL">
              {c.trlRange[0]}–{c.trlRange[1]}
            </MetaCell>

            <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border text-foreground/60 transition group-hover:border-brand group-hover:bg-brand group-hover:text-white">
              <ArrowRight className="h-4 w-4" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function MetaCell({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-[120px]">
      <div className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase text-muted-foreground">
        {icon} {label}
      </div>
      <div className="mt-0.5 font-display text-sm font-semibold">{children}</div>
    </div>
  );
}
