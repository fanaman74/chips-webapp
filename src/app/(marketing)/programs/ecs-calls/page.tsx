import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/marketing/page-hero";
import { Container, Section } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata = { title: "ECS R&I Calls" };

export default function EcsCallsPage() {
  return (
    <>
      <PageHero
        eyebrow="ECS R&I"
        title="Research and innovation grants, TRL 1 to 8."
        description="Annual competitive calls for collaborative electronic-components-and-systems projects — from fundamental research through to pilot deployment."
      >
        <div className="flex flex-wrap gap-3">
          <Badge variant="brand">Programme budget €2.8B</Badge>
          <Badge variant="outline">154 active projects</Badge>
        </div>
      </PageHero>

      <Section>
        <Container>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                trl: "1 – 3",
                label: "Research Actions (RIA)",
                text: "Exploratory research on novel devices, materials, and architectures. Academic-led consortia welcome.",
              },
              {
                trl: "4 – 6",
                label: "Innovation Actions (IA)",
                text: "Bring validated technologies toward pilot demonstration in operational environments.",
              },
              {
                trl: "6 – 8",
                label: "Industrial Deployment",
                text: "Large-scale industrial pilots that prepare technologies for commercial market entry.",
              },
            ].map((c) => (
              <div key={c.label} className="rounded-xl border border-border bg-card p-7 shadow-card">
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  TRL {c.trl}
                </div>
                <h3 className="mt-2 font-display text-lg font-semibold tracking-tight">
                  {c.label}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {c.text}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <Button asChild>
              <Link href="/calls">
                See open ECS calls
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
