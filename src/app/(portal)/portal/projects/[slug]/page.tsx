import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  Clock,
  FileSpreadsheet,
  MessageSquare,
  Upload,
  Users,
} from "lucide-react";
import { MY_PROJECTS, type Milestone } from "@/data/applications";
import { PortalContainer } from "@/components/portal/portal-container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate, formatEur } from "@/lib/format";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = MY_PROJECTS.find((x) => x.slug === slug);
  return { title: p ? `${p.acronym} workspace` : "Project" };
}

export default async function ProjectWorkspacePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = MY_PROJECTS.find((x) => x.slug === slug);
  if (!project) notFound();

  return (
    <PortalContainer>
      <Link
        href="/portal/projects"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> All projects
      </Link>

      <div className="mt-4 mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="success">Active</Badge>
            <span className="font-mono text-xs text-muted-foreground">{project.grantRef}</span>
            <span className="font-mono text-xs text-muted-foreground">· {project.period}</span>
          </div>
          <div className="mt-3">
            <span className="font-mono text-sm font-semibold text-accent-600">
              {project.acronym}
            </span>
          </div>
          <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight md:text-3xl text-balance">
            {project.name}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Upload className="h-4 w-4" /> Upload deliverable
          </Button>
          <Button>
            <FileSpreadsheet className="h-4 w-4" /> Submit progress report
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <StatBox label="Progress" value={`${project.progressPct}%`} hint="Overall completion" />
        <StatBox
          label="Next report"
          value={formatDate(project.nextReportingDate, { month: "short", day: "numeric" })}
          hint="Period 02 / 06"
        />
        <StatBox
          label="Partners"
          value={project.consortiumSize.toString()}
          hint={`Coord. ${project.coordinator}`}
        />
        <StatBox
          label="Funding"
          value={formatEur(project.fundingEur, { compact: true })}
          hint={`Budget ${formatEur(project.budgetEur, { compact: true })}`}
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section>
          <h2 className="font-display text-lg font-semibold tracking-tight mb-4">
            Milestones
          </h2>
          <ol className="relative space-y-5 border-l border-border pl-8">
            {project.milestones.map((m) => (
              <MilestoneEntry key={m.id} m={m} />
            ))}
          </ol>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-lg font-semibold tracking-tight">
            Reporting & communications
          </h2>
          <div className="rounded-xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-amber/10 text-amber">
                <Clock className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-sm">Reporting period opens 1 May</div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Collect deliverables and technical report input from all partners.
                </p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Inputs received</span>
                <span className="font-medium text-foreground">4 / 7 partners</span>
              </div>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
                <div className="h-full rounded-full bg-amber" style={{ width: "57%" }} />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">Recent messages</h3>
              <Link href="/portal/messages" className="text-xs text-brand hover:underline">
                View all
              </Link>
            </div>
            <ul className="mt-3 space-y-3">
              {[
                { from: "Programme Officer", text: "Review comments on Deliverable D3.2" },
                { from: "Consortium · WP3", text: "Tape-out schedule confirmed" },
                { from: "Partner · IMEC", text: "Pilot line slot allocated for 14–18 July" },
              ].map((m, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <div className="min-w-0">
                    <div className="font-medium">{m.from}</div>
                    <div className="text-xs text-muted-foreground truncate">{m.text}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">Consortium</h3>
              <span className="text-xs text-muted-foreground">
                <Users className="mr-1 inline h-3 w-3" />
                {project.consortiumSize}
              </span>
            </div>
            <Link
              href={`/projects/${project.slug}`}
              className="mt-3 inline-flex items-center gap-1.5 text-xs text-brand hover:underline"
            >
              Public project page
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
        </section>
      </div>
    </PortalContainer>
  );
}

function StatBox({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
      <div className="mt-1.5 font-display text-2xl font-semibold">{value}</div>
      {hint && <div className="mt-0.5 text-xs text-muted-foreground">{hint}</div>}
    </div>
  );
}

function MilestoneEntry({ m }: { m: Milestone }) {
  const done = m.status === "done";
  const active = m.status === "in-progress";
  return (
    <li className="relative">
      <span
        className={
          "absolute -left-[37px] top-1 inline-flex h-4 w-4 items-center justify-center rounded-full border-2 " +
          (done
            ? "border-success bg-success text-white"
            : active
              ? "border-brand bg-background ring-4 ring-brand/15"
              : "border-border bg-background")
        }
      >
        {done && <CheckCircle2 className="h-3 w-3" />}
      </span>
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-xs font-semibold text-accent-600">{m.id}</span>
        <span className="font-display text-base font-semibold">{m.title}</span>
        {active && <Badge variant="brand">In progress</Badge>}
        {m.status === "upcoming" && <Badge variant="outline">Upcoming</Badge>}
        {done && <Badge variant="success">Complete</Badge>}
      </div>
      <div className="mt-1 inline-flex items-center gap-3 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          {formatDate(m.dueDate)}
        </span>
        <span>
          {m.deliverablesDone}/{m.deliverables} deliverables
        </span>
      </div>
      <div className="mt-2 h-1 w-48 overflow-hidden rounded-full bg-surface-2">
        <div
          className={
            "h-full rounded-full " +
            (done ? "bg-success" : active ? "bg-brand" : "bg-border")
          }
          style={{ width: `${Math.round((m.deliverablesDone / m.deliverables) * 100)}%` }}
        />
      </div>
    </li>
  );
}
