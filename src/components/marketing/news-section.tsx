import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { latestNews } from "@/data/news";
import { Container, Eyebrow, Section } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format";
import { NEWS_CATEGORY_COLOR, colorFor } from "@/lib/colors";
import { cn } from "@/lib/utils";

export function NewsSection() {
  const items = latestNews(4);
  const [lead, ...rest] = items;
  const leadColor = colorFor(NEWS_CATEGORY_COLOR[lead.category] ?? "brand");
  return (
    <Section className="bg-surface-2/60 border-t border-b border-border">
      <Container>
        <div className="mb-10 text-center">
          <Eyebrow className="justify-center">Latest news</Eyebrow>
          <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">
            What&rsquo;s moving in the ecosystem.
          </h2>
          <div className="section-green-line" />
          <div className="mt-4 flex justify-center">
            <Button variant="outline" asChild>
              <Link href="/news">
                All news
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <Link
            href={`/news/${lead.slug}`}
            className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card p-7 shadow-card transition-all hover:shadow-elevated"
          >
            <span
              aria-hidden
              className={cn("absolute inset-x-0 top-0 h-1", leadColor.dot)}
            />
            <div
              aria-hidden
              className={cn(
                "pointer-events-none absolute -top-20 -right-20 h-56 w-56 rounded-full bg-gradient-to-br opacity-60 blur-3xl",
                leadColor.gradient,
              )}
            />
            <div className="relative flex items-center gap-2">
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
                  leadColor.chip,
                )}
              >
                <span className={cn("h-1.5 w-1.5 rounded-full", leadColor.dot)} />
                {lead.category}
              </span>
              <span className="text-xs text-muted-foreground">{formatDate(lead.publishedAt)}</span>
            </div>
            <h3 className="relative mt-4 font-display text-2xl font-semibold leading-snug tracking-tight text-balance group-hover:text-brand transition-colors">
              {lead.title}
            </h3>
            <p className="relative mt-4 text-muted-foreground">{lead.excerpt}</p>
            <div className="relative mt-auto pt-6 flex items-center gap-3 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{lead.readingMinutes} min read</span>
              <span className="h-1 w-1 rounded-full bg-border" />
              <span>{lead.author}</span>
            </div>
          </Link>

          <div className="flex flex-col gap-3">
            {rest.map((n) => {
              const c = colorFor(NEWS_CATEGORY_COLOR[n.category] ?? "brand");
              return (
                <Link
                  key={n.slug}
                  href={`/news/${n.slug}`}
                  className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-card transition-all hover:shadow-elevated"
                >
                  <span aria-hidden className={cn("absolute inset-y-0 left-0 w-0.5", c.dot)} />
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium",
                        c.chip,
                      )}
                    >
                      {n.category}
                    </span>
                    <span className="text-xs text-muted-foreground">{formatDate(n.publishedAt)}</span>
                  </div>
                  <h3 className="mt-3 font-display text-base font-semibold leading-snug tracking-tight group-hover:text-brand transition-colors">
                    {n.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{n.excerpt}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </Container>
    </Section>
  );
}
