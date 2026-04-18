import { PageHero } from "@/components/marketing/page-hero";
import { Container, Section } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Governance" };

const BOARDS = [
  {
    name: "Governing Board",
    role: "Final authority on Work Programme, budget and strategic direction.",
    composition: "European Commission + 26 member states + 3 industry associations",
  },
  {
    name: "Public Authorities Board",
    role: "Approves national co-funding commitments and prioritises calls.",
    composition: "European Commission + member state representatives",
  },
  {
    name: "Private Members Board",
    role: "Represents industry and research interests — advises on Work Programme.",
    composition: "AENEAS · EPoSS · INSIDE industry associations",
  },
];

const OFFICE = [
  { role: "Executive Director", name: "Andreas Weber", org: "Chips JU" },
  { role: "Head of Programmes", name: "Dr. Miriam Haas", org: "Chips JU" },
  { role: "Head of Pilot Lines", name: "Ing. Marco Russo", org: "Chips JU" },
  { role: "Head of Finance", name: "Sofia Ricci", org: "Chips JU" },
];

export default function GovernancePage() {
  return (
    <>
      <PageHero
        eyebrow="Governance"
        title="A tripartite governance model."
        description="The Chips JU is governed by the Commission, participating states and industry acting in partnership. Decisions on strategy, Work Programme and budget require consensus across all three."
      />

      <Section>
        <Container>
          <h2 className="font-display text-2xl font-semibold tracking-tight">Boards</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {BOARDS.map((b) => (
              <div key={b.name} className="rounded-xl border border-border bg-card p-6 shadow-card">
                <Badge variant="brand">{b.name.split(" ")[0]}</Badge>
                <h3 className="mt-3 font-display text-lg font-semibold tracking-tight">
                  {b.name}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{b.role}</p>
                <div className="mt-4 border-t border-border pt-3 text-xs text-muted-foreground">
                  {b.composition}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <section className="border-t border-border bg-surface-2/60">
        <Container className="py-16">
          <h2 className="font-display text-2xl font-semibold tracking-tight">Programme Office</h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            The Chips JU Programme Office — headquartered in Brussels — runs the
            day-to-day: call management, evaluation coordination, grant management,
            reporting and external communications.
          </p>
          <div className="mt-8 overflow-hidden rounded-xl border border-border bg-card shadow-card">
            {OFFICE.map((p, i) => (
              <div
                key={p.name}
                className={`grid grid-cols-1 gap-2 px-6 py-5 md:grid-cols-[1fr_1fr_1fr] md:items-center ${
                  i > 0 ? "border-t border-border" : ""
                }`}
              >
                <div className="font-display text-base font-semibold">{p.name}</div>
                <div className="text-sm text-muted-foreground">{p.role}</div>
                <div className="text-sm font-mono text-muted-foreground">{p.org}</div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
