import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";
import { NEWS, getArticle } from "@/data/news";
import { Container, Section } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/format";

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

  const more = NEWS.filter((n) => n.slug !== slug).slice(0, 3);

  return (
    <>
      <Section className="pt-14 md:pt-20">
        <Container className="max-w-3xl">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to news
          </Link>

          <div className="mt-6 flex items-center gap-2">
            <Badge variant="brand">{article.category}</Badge>
            <span className="text-xs text-muted-foreground">
              {formatDate(article.publishedAt)}
            </span>
            <span className="h-1 w-1 rounded-full bg-border" />
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" /> {article.readingMinutes} min read
            </span>
          </div>

          <h1 className="mt-5 font-display text-3xl font-semibold leading-tight tracking-tight md:text-5xl text-balance">
            {article.title}
          </h1>
          <p className="mt-5 text-pretty text-lg leading-relaxed text-foreground/80">
            {article.excerpt}
          </p>

          <div className="mt-10 space-y-5 text-pretty text-base leading-relaxed text-foreground/90">
            {article.body.split("\n\n").map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          <div className="mt-12 border-t border-border pt-6 text-sm text-muted-foreground">
            By {article.author}
          </div>
        </Container>
      </Section>

      <section className="border-t border-border bg-surface-2/60 py-14">
        <Container>
          <h2 className="font-display text-2xl font-semibold tracking-tight">
            More from Chips JU
          </h2>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {more.map((n) => (
              <Link
                key={n.slug}
                href={`/news/${n.slug}`}
                className="group rounded-xl border border-border bg-card p-6 shadow-card transition-all hover:shadow-elevated"
              >
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{n.category}</Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(n.publishedAt)}
                  </span>
                </div>
                <h3 className="mt-3 font-display text-base font-semibold leading-snug group-hover:text-brand transition-colors">
                  {n.title}
                </h3>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
