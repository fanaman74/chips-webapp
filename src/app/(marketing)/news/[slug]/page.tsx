import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import { NEWS, getArticle } from "@/data/news";
import { Container, Section } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/format";
import { NEWS_CATEGORY_COLOR, colorFor } from "@/lib/colors";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return NEWS.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = getArticle(slug);
  return { title: a ? a.title : "News" };
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const more = NEWS.filter((n) => n.slug !== slug && n.category !== "Event").slice(0, 3);
  const color = colorFor(NEWS_CATEGORY_COLOR[article.category] ?? "brand");

  return (
    <>
      {/* Hero header */}
      <section className="relative overflow-hidden border-b border-border bg-surface-2/40 py-14 md:py-20">
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-gradient-to-br opacity-40 blur-3xl",
            color.gradient,
          )}
        />
        <Container className="max-w-5xl">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to news
          </Link>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
                color.chip,
              )}
            >
              <span className={cn("h-1.5 w-1.5 rounded-full", color.dot)} />
              {article.category}
            </span>
          </div>

          <h1 className="mt-4 font-display text-3xl font-semibold leading-tight tracking-tight text-balance md:text-5xl max-w-3xl">
            {article.title}
          </h1>
          <p className="mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
            {article.excerpt}
          </p>
        </Container>
      </section>

      {/* Article body + sidebar */}
      <Section>
        <Container className="max-w-5xl">
          <div className="grid gap-12 lg:grid-cols-[1fr_280px]">
            {/* Body */}
            <div>
              <div className="space-y-6 text-pretty text-base leading-[1.85] text-foreground/90">
                {article.body.split("\n\n").map((para, i) => {
                  if (para.startsWith("# ")) {
                    return (
                      <h2 key={i} className="font-display text-2xl font-semibold tracking-tight pt-4">
                        {para.slice(2)}
                      </h2>
                    );
                  }
                  if (para.startsWith("## ")) {
                    return (
                      <h3 key={i} className="font-display text-xl font-semibold tracking-tight pt-2">
                        {para.slice(3)}
                      </h3>
                    );
                  }
                  return <p key={i}>{para}</p>;
                })}
              </div>

              <div className="mt-12 flex items-center gap-4 border-t border-border pt-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-2 text-foreground/60">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold">{article.author}</div>
                  <div className="text-xs text-muted-foreground">Chips JU Communications</div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-xl border border-border bg-card p-5 shadow-card">
                <h3 className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Article details
                </h3>
                <dl className="mt-4 space-y-4 text-sm">
                  <div className="flex items-start gap-3">
                    <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    <div>
                      <dt className="text-xs text-muted-foreground">Published</dt>
                      <dd className="font-medium">{formatDate(article.publishedAt)}</dd>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    <div>
                      <dt className="text-xs text-muted-foreground">Reading time</dt>
                      <dd className="font-medium">{article.readingMinutes} min read</dd>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <User className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    <div>
                      <dt className="text-xs text-muted-foreground">Author</dt>
                      <dd className="font-medium">{article.author}</dd>
                    </div>
                  </div>
                </dl>
              </div>

              <div className="rounded-xl border border-border bg-card p-5 shadow-card">
                <h3 className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-3">
                  Related
                </h3>
                <div className="space-y-3">
                  {more.slice(0, 2).map((n) => (
                    <Link
                      key={n.slug}
                      href={`/news/${n.slug}`}
                      className="group block rounded-lg border border-border bg-surface-2/50 p-3 text-sm transition-colors hover:bg-surface-2"
                    >
                      <Badge variant="outline" className="mb-2 text-[10px]">{n.category}</Badge>
                      <p className="font-medium leading-snug group-hover:text-brand transition-colors">
                        {n.title}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">{formatDate(n.publishedAt)}</p>
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </Section>

      {/* More articles */}
      <section className="border-t border-border bg-surface-2/60 py-14">
        <Container>
          <h2 className="font-display text-2xl font-semibold tracking-tight">
            More from Chips JU
          </h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 md:grid-cols-3">
            {more.map((n) => {
              const c = colorFor(NEWS_CATEGORY_COLOR[n.category] ?? "brand");
              return (
                <Link
                  key={n.slug}
                  href={`/news/${n.slug}`}
                  className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-elevated"
                >
                  <span aria-hidden className={cn("absolute inset-x-0 top-0 h-1", c.dot)} />
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
                  <h3 className="mt-3 font-display text-base font-semibold leading-snug group-hover:text-brand transition-colors">
                    {n.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{n.excerpt}</p>
                </Link>
              );
            })}
          </div>
        </Container>
      </section>
    </>
  );
}
