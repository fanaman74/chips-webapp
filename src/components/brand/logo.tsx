import * as React from "react";
import { cn } from "@/lib/utils";

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5 select-none", className)}>
      <LogoMark className="h-7 w-7" />
      {!compact && (
        <span className="font-display text-base font-semibold tracking-tight">
          Chips JU
        </span>
      )}
    </span>
  );
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <rect x="1" y="1" width="30" height="30" rx="6" fill="rgb(var(--brand-blue))" />
      <rect x="6" y="6" width="20" height="20" rx="2" stroke="rgb(var(--brand-accent))" strokeWidth="1.5" strokeOpacity="0.7" />
      <path
        d="M11 12 L11 10 M15 12 L15 10 M19 12 L19 10 M11 22 L11 20 M15 22 L15 20 M19 22 L19 20 M8 15 L6 15 M8 19 L6 19 M24 15 L26 15 M24 19 L26 19"
        stroke="rgb(var(--brand-accent))"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <rect x="11" y="12" width="10" height="8" rx="1" fill="rgb(var(--brand-accent))" fillOpacity="0.25" stroke="rgb(var(--brand-accent))" strokeWidth="1" />
      <circle cx="16" cy="16" r="2" fill="#fff" />
    </svg>
  );
}
