-- Run this in the Supabase SQL editor.
-- The site inserts leads with the service role key from the server.
-- Row level security stays on, with no public policies, so the anon key
-- cannot read or write customer messages.

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 2 and 80),
  email text not null check (position('@' in email) > 1),
  phone text check (phone is null or char_length(phone) between 1 and 30),
  project_type text not null check (project_type in ('restaurant', 'portfolio', 'both', 'unsure')),
  project_name text check (project_name is null or char_length(project_name) between 1 and 80),
  timeline text check (timeline is null or timeline in ('asap', 'this-month', 'this-season', 'browsing')),
  message text not null check (char_length(message) between 10 and 2000)
);

alter table public.inquiries enable row level security;

revoke all on table public.inquiries from anon, authenticated;
grant select, insert on table public.inquiries to service_role;

create index if not exists inquiries_created_at_idx
  on public.inquiries (created_at desc);
