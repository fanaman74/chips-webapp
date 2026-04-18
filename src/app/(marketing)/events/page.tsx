import Link from "next/link";
import { Calendar, MapPin } from "lucide-react";
import { upcomingEvents } from "@/data/events";
import { PageHero } from "@/components/marketing/page-hero";
import { Container, Section } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/format";

export const metadata = { title: "Events" };

export default function EventsPage() {
  const events = upcomingEvents();
  return (
    <>
      <PageHero
        eyebrow="Events"
        title="Info Days, workshops and the annual Industry Day."
        description="Meet programme officers, prospective consortium partners, pilot line operators and the broader Chips JU community."
      />
      <Section>
        <Container>
          <div className="grid gap-5 md:grid-cols-2">
            {events.map((e) => (
              <Link
                key={e.slug}
                href={`/events/${e.slug}`}
                className="group flex flex-col gap-4 rounded-xl border border-border bg-card p-6 shadow-card transition-all hover:shadow-elevated"
              >
                <div className="flex items-center gap-2">
                  <Badge variant="brand">{e.type}</Badge>
                  {e.registrationOpen ? (
                    <Badge variant="success">Registration open</Badge>
                  ) : (
                    <Badge variant="outline">Save the date</Badge>
                  )}
                </div>
                <h3 className="font-display text-xl font-semibold leading-tight tracking-tight group-hover:text-brand transition-colors">
                  {e.title}
                </h3>
                <p className="text-sm text-muted-foreground">{e.summary}</p>
                <div className="mt-auto grid grid-cols-2 gap-4 border-t border-border pt-4 text-xs">
                  <div className="inline-flex items-center gap-1.5 text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span className="font-medium text-foreground">{formatDate(e.date)}</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span>{e.location}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
