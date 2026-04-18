import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, MapPin } from "lucide-react";
import { EVENTS, getEvent } from "@/data/events";
import { Container, Section } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/format";

export function generateStaticParams() {
  return EVENTS.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = getEvent(slug);
  return { title: event ? event.title : "Event" };
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = getEvent(slug);
  if (!event) notFound();

  return (
    <Section className="pt-14">
      <Container className="max-w-3xl">
        <Link
          href="/events"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to events
        </Link>
        <div className="mt-6 flex items-center gap-2">
          <Badge variant="brand">{event.type}</Badge>
          {event.registrationOpen ? (
            <Badge variant="success">Registration open</Badge>
          ) : (
            <Badge variant="outline">Save the date</Badge>
          )}
        </div>
        <h1 className="mt-5 font-display text-3xl font-semibold leading-tight tracking-tight md:text-5xl text-balance">
          {event.title}
        </h1>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Date
              </div>
              <div className="font-display text-base font-semibold">
                {formatDate(event.date)}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Location
              </div>
              <div className="font-display text-base font-semibold">{event.location}</div>
            </div>
          </div>
        </div>
        <p className="mt-8 text-pretty text-lg leading-relaxed text-foreground/85">
          {event.summary}
        </p>
        <div className="mt-8">
          <Button disabled={!event.registrationOpen}>
            {event.registrationOpen ? "Register now" : "Registration opens soon"}
          </Button>
        </div>
      </Container>
    </Section>
  );
}
