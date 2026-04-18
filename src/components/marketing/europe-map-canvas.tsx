"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// Equirectangular projection: lon ∈ [-12, 36], lat ∈ [34, 71] → 1200×600
// x = (lon + 12) * 25;   y = (71 - lat) * 16.2
const CAPITALS = [
  { id: "LIS", x: 72,   y: 523, major: false }, // Lisbon
  { id: "MAD", x: 208,  y: 495, major: true  }, // Madrid
  { id: "PAR", x: 359,  y: 359, major: true  }, // Paris
  { id: "BRU", x: 409,  y: 326, major: false }, // Brussels
  { id: "AMS", x: 423,  y: 302, major: true  }, // Amsterdam
  { id: "DUB", x: 144,  y: 286, major: false }, // Dublin
  { id: "LUX", x: 453,  y: 346, major: false }, // Luxembourg
  { id: "BER", x: 635,  y: 299, major: true  }, // Berlin
  { id: "WAR", x: 825,  y: 304, major: true  }, // Warsaw
  { id: "PRA", x: 661,  y: 339, major: false }, // Prague
  { id: "VIE", x: 709,  y: 369, major: true  }, // Vienna
  { id: "BUD", x: 776,  y: 381, major: false }, // Budapest
  { id: "BRN", x: 486,  y: 390, major: false }, // Bern
  { id: "LJU", x: 663,  y: 404, major: false }, // Ljubljana
  { id: "ZAG", x: 700,  y: 408, major: false }, // Zagreb
  { id: "BEL", x: 812,  y: 424, major: false }, // Belgrade
  { id: "ROM", x: 613,  y: 472, major: true  }, // Rome
  { id: "ATH", x: 893,  y: 535, major: true  }, // Athens
  { id: "SOF", x: 883,  y: 458, major: false }, // Sofia
  { id: "BUC", x: 953,  y: 430, major: false }, // Bucharest
  { id: "STO", x: 752,  y: 189, major: true  }, // Stockholm
  { id: "OSL", x: 569,  y: 180, major: false }, // Oslo
  { id: "COP", x: 614,  y: 248, major: false }, // Copenhagen
  { id: "HEL", x: 924,  y: 175, major: false }, // Helsinki
  { id: "TAL", x: 919,  y: 187, major: false }, // Tallinn
  { id: "RIG", x: 903,  y: 228, major: false }, // Riga
  { id: "VIL", x: 932,  y: 264, major: false }, // Vilnius
  { id: "VAL", x: 663,  y: 569, major: false }, // Valletta
  { id: "NIC", x: 1080, y: 578, major: false }, // Nicosia
  { id: "BRA", x: 728,  y: 370, major: false }, // Bratislava
];

// [from, to] index pairs
const CONNECTIONS: [number, number][] = [
  [0,  1 ], // Lisbon – Madrid
  [1,  2 ], // Madrid – Paris
  [2,  3 ], // Paris – Brussels
  [3,  4 ], // Brussels – Amsterdam
  [5,  4 ], // Dublin – Amsterdam
  [3,  6 ], // Brussels – Luxembourg
  [6,  7 ], // Luxembourg – Berlin
  [7,  8 ], // Berlin – Warsaw
  [7,  9 ], // Berlin – Prague
  [9,  10], // Prague – Vienna
  [10, 11], // Vienna – Budapest
  [10, 29], // Vienna – Bratislava
  [2,  12], // Paris – Bern
  [12, 10], // Bern – Vienna
  [10, 13], // Vienna – Ljubljana
  [13, 14], // Ljubljana – Zagreb
  [14, 15], // Zagreb – Belgrade
  [11, 15], // Budapest – Belgrade
  [15, 18], // Belgrade – Sofia
  [18, 17], // Sofia – Athens
  [18, 19], // Sofia – Bucharest
  [8,  19], // Warsaw – Bucharest
  [7,  22], // Berlin – Copenhagen
  [21, 22], // Oslo – Copenhagen
  [22, 20], // Copenhagen – Stockholm
  [20, 23], // Stockholm – Helsinki
  [23, 24], // Helsinki – Tallinn
  [24, 25], // Tallinn – Riga
  [25, 26], // Riga – Vilnius
  [16, 27], // Rome – Valletta
  [17, 28], // Athens – Nicosia
  [2,  7 ], // Paris – Berlin (diagonal)
  [16, 12], // Rome – Bern
];

function arcD(ai: number, bi: number, dir: number): string {
  const a = CAPITALS[ai];
  const b = CAPITALS[bi];
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy);
  const offset = Math.min(len * 0.18, 55) * dir;
  const cx = Math.round(mx - (dy / len) * offset);
  const cy = Math.round(my + (dx / len) * offset);
  return `M ${a.x} ${a.y} Q ${cx} ${cy} ${b.x} ${b.y}`;
}

export function EuropeMapCanvas({ className }: { className?: string }) {
  const arcs = React.useMemo(
    () => CONNECTIONS.map(([ai, bi], i) => ({
      id: `arc-${i}`,
      d: arcD(ai, bi, i % 2 === 0 ? 1 : -1),
      dur: 5 + (i % 6),
    })),
    [],
  );

  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      {/* Atmosphere blobs */}
      <div className="absolute -top-32 -left-24 h-[420px] w-[420px] rounded-full bg-indigo/20 blur-[120px]" />
      <div className="absolute top-10 right-0 h-[480px] w-[480px] rounded-full bg-accent/20 blur-[140px]" />
      <div className="absolute bottom-0 left-1/3 h-[360px] w-[360px] rounded-full bg-fuchsia/15 blur-[120px]" />

      <svg
        viewBox="0 0 1200 600"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
      >
        {/* Static arc lines */}
        <g fill="none" stroke="rgb(var(--brand-accent))" strokeWidth="0.8" opacity="0.18">
          {arcs.map((arc) => (
            <path key={arc.id} id={arc.id} d={arc.d} />
          ))}
        </g>

        {/* Traveling bubbles — 2 per arc, staggered */}
        {arcs.map((arc) => (
          <React.Fragment key={`b-${arc.id}`}>
            <circle r="2.5" fill="rgb(var(--brand-accent))" opacity="0.85">
              <animateMotion
                dur={`${arc.dur}s`}
                repeatCount="indefinite"
                begin={`${(arc.dur * 0.1).toFixed(1)}s`}
              >
                <mpath href={`#${arc.id}`} />
              </animateMotion>
            </circle>
            <circle r="2.5" fill="rgb(var(--brand-accent))" opacity="0.6">
              <animateMotion
                dur={`${arc.dur}s`}
                repeatCount="indefinite"
                begin={`${(arc.dur * 0.6).toFixed(1)}s`}
              >
                <mpath href={`#${arc.id}`} />
              </animateMotion>
            </circle>
          </React.Fragment>
        ))}

        {/* Capital city nodes */}
        {CAPITALS.map((c) => (
          <g key={c.id}>
            <circle cx={c.x} cy={c.y} r={c.major ? 10 : 7} fill="rgb(var(--brand-accent))" opacity="0.07" />
            <circle cx={c.x} cy={c.y} r={c.major ? 3 : 2} fill="rgb(var(--brand-accent))" opacity={c.major ? 0.7 : 0.45} />
            <circle cx={c.x} cy={c.y} r="1" fill="white" opacity="0.8" />
          </g>
        ))}
      </svg>

      {/* Fade edges so hero text stays readable */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/0 to-background" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-background/0 to-background/60" />
    </div>
  );
}
