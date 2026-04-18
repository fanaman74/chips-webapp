import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { APPLICATIONS, STATUS_LABEL } from "@/data/applications";
import { PortalContainer, PortalPageHeader } from "@/components/portal/portal-container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatEur, relativeDeadline } from "@/lib/format";

export const metadata = { title: "My applications" };

const statusVariant: Record<string, "brand" | "amber" | "success" | "default" | "outline"> = {
  draft: "amber",
  submitted: "brand",
  "in-evaluation": "brand",
  awarded: "success",
  rejected: "outline",
  resubmission: "amber",
};

export default function ApplicationsPage() {
  return (
    <PortalContainer>
      <PortalPageHeader
        eyebrow="Applications"
        title="My applications"
        description="All of your applications, drafts and submissions — across the current and past call rounds."
        actions={
          <Button asChild>
            <Link href="/portal/applications/new">
              <Plus className="h-4 w-4" /> New
            </Link>
          </Button>
        }
      />

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
        <div className="grid grid-cols-[1fr_auto_auto_auto] gap-6 border-b border-border bg-surface-2 px-6 py-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          <div>Proposal</div>
          <div className="w-28">Status</div>
          <div className="w-32">Completeness</div>
          <div className="w-10" />
        </div>
        {APPLICATIONS.map((a, i) => (
          <Link
            key={a.id}
            href={`/portal/applications/${a.id}`}
            className={`grid grid-cols-1 gap-4 px-6 py-5 text-sm transition-colors hover:bg-surface-2 md:grid-cols-[1fr_auto_auto_auto] md:items-center md:gap-6 ${
              i > 0 ? "border-t border-border" : ""
            }`}
          >
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs font-semibold text-accent-600">
                  {a.acronym}
                </span>
                <span className="font-mono text-[10px] uppercase text-muted-foreground">
                  {a.callRef}
                </span>
              </div>
              <div className="mt-1 font-display text-base font-semibold leading-snug">
                {a.title}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                {a.callTitle} · {a.consortiumSize} partners ·{" "}
                {formatEur(a.requestedFundingEur, { compact: true })} requested · due{" "}
                {formatDate(a.dueDate)}
                {a.status === "draft" && ` · ${relativeDeadline(a.dueDate)}`}
              </div>
            </div>
            <div className="w-28">
              <Badge variant={statusVariant[a.status]}>{STATUS_LABEL[a.status]}</Badge>
            </div>
            <div className="w-32">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{a.completeness}%</span>
                <span>last edit {formatDate(a.lastEdited, { month: "short", day: "numeric" })}</span>
              </div>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
                <div
                  className="h-full rounded-full bg-brand"
                  style={{ width: `${a.completeness}%` }}
                />
              </div>
            </div>
            <div className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border text-foreground/60">
              <ArrowRight className="h-4 w-4" />
            </div>
          </Link>
        ))}
      </div>
    </PortalContainer>
  );
}
