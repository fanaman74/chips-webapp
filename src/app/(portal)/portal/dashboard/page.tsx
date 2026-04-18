import Link from "next/link";
import {
  ArrowRight,
  Bell,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  FolderKanban,
  Rocket,
  TrendingUp,
} from "lucide-react";
import { getSession } from "@/lib/auth";
import { APPLICATIONS, MY_PROJECTS, NOTIFICATIONS, STATUS_LABEL } from "@/data/applications";
import { openCalls } from "@/data/calls";
import { PortalContainer, PortalPageHeader } from "@/components/portal/portal-container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatEur, relativeDeadline } from "@/lib/format";

function timeOfDay() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 18) return "afternoon";
  return "evening";
}

function firstName(full: string) {
  const tokens = full.split(" ").filter((t) => !/^(Dr|Mr|Mrs|Ms|Prof|Ing)\.?$/.test(t));
  return tokens[0] ?? full;
}

export default async function DashboardPage() {
  const session = (await getSession())!;
  const drafts = APPLICATIONS.filter((a) => a.status === "draft");
  const inEval = APPLICATIONS.filter((a) => a.status === "in-evaluation");
  const awarded = APPLICATIONS.filter((a) => a.status === "awarded");
  const calls = openCalls().slice(0, 3);

  const greeting =
    session.role === "admin"
      ? "Ready to post today's announcement?"
      : session.role === "partner"
        ? "Welcome back. Here's your project pulse."
        : "Welcome back. Here's your application pulse.";

  return (
    <PortalContainer>
      <PortalPageHeader
        eyebrow={session.role === "admin" ? "Programme office" : session.role === "partner" ? "Partner workspace" : "Applicant workspace"}
        title={`Good ${timeOfDay()}, ${firstName(session.name)}.`}
        description={greeting}
        actions={
          <Button asChild>
            <Link href="/portal/applications/new">
              <Rocket className="h-4 w-4" />
              New application
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          icon={<FileText className="h-4 w-4" />}
          label="Active drafts"
          value={drafts.length.toString()}
          hint={`Next deadline: ${formatDate(drafts[0]?.dueDate ?? "2026-05-21")}`}
        />
        <KpiCard
          icon={<Clock className="h-4 w-4" />}
          label="In evaluation"
          value={inEval.length.toString()}
          hint="Results expected Sep 2025"
        />
        <KpiCard
          icon={<FolderKanban className="h-4 w-4" />}
          label="Funded projects"
          value={MY_PROJECTS.length.toString()}
          hint={`${MY_PROJECTS.reduce((s, p) => s + p.consortiumSize, 0)} partners`}
        />
        <KpiCard
          icon={<TrendingUp className="h-4 w-4" />}
          label="Funding awarded"
          value={formatEur(awarded.reduce((s, a) => s + a.requestedFundingEur, 0) + MY_PROJECTS.reduce((s, p) => s + p.fundingEur, 0), { compact: true })}
          hint="Cumulative lifetime"
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold tracking-tight">
              Your draft applications
            </h2>
            <Link
              href="/portal/applications"
              className="text-sm text-foreground/60 hover:text-foreground"
            >
              View all →
            </Link>
          </div>
          <div className="space-y-3">
            {drafts.map((a) => (
              <Link
                key={a.id}
                href={`/portal/applications/${a.id}`}
                className="group grid gap-4 rounded-xl border border-border bg-card p-5 shadow-card transition-all hover:shadow-elevated md:grid-cols-[1fr_auto] md:items-center"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="amber">{STATUS_LABEL[a.status]}</Badge>
                    <span className="font-mono text-[10px] uppercase text-muted-foreground">
                      {a.callRef}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-accent-600">
                      {a.acronym}
                    </span>
                  </div>
                  <h3 className="mt-0.5 font-display text-base font-semibold leading-snug tracking-tight">
                    {a.title}
                  </h3>
                  <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> due {formatDate(a.dueDate)}
                    </span>
                    <span>{a.consortiumSize} partners</span>
                    <span>{formatEur(a.requestedFundingEur, { compact: true })}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="w-36">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Complete</span>
                      <span className="font-medium text-foreground">{a.completeness}%</span>
                    </div>
                    <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
                      <div
                        className="h-full rounded-full bg-brand"
                        style={{ width: `${a.completeness}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-xs text-amber">{relativeDeadline(a.dueDate)}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold tracking-tight">
              Notifications
            </h2>
            <Link
              href="/portal/messages"
              className="text-sm text-foreground/60 hover:text-foreground"
            >
              View all →
            </Link>
          </div>
          <div className="rounded-xl border border-border bg-card shadow-card">
            {NOTIFICATIONS.map((n, i) => (
              <div
                key={n.id}
                className={`flex items-start gap-3 px-5 py-4 ${
                  i > 0 ? "border-t border-border" : ""
                }`}
              >
                <div
                  className={`mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    n.kind === "call"
                      ? "bg-brand/10 text-brand"
                      : n.kind === "project"
                        ? "bg-accent/10 text-accent-600"
                        : n.kind === "admin"
                          ? "bg-amber/10 text-amber"
                          : "bg-surface-2 text-foreground/70"
                  }`}
                >
                  {n.kind === "call" ? (
                    <FileText className="h-4 w-4" />
                  ) : n.kind === "project" ? (
                    <FolderKanban className="h-4 w-4" />
                  ) : n.kind === "admin" ? (
                    <Bell className="h-4 w-4" />
                  ) : (
                    <Calendar className="h-4 w-4" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="font-medium text-sm leading-snug">{n.title}</div>
                    {n.unread && (
                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-accent" />
                    )}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {n.description}
                  </div>
                  <div className="mt-1 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                    {n.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold tracking-tight">
            Calls matched to your profile
          </h2>
          <Link href="/calls" className="text-sm text-foreground/60 hover:text-foreground">
            Browse all →
          </Link>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {calls.map((c) => (
            <Link
              key={c.slug}
              href={`/calls/${c.slug}`}
              className="group rounded-xl border border-border bg-card p-5 shadow-card transition-all hover:shadow-elevated"
            >
              <div className="flex items-center gap-2">
                <Badge variant="brand">{c.instrument}</Badge>
                <span className="font-mono text-[10px] uppercase text-muted-foreground">
                  {c.ref}
                </span>
              </div>
              <h3 className="mt-3 font-display text-sm font-semibold leading-snug tracking-tight">
                {c.title}
              </h3>
              <div className="mt-4 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  {formatEur(c.budgetEur, { compact: true })} budget
                </span>
                <span className="text-amber">{relativeDeadline(c.deadline)}</span>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm text-foreground/60 group-hover:text-brand">
                <span>View call</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-lg font-semibold tracking-tight">
          Active projects at a glance
        </h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {MY_PROJECTS.map((p) => (
            <Link
              key={p.slug}
              href={`/portal/projects/${p.slug}`}
              className="group rounded-xl border border-border bg-card p-6 shadow-card transition-all hover:shadow-elevated"
            >
              <div className="flex items-center gap-2">
                <Badge variant="success" className="inline-flex gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Active
                </Badge>
                <span className="font-mono text-[10px] uppercase text-muted-foreground">
                  {p.grantRef}
                </span>
              </div>
              <h3 className="mt-3 font-display text-base font-semibold tracking-tight">
                {p.acronym} — {p.name}
              </h3>
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Progress</span>
                  <span className="font-medium text-foreground">{p.progressPct}%</span>
                </div>
                <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
                  <div
                    className="h-full rounded-full bg-brand"
                    style={{ width: `${p.progressPct}%` }}
                  />
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
                <div>
                  <div className="font-mono text-[9px] uppercase text-muted-foreground">Partners</div>
                  <div className="mt-0.5 font-display font-semibold">{p.consortiumSize}</div>
                </div>
                <div>
                  <div className="font-mono text-[9px] uppercase text-muted-foreground">Funding</div>
                  <div className="mt-0.5 font-display font-semibold">
                    {formatEur(p.fundingEur, { compact: true })}
                  </div>
                </div>
                <div>
                  <div className="font-mono text-[9px] uppercase text-muted-foreground">Next report</div>
                  <div className="mt-0.5 font-display font-semibold">
                    {formatDate(p.nextReportingDate)}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </PortalContainer>
  );
}

function KpiCard({
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
      <div className="mt-2 font-display text-3xl font-semibold tracking-tight">
        {value}
      </div>
      {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
    </div>
  );
}
