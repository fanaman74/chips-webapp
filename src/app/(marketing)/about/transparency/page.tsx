import { PageHero } from "@/components/marketing/page-hero";
import { Container, Section } from "@/components/ui/container";
import { formatEur } from "@/lib/format";
import { Download } from "lucide-react";

export const metadata = { title: "Financial transparency" };

const DOCS = [
  { year: 2025, title: "Annual Activity Report 2025", size: "4.2 MB" },
  { year: 2024, title: "Annual Accounts 2024", size: "1.1 MB" },
  { year: 2024, title: "Annual Activity Report 2024", size: "3.8 MB" },
  { year: 2024, title: "Court of Auditors opinion 2024", size: "420 KB" },
  { year: 2023, title: "Founding Annual Report", size: "2.9 MB" },
];

export default function TransparencyPage() {
  return (
    <>
      <PageHero
        eyebrow="Financial transparency"
        title="Full transparency on every euro spent."
        description="All Chips JU accounts are published annually and audited by the European Court of Auditors. Grant beneficiaries are listed in the EU Financial Transparency System."
      />

      <Section>
        <Container>
          <div className="grid gap-5 md:grid-cols-3">
            {[
              { label: "2026 commitment appropriations", value: formatEur(3_100_000_000, { compact: true }) },
              { label: "Cumulative spent", value: formatEur(5_400_000_000, { compact: true }) },
              { label: "Remaining envelope", value: formatEur(6_900_000_000, { compact: true }) },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-border bg-card p-6 shadow-card">
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  {s.label}
                </div>
                <div className="mt-2 font-display text-3xl font-semibold">{s.value}</div>
              </div>
            ))}
          </div>

          <h2 className="mt-16 font-display text-2xl font-semibold tracking-tight">
            Published documents
          </h2>
          <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card shadow-card">
            {DOCS.map((d, i) => (
              <a
                key={d.title}
                href="#"
                className={`flex items-center justify-between gap-4 px-6 py-4 text-sm transition-colors hover:bg-surface-2 ${
                  i > 0 ? "border-t border-border" : ""
                }`}
              >
                <div>
                  <div className="font-medium">{d.title}</div>
                  <div className="text-xs text-muted-foreground">PDF · {d.size}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-muted-foreground">{d.year}</span>
                  <Download className="h-4 w-4 text-muted-foreground" />
                </div>
              </a>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
