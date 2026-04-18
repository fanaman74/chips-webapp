import { MEMBERS, INDUSTRY_MEMBERS } from "@/data/members";
import { PageHero } from "@/components/marketing/page-hero";
import { Container, Section } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Members" };

export default function MembersPage() {
  const states = MEMBERS.filter((m) => m.type === "member-state");
  const associated = MEMBERS.filter((m) => m.type === "associated");

  return (
    <>
      <PageHero
        eyebrow="Members"
        title="29 states. 350+ industry members."
        description="The Chips JU is founded by 26 EU member states and 3 associated countries, alongside three industry associations representing Europe's semiconductor community."
      />

      <Section>
        <Container>
          <h2 className="font-display text-2xl font-semibold tracking-tight">Participating states</h2>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {states.map((m) => (
              <div
                key={m.code}
                className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5 text-sm"
              >
                <span className="inline-flex h-7 w-9 items-center justify-center rounded border border-border bg-surface-2 font-mono text-xs font-semibold">
                  {m.code}
                </span>
                <span className="truncate">{m.country}</span>
              </div>
            ))}
          </div>

          <h2 className="mt-16 font-display text-2xl font-semibold tracking-tight">
            Associated countries
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {associated.map((m) => (
              <div
                key={m.code}
                className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5 text-sm"
              >
                <span className="inline-flex h-7 w-9 items-center justify-center rounded border border-border bg-surface-2 font-mono text-xs font-semibold">
                  {m.code}
                </span>
                <span>{m.country}</span>
              </div>
            ))}
          </div>

          <h2 className="mt-16 font-display text-2xl font-semibold tracking-tight">
            Industry associations
          </h2>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {[
              { name: "AENEAS", focus: "Research and innovation in electronics" },
              { name: "EPoSS", focus: "Smart systems integration" },
              { name: "INSIDE", focus: "Industrial embedded systems and applications" },
            ].map((a) => (
              <div key={a.name} className="rounded-xl border border-border bg-card p-6 shadow-card">
                <div className="font-display text-xl font-semibold tracking-tight">{a.name}</div>
                <p className="mt-2 text-sm text-muted-foreground">{a.focus}</p>
              </div>
            ))}
          </div>

          <h2 className="mt-16 font-display text-2xl font-semibold tracking-tight">
            Industry members — selected
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            350+ organisations participate as industry members. A sample below.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {INDUSTRY_MEMBERS.map((name) => (
              <Badge key={name} variant="outline" className="text-sm">
                {name}
              </Badge>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
