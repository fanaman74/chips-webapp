import Link from "next/link";
import { Clock } from "lucide-react";
import { NEWS } from "@/data/news";
import { PageHero } from "@/components/marketing/page-hero";
import { Container, Section } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/format";

export const metadata = { title: "News & Events" };

export default function NewsIndex() {
  const [lead, ...rest] = [...NEWS].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

  return (
    <>
      <PageHero
        eyebrow="News & events"
        title="Announcements, project milestones and policy updates."
        description="The latest from the Chips JU programme office and the projects, pilot lines and partners that make up the European semiconductor ecosystem."
      />

      <Section className="pt-14">
        <Container>
          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <Link
              href={`/news/${lead.slug}`}
              className="group flex flex-col rounded-xl border border-border bg-card p-8 shadow-card transition-all hover:shadow-elevated"
            >
              <div className="flex items-center gap-2">
                <Badge variant="brand">{lead.category}</Badge>
                <span className="text-xs text-muted-foreground">
                  {formatDate(lead.publishedAt)}
                </span>
              </div>
              <h2 className="mt-5 font-display text-3xl font-semibold leading-tight tracking-tight text-balance group-hover:text-brand transition-colors">
                {lead.title}
              </h2>
              <p className="mt-4 text-muted-foreground">{lead.excerpt}</p>
              <div className="mt-auto pt-8 inline-flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-3 w-3" /> {lead.readingMinutes} min read
                <span className="h-1 w-1 rounded-full bg-border" />
                {lead.author}
              </div>
            </Link>

            <div className="grid content-start gap-3">
              {rest.slice(0, 3).map((n) => (
                <Link
                  key={n.slug}
                  href={`/news/${n.slug}`}
                  className="group rounded-xl border border-border bg-card p-5 shadow-card transition-all hover:shadow-elevated"
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
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                    {n.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {rest.slice(3).map((n) => (
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
                <h3 className="mt-3 font-display text-lg font-semibold leading-snug group-hover:text-brand transition-colors">
                  {n.title}
                </h3>
                <p className="mt-3 text-sm text-muted-foreground line-clamp-3">
                  {n.excerpt}
                </p>
              </Link>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
