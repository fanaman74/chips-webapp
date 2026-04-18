import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { getOpenCalls } from "@/lib/calls";
import { PageHero } from "@/components/marketing/page-hero";
import { Container, Section } from "@/components/ui/container";
import { CallMatchClient } from "./call-match-client";

export const metadata = { title: "Call Match — CHIPS JU" };
export const revalidate = 3600;

export default async function CallMatchPage() {
  const calls = await getOpenCalls();

  return (
    <>
      <PageHero
        eyebrow="Step 01 — Evaluate your fit"
        title="Call Match."
        description="Describe your project idea and let our AI evaluator — trained as a senior Horizon Europe expert — assess how well it fits the call, score it against EU criteria, and tell you exactly how to strengthen it."
      >
        <Link
          href="/participate/open-calls"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Open Calls
        </Link>
      </PageHero>

      <Section>
        <Container>
          {calls.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card p-16 text-center">
              <p className="text-muted-foreground">No open calls available at this time.</p>
            </div>
          ) : (
            <Suspense fallback={null}>
              <CallMatchClient calls={calls} />
            </Suspense>
          )}
        </Container>
      </Section>
    </>
  );
}
