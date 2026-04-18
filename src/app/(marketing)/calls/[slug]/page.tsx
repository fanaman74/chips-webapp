import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  Users,
} from "lucide-react";
import { CALLS, getCall } from "@/data/calls";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/container";
import { formatDate, formatEur, relativeDeadline } from "@/lib/format";

export function generateStaticParams() {
  return CALLS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const call = getCall(slug);
  return { title: call ? `${call.ref} — ${call.title}` : "Call" };
}

export default async function CallDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const call = getCall(slug);
  if (!call) notFound();

  const isOpen = call.status === "open";

  return (
    <>
      <section className="border-b border-border bg-surface-2/40">
        <Container className="py-10 md:py-14">
          <Link
            href="/calls"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            All calls
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <Badge variant="brand">{call.programme}</Badge>
            <Badge variant="outline">{call.instrument}</Badge>
            <Badge variant={isOpen ? "success" : call.status === "upcoming" ? "amber" : "default"}>
              {call.status}
            </Badge>
            <span className="font-mono text-xs text-muted-foreground">{call.ref}</span>
          </div>
          <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight md:text-5xl text-balance max-w-4xl">
            {call.title}
          </h1>
          <p className="mt-4 max-w-3xl text-muted-foreground md:text-lg">{call.summary}</p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 md:grid-cols-4">
            <StatPill label="Budget" value={formatEur(call.budgetEur, { compact: true })} icon={<FileText className="h-4 w-4" />} />
            <StatPill
              label="Deadline"
              value={formatDate(call.deadline)}
              hint={isOpen ? relativeDeadline(call.deadline) : undefined}
              icon={<Calendar className="h-4 w-4" />}
            />
            <StatPill
              label="Expected projects"
              value={`~${call.expectedProjects}`}
              icon={<Users className="h-4 w-4" />}
            />
            <StatPill
              label="TRL range"
              value={`${call.trlRange[0]}–${call.trlRange[1]}`}
              icon={<Clock className="h-4 w-4" />}
            />
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" disabled={!isOpen} asChild={isOpen}>
              {isOpen ? (
                <Link href="/portal/applications/new">
                  Start application
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ) : (
                <span>{call.status === "upcoming" ? "Opens soon" : "Call closed"}</span>
              )}
            </Button>
            <Button size="lg" variant="outline">
              <Download className="h-4 w-4" />
              Call document (PDF)
            </Button>
          </div>
        </Container>
      </section>

      <Section>
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
            <div className="space-y-10">
              <div>
                <h2 className="font-display text-2xl font-semibold tracking-tight mb-4">
                  Topics
                </h2>
                <div className="flex flex-wrap gap-2">
                  {call.topics.map((t) => (
                    <Badge key={t} variant="accent">
                      {t}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="font-display text-2xl font-semibold tracking-tight mb-4">
                  Eligibility
                </h2>
                <ul className="space-y-2">
                  {call.eligibility.map((e) => (
                    <li
                      key={e}
                      className="flex items-start gap-3 rounded-lg border border-border bg-card p-4"
                    >
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                      <span className="text-sm text-foreground/90">{e}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="font-display text-2xl font-semibold tracking-tight mb-4">
                  Evaluation timeline
                </h2>
                <ol className="relative space-y-6 border-l border-border pl-8">
                  <TimelineEntry
                    label="Call opens"
                    date={formatDate(call.openDate)}
                    done
                  />
                  <TimelineEntry
                    label="Submission deadline"
                    date={formatDate(call.deadline)}
                    active={isOpen}
                  />
                  <TimelineEntry
                    label="Evaluation"
                    date="Jun – Aug 2026"
                  />
                  <TimelineEntry
                    label="Grant agreement signatures"
                    date="Q4 2026"
                  />
                  <TimelineEntry label="Project start" date="Q1 2027" />
                </ol>
              </div>
            </div>

            <aside className="space-y-4">
              <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                <h3 className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Contact
                </h3>
                <div className="mt-4 space-y-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Programme officer</div>
                    <div className="font-medium">Dr. Miriam Haas</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Email</div>
                    <a
                      href="mailto:calls@chips-ju.europa.eu"
                      className="text-brand hover:underline"
                    >
                      calls@chips-ju.europa.eu
                    </a>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Info Day</div>
                    <Link
                      href="/events/ecs-info-day-spring-2026"
                      className="text-brand hover:underline"
                    >
                      ECS Spring 2026 Info Day →
                    </Link>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-surface-2 p-6">
                <h3 className="font-display text-sm font-semibold">
                  Need help applying?
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Our network of 14 competence centres provides free application support
                  to SMEs and new entrants.
                </p>
                <Button variant="outline" size="sm" className="mt-4" asChild>
                  <Link href="/participate">Get support</Link>
                </Button>
              </div>
            </aside>
          </div>
        </Container>
      </Section>
    </>
  );
}

function StatPill({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: string;
  hint?: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {icon} {label}
      </div>
      <div className="mt-1 font-display text-xl font-semibold">{value}</div>
      {hint && <div className="mt-0.5 text-xs text-amber">{hint}</div>}
    </div>
  );
}

function TimelineEntry({
  label,
  date,
  done,
  active,
}: {
  label: string;
  date: string;
  done?: boolean;
  active?: boolean;
}) {
  return (
    <li className="relative">
      <span
        className={
          "absolute -left-[37px] top-1 inline-flex h-4 w-4 items-center justify-center rounded-full border-2 " +
          (done
            ? "border-success bg-success"
            : active
              ? "border-brand bg-background ring-4 ring-brand/15"
              : "border-border bg-background")
        }
      />
      <div className={active ? "font-semibold" : "text-foreground/90"}>{label}</div>
      <div className="text-sm text-muted-foreground">{date}</div>
    </li>
  );
}
