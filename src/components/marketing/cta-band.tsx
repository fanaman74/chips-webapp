import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/container";

export function CtaBand() {
  return (
    <Section className="py-20">
      <Container>
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-8 md:p-14 shadow-card">
          <div
            aria-hidden
            className="absolute inset-0 bg-grid bg-grid-fade opacity-40 dark:opacity-25"
          />
          <div
            aria-hidden
            className="absolute -top-40 -right-24 h-[420px] w-[420px] rounded-full bg-accent/20 blur-3xl"
          />
          <div className="relative grid gap-8 md:grid-cols-5 md:items-center">
            <div className="md:col-span-3">
              <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl text-balance">
                Building Europe&rsquo;s chips? We want to work with you.
              </h2>
              <p className="mt-4 max-w-xl text-muted-foreground">
                Whether you&rsquo;re an SME, research institution, university or
                industrial consortium — the Chips JU has a pathway for you. Explore
                open calls, browse pilot line access, or contact the programme
                office directly.
              </p>
            </div>
            <div className="md:col-span-2 md:justify-self-end">
              <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
                <Button size="lg" asChild>
                  <Link href="/calls">
                    See open calls
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/participate">How to participate</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
