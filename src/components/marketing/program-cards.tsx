import Link from "next/link";
import { ArrowUpRight, Cpu, FlaskConical, Factory } from "lucide-react";
import { PROGRAMS } from "@/data/programs";
import { Container, Eyebrow, Section } from "@/components/ui/container";
import { formatEur } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { colorFor, type ColorKey } from "@/lib/colors";
import { cn } from "@/lib/utils";

const ICONS = { cpu: Cpu, flask: FlaskConical, factory: Factory };
const PROGRAM_COLOR: Record<string, ColorKey> = {
  "chips-for-europe": "brand",
  "ecs-calls": "fuchsia",
  "pilot-lines": "amber",
};

export function ProgramCards() {
  return (
    <Section>
      <Container>
        <div className="mb-10 text-center">
          <Eyebrow className="justify-center">Chips JU programmes</Eyebrow>
          <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl text-balance">
            Three pillars. One mission. European sovereignty.
          </h2>
          <div className="section-green-line" />
          <p className="mt-4 mx-auto max-w-xl text-muted-foreground">
            €12.3 billion across the Multiannual Work Programme 2023–2027, tracked live from CORDIS.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {PROGRAMS.map((p) => {
            const Icon = ICONS[p.icon];
            const color = colorFor(PROGRAM_COLOR[p.slug] ?? "brand");
            return (
              <Link
                key={p.slug}
                href={p.href}
                className={cn(
                  "group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border bg-card p-7 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-elevated",
                )}
              >
                <span aria-hidden className={cn("absolute inset-x-0 top-0 h-1", color.dot)} />
                <div
                  aria-hidden
                  className={cn(
                    "pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full bg-gradient-to-br opacity-60 blur-3xl transition-opacity group-hover:opacity-90",
                    color.gradient,
                  )}
                />
                <div className="relative">
                  <div
                    className={cn(
                      "inline-flex h-11 w-11 items-center justify-center rounded-lg border",
                      color.chip,
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 font-display text-xl font-semibold tracking-tight">
                    {p.name}
                  </h3>
                  <p className={cn("mt-1 text-sm font-medium", color.text)}>{p.tagline}</p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {p.summary}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {p.focus.slice(0, 3).map((f) => (
                      <Badge key={f} variant="outline">
                        {f}
                      </Badge>
                    ))}
                    {p.focus.length > 3 && (
                      <Badge variant="outline">+{p.focus.length - 3} more</Badge>
                    )}
                  </div>
                </div>
                <div className="relative mt-8 flex items-center justify-between border-t border-border pt-5 text-sm">
                  <div>
                    <div className="font-mono text-xs text-muted-foreground">Programme budget</div>
                    <div className="font-display text-base font-semibold">
                      {formatEur(p.budgetEur, { compact: true })}
                    </div>
                  </div>
                  <div
                    className={cn(
                      "inline-flex h-9 w-9 items-center justify-center rounded-full border text-foreground/60 transition group-hover:bg-card",
                      "group-hover:" + color.text.replace("text-", "text-"),
                      "group-hover:border-current",
                    )}
                  >
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
