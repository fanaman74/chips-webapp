import { PageHero } from "@/components/marketing/page-hero";
import { Container, Section } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Pilot Lines" };

const LINES = [
  {
    name: "Sub-2nm logic",
    host: "IMEC · Leuven, BE",
    status: "In ramp-up",
    capability: "Advanced-node logic · EUV · angstrom-scale patterning",
    access: "Shuttle + project-based",
  },
  {
    name: "FD-SOI 22nm – 10nm",
    host: "CEA-Leti · Grenoble, FR · GlobalFoundries · Dresden, DE",
    status: "Operational",
    capability: "Ultra-low-power embedded, RF, IoT, automotive grade",
    access: "Open shuttles, 6 per year",
  },
  {
    name: "Wide bandgap (SiC / GaN)",
    host: "STMicroelectronics · Catania, IT · Fraunhofer IISB · Erlangen, DE",
    status: "Operational",
    capability: "Power electronics — automotive traction, grid inverters",
    access: "Project-based, 2 calls per year",
  },
  {
    name: "Photonics",
    host: "CEA-Leti · Grenoble, FR · Fraunhofer HHI · Berlin, DE",
    status: "Operational",
    capability: "Silicon photonics, InP integration, co-packaged optics",
    access: "Shuttle + co-design workshops",
  },
  {
    name: "Heterogeneous integration",
    host: "Fraunhofer IZM · Berlin, DE · TNO · Eindhoven, NL",
    status: "In ramp-up",
    capability: "Chiplets · 3D stacking · fan-out WLP · advanced substrates",
    access: "Project-based, open applications",
  },
];

export default function PilotLinesPage() {
  return (
    <>
      <PageHero
        eyebrow="Pilot lines"
        title="Five open-access platforms for Europe's semiconductor future."
        description="Flagship pilot lines operated by Europe's strongest RTOs and fabs. Every line is open to eligible participants — from SMEs and startups through to multinationals."
      >
        <div className="flex flex-wrap gap-3">
          <Badge variant="brand">5 pilot lines</Badge>
          <Badge variant="outline">9 host sites · 7 countries</Badge>
        </div>
      </PageHero>

      <Section>
        <Container>
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
            <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr_1fr] gap-6 border-b border-border bg-surface-2 px-6 py-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              <div>Line</div>
              <div>Host(s)</div>
              <div>Status</div>
              <div>Capability</div>
              <div>Access</div>
            </div>
            {LINES.map((l, i) => (
              <div
                key={l.name}
                className={`grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr_1fr_1fr] gap-4 md:gap-6 px-6 py-5 text-sm ${
                  i > 0 ? "border-t border-border" : ""
                }`}
              >
                <div className="font-display text-base font-semibold">{l.name}</div>
                <div className="text-muted-foreground">{l.host}</div>
                <div>
                  <Badge variant={l.status === "Operational" ? "success" : "amber"}>
                    {l.status}
                  </Badge>
                </div>
                <div className="text-muted-foreground">{l.capability}</div>
                <div className="text-muted-foreground">{l.access}</div>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
