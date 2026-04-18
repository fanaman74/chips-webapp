import type { HeroStat } from "@/lib/cordis";
import { Counter } from "./counter";
import { colorFor, type ColorKey } from "@/lib/colors";
import { cn } from "@/lib/utils";

const STAT_COLORS: ColorKey[] = ["brand", "fuchsia", "emerald", "amber"];

export function StatsRow({ stats }: { stats: HeroStat[] }) {
  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-4">
      {stats.map((s, i) => {
        const decimals = Number.isInteger(s.value) ? 0 : 1;
        const color = colorFor(STAT_COLORS[i % STAT_COLORS.length]);
        return (
          <div
            key={s.label}
            className="relative overflow-hidden bg-card px-5 py-6 md:px-7 md:py-8"
          >
            <div
              aria-hidden
              className={cn(
                "pointer-events-none absolute -top-14 -right-14 h-36 w-36 rounded-full bg-gradient-to-br opacity-60 blur-3xl",
                color.gradient,
              )}
            />
            <span
              aria-hidden
              className={cn("absolute inset-x-0 top-0 h-0.5", color.dot)}
            />
            <div className="relative font-display text-3xl font-bold tracking-tight md:text-4xl">
              {s.prefix ?? ""}
              <Counter value={s.value} decimals={decimals} />
              {s.suffix ?? ""}
            </div>
            <div className="relative mt-1 text-sm font-medium text-foreground/80">
              {s.label}
            </div>
            {s.note && (
              <div className="relative mt-0.5 text-xs text-muted-foreground">{s.note}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
