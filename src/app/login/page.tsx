import Link from "next/link";
import { ArrowLeft, ArrowRight, Building2, ShieldCheck, User } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Container } from "@/components/ui/container";

export const metadata = { title: "Sign in" };

const ROLES = [
  {
    id: "applicant",
    icon: User,
    name: "Sign in as Applicant",
    subtitle: "Dr. Elena Moreau — ETH Zurich",
    description:
      "Draft proposals, manage your consortium, track evaluation status.",
  },
  {
    id: "partner",
    icon: Building2,
    name: "Sign in as Partner",
    subtitle: "Andreas Weber — Infineon Technologies",
    description:
      "View funded projects, submit milestone reports, manage consortium members.",
  },
  {
    id: "admin",
    icon: ShieldCheck,
    name: "Sign in as Programme Officer",
    subtitle: "Sofia Ricci — Chips JU Programme Office",
    description:
      "Publish news, manage calls, review submission queues, export reports.",
  },
];

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect = "/portal" } = await searchParams;
  return (
    <div className="relative flex min-h-dvh flex-col">
      <header className="border-b border-border">
        <Container className="flex h-16 items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2">
            <Logo />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to site
          </Link>
        </Container>
      </header>

      <main className="relative flex-1 overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 bg-grid bg-grid-fade opacity-30 dark:opacity-20"
        />
        <Container className="relative py-16 md:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-1/80 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-amber" />
              Demo environment — one-click sign in as any role
            </div>
            <h1 className="mt-6 font-display text-3xl font-semibold leading-tight tracking-tight md:text-5xl text-balance">
              Sign in to the applicant portal.
            </h1>
            <p className="mt-4 text-muted-foreground">
              In the full production portal, sign-in uses EU Login (SSO) with two-factor
              authentication. For this prototype, choose a role to explore the experience.
            </p>
          </div>

          <div className="mx-auto mt-12 grid max-w-4xl gap-4 md:grid-cols-3">
            {ROLES.map((r) => {
              const Icon = r.icon;
              return (
                <form
                  key={r.id}
                  action="/api/auth/login"
                  method="post"
                  className="group relative flex flex-col rounded-2xl border border-border bg-card p-6 shadow-card transition-all hover:shadow-elevated hover:-translate-y-0.5"
                >
                  <input type="hidden" name="role" value={r.id} />
                  <input type="hidden" name="redirect" value={redirect} />
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h2 className="mt-4 font-display text-lg font-semibold tracking-tight">
                    {r.name}
                  </h2>
                  <p className="mt-0.5 font-mono text-xs text-accent-600">{r.subtitle}</p>
                  <p className="mt-3 flex-1 text-sm text-muted-foreground">{r.description}</p>
                  <button
                    type="submit"
                    className="mt-5 inline-flex items-center justify-between rounded-md border border-border bg-surface-1 px-4 py-2.5 text-sm font-medium transition-all group-hover:border-brand group-hover:bg-brand group-hover:text-white"
                  >
                    <span>Continue</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </form>
              );
            })}
          </div>

          <div className="mx-auto mt-14 max-w-2xl rounded-xl border border-border bg-surface-2 p-5 text-center text-sm text-muted-foreground">
            EU Login, SMS OTP and hardware security keys are supported in the production
            system. National eIDs accepted via eIDAS.
          </div>
        </Container>
      </main>
    </div>
  );
}
