# Chips JU Webapp — Pitch Prototype

A high-fidelity, navigable prototype pitched as a redesign of the Chips Joint Undertaking (chips-ju.europa.eu). Modern institutional design, inspired by the craft of openclaw.ai but scaled for an EU body.

> This is a prototype — mock auth, mock data, no real backend. Built to demonstrate design direction, information architecture and user flows for a stakeholder pitch.

## Stack

- Next.js 16 (App Router, React 19, Turbopack)
- TypeScript strict
- Tailwind CSS v4 with a custom design-token system
- Framer Motion for measured motion
- Lucide icons · Space Grotesk + Geist display/body fonts

## Run it

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## 5-minute demo script

Walk a Chips JU stakeholder through the pitch in this order:

1. **Home** (`/`) — open in light mode. Scroll slowly: the animated circuit background, the stats counters, programme cards, featured projects, open calls panel, Europe map, news module, CTA band. Toggle dark mode (top-right) to show both themes.
2. **Projects explorer** (`/projects`) — filter by topic area, drag the TRL slider, search "quantum". Click a project card.
3. **Project detail** (e.g. `/projects/eurohpc-edge`) — show consortium table, outcomes, funding breakdown.
4. **Open calls** (`/calls`) — grouped by status, each line compact yet rich. Click the first open call.
5. **Call detail** — show the full evaluation timeline, eligibility panel, then hit **Start application**.
6. **Login** (`/login`) — choose *Applicant*. The portal opens.
7. **Portal dashboard** (`/portal/dashboard`) — KPIs, drafts with progress bars, notifications, matched calls.
8. **Application wizard** (`/portal/applications/new`) — step through: eligibility checklist → consortium editor (add/remove a partner) → budget slider (watch the numbers move) → work plan → review.
9. **Project workspace** (`/portal/projects/greensoc`) — milestone timeline, reporting period, messages, consortium.
10. Sign out. Sign back in as **Programme Officer** to show the admin view (`/portal/admin`).

## What's real vs mocked

**Real:** routing, layouts, theme system, all UI components, filter/search logic, wizard state, responsive breakpoints, SSR, static generation for content pages.

**Mocked:** authentication (cookie-only, no password), content (realistic but fabricated), application persistence (lives in React state within the wizard), admin CRUD, email/notifications.

## Project layout

```
src/
├── app/
│   ├── (marketing)/    # Public site with site header/footer
│   ├── (portal)/       # Authenticated portal shell
│   ├── api/auth/       # Mock login/logout routes
│   ├── login/          # Role picker
│   ├── layout.tsx      # Root (fonts, theme provider)
│   └── globals.css     # Design tokens
├── components/
│   ├── brand/          # Logo
│   ├── layout/         # SiteHeader, SiteFooter, PortalShell
│   ├── marketing/      # Hero, CircuitCanvas, StatsRow, cards, ...
│   ├── portal/         # Wizard, containers
│   └── ui/             # Button, Card, Badge, Input, Select, Container
├── data/               # Mock content (projects, calls, news, ...)
└── lib/                # auth, utils, format
```

## Design tokens

All colour, radius, shadow and typography tokens are defined in `src/app/globals.css` under `@theme inline`. Light and dark palettes use the same semantic names (`--brand-blue`, `--brand-accent`, `--surface-1`, etc.) — swap one value, and every surface updates coherently.

## Deployment

The app is Vercel-ready. No environment variables are needed for the prototype.

```bash
npm run build
npm run start
```
