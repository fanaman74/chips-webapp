import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHero } from "@/components/marketing/page-hero";
import { ConsortiumForm } from "./consortium-form";

export const metadata = { title: "Find consortium partners" };

export default function ConsortiumPage() {
  return (
    <>
      <PageHero
        eyebrow="Step 02 — Build your consortium"
        title="Find research partners."
        description="Describe your project and we'll search the CORDIS database of European R&I organisations to find the best consortium partners — ranked by AI."
      >
        <Link
          href="/participate"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Participate
        </Link>
      </PageHero>

      <ConsortiumForm />
    </>
  );
}
