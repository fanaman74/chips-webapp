"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

// Deterministic pseudo-random so SSR and client match.
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function CircuitCanvas({ className }: Props) {
  const paths = React.useMemo(() => buildPaths(), []);
  const pads = React.useMemo(() => buildPads(), []);

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
    >
      {/* Colourful gradient mesh */}
      <div className="absolute -top-32 -left-24 h-[420px] w-[420px] rounded-full bg-indigo/25 blur-[120px]" />
      <div className="absolute top-20 right-0 h-[480px] w-[480px] rounded-full bg-accent/25 blur-[130px]" />
      <div className="absolute bottom-0 left-1/3 h-[380px] w-[380px] rounded-full bg-fuchsia/20 blur-[120px]" />
      <div className="absolute top-10 left-1/2 h-[300px] w-[300px] rounded-full bg-amber/15 blur-[100px]" />
      <div className="absolute inset-0 bg-grid bg-grid-fade opacity-40 dark:opacity-30" />
      <svg
        viewBox="0 0 1200 600"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          <linearGradient id="trace-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgb(var(--brand-accent))" stopOpacity="0" />
            <stop offset="50%" stopColor="rgb(var(--brand-accent))" stopOpacity="1" />
            <stop offset="100%" stopColor="rgb(var(--brand-accent))" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgb(var(--brand-accent))" stopOpacity="0.35" />
            <stop offset="100%" stopColor="rgb(var(--brand-accent))" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Soft glow behind center */}
        <circle cx="600" cy="320" r="360" fill="url(#glow)" />

        {/* Static traces */}
        <g stroke="rgb(var(--border))" strokeWidth="1" fill="none" opacity="0.9">
          {paths.map((d, i) => (
            <path key={`s-${i}`} d={d} />
          ))}
        </g>

        {/* Animated trace pulses */}
        <g stroke="url(#trace-grad)" strokeWidth="1.4" fill="none">
          {paths.slice(0, 8).map((d, i) => (
            <path
              key={`a-${i}`}
              d={d}
              className="animate-trace"
              style={{ animationDelay: `${(i * 1.2).toFixed(1)}s`, animationDuration: `${10 + i}s` }}
            />
          ))}
        </g>

        {/* Pads */}
        <g>
          {pads.map((p, i) => (
            <g key={`p-${i}`}>
              <rect
                x={p.x - 3}
                y={p.y - 3}
                width="6"
                height="6"
                fill="rgb(var(--brand-accent))"
                opacity={p.bright ? 0.9 : 0.35}
                className={p.bright ? "animate-pulse-slow" : undefined}
              />
            </g>
          ))}
        </g>

        {/* Center chip silhouette */}
        <g transform="translate(540 260)">
          <rect
            x="0"
            y="0"
            width="120"
            height="120"
            rx="8"
            fill="rgb(var(--brand-blue))"
            opacity="0.10"
            stroke="rgb(var(--brand-blue))"
            strokeOpacity="0.35"
            strokeWidth="1"
          />
          <rect
            x="20"
            y="20"
            width="80"
            height="80"
            rx="4"
            fill="none"
            stroke="rgb(var(--brand-accent))"
            strokeOpacity="0.5"
            strokeWidth="1"
          />
          {/* Pins */}
          {Array.from({ length: 8 }).map((_, i) => {
            const s = 12 + i * 13;
            return (
              <g key={`pin-${i}`}>
                <line x1={s} y1={-6} x2={s} y2={0} stroke="rgb(var(--brand-accent))" strokeOpacity="0.6" />
                <line x1={s} y1={120} x2={s} y2={126} stroke="rgb(var(--brand-accent))" strokeOpacity="0.6" />
                <line x1={-6} y1={s} x2={0} y2={s} stroke="rgb(var(--brand-accent))" strokeOpacity="0.6" />
                <line x1={120} y1={s} x2={126} y2={s} stroke="rgb(var(--brand-accent))" strokeOpacity="0.6" />
              </g>
            );
          })}
        </g>
      </svg>

      {/* Subtle gradient fade to improve text legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/0 to-background" />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/0 to-background" />
    </div>
  );
}

function buildPaths(): string[] {
  const rnd = mulberry32(7);
  const out: string[] = [];
  for (let i = 0; i < 16; i++) {
    const y = 40 + Math.floor(rnd() * 520);
    const segs: string[] = [`M ${-20} ${y}`];
    let x = -20;
    let cy = y;
    while (x < 1220) {
      const dx = 60 + Math.floor(rnd() * 140);
      x += dx;
      segs.push(`L ${x} ${cy}`);
      // occasional right-angle bend
      if (rnd() > 0.55) {
        const dy = (rnd() > 0.5 ? 1 : -1) * (20 + Math.floor(rnd() * 60));
        cy = Math.max(20, Math.min(580, cy + dy));
        segs.push(`L ${x} ${cy}`);
      }
    }
    out.push(segs.join(" "));
  }
  return out;
}

function buildPads() {
  const rnd = mulberry32(42);
  const out: { x: number; y: number; bright: boolean }[] = [];
  for (let i = 0; i < 60; i++) {
    out.push({
      x: Math.floor(rnd() * 1200),
      y: Math.floor(rnd() * 600),
      bright: rnd() > 0.75,
    });
  }
  return out;
}
