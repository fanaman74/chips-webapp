import Link from "next/link";
import { ArrowRight, Building2, Flame, GraduationCap, HelpCircle, Rocket } from "lucide-react";
import { PageHero } from "@/components/marketing/page-hero";
import { Container, Section } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Participate" };

const PATHS = [
  {
    icon: Rocket,
    for: "Startups & SMEs",
    text: "Access pilot lines through shuttle tape-outs, get design support via competence centres, or join consortia as a specialist partner.",
    cta: { label: "SME fast-track", href: "/calls" },
  },
  {
    icon: Building2,
    for: "Industry",
    text: "Lead innovation actions, participate in pilot line consortia, or join industrial deployment projects.",
    cta: { label: "Industry calls", href: "/calls" },
  },
  {
    icon: GraduationCap,
    for: "Academia & RTOs",
    text: "Lead research actions on frontier topics, or partner with industry in collaborative consortia across TRLs 1–6.",
    cta: { label: "Research calls", href: "/calls" },
  },
  {
    icon: Flame,
    for: "National authorities",
    text: "Co-fund pilot lines and competence centres under the Chips Act framework.",
    cta: { label: "Governance", href: "/about/governance" },
  },
];

const STEPS = [
  {
    step: "01",
    title: "Find a matching call",
    body: "Browse open calls in the applicant portal. Each has clear scope, expected outcomes and evaluation criteria.",
  },
  {
    step: "02",
    title: "Build your consortium",
    body: "Most calls require 3–7 partners across 3+ states. Use the partner search in the portal, or come to an Info Day to meet prospective partners.",
  },
  {
    step: "03",
    title: "Draft your proposal",
    body: "The portal's guided application walks you through eligibility, consortium, budget, work plan and impact. Save drafts and collaborate with partners in real time.",
  },
  {
    step: "04",
    title: "Submit & evaluate",
    body: "Submit before the deadline. Evaluation takes 2–3 months. Successful consortia sign grant agreements within 6 months of submission.",
  },
];

export default function ParticipatePage() {
  return (
    <>
      <PageHero
        eyebrow="Participate"
        title="Join Europe's semiconductor ecosystem."
        description="Whether you're a startup, a multinational, a university or a national authority — there is a pathway for you. Here's how to participate in Chips JU programmes."
      />

      <Section>
        <Container>
          <div className="grid gap-5 md:grid-cols-2">
            {PATHS.map((p) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.for}
                  className="flex flex-col gap-4 rounded-xl border border-border bg-card p-7 shadow-card"
                >
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-xl font-semibold tracking-tight">
                    {p.for}
                  </h3>
                  <p className="flex-1 text-sm leading-relaxed text-muted-foreground">{p.text}</p>
                  <Button variant="outline" size="sm" className="self-start" asChild>
                    <Link href={p.cta.href}>
                      {p.cta.label}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              );
            })}
          </div>
        </Container>
      </Section>

      <section className="border-t border-border bg-surface-2/60">
        <Container className="py-16">
          <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl text-balance max-w-2xl">
            Applying in four steps.
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s) => (
              <div key={s.step} className="rounded-xl border border-border bg-card p-6 shadow-card">
                <div className="font-mono text-sm font-semibold text-accent-600">{s.step}</div>
                <h3 className="mt-2 font-display text-lg font-semibold tracking-tight">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <Section>
        <Container>
          <div className="flex flex-col items-start gap-6 rounded-2xl border border-border bg-card p-8 md:flex-row md:items-center md:justify-between md:p-10 shadow-card">
            <div className="flex items-start gap-4">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-accent/15 text-accent-600">
                <HelpCircle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-display text-xl font-semibold tracking-tight">
                  Need help getting started?
                </h3>
                <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                  Our network of 14 national competence centres provides free support to
                  newcomers. They help with eligibility, partner search and proposal
                  writing — and speak your language.
                </p>
              </div>
            </div>
            <Button asChild>
              <Link href="/about/members">
                Find your competence centre
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
