import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { PageHero } from "@/components/marketing/page-hero";
import { Container, Section } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Chips for Europe Initiative" };

const PILLARS = [
  {
    title: "Pilot lines",
    description:
      "Open-access pilot lines spanning FD-SOI, wide bandgap, heterogeneous integration, photonics and leading-edge logic.",
    metric: "€3.3B",
    metricLabel: "Capex committed",
  },
  {
    title: "Design platforms",
    description:
      "Cloud-based EDA, open PDKs and shuttle tape-outs to lower the barrier for European SMEs and academia.",
    metric: "€240M",
    metricLabel: "For design infrastructure",
  },
  {
    title: "Competence centres",
    description:
      "A network of national centres offering services, training and access to pilot line capacity.",
    metric: "14",
    metricLabel: "Centres operational",
  },
  {
    title: "Quantum & neuromorphic",
    description:
      "Dedicated budget lines for frontier technologies — integrated quantum and brain-inspired computing.",
    metric: "€620M",
    metricLabel: "Frontier envelope",
  },
];

export default function ChipsForEuropePage() {
  return (
    <>
      <PageHero
        eyebrow="Chips for Europe Initiative"
        title="The industrial pillar of Europe's chips strategy."
        description="Pilot lines, design infrastructure, competence centres and frontier technology — the public capacity that lets European industry stay competitive at every node."
      >
        <div className="flex flex-wrap gap-3">
          <Badge variant="brand">Programme budget €6.2B</Badge>
          <Badge variant="outline">42 actions · 29 states</Badge>
        </div>
      </PageHero>

      <Section>
        <Container>
          <div className="grid gap-5 md:grid-cols-2">
            {PILLARS.map((p) => (
              <div
                key={p.title}
                className="rounded-xl border border-border bg-card p-7 shadow-card"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-display text-xl font-semibold tracking-tight">
                      {p.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {p.description}
                    </p>
                  </div>
                  <div className="shrink-0 rounded-lg border border-border bg-surface-2 px-3 py-2 text-right">
                    <div className="font-display text-lg font-semibold">{p.metric}</div>
                    <div className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                      {p.metricLabel}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <section className="border-t border-border bg-surface-2/60">
        <Container className="py-16">
          <h2 className="font-display text-2xl font-semibold tracking-tight md:text-3xl text-balance max-w-3xl">
            Principles behind the initiative
          </h2>
          <ul className="mt-8 grid gap-4 md:grid-cols-2">
            {[
              "Open access to any eligible participant — industry, academia, SMEs, startups.",
              "Non-duplicative with national capacity: we scale what already exists.",
              "Technology-neutral between advanced-node and more-than-Moore.",
              "Transparent pricing for shuttle runs, with SME and academic rebates.",
              "Mandatory IP licensing terms that respect both commercial and open-source paths.",
              "Full alignment with the European Chips Act and complementary national plans.",
            ].map((p) => (
              <li
                key={p}
                className="flex items-start gap-3 rounded-lg border border-border bg-card p-4"
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent-600" />
                <span className="text-sm">{p}</span>
              </li>
            ))}
          </ul>

          <div className="mt-10">
            <Button asChild>
              <Link href="/calls">
                Open calls under this programme
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
