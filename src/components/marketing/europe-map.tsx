import { Container, Eyebrow, Section } from "@/components/ui/container";
import { MEMBERS } from "@/data/members";

const NODES = [
  { code: "FR", x: 45, y: 55, label: "France" },
  { code: "DE", x: 54, y: 45, label: "Germany", big: true },
  { code: "BE", x: 48, y: 43, label: "Belgium", big: true },
  { code: "NL", x: 50, y: 40, label: "Netherlands", big: true },
  { code: "IT", x: 55, y: 65, label: "Italy", big: true },
  { code: "ES", x: 35, y: 72, label: "Spain" },
  { code: "SE", x: 58, y: 20, label: "Sweden" },
  { code: "FI", x: 66, y: 18, label: "Finland" },
  { code: "PL", x: 62, y: 42, label: "Poland" },
  { code: "CZ", x: 58, y: 48, label: "Czech Rep." },
  { code: "AT", x: 58, y: 52, label: "Austria" },
  { code: "IE", x: 32, y: 38, label: "Ireland" },
  { code: "PT", x: 28, y: 73, label: "Portugal" },
  { code: "GR", x: 66, y: 72, label: "Greece" },
  { code: "RO", x: 68, y: 56, label: "Romania" },
  { code: "DK", x: 53, y: 33, label: "Denmark" },
  { code: "HU", x: 62, y: 52, label: "Hungary" },
];

export function EuropeMap() {
  const total = MEMBERS.length;
  const memberStates = MEMBERS.filter((m) => m.type === "member-state").length;
  return (
    <Section>
      <Container>
        <div className="grid gap-10 md:grid-cols-2 md:gap-16 items-center">
          <div>
            <Eyebrow>Continental in scope</Eyebrow>
            <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl text-balance">
              29 participating states. <span className="text-brand">One ecosystem.</span>
            </h2>
            <div className="section-green-line ml-0" style={{marginLeft: 0, marginRight: 'auto'}} />
            <p className="mt-4 text-muted-foreground">
              The Chips JU operates across {memberStates} EU member states and{" "}
              {total - memberStates} associated countries — coordinating with national
              authorities, competence centres and regional clusters from Lisbon to Helsinki.
            </p>
            <dl className="mt-8 grid grid-cols-3 gap-6">
              <div>
                <dt className="font-mono text-[10px] uppercase text-muted-foreground">
                  Member states
                </dt>
                <dd className="mt-1 font-display text-2xl font-semibold">{memberStates}</dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase text-muted-foreground">
                  Associated
                </dt>
                <dd className="mt-1 font-display text-2xl font-semibold">{total - memberStates}</dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase text-muted-foreground">
                  Pilot lines
                </dt>
                <dd className="mt-1 font-display text-2xl font-semibold">5</dd>
              </div>
            </dl>
          </div>

          <div className="relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-card aspect-[4/3]">
            <svg viewBox="0 0 100 100" className="h-full w-full">
              {/* Stylised europe blob */}
              <defs>
                <linearGradient id="eu-grad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="rgb(var(--brand-blue))" stopOpacity="0.07" />
                  <stop offset="100%" stopColor="rgb(var(--brand-accent))" stopOpacity="0.04" />
                </linearGradient>
              </defs>
              <path
                d="M20 40 Q22 22 40 18 Q55 12 70 22 Q86 30 80 46 Q84 62 70 74 Q56 86 40 82 Q22 78 20 62 Z"
                fill="url(#eu-grad)"
                stroke="rgb(var(--border))"
                strokeWidth="0.2"
              />
              {/* Connection lines between nodes */}
              {NODES.filter((n) => n.big).map((a, i) =>
                NODES.filter((n) => n.big).slice(i + 1).map((b) => (
                  <line
                    key={`${a.code}-${b.code}`}
                    x1={a.x}
                    y1={a.y}
                    x2={b.x}
                    y2={b.y}
                    stroke="rgb(var(--brand-accent))"
                    strokeOpacity="0.25"
                    strokeWidth="0.15"
                    strokeDasharray="0.6 0.6"
                  />
                )),
              )}
              {/* Nodes */}
              {NODES.map((n) => (
                <g key={n.code}>
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={n.big ? 1.6 : 1.0}
                    fill="rgb(var(--brand-blue))"
                  />
                  {n.big && (
                    <circle
                      cx={n.x}
                      cy={n.y}
                      r="3"
                      fill="rgb(var(--brand-accent))"
                      fillOpacity="0.15"
                      className="animate-pulse-slow"
                    />
                  )}
                </g>
              ))}
            </svg>

            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-lg border border-border bg-background/80 p-3 text-xs backdrop-blur">
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-brand" />
                Participating state
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-accent" />
                Pilot line host
              </span>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
