import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MY_PROJECTS } from "@/data/applications";
import { PortalContainer, PortalPageHeader } from "@/components/portal/portal-container";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatEur } from "@/lib/format";

export const metadata = { title: "My projects" };

export default function PortalProjectsPage() {
  return (
    <PortalContainer>
      <PortalPageHeader
        eyebrow="Projects"
        title="My funded projects"
        description="Active grant agreements, milestones, reporting and consortium management."
      />
      <div className="grid gap-5 md:grid-cols-2">
        {MY_PROJECTS.map((p) => (
          <Link
            key={p.slug}
            href={`/portal/projects/${p.slug}`}
            className="group flex flex-col rounded-xl border border-border bg-card p-6 shadow-card transition-all hover:shadow-elevated"
          >
            <div className="flex items-center gap-2">
              <Badge variant="success">Active</Badge>
              <span className="font-mono text-[10px] uppercase text-muted-foreground">
                {p.grantRef}
              </span>
            </div>
            <h3 className="mt-3 font-mono text-xs font-semibold text-accent-600">
              {p.acronym}
            </h3>
            <h4 className="mt-0.5 font-display text-lg font-semibold leading-snug tracking-tight">
              {p.name}
            </h4>
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Progress</span>
                <span className="font-medium text-foreground">{p.progressPct}%</span>
              </div>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
                <div className="h-full rounded-full bg-brand" style={{ width: `${p.progressPct}%` }} />
              </div>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3 text-xs">
              <div>
                <div className="font-mono text-[10px] uppercase text-muted-foreground">Partners</div>
                <div className="mt-0.5 font-display text-sm font-semibold">{p.consortiumSize}</div>
              </div>
              <div>
                <div className="font-mono text-[10px] uppercase text-muted-foreground">Funding</div>
                <div className="mt-0.5 font-display text-sm font-semibold">
                  {formatEur(p.fundingEur, { compact: true })}
                </div>
              </div>
              <div>
                <div className="font-mono text-[10px] uppercase text-muted-foreground">Period</div>
                <div className="mt-0.5 font-display text-sm font-semibold">{p.period.split(" → ")[0].slice(0, 4)}–{p.period.split(" → ")[1].slice(0, 4)}</div>
              </div>
            </div>

            <div className="mt-auto pt-5 flex items-center justify-between text-sm text-foreground/60 group-hover:text-brand">
              <span>Enter workspace</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </Link>
        ))}
      </div>
    </PortalContainer>
  );
}
