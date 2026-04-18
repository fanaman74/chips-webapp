import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { latestNews } from "@/data/news";
import { Container, Eyebrow, Section } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format";
import { NEWS_CATEGORY_COLOR, colorFor } from "@/lib/colors";
import { cn } from "@/lib/utils";

export function NewsSection() {
  const items = latestNews(6).filter((n) => n.category !== "Event").slice(0, 4);
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

        <div className="grid gap-5 sm:grid-cols-2">
          {items.map((n) => {
            const c = colorFor(NEWS_CATEGORY_COLOR[n.category] ?? "brand");
            return (
              <Link
                key={n.slug}
                href={`/news/${n.slug}`}
                className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card p-6 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-elevated"
              >
                <span aria-hidden className={cn("absolute inset-x-0 top-0 h-1", c.dot)} />
                <div
                  aria-hidden
                  className={cn(
                    "pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-gradient-to-br opacity-50 blur-2xl transition-opacity group-hover:opacity-80",
                    c.gradient,
                  )}
                />
                <div className="relative flex items-center gap-2">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
                      c.chip,
                    )}
                  >
                    <span className={cn("h-1.5 w-1.5 rounded-full", c.dot)} />
                    {n.category}
                  </span>
                  <span className="text-xs text-muted-foreground">{formatDate(n.publishedAt)}</span>
                </div>
                <h3 className="relative mt-4 font-display text-lg font-semibold leading-snug tracking-tight text-balance group-hover:text-brand transition-colors">
                  {n.title}
                </h3>
                <p className="relative mt-3 flex-1 text-sm text-muted-foreground line-clamp-3">
                  {n.excerpt}
                </p>
                <div className="relative mt-5 flex items-center gap-3 text-xs text-muted-foreground border-t border-border pt-4">
                  <Clock className="h-3 w-3" />
                  <span>{n.readingMinutes} min read</span>
                  <span className="h-1 w-1 rounded-full bg-border" />
                  <span>{n.author}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
