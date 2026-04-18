import Link from "next/link";
import { ArrowRight, ChevronRight, PlayCircle } from "lucide-react";
import { EuropeMapCanvas } from "./europe-map-canvas";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { StatsRow } from "./stats-row";
import { getCordisProjects, deriveCordisStats } from "@/lib/cordis";

export async function Hero() {
  const projects = await getCordisProjects();
  const stats = deriveCordisStats(projects);

  return (
    <section className="relative overflow-hidden pt-10 pb-16 md:pt-20 md:pb-24">
      <EuropeMapCanvas />
      <Container className="relative">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-1/80 px-3 py-1 text-xs font-medium text-foreground/80 shadow-sm backdrop-blur">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-success" />
            2026 Work Programme adopted — €2.4B in calls opening
            <Link href="/news/work-programme-2026-adopted" className="inline-flex items-center text-brand hover:underline">
              Read <ChevronRight className="h-3 w-3" />
            </Link>
          </div>

          <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-balance sm:text-5xl md:text-6xl lg:text-7xl">
            Europe&rsquo;s chip ecosystem,
            <br className="hidden sm:inline" />{" "}
            tracked by AI.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-balance text-base leading-relaxed text-muted-foreground md:text-lg">
            An independent AI-powered platform aggregating live projects, funding
            calls and policy developments from the Chips Joint Undertaking and
            CORDIS — updated daily, so you never miss what matters.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/projects">
                Explore projects
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/calls">
                View open calls
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="mt-16 md:mt-20">
          <StatsRow stats={stats} />
        </div>
      </Container>
    </section>
  );
}
