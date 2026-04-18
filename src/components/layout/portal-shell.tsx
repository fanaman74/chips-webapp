"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  FileText,
  FolderKanban,
  Home,
  LifeBuoy,
  LogOut,
  Mail,
  Search,
  Settings,
  ShieldCheck,
} from "lucide-react";
import { Logo, LogoMark } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import type { Session } from "@/lib/auth";

const NAV_BASE = [
  { label: "Dashboard", href: "/portal/dashboard", icon: Home },
  { label: "Applications", href: "/portal/applications", icon: FileText },
  { label: "My projects", href: "/portal/projects", icon: FolderKanban },
  { label: "Messages", href: "/portal/messages", icon: Mail },
];

const NAV_ADMIN = [
  { label: "Admin", href: "/portal/admin", icon: ShieldCheck },
];

export function PortalShell({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session;
}) {
  const pathname = usePathname();
  const nav = session.role === "admin" ? [...NAV_BASE, ...NAV_ADMIN] : NAV_BASE;

  return (
    <div className="flex min-h-dvh">
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-border bg-surface-2 md:flex">
        <div className="flex h-16 items-center border-b border-border px-5">
          <Link href="/" className="inline-flex items-center">
            <Logo />
          </Link>
        </div>
        <nav className="flex-1 px-3 py-5 space-y-0.5">
          {nav.map((item) => {
            const Icon = item.icon;
            const active =
              pathname === item.href ||
              (item.href !== "/portal" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-card text-foreground shadow-sm border border-border"
                    : "text-foreground/70 hover:text-foreground hover:bg-card/50",
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-border p-3 space-y-0.5">
          <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-foreground/70 hover:text-foreground hover:bg-card/50 transition-colors">
            <LifeBuoy className="h-4 w-4" /> Support
          </button>
          <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-foreground/70 hover:text-foreground hover:bg-card/50 transition-colors">
            <Settings className="h-4 w-4" /> Settings
          </button>
        </div>
        <div className="border-t border-border p-3">
          <div className="flex items-center gap-3 rounded-md bg-card p-3 border border-border">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand text-white text-sm font-semibold">
              {session.name
                .split(" ")
                .map((s) => s[0])
                .slice(0, 2)
                .join("")}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium">{session.name}</div>
              <div className="truncate text-xs text-muted-foreground">{session.org}</div>
            </div>
            <form action="/api/auth/logout" method="post">
              <button
                type="submit"
                className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-surface-2 text-foreground/60 hover:text-foreground"
                aria-label="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </aside>

      <div className="flex-1 md:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/85 px-5 backdrop-blur-lg md:px-8">
          <div className="md:hidden">
            <LogoMark className="h-6 w-6" />
          </div>
          <div className="relative flex-1 max-w-xl">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Search applications, projects, calls…"
              className="h-10 w-full rounded-md border border-border bg-surface-1 pl-9 pr-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-surface-1 text-foreground/70 hover:text-foreground hover:bg-surface-2 relative">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-0.5 -right-0.5 inline-block h-2 w-2 rounded-full bg-accent" />
            </button>
            <ThemeToggle />
          </div>
        </header>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
