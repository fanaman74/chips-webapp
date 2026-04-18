import { getCordisProjects } from "@/lib/cordis";
import { PageHero } from "@/components/marketing/page-hero";
import { ProjectsExplorer } from "@/components/marketing/projects-explorer";
import { Container, Section } from "@/components/ui/container";

export const metadata = { title: "Projects" };

export default async function ProjectsPage() {
  const projects = await getCordisProjects();
  return (
    <>
      <PageHero
        eyebrow="Projects"
        title={`${projects.length} projects shaping Europe's chip industry.`}
        description="Explore every project funded by the Chips JU and its predecessor KDT JU — filter by status, country or programme."
      />
      <Section className="pt-14">
        <Container>
          <ProjectsExplorer projects={projects} />
        </Container>
      </Section>
    </>
  );
}
