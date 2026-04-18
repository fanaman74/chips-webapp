import { PageHero } from "@/components/marketing/page-hero";
import { Container, Section } from "@/components/ui/container";

export const metadata = { title: "Vision & mission" };

const OBJECTIVES = [
  { n: "01", t: "Double Europe's global semiconductor market share", d: "From 10% to 20% by 2030." },
  { n: "02", t: "Build open-access pilot infrastructure", d: "From advanced logic to wide bandgap and photonics." },
  { n: "03", t: "Strengthen Europe's design ecosystem", d: "Competence centres, open PDKs, SME access." },
  { n: "04", t: "Secure sovereignty-critical applications", d: "Automotive, industrial, health, defence, energy." },
  { n: "05", t: "Lead on sustainability", d: "PFAS-free chemistry, closed-loop water, renewable energy." },
];

export default function VisionPage() {
  return (
    <>
      <PageHero
        eyebrow="Vision & mission"
        title="European leadership in semiconductors by 2030."
        description="Our mission is to double Europe's share of global semiconductor production and design capability through sustained public-private investment in research, pilot infrastructure and industrial scale-up."
      />

      <Section>
        <Container className="max-w-3xl">
          <p className="text-pretty text-lg leading-relaxed text-foreground/90">
            Semiconductors are the foundation of the digital and green transitions.
            Europe&rsquo;s ability to shape its own future — in automotive, energy, health,
            defence and artificial intelligence — depends on having a deep, resilient and
            sustainable semiconductor base at home.
          </p>
          <p className="mt-5 text-pretty leading-relaxed text-muted-foreground">
            The Chips Joint Undertaking was established in 2023 to implement the research
            and industrial pillars of the European Chips Act. We combine EU funds,
            national co-funding and private investment to build pilot infrastructure,
            fund collaborative research, and open European semiconductor capability to
            every eligible participant — from startups to multinationals.
          </p>
        </Container>
      </Section>

      <section className="border-t border-border bg-surface-2/60">
        <Container className="py-16">
          <h2 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
            Five strategic objectives
          </h2>
          <div className="mt-8 space-y-3">
            {OBJECTIVES.map((o) => (
              <div
                key={o.n}
                className="grid gap-2 rounded-xl border border-border bg-card p-6 md:grid-cols-[80px_1fr_2fr] md:items-baseline shadow-card"
              >
                <div className="font-mono text-sm font-semibold text-accent-600">{o.n}</div>
                <div className="font-display text-lg font-semibold tracking-tight">{o.t}</div>
                <div className="text-muted-foreground">{o.d}</div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
