"use client";

import * as React from "react";
import { Search } from "lucide-react";
import Fuse from "fuse.js";
import type { Project } from "@/lib/cordis";
import { ProjectCard } from "./project-card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { formatEur } from "@/lib/format";

type Status = "all" | Project["status"];
type Programme = "all" | Project["programme"];

export function ProjectsExplorer({ projects }: { projects: Project[] }) {
  const [query, setQuery] = React.useState("");
  const [status, setStatus] = React.useState<Status>("all");
  const [programme, setProgramme] = React.useState<Programme>("all");
  const [country, setCountry] = React.useState("all");

  const countries = React.useMemo(() => {
    const set = new Set(projects.map((p) => p.coordinator.country).filter(Boolean));
    return Array.from(set).sort();
  }, [projects]);

  const fuse = React.useMemo(
    () =>
      new Fuse(projects, {
        keys: ["name", "acronym", "summary", "coordinator.name"],
        threshold: 0.35,
        ignoreLocation: true,
      }),
    [projects],
  );

  const filtered = React.useMemo(() => {
    let base: Project[] = query
      ? fuse.search(query).map((r) => r.item)
      : projects;
    if (status !== "all") base = base.filter((p) => p.status === status);
    if (programme !== "all") base = base.filter((p) => p.programme === programme);
    if (country !== "all") base = base.filter((p) => p.coordinator.country === country);
    return base;
  }, [fuse, query, projects, status, programme, country]);

  const totalFunding = filtered.reduce((sum, p) => sum + p.fundingEur, 0);

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
        <div>
          <label className="mb-2 flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            <Search className="h-3 w-3" /> Search
          </label>
          <Input
            placeholder="Project, acronym, coordinator…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div>
          <label className="mb-2 block font-mono text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Status
          </label>
          <Select value={status} onChange={(e) => setStatus(e.target.value as Status)}>
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="upcoming">Upcoming</option>
          </Select>
        </div>

        <div>
          <label className="mb-2 block font-mono text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Programme
          </label>
          <Select value={programme} onChange={(e) => setProgramme(e.target.value as Programme)}>
            <option value="all">All programmes</option>
            <option value="CHIPS">CHIPS JU</option>
            <option value="KDT">KDT JU (predecessor)</option>
          </Select>
        </div>

        <div>
          <label className="mb-2 block font-mono text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Coordinator country
          </label>
          <Select value={country} onChange={(e) => setCountry(e.target.value)}>
            <option value="all">All countries</option>
            {countries.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </Select>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setQuery("");
            setStatus("all");
            setProgramme("all");
            setCountry("all");
          }}
        >
          Reset filters
        </Button>
      </aside>

      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-3 justify-between rounded-lg border border-border bg-surface-2/60 p-4 text-sm">
          <div className="flex items-center gap-3">
            <Badge variant="brand">{filtered.length}</Badge>
            <span>projects matching your filters</span>
          </div>
          {totalFunding > 0 && (
            <div className="text-muted-foreground">
              Total EC funding:{" "}
              <span className="font-display font-semibold text-foreground">
                {formatEur(totalFunding, { compact: true })}
              </span>
            </div>
          )}
        </div>

        {filtered.length ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border bg-surface-2 p-12 text-center">
            <p className="font-display text-lg font-semibold">No projects match</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Try widening your filters or clearing the search query.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
