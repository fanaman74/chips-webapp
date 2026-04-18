import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/marketing/page-hero";
import { Container, Section } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export const metadata = { title: "About" };

const SECTIONS = [
  { href: "/about/vision", label: "Vision & mission", text: "Our strategic objectives for the 2023–2027 programme period." },
  { href: "/about/governance", label: "Governance", text: "Governing Board, Public Authorities Board and Programme Office." },
  { href: "/about/members", label: "Members", text: "Participating states, associated countries and industry members." },
  { href: "/about/history", label: "History", text: "From ARTEMIS and ENIAC through ECSEL to Chips JU." },
  { href: "/about/transparency", label: "Transparency", text: "Budgets, audits, ethics, procurement." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Chips JU"
        title="A public-private partnership for Europe's chip industry."
        description="The Chips Joint Undertaking is a body of the European Union established under Council Regulation (EU) 2023/1782. It implements the research and industrial pillars of the European Chips Act."
      />

      <Section>
        <Container>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {SECTIONS.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="group rounded-xl border border-border bg-card p-7 shadow-card transition-all hover:shadow-elevated hover:-translate-y-0.5"
              >
                <h3 className="font-display text-lg font-semibold tracking-tight group-hover:text-brand transition-colors">
                  {s.label}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm text-foreground/60 group-hover:text-brand">
                  Learn more <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-16 rounded-2xl border border-border bg-card p-8 md:p-12 shadow-card">
            <div className="grid gap-8 md:grid-cols-2 md:items-center">
              <div>
                <h2 className="font-display text-2xl font-semibold tracking-tight md:text-3xl text-balance">
                  Founded in 2023. Funded through 2033.
                </h2>
                <p className="mt-4 text-muted-foreground text-pretty">
                  Chips JU succeeds the Key Digital Technologies Joint Undertaking and
                  implements the Chips for Europe Initiative alongside the ECS R&amp;I
                  programme under a €12.3 billion envelope.
                </p>
                <div className="mt-6">
                  <Button variant="outline" asChild>
                    <Link href="/about/history">
                      Read our history
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
              <dl className="grid grid-cols-2 gap-6 md:gap-8">
                <Stat label="Total envelope" value="€12.3B" />
                <Stat label="Member states" value="26" />
                <Stat label="Associated" value="3" />
                <Stat label="Industry members" value="350+" />
              </dl>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface-2 p-4">
      <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 font-display text-2xl font-semibold">{value}</div>
    </div>
  );
}
