import { Download, FileText } from "lucide-react";
import { PageHero } from "@/components/marketing/page-hero";
import { Container, Section } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Documents" };

const DOCS = [
  { group: "Work Programmes", items: [
    { title: "Multiannual Work Programme 2023–2027", year: 2023, size: "6.2 MB" },
    { title: "Work Programme 2026", year: 2026, size: "4.4 MB" },
    { title: "Work Programme 2025", year: 2025, size: "4.1 MB" },
    { title: "Work Programme 2024", year: 2024, size: "3.9 MB" },
  ]},
  { group: "Call templates", items: [
    { title: "RIA proposal template 2026", year: 2026, size: "180 KB" },
    { title: "IA proposal template 2026", year: 2026, size: "180 KB" },
    { title: "Pilot line proposal template 2026", year: 2026, size: "220 KB" },
    { title: "Evaluation criteria — general", year: 2026, size: "90 KB" },
  ]},
  { group: "Annual reports", items: [
    { title: "Annual Activity Report 2025", year: 2025, size: "4.2 MB" },
    { title: "Annual Activity Report 2024", year: 2024, size: "3.8 MB" },
    { title: "Annual Accounts 2024", year: 2024, size: "1.1 MB" },
  ]},
  { group: "Legal & governance", items: [
    { title: "Council Regulation (EU) 2023/1782", year: 2023, size: "480 KB" },
    { title: "Financial Rules of the Chips JU", year: 2023, size: "620 KB" },
    { title: "Code of Conduct for members", year: 2024, size: "210 KB" },
  ]},
];

export default function DocumentsPage() {
  return (
    <>
      <PageHero
        eyebrow="Documents"
        title="Work programmes, templates, reports and legal texts."
        description="The authoritative document library for applicants, partners and stakeholders. All texts are freely available and published in English."
      />

      <Section>
        <Container className="space-y-12">
          {DOCS.map((group) => (
            <section key={group.group}>
              <h2 className="font-display text-xl font-semibold tracking-tight mb-4">
                {group.group}
              </h2>
              <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
                {group.items.map((d, i) => (
                  <a
                    key={d.title}
                    href="#"
                    className={`flex items-center justify-between gap-4 px-6 py-4 text-sm transition-colors hover:bg-surface-2 ${
                      i > 0 ? "border-t border-border" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{d.title}</div>
                        <div className="text-xs text-muted-foreground">
                          PDF · {d.size}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{d.year}</Badge>
                      <Download className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </a>
                ))}
              </div>
            </section>
          ))}
        </Container>
      </Section>
    </>
  );
}
