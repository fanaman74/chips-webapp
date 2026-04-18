import Link from "next/link";
import { ArrowRight, Cpu, Factory, FlaskConical } from "lucide-react";
import { PROGRAMS } from "@/data/programs";
import { PageHero } from "@/components/marketing/page-hero";
import { Container, Section } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatEur } from "@/lib/format";

export const metadata = { title: "Programmes" };

const ICONS = { cpu: Cpu, flask: FlaskConical, factory: Factory };

export default function ProgrammesPage() {
  return (
    <>
      <PageHero
        eyebrow="Programmes"
        title="Three programmes, one coherent strategy."
        description="Our work is structured around three pillars — pilot lines, research and innovation calls, and open-access infrastructure. Together they span the full semiconductor value chain."
      />

      <Section>
        <Container className="space-y-12">
          {PROGRAMS.map((p, i) => {
            const Icon = ICONS[p.icon];
            return (
              <article
                key={p.slug}
                className="grid gap-8 rounded-2xl border border-border bg-card p-8 md:p-12 shadow-card md:grid-cols-[1fr_320px]"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                      Pillar {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight md:text-4xl text-balance">
                    {p.name}
                  </h2>
                  <p className="mt-2 text-lg font-medium text-accent-600">{p.tagline}</p>
                  <p className="mt-5 max-w-2xl text-pretty text-foreground/85">{p.summary}</p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {p.focus.map((f) => (
                      <Badge key={f} variant="outline">
                        {f}
                      </Badge>
                    ))}
                  </div>

                  <div className="mt-8">
                    <Button variant="outline" asChild>
                      <Link href={p.href}>
                        Learn more
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>

                <aside className="rounded-xl border border-border bg-surface-2 p-6">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    Programme budget
                  </div>
                  <div className="mt-2 font-display text-3xl font-semibold">
                    {formatEur(p.budgetEur, { compact: true })}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    2023–2027 envelope
                  </div>

                  <div className="mt-6 space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Active projects</span>
                      <span className="font-display font-semibold">
                        {[112, 154, 46][i]}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Countries</span>
                      <span className="font-display font-semibold">{[27, 29, 14][i]}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Open calls</span>
                      <span className="font-display font-semibold">{[2, 3, 1][i]}</span>
                    </div>
                  </div>
                </aside>
              </article>
            );
          })}
        </Container>
      </Section>
    </>
  );
}
