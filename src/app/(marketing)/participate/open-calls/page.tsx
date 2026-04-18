import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { getCalls } from "@/lib/calls";
import { PageHero } from "@/components/marketing/page-hero";
import { Container, Section } from "@/components/ui/container";
import { OpenCallsGrid } from "./open-calls-grid";

export const metadata = { title: "CHIPS open calls" };
export const revalidate = 3600;

export default async function ChipsOpenCallsPage() {
  const all = await getCalls();
  const calls = all.filter((c) => c.status === "open");

  return (
    <>
      <PageHero
        eyebrow="Step 01 — Find a matching call"
        title="Open calls for proposals."
        description={`${calls.length} funding ${calls.length === 1 ? "opportunity" : "opportunities"} currently open under the Chips Joint Undertaking. Click any call for an AI-generated briefing.`}
      >
        <Link
          href="/participate"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Participate
        </Link>
      </PageHero>

      <Section>
        <Container>
          {calls.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card p-16 text-center">
              <p className="text-muted-foreground">No open calls at this time.</p>
              <a
                href="https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/opportunities/topic-search"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:underline"
              >
                Browse the EU Funding & Tenders Portal
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          ) : (
            <OpenCallsGrid calls={calls} />
          )}

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Data sourced from the{" "}
            <a
              href="https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/opportunities/topic-search"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground"
            >
              EU Funding & Tenders Portal
            </a>
          </p>
        </Container>
      </Section>
    </>
  );
}
