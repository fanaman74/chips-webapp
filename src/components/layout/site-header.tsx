"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string; description?: string }[];
};

const NAV: NavItem[] = [
  {
    label: "About",
    href: "/about",
    children: [
      { label: "Vision", href: "/about/vision", description: "Our mission and strategic objectives" },
      { label: "Governance", href: "/about/governance", description: "Governing board and programme office" },
      { label: "Members", href: "/about/members", description: "Participating states and industry" },
      { label: "History", href: "/about/history", description: "From ECSEL to Chips JU" },
      { label: "Transparency", href: "/about/transparency", description: "Financial reporting and audits" },
    ],
  },
  {
    label: "Programmes",
    href: "/programs",
    children: [
      { label: "Chips for Europe Initiative", href: "/programs/chips-for-europe", description: "Pilot lines for advanced semiconductor technologies" },
      { label: "ECS R&I Calls", href: "/programs/ecs-calls", description: "Research grants across TRLs 1–8" },
      { label: "Pilot Lines", href: "/programs/pilot-lines", description: "Infrastructure and access" },
    ],
  },
  { label: "Projects", href: "/projects" },
  { label: "Calls", href: "/calls" },
  { label: "News & Events", href: "/news" },
  { label: "Participate", href: "/participate" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-200",
        scrolled
          ? "border-b border-border bg-background/85 backdrop-blur-lg"
          : "border-b border-transparent bg-background/0",
      )}
    >
      <div className="mx-auto relative flex h-16 w-full max-w-7xl items-center px-5 md:px-8">
        <Link href="/" className="inline-flex items-center">
          <Logo compact />
        </Link>

        <nav className="absolute left-1/2 -translate-x-1/2 hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <NavLink key={item.href} item={item} pathname={pathname} />
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Sign in</Link>
            </Button>
          </div>
          <button
            type="button"
            aria-label="Menu"
            onClick={() => setMobileOpen((v) => !v)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-surface-1 lg:hidden"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-background lg:hidden">
          <div className="mx-auto max-w-7xl px-5 py-4">
            {NAV.map((item) => (
              <div key={item.href} className="py-1">
                <Link
                  href={item.href}
                  className="block py-2 font-medium text-foreground"
                >
                  {item.label}
                </Link>
                {item.children && (
                  <div className="ml-3 border-l border-border pl-3">
                    {item.children.map((c) => (
                      <Link
                        key={c.href}
                        href={c.href}
                        className="block py-1.5 text-sm text-muted-foreground hover:text-foreground"
                      >
                        {c.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="mt-4 flex gap-2">
              <Button variant="outline" size="sm" className="flex-1" asChild>
                <Link href="/login">Sign in</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function NavLink({ item, pathname }: { item: NavItem; pathname: string }) {
  const active =
    pathname === item.href ||
    (item.href !== "/" && pathname.startsWith(item.href));

  if (!item.children) {
    return (
      <Link
        href={item.href}
        className={cn(
          "rounded-md px-3 py-2 text-sm font-medium transition-colors",
          active
            ? "text-foreground bg-surface-2"
            : "text-foreground/70 hover:text-foreground hover:bg-surface-2",
        )}
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div className="group relative">
      <Link
        href={item.href}
        className={cn(
          "inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors",
          active
            ? "text-foreground bg-surface-2"
            : "text-foreground/70 hover:text-foreground hover:bg-surface-2",
        )}
      >
        {item.label}
        <ChevronDown className="h-3.5 w-3.5 opacity-60 transition group-hover:rotate-180" />
      </Link>
      <div className="absolute left-0 top-full w-[320px] pt-2 opacity-0 invisible translate-y-1 transition-all group-hover:opacity-100 group-hover:visible group-hover:translate-y-0">
        <div className="rounded-lg border border-border bg-card p-2 shadow-elevated">
          {item.children!.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="block rounded-md p-3 hover:bg-surface-2"
            >
              <div className="text-sm font-medium">{c.label}</div>
              {c.description && (
                <div className="mt-0.5 text-xs text-muted-foreground">
                  {c.description}
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
