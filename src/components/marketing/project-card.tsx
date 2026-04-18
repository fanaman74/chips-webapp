import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/cordis";
import { Badge } from "@/components/ui/badge";
import { formatEur } from "@/lib/format";
import { colorFor, type ColorKey } from "@/lib/colors";
import { cn } from "@/lib/utils";

const PROGRAMME_COLOR: Record<Project["programme"], ColorKey> = {
  CHIPS: "brand",
  KDT: "fuchsia",
};

export function ProjectCard({ project }: { project: Project }) {
  const color = colorFor(PROGRAMME_COLOR[project.programme]);
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card p-6 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-elevated"
    >
      <span aria-hidden className={cn("absolute inset-x-0 top-0 h-1", color.dot)} />
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-gradient-to-br opacity-50 blur-2xl transition-opacity group-hover:opacity-80",
          color.gradient,
        )}
      />

      <div className="relative flex items-start justify-between gap-3">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
            color.chip,
          )}
        >
          <span className={cn("h-1.5 w-1.5 rounded-full", color.dot)} />
          {project.programme}
        </span>
        <Badge variant={project.status === "active" ? "success" : "outline"}>
          {project.status}
        </Badge>
      </div>

      <div className="relative mt-4">
        <span className={cn("font-mono text-xs font-semibold", color.text)}>
          {project.acronym}
        </span>
      </div>
      <h3 className="relative mt-1 font-display text-lg font-semibold leading-snug tracking-tight">
        {project.name}
      </h3>
      <p className="relative mt-3 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-3">
        {project.summary}
      </p>

      <div className="relative mt-6 grid grid-cols-3 gap-4 border-t border-border pt-4 text-xs">
        <div>
          <div className="font-mono text-[10px] uppercase text-muted-foreground">Funding</div>
          <div className="mt-0.5 font-display text-sm font-semibold">
            {project.fundingEur ? formatEur(project.fundingEur, { compact: true }) : "—"}
          </div>
        </div>
        <div>
          <div className="font-mono text-[10px] uppercase text-muted-foreground">Partners</div>
          <div className="mt-0.5 font-display text-sm font-semibold">
            {project.consortiumSize || "—"}
          </div>
        </div>
        <div>
          <div className="font-mono text-[10px] uppercase text-muted-foreground">Lead</div>
          <div className="mt-0.5 font-display text-sm font-semibold truncate">
            {project.coordinator.country || "—"}
          </div>
        </div>
      </div>

      <div className="relative mt-5 flex items-center justify-between text-sm text-foreground/60 transition group-hover:text-brand">
        <span>View project</span>
        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>
    </Link>
  );
}
