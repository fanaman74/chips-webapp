export type EventType = "Info Day" | "Industry Day" | "Webinar" | "Workshop" | "Conference";

export type EventItem = {
  slug: string;
  title: string;
  type: EventType;
  date: string;
  location: string;
  summary: string;
  registrationOpen: boolean;
};

export const EVENTS: EventItem[] = [
  {
    slug: "industry-day-munich-2026",
    title: "Chips JU Industry Day 2026",
    type: "Industry Day",
    date: "2026-06-12",
    location: "Munich, Germany",
    summary:
      "Annual gathering of the European semiconductor ecosystem — flagship programme updates, partner pitching and networking.",
    registrationOpen: true,
  },
  {
    slug: "ecs-info-day-spring-2026",
    title: "ECS Spring 2026 Info Day",
    type: "Info Day",
    date: "2026-03-06",
    location: "Brussels + online",
    summary:
      "Presentation of the three open ECS R&I calls. Live Q&A with programme officers.",
    registrationOpen: true,
  },
  {
    slug: "pilot-line-access-workshop",
    title: "Pilot line access workshop for SMEs",
    type: "Workshop",
    date: "2026-05-14",
    location: "Leuven, Belgium",
    summary:
      "Hands-on workshop covering pilot line access procedures, PDK licensing and shuttle tape-outs.",
    registrationOpen: true,
  },
  {
    slug: "cyber-cert-consultation",
    title: "CYBER-CERT public consultation webinar",
    type: "Webinar",
    date: "2026-04-29",
    location: "Online",
    summary:
      "Walkthrough of the draft certification framework for IoT semiconductors.",
    registrationOpen: true,
  },
  {
    slug: "photonics-workshop",
    title: "Silicon photonics chiplet workshop",
    type: "Workshop",
    date: "2026-05-28",
    location: "Grenoble, France",
    summary:
      "Co-design workshop with the PHOTON-LINK consortium and ecosystem partners.",
    registrationOpen: false,
  },
  {
    slug: "icsw-2026",
    title: "International Chips Sovereignty Week",
    type: "Conference",
    date: "2026-10-07",
    location: "Brussels, Belgium",
    summary:
      "Three-day conference with EU Commission, industry and academia on European semiconductor sovereignty.",
    registrationOpen: false,
  },
];

export function upcomingEvents(n?: number) {
  const sorted = [...EVENTS].sort((a, b) => a.date.localeCompare(b.date));
  return typeof n === "number" ? sorted.slice(0, n) : sorted;
}

export function getEvent(slug: string) {
  return EVENTS.find((e) => e.slug === slug);
}
