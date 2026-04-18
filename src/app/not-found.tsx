import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/brand/logo";

export default function NotFound() {
  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center px-5">
      <div
        aria-hidden
        className="absolute inset-0 bg-grid bg-grid-fade opacity-30 dark:opacity-20"
      />
      <div className="relative text-center">
        <LogoMark className="mx-auto h-12 w-12" />
        <div className="mt-8 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          Error 404
        </div>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight md:text-6xl">
          Signal lost on the substrate.
        </h1>
        <p className="mx-auto mt-4 max-w-md text-balance text-muted-foreground">
          The page you&rsquo;re looking for doesn&rsquo;t exist. Check the URL or head back
          to the home page.
        </p>
        <Button className="mt-8" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
        </Button>
      </div>
    </main>
  );
}
