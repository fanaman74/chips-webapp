"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const current = mounted ? (resolvedTheme ?? theme) : "light";
  const isDark = current === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle theme"
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-surface-1 text-foreground/70 transition hover:text-foreground hover:bg-surface-2",
        className,
      )}
    >
      <Sun className={cn("h-4 w-4 transition", isDark ? "opacity-0 -rotate-90" : "opacity-100 rotate-0")} />
      <Moon className={cn("absolute h-4 w-4 transition", isDark ? "opacity-100 rotate-0" : "opacity-0 rotate-90")} />
    </button>
  );
}
