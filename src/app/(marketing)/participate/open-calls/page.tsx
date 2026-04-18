import Link from "next/link";
import { ArrowLeft, ExternalLink, Calendar } from "lucide-react";
import { getCalls } from "@/lib/calls";
import { PageHero } from "@/components/marketing/page-hero";
import { Container, Section } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { formatDate, relativeDeadline } from "@/lib/format";
import { INSTRUMENT_COLOR, colorFor } from "@/lib/colors";
import { cn } from "@/lib/utils";

export const metadata = { title: "CHIPS open calls" };
export const revalidate = 3600;

export default async function ChipsOpenCallsPage() {
  const all = await getCalls();
  const calls = all.filter((c) => c.status === "open");

  return (
    <>
      <PageHero
        eyebrow="Step 01 — Find a matching call"
        title="CHIPS open calls for proposals."
        description="All currently open funding opportunities under the Chips Joint Undertaking, sourced live from the EU Funding & Tenders Portal."
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
            <div className="rounded-xl border border-border bg-card p-12 text-center text-muted-foreground">
              No open calls at this time. Check the{" "}
              <a
                href="https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/opportunities/topic-search"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground"
              >
                EU Funding & Tenders Portal
              </a>{" "}
              for updates.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-card">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface-1">
                    <th className="px-5 py-3.5 text-left font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      Call ID
                    </th>
                    <th className="px-5 py-3.5 text-left font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      Title
                    </th>
                    <th className="px-5 py-3.5 text-left font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      Programme
                    </th>
                    <th className="px-5 py-3.5 text-left font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      Type
                    </th>
                    <th className="px-5 py-3.5 text-left font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      Deadline
                    </th>
                    <th className="px-5 py-3.5 text-left font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      Opened
                    </th>
                    <th className="sr-only">Apply</th>
                  </tr>
                </thead>
                <tbody>
                  {calls.map((c, i) => {
                    const instrColor = colorFor(
                      INSTRUMENT_COLOR[c.instrument as keyof typeof INSTRUMENT_COLOR] ?? "brand"
                    );
                    return (
                      <tr
                        key={c.id}
                        className={cn(
                          "group transition-colors hover:bg-surface-2",
                          i > 0 && "border-t border-border"
                        )}
                      >
                        <td className="whitespace-nowrap px-5 py-4 font-mono text-[11px] text-muted-foreground">
                          {c.id}
                        </td>
                        <td className="px-5 py-4 max-w-sm">
                          <span className="font-display text-sm font-semibold leading-snug tracking-tight line-clamp-2">
                            {c.title}
                          </span>
                          {c.summary && (
                            <p className="mt-1 text-xs text-muted-foreground line-clamp-2 max-w-xs">
                              {c.summary}
                            </p>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-5 py-4">
                          <Badge variant="brand">{c.programme}</Badge>
                        </td>
                        <td className="whitespace-nowrap px-5 py-4">
                          <span
                            className={cn(
                              "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium",
                              instrColor.chip
                            )}
                          >
                            {c.instrument}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-5 py-4">
                          {c.deadline ? (
                            <div>
                              <div className="font-display text-sm font-semibold">
                                {formatDate(c.deadline)}
                              </div>
                              <div className="text-[10px] text-amber">
                                {relativeDeadline(c.deadline)}
                              </div>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-sm text-muted-foreground">
                          {formatDate(c.open_date)}
                        </td>
                        <td className="px-5 py-4">
                          <a
                            href={c.portal_url ?? "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground transition hover:border-brand hover:bg-brand hover:text-white"
                          >
                            Apply
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="border-t border-border px-5 py-3 text-xs text-muted-foreground">
                {calls.length} open {calls.length === 1 ? "call" : "calls"} · Data sourced from the{" "}
                <a
                  href="https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/opportunities/topic-search"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-foreground"
                >
                  EU Funding & Tenders Portal
                </a>
              </div>
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}
