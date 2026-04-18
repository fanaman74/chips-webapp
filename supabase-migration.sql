-- Chips JU Webapp — initial schema
-- Run this in the Supabase SQL Editor: https://supabase.com/dashboard/project/cwrojafckucpadzoxqio/sql

create table if not exists public.calls (
  id            text primary key,          -- e.g. HORIZON-JU-CHIPS-2026-1-RIA
  title         text not null,
  summary       text,
  instrument    text not null default '',  -- RIA | IA | CSA | Pilot Line
  programme     text not null default '',  -- ECS R&I | Chips for Europe | Digital Europe
  open_date     date,
  deadline      date,
  budget_eur    bigint,                    -- optional, manually maintained
  portal_url    text,
  status        text not null default 'open'
                  check (status in ('open','forthcoming','closed')),
  synced_at     timestamptz not null default now()
);

-- allow public read
alter table public.calls enable row level security;
create policy "public read" on public.calls for select using (true);

create table if not exists public.sync_log (
  id         bigint generated always as identity primary key,
  source     text not null,
  started_at timestamptz not null default now(),
  ended_at   timestamptz,
  inserted   int default 0,
  updated    int default 0,
  error      text
);

alter table public.sync_log enable row level security;
create policy "public read" on public.sync_log for select using (true);
