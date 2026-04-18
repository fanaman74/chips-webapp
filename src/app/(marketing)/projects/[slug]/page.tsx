import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, ExternalLink, Users } from "lucide-react";
import { getCordisProjects, getCordisProject } from "@/lib/cordis";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/container";
import { formatDate, formatDateRange, formatEur } from "@/lib/format";

export async function generateStaticParams() {
  const projects = await getCordisProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await getCordisProject(slug);
  return { title: p ? `${p.acronym} — ${p.name}` : "Project" };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getCordisProject(slug);
  if (!project) notFound();

  return (
    <>
      <section className="border-b border-border bg-surface-2/40">
        <Container className="py-10 md:py-14">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to all projects
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <Badge variant="brand">{project.programme}</Badge>
            <Badge variant={project.status === "active" ? "success" : "default"}>
              {project.status}
            </Badge>
          </div>
          <div className="mt-4">
            <span className="font-mono text-sm font-semibold text-accent-600">
              {project.acronym}
            </span>
          </div>
          <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight md:text-5xl text-balance max-w-4xl">
            {project.name}
          </h1>
          <p className="mt-4 max-w-3xl text-muted-foreground md:text-lg">
            {project.summary}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {project.website && (
              <Button variant="outline" asChild>
                <a href={project.website} target="_blank" rel="noopener noreferrer">
                  Project website
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            )}
            <Button variant="outline" asChild>
              <Link href="/calls">Similar open calls</Link>
            </Button>
          </div>
        </Container>
      </section>

      <Section>
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
            <div className="space-y-10">
              <div>
                <h2 className="font-display text-2xl font-semibold tracking-tight mb-4">
                  About the project
                </h2>
                <p className="text-pretty leading-relaxed text-foreground/85 whitespace-pre-line">
                  {project.description}
                </p>
              </div>

              {project.consortium.length > 0 && (
                <div>
                  <h2 className="font-display text-2xl font-semibold tracking-tight mb-4">
                    Consortium
                  </h2>
                  <div className="overflow-hidden rounded-xl border border-border bg-card">
                    <table className="w-full text-sm">
                      <thead className="bg-surface-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                        <tr>
                          <th className="px-4 py-3 text-left">Organisation</th>
                          <th className="px-4 py-3 text-left">Country</th>
                        </tr>
                      </thead>
                      <tbody>
                        {project.consortium.map((c, i) => (
                          <tr key={`${c.name}-${i}`} className={i > 0 ? "border-t border-border" : ""}>
                            <td className="px-4 py-3 font-medium">
                              {c.name}
                              {c.name === project.coordinator.name && (
                                <Badge variant="brand" className="ml-2">
                                  Coordinator
                                </Badge>
                              )}
                            </td>
                            <td className="px-4 py-3 font-mono text-xs">{c.country}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {project.consortiumSize > project.consortium.length && (
                      <div className="border-t border-border px-4 py-3 text-xs text-muted-foreground">
                        + {project.consortiumSize - project.consortium.length} additional partners
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <aside className="space-y-4">
              <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                <h3 className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  At a glance
                </h3>
                <dl className="mt-4 space-y-4 text-sm">
                  {project.budgetEur > 0 && (
                    <div>
                      <dt className="text-muted-foreground">Total budget</dt>
                      <dd className="mt-0.5 font-display text-xl font-semibold">
                        {formatEur(project.budgetEur)}
                      </dd>
                    </div>
                  )}
                  {project.fundingEur > 0 && (
                    <div>
                      <dt className="text-muted-foreground">EC funding</dt>
                      <dd className="mt-0.5 font-display text-xl font-semibold text-brand">
                        {formatEur(project.fundingEur)}
                      </dd>
                      {project.budgetEur > 0 && (
                        <dd className="mt-0.5 text-xs text-muted-foreground">
                          {Math.round((project.fundingEur / project.budgetEur) * 100)}% co-funding rate
                        </dd>
                      )}
                    </div>
                  )}
                  {project.startDate && (
                    <div className="border-t border-border pt-4">
                      <dt className="text-muted-foreground inline-flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" /> Timeline
                      </dt>
                      <dd className="mt-0.5 font-medium">
                        {formatDateRange(project.startDate, project.endDate)}
                      </dd>
                    </div>
                  )}
                  {project.consortiumSize > 0 && (
                    <div>
                      <dt className="text-muted-foreground inline-flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5" /> Consortium size
                      </dt>
                      <dd className="mt-0.5 font-medium">{project.consortiumSize} partners</dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-muted-foreground">Coordinator</dt>
                    <dd className="mt-0.5 font-medium">
                      {project.coordinator.name}{" "}
                      {project.coordinator.country && (
                        <span className="text-muted-foreground">({project.coordinator.country})</span>
                      )}
                    </dd>
                  </div>
                  {project.startDate && (
                    <div>
                      <dt className="text-muted-foreground">Start date</dt>
                      <dd className="mt-0.5 font-medium">{formatDate(project.startDate)}</dd>
                    </div>
                  )}
                </dl>
              </div>
            </aside>
          </div>
        </Container>
      </Section>
    </>
  );
}
