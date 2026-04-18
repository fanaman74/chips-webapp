import Link from "next/link";
import {
  BarChart3,
  FileText,
  Inbox,
  Plus,
  TrendingUp,
  Users,
} from "lucide-react";
import { PortalContainer, PortalPageHeader } from "@/components/portal/portal-container";
import { NEWS } from "@/data/news";
import { CALLS } from "@/data/calls";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate, formatEur } from "@/lib/format";

export const metadata = { title: "Admin" };

export default function AdminPage() {
  const draftsInQueue = 47;
  const evaluatorsAssigned = 132;

  return (
    <PortalContainer>
      <PortalPageHeader
        eyebrow="Programme office"
        title="Admin dashboard"
        description="Oversight on submissions, evaluation, content and budgets."
        actions={
          <>
            <Button variant="outline">
              <Plus className="h-4 w-4" /> New call
            </Button>
            <Button>
              <Plus className="h-4 w-4" /> New news post
            </Button>
          </>
        }
      />

      <div className="grid gap-4 md:grid-cols-4">
        <AdminKpi icon={<Inbox className="h-4 w-4" />} label="Proposals received" value="312" hint="Current evaluation cycle" />
        <AdminKpi icon={<FileText className="h-4 w-4" />} label="In review queue" value={draftsInQueue.toString()} hint="Pending assignment" />
        <AdminKpi icon={<Users className="h-4 w-4" />} label="Evaluators assigned" value={evaluatorsAssigned.toString()} hint="Across 18 expert panels" />
        <AdminKpi icon={<TrendingUp className="h-4 w-4" />} label="Committed" value={formatEur(2_400_000_000, { compact: true })} hint="2026 cycle commitments" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section>
          <h2 className="font-display text-lg font-semibold tracking-tight mb-4">
            Call pipeline
          </h2>
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
            <div className="grid grid-cols-[1fr_auto_auto_auto] gap-6 border-b border-border bg-surface-2 px-5 py-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              <div>Call</div>
              <div className="w-24">Status</div>
              <div className="w-28">Budget</div>
              <div className="w-32">Deadline</div>
            </div>
            {CALLS.slice(0, 6).map((c, i) => (
              <div
                key={c.slug}
                className={`grid grid-cols-[1fr_auto_auto_auto] items-center gap-6 px-5 py-3 text-sm ${
                  i > 0 ? "border-t border-border" : ""
                }`}
              >
                <div className="min-w-0">
                  <div className="font-medium truncate">{c.title}</div>
                  <div className="font-mono text-[10px] uppercase text-muted-foreground">{c.ref}</div>
                </div>
                <div className="w-24">
                  <Badge variant={c.status === "open" ? "success" : c.status === "upcoming" ? "amber" : "outline"}>
                    {c.status}
                  </Badge>
                </div>
                <div className="w-28 font-display text-sm font-semibold">
                  {formatEur(c.budgetEur, { compact: true })}
                </div>
                <div className="w-32 text-muted-foreground">{formatDate(c.deadline)}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold tracking-tight">News queue</h2>
            <Link href="#" className="text-sm text-foreground/60 hover:text-foreground">
              Draft new →
            </Link>
          </div>
          <div className="rounded-xl border border-border bg-card shadow-card">
            {NEWS.slice(0, 4).map((n, i) => (
              <div
                key={n.slug}
                className={`px-5 py-4 ${i > 0 ? "border-t border-border" : ""}`}
              >
                <div className="flex items-center gap-2">
                  <Badge variant="brand">{n.category}</Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(n.publishedAt)}
                  </span>
                </div>
                <div className="mt-1.5 font-display text-sm font-semibold leading-snug">
                  {n.title}
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-border bg-gradient-to-br from-brand/5 to-accent/5 p-5 shadow-card">
            <div className="flex items-start gap-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-card text-brand">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-base font-semibold">Monthly report ready</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  April 2026 — 312 active projects, €11.2B committed to date. Export to
                  share with the Governing Board.
                </p>
                <Button size="sm" className="mt-3">
                  Export report
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PortalContainer>
  );
}

function AdminKpi({
  icon,
  label,
  value,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <div className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {icon} {label}
      </div>
      <div className="mt-2 font-display text-3xl font-semibold tracking-tight">{value}</div>
      {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
    </div>
  );
}
