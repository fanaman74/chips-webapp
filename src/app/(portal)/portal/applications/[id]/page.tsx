import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { APPLICATIONS } from "@/data/applications";
import { ApplicationWizard } from "@/components/portal/application-wizard";
import { PortalContainer } from "@/components/portal/portal-container";
import { Badge } from "@/components/ui/badge";
import { STATUS_LABEL } from "@/data/applications";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const a = APPLICATIONS.find((x) => x.id === id);
  return { title: a ? `${a.acronym} — application` : "Application" };
}

export default async function ApplicationDraftPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const a = APPLICATIONS.find((x) => x.id === id);
  if (!a) notFound();

  return (
    <PortalContainer>
      <Link
        href="/portal/applications"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to applications
      </Link>
      <div className="mt-4 mb-8">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="amber">{STATUS_LABEL[a.status]}</Badge>
          <span className="font-mono text-xs text-muted-foreground">{a.callRef}</span>
        </div>
        <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight md:text-3xl">
          <span className="font-mono text-accent-600 text-base">{a.acronym}</span>
          <span className="block mt-1">{a.title}</span>
        </h1>
      </div>
      <ApplicationWizard callRef={a.callRef} callTitle={a.callTitle} />
    </PortalContainer>
  );
}
