"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  Coins,
  FileCheck2,
  ListChecks,
  Plus,
  Save,
  UserPlus,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatEur } from "@/lib/format";

type Partner = {
  id: string;
  name: string;
  country: string;
  type: "industry" | "academic" | "rto";
  role: string;
  budget: number;
};

const DEFAULT_PARTNERS: Partner[] = [
  { id: "1", name: "ETH Zurich", country: "CH", type: "academic", role: "Coordinator", budget: 3_200_000 },
  { id: "2", name: "STMicroelectronics", country: "FR", type: "industry", role: "Silicon lead", budget: 4_800_000 },
  { id: "3", name: "IMEC", country: "BE", type: "rto", role: "Pilot line access", budget: 2_100_000 },
  { id: "4", name: "KU Leuven", country: "BE", type: "academic", role: "Algorithms", budget: 1_600_000 },
];

const STEPS = [
  { id: 1, label: "Eligibility", icon: ListChecks },
  { id: 2, label: "Consortium", icon: UserPlus },
  { id: 3, label: "Budget", icon: Coins },
  { id: 4, label: "Work plan", icon: Building2 },
  { id: 5, label: "Review", icon: FileCheck2 },
] as const;

export function ApplicationWizard({
  callRef = "ECS-2026-1-IA",
  callTitle = "Sovereign edge AI compute platforms",
}: {
  callRef?: string;
  callTitle?: string;
}) {
  const [step, setStep] = React.useState(1);

  // Step 1 — Eligibility
  const [acronym, setAcronym] = React.useState("EDGE-CORTEX");
  const [title, setTitle] = React.useState(
    "Sovereign edge AI cortex — reference silicon + runtime",
  );
  const [instrument, setInstrument] = React.useState("IA");
  const [abstract, setAbstract] = React.useState(
    "EDGE-CORTEX delivers an open, certifiable reference platform for edge AI inference, combining a RISC-V cluster fabricated on 22nm FD-SOI with a deterministic runtime for automotive and smart-grid workloads.",
  );
  const [eligible, setEligible] = React.useState({
    consortium: true,
    states: true,
    industryLed: true,
    sovereignty: true,
  });

  // Step 2 — Consortium
  const [partners, setPartners] = React.useState<Partner[]>(DEFAULT_PARTNERS);

  // Step 3 — Budget
  const [fundingRate, setFundingRate] = React.useState(50);

  // Step 4 — Work plan
  const [workPackages] = React.useState([
    { id: "WP1", title: "Project management", lead: "ETH Zurich", months: 36, effort: 18 },
    { id: "WP2", title: "Architecture & system design", lead: "ETH Zurich", months: 18, effort: 42 },
    { id: "WP3", title: "Silicon implementation", lead: "ST", months: 24, effort: 98 },
    { id: "WP4", title: "Runtime & certification", lead: "IMEC", months: 24, effort: 62 },
    { id: "WP5", title: "Pilot deployment", lead: "KU Leuven", months: 18, effort: 54 },
    { id: "WP6", title: "Dissemination & exploitation", lead: "ETH Zurich", months: 36, effort: 24 },
  ]);

  const totalBudget = partners.reduce((s, p) => s + p.budget, 0);
  const requestedFunding = Math.round((totalBudget * fundingRate) / 100);

  const valid = eligible.consortium && eligible.states && eligible.industryLed && eligible.sovereignty;

  function next() {
    setStep((s) => Math.min(STEPS.length, s + 1));
  }
  function prev() {
    setStep((s) => Math.max(1, s - 1));
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
      <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Applying to
          </div>
          <div className="mt-2 font-mono text-xs font-semibold text-accent-600">
            {callRef}
          </div>
          <div className="mt-1 font-display text-sm font-semibold leading-snug">
            {callTitle}
          </div>
        </div>
        <nav className="space-y-1">
          {STEPS.map((s) => {
            const Icon = s.icon;
            const done = s.id < step;
            const active = s.id === step;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setStep(s.id)}
                className={cn(
                  "group flex w-full items-center gap-3 rounded-md border px-3 py-2.5 text-left text-sm transition-all",
                  active
                    ? "border-brand/60 bg-brand/5 text-foreground shadow-sm"
                    : done
                      ? "border-border bg-card text-foreground/80 hover:bg-surface-2"
                      : "border-border bg-card text-foreground/60 hover:bg-surface-2",
                )}
              >
                <span
                  className={cn(
                    "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border",
                    done
                      ? "border-success bg-success text-white"
                      : active
                        ? "border-brand bg-brand text-white"
                        : "border-border bg-surface-2 text-foreground/60",
                  )}
                >
                  {done ? <Check className="h-3.5 w-3.5" /> : <Icon className="h-3.5 w-3.5" />}
                </span>
                <span className="flex-1">
                  <span className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    Step {s.id}
                  </span>
                  <span className="block font-medium">{s.label}</span>
                </span>
              </button>
            );
          })}
        </nav>

        <div className="rounded-xl border border-border bg-surface-2 p-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2 font-medium text-foreground">
            <Save className="h-3.5 w-3.5" /> Auto-saved
          </div>
          <div className="mt-1">Last saved just now · draft id <span className="font-mono">app-2026-01</span></div>
        </div>
      </aside>

      <div className="space-y-6">
        {step === 1 && (
          <StepCard
            title="Eligibility & proposal basics"
            description="Confirm you meet the call's eligibility criteria and set the basic metadata for your proposal."
          >
            <div className="grid gap-4 md:grid-cols-[1fr_200px]">
              <Field label="Proposal acronym">
                <Input value={acronym} onChange={(e) => setAcronym(e.target.value)} />
              </Field>
              <Field label="Instrument">
                <Select value={instrument} onChange={(e) => setInstrument(e.target.value)}>
                  <option value="IA">Innovation Action (IA)</option>
                  <option value="RIA">Research Action (RIA)</option>
                  <option value="CSA">Coordination & Support (CSA)</option>
                </Select>
              </Field>
            </div>
            <Field label="Proposal title">
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </Field>
            <Field label="Abstract (2,000 chars max)">
              <Textarea
                rows={4}
                value={abstract}
                onChange={(e) => setAbstract(e.target.value)}
              />
              <div className="mt-1 text-right font-mono text-[10px] text-muted-foreground">
                {abstract.length} / 2000
              </div>
            </Field>

            <div className="rounded-lg border border-border bg-surface-2 p-5">
              <div className="text-sm font-semibold">Eligibility self-declaration</div>
              <p className="mt-1 text-xs text-muted-foreground">
                You must confirm all four criteria to submit. Final eligibility is
                verified at evaluation.
              </p>
              <div className="mt-4 space-y-2">
                {[
                  { k: "consortium", label: "Consortium of ≥ 5 legal entities" },
                  { k: "states", label: "Partners from ≥ 3 participating states" },
                  { k: "industryLed", label: "Industry-led with ≥ 1 RTO involved" },
                  { k: "sovereignty", label: "Addresses at least one sovereignty-critical vertical" },
                ].map((c) => (
                  <label
                    key={c.k}
                    className="flex items-center gap-3 rounded-md border border-border bg-card p-3 text-sm cursor-pointer hover:bg-surface-2"
                  >
                    <input
                      type="checkbox"
                      className="h-4 w-4 accent-brand"
                      checked={eligible[c.k as keyof typeof eligible]}
                      onChange={(e) =>
                        setEligible({ ...eligible, [c.k]: e.target.checked })
                      }
                    />
                    <span className="flex-1">{c.label}</span>
                    {eligible[c.k as keyof typeof eligible] && (
                      <CheckCircle2 className="h-4 w-4 text-success" />
                    )}
                  </label>
                ))}
              </div>
            </div>
          </StepCard>
        )}

        {step === 2 && (
          <StepCard
            title="Consortium"
            description="Add the partners who will deliver the project. Assign roles and initial budget splits — you can iterate these later."
          >
            <div className="overflow-hidden rounded-lg border border-border bg-card">
              <div className="grid grid-cols-[1.4fr_auto_auto_1fr_auto_auto] gap-4 border-b border-border bg-surface-2 px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                <div>Organisation</div>
                <div className="w-12">Country</div>
                <div className="w-20">Type</div>
                <div>Role</div>
                <div className="w-32">Budget</div>
                <div className="w-6" />
              </div>
              {partners.map((p, i) => (
                <div
                  key={p.id}
                  className={`grid grid-cols-[1.4fr_auto_auto_1fr_auto_auto] items-center gap-4 px-4 py-3 text-sm ${
                    i > 0 ? "border-t border-border" : ""
                  }`}
                >
                  <div className="font-medium">
                    {p.name}
                    {p.role === "Coordinator" && (
                      <Badge variant="brand" className="ml-2">
                        Lead
                      </Badge>
                    )}
                  </div>
                  <div className="w-12 font-mono text-xs">{p.country}</div>
                  <div className="w-20 text-xs capitalize text-muted-foreground">{p.type}</div>
                  <div className="text-muted-foreground">{p.role}</div>
                  <div className="w-32 font-display text-sm font-semibold">
                    {formatEur(p.budget, { compact: true })}
                  </div>
                  <button
                    type="button"
                    onClick={() => setPartners(partners.filter((x) => x.id !== p.id))}
                    className="inline-flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:bg-surface-2 hover:text-danger"
                    aria-label="Remove partner"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between rounded-lg border border-dashed border-border bg-surface-2 p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <UserPlus className="h-4 w-4" /> Add a partner by search or organisation ID
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  setPartners([
                    ...partners,
                    {
                      id: String(Math.random()).slice(2, 8),
                      name: "New partner",
                      country: "EU",
                      type: "industry",
                      role: "Contributor",
                      budget: 1_000_000,
                    },
                  ])
                }
              >
                <Plus className="h-4 w-4" /> Add partner
              </Button>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <InfoCell label="Partners" value={partners.length.toString()} />
              <InfoCell
                label="Countries"
                value={new Set(partners.map((p) => p.country)).size.toString()}
              />
              <InfoCell
                label="Total budget"
                value={formatEur(totalBudget, { compact: true })}
              />
            </div>
          </StepCard>
        )}

        {step === 3 && (
          <StepCard
            title="Budget"
            description="Set the co-funding rate. The Chips JU contribution is capped by call type; the remainder is covered by consortium and national sources."
          >
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-lg border border-border bg-card p-5 shadow-card">
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Total eligible costs
                </div>
                <div className="mt-2 font-display text-3xl font-semibold">
                  {formatEur(totalBudget)}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Sum of partner budgets
                </div>
              </div>
              <div className="rounded-lg border border-brand/40 bg-brand/5 p-5">
                <div className="font-mono text-[10px] uppercase tracking-widest text-brand">
                  Requested Chips JU funding
                </div>
                <div className="mt-2 font-display text-3xl font-semibold text-brand">
                  {formatEur(requestedFunding)}
                </div>
                <div className="mt-1 text-xs text-brand/80">
                  {fundingRate}% co-funding rate
                </div>
              </div>
            </div>

            <div>
              <label className="mb-2 flex items-center justify-between font-mono text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                <span>Co-funding rate</span>
                <span className="font-display text-base font-bold text-foreground">
                  {fundingRate}%
                </span>
              </label>
              <input
                type="range"
                min={25}
                max={70}
                value={fundingRate}
                onChange={(e) => setFundingRate(Number(e.target.value))}
                className="w-full accent-brand"
              />
              <div className="mt-2 flex justify-between font-mono text-[10px] text-muted-foreground">
                <span>25% min</span>
                <span>50% default (IA)</span>
                <span>70% max (RIA)</span>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card">
              <div className="border-b border-border bg-surface-2 px-5 py-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Per-partner split
              </div>
              <div className="divide-y divide-border">
                {partners.map((p) => (
                  <div
                    key={p.id}
                    className="grid grid-cols-[1fr_120px_120px] items-center gap-4 px-5 py-3 text-sm"
                  >
                    <div className="font-medium">{p.name}</div>
                    <div className="text-muted-foreground">{formatEur(p.budget)}</div>
                    <div className="font-display font-semibold text-brand">
                      {formatEur(Math.round((p.budget * fundingRate) / 100))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </StepCard>
        )}

        {step === 4 && (
          <StepCard
            title="Work plan"
            description="Define your work package structure. Each WP carries a title, lead partner, duration and effort in person-months."
          >
            <div className="overflow-hidden rounded-lg border border-border bg-card">
              <div className="grid grid-cols-[60px_1fr_1fr_auto_auto] gap-4 border-b border-border bg-surface-2 px-5 py-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                <div>WP</div>
                <div>Title</div>
                <div>Lead</div>
                <div className="w-20">Duration</div>
                <div className="w-16">Effort</div>
              </div>
              {workPackages.map((wp, i) => (
                <div
                  key={wp.id}
                  className={`grid grid-cols-[60px_1fr_1fr_auto_auto] gap-4 px-5 py-3 text-sm ${
                    i > 0 ? "border-t border-border" : ""
                  }`}
                >
                  <div className="font-mono font-semibold text-accent-600">{wp.id}</div>
                  <div className="font-medium">{wp.title}</div>
                  <div className="text-muted-foreground">{wp.lead}</div>
                  <div className="w-20 text-muted-foreground">{wp.months} mo</div>
                  <div className="w-16 font-display font-semibold">{wp.effort} PM</div>
                </div>
              ))}
            </div>

            <div className="rounded-lg border border-dashed border-border bg-surface-2 p-5 text-center text-sm text-muted-foreground">
              + Add work package, milestone or deliverable (full tool in production)
            </div>
          </StepCard>
        )}

        {step === 5 && (
          <StepCard
            title="Review & submit"
            description="One final look. Once submitted, your proposal enters the evaluation queue and cannot be edited unless resubmission is requested."
          >
            <ReviewRow label="Proposal" value={`${acronym} — ${title}`} />
            <ReviewRow label="Call reference" value={callRef} />
            <ReviewRow label="Instrument" value={instrument} />
            <ReviewRow label="Consortium" value={`${partners.length} partners in ${new Set(partners.map((p) => p.country)).size} countries`} />
            <ReviewRow label="Total cost" value={formatEur(totalBudget)} />
            <ReviewRow label="Requested funding" value={formatEur(requestedFunding)} highlight />
            <ReviewRow label="Work packages" value={`${workPackages.length} WPs · ${workPackages.reduce((s, w) => s + w.effort, 0)} person-months`} />

            <div className="mt-4 rounded-lg border border-success/40 bg-success/5 p-5">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                <div className="text-sm">
                  <div className="font-medium">All eligibility checks pass</div>
                  <div className="mt-0.5 text-muted-foreground">
                    Consortium size, geographic diversity, industry participation and
                    sovereignty focus — all confirmed.
                  </div>
                </div>
              </div>
            </div>
          </StepCard>
        )}

        <div className="sticky bottom-0 -mx-5 mt-6 border-t border-border bg-background/90 px-5 py-4 backdrop-blur md:-mx-8 md:px-8">
          <div className="mx-auto flex max-w-4xl items-center justify-between gap-3">
            <Button variant="outline" onClick={prev} disabled={step === 1}>
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="ghost">
                <Save className="h-4 w-4" /> Save draft
              </Button>
              {step === STEPS.length ? (
                <Button variant="accent" disabled={!valid} asChild={valid}>
                  {valid ? (
                    <Link href="/portal/applications">
                      Submit proposal
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  ) : (
                    <span>Fix eligibility first</span>
                  )}
                </Button>
              ) : (
                <Button onClick={next}>
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-5 rounded-2xl border border-border bg-card p-6 md:p-8 shadow-card">
      <div>
        <h2 className="font-display text-xl font-semibold tracking-tight md:text-2xl">
          {title}
        </h2>
        {description && (
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      {children}
    </label>
  );
}

function InfoCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 font-display text-xl font-semibold">{value}</div>
    </div>
  );
}

function ReviewRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border py-3 text-sm last:border-b-0">
      <div className="text-muted-foreground">{label}</div>
      <div
        className={cn(
          "text-right font-medium",
          highlight && "font-display text-lg font-semibold text-brand",
        )}
      >
        {value}
      </div>
    </div>
  );
}
