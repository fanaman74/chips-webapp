import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ApplicationWizard } from "@/components/portal/application-wizard";
import { PortalContainer } from "@/components/portal/portal-container";

export const metadata = { title: "New application" };

export default function NewApplicationPage() {
  return (
    <PortalContainer>
      <Link
        href="/portal/applications"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to applications
      </Link>
      <div className="mt-4 mb-8">
        <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          New application
        </div>
        <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight md:text-3xl">
          Let&rsquo;s build your proposal.
        </h1>
      </div>
      <ApplicationWizard />
    </PortalContainer>
  );
}
