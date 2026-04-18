import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getCordisProjects } from "@/lib/cordis";
import { Container, Eyebrow, Section } from "@/components/ui/container";
import { ProjectCard } from "./project-card";
import { Button } from "@/components/ui/button";

export async function FeaturedProjects() {
  const allProjects = await getCordisProjects();
  const chips = allProjects.filter((p) => p.programme === "CHIPS");
  const kdt = allProjects.filter((p) => p.programme === "KDT");
  const projects = [...chips, ...kdt].slice(0, 4);
  return (
    <Section className="bg-surface-2/60 border-t border-b border-border">
      <Container>
        <div className="mb-10 text-center">
          <Eyebrow className="justify-center">Featured projects</Eyebrow>
          <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl text-balance">
            From pilot lines to sovereign platforms.
          </h2>
          <div className="section-green-line" />
          <p className="mt-4 mx-auto max-w-2xl text-muted-foreground">
            A selection of flagship actions funded across the Chips for Europe and
            KDT programmes.
          </p>
          <div className="mt-4 flex justify-center">
            <Button variant="outline" asChild>
              <Link href="/projects">
                All {allProjects.length} projects
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {projects.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
