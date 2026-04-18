import { PageHero } from "@/components/marketing/page-hero";
import { Container, Section } from "@/components/ui/container";

export const metadata = { title: "History" };

const MILESTONES = [
  { year: "2008", title: "ARTEMIS & ENIAC Joint Undertakings", body: "EU public-private research partnerships launched for embedded systems and nanoelectronics." },
  { year: "2014", title: "ECSEL Joint Undertaking", body: "Merger of ARTEMIS and ENIAC into the Electronic Components and Systems for European Leadership programme." },
  { year: "2021", title: "KDT Joint Undertaking", body: "Key Digital Technologies JU established under Horizon Europe — €1.8B over 2021–2027." },
  { year: "2022", title: "European Chips Act proposed", body: "The European Commission proposes a comprehensive framework to double EU semiconductor market share by 2030." },
  { year: "2023", title: "Chips JU established", body: "Council Regulation (EU) 2023/1782 establishes the Chips Joint Undertaking, expanding KDT's remit to include pilot lines and design platforms." },
  { year: "2024", title: "First pilot line calls", body: "Sub-2nm and heterogeneous integration pilot line calls open. First grant agreements signed." },
  { year: "2026", title: "2026 Work Programme adopted", body: "€2.4B in new calls, including the sub-2nm pilot line ramp-up phase." },
];

export default function HistoryPage() {
  return (
    <>
      <PageHero
        eyebrow="History"
        title="From ARTEMIS to Chips JU."
        description="Nearly two decades of European public-private partnership in semiconductors — continuously evolving to meet the strategic needs of the continent."
      />

      <Section>
        <Container className="max-w-3xl">
          <ol className="relative space-y-10 border-l border-border pl-10">
            {MILESTONES.map((m) => (
              <li key={m.year} className="relative">
                <span className="absolute -left-[47px] top-0 inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-brand bg-background font-mono text-[10px] font-semibold text-brand">
                  {m.year.slice(2)}
                </span>
                <div className="font-mono text-xs text-muted-foreground">{m.year}</div>
                <h3 className="mt-1 font-display text-xl font-semibold tracking-tight">
                  {m.title}
                </h3>
                <p className="mt-2 text-pretty leading-relaxed text-muted-foreground">
                  {m.body}
                </p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>
    </>
  );
}
