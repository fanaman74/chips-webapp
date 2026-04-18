import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { Container } from "@/components/ui/container";

const SECTIONS = [
  {
    title: "Organisation",
    links: [
      { label: "About", href: "/about" },
      { label: "Vision & mission", href: "/about/vision" },
      { label: "Governance", href: "/about/governance" },
      { label: "Members", href: "/about/members" },
      { label: "Transparency", href: "/about/transparency" },
    ],
  },
  {
    title: "Programmes",
    links: [
      { label: "Chips for Europe", href: "/programs/chips-for-europe" },
      { label: "ECS R&I Calls", href: "/programs/ecs-calls" },
      { label: "Pilot Lines", href: "/programs/pilot-lines" },
      { label: "Projects", href: "/projects" },
    ],
  },
  {
    title: "Participate",
    links: [
      { label: "Open calls", href: "/calls" },
      { label: "How to apply", href: "/participate" },
      { label: "Documents", href: "/documents" },
      { label: "Events", href: "/events" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/legal/privacy" },
      { label: "Cookies", href: "/legal/cookies" },
      { label: "Accessibility", href: "/legal/accessibility" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="relative mt-24 border-t border-border bg-surface-2">
      <Container className="py-16">
        <div className="grid gap-12 md:grid-cols-5">
          <div className="md:col-span-2 space-y-5">
            <Logo />
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              The Chips Joint Undertaking — a public-private partnership bolstering
              Europe&rsquo;s semiconductor industry.
            </p>
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 items-center rounded-md border border-border bg-surface-1 px-3 text-xs text-muted-foreground">
                Horizon Europe
              </span>
              <span className="inline-flex h-10 items-center rounded-md border border-border bg-surface-1 px-3 text-xs text-muted-foreground">
                Digital Europe
              </span>
            </div>
          </div>

          {SECTIONS.map((section) => (
            <div key={section.title}>
              <div className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                {section.title}
              </div>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-foreground/70 transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-border pt-6 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Chips Joint Undertaking. A body of the European Union.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>Funded by the European Union</span>
            <span className="h-1 w-1 rounded-full bg-border" />
            <span>Prototype pitch design</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
