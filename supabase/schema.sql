-- Run this in the Supabase SQL editor.
-- The site inserts leads with the service role key from the server.
-- Row level security stays on, with no public policies, so the anon key
-- cannot read or write customer messages.

create table if not exists public.inquiries (
  id uuid primary key default extensions.gen_random_uuid(),
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

alter table public.inquiries
  alter column id set default extensions.gen_random_uuid();

revoke all on table public.inquiries from anon, authenticated;
grant usage on schema public to service_role;
grant select, insert on table public.inquiries to service_role;

notify pgrst, 'reload schema';

create index if not exists inquiries_created_at_idx
  on public.inquiries (created_at desc);

-- Private client proposals. The desk writes these with the service role key.
-- Each link expires after 7 days. Pictures live in the private "proposals" bucket.

create table if not exists public.proposals (
  id uuid primary key default extensions.gen_random_uuid(),
  created_at timestamptz not null default now(),
  client_name text not null check (char_length(client_name) between 2 and 80),
  title text not null check (char_length(title) between 2 and 120),
  description text not null check (char_length(description) between 10 and 12000),
  token text not null unique check (char_length(token) between 20 and 80),
  expires_at timestamptz not null
);

create table if not exists public.proposal_images (
  id uuid primary key default extensions.gen_random_uuid(),
  proposal_id uuid not null references public.proposals(id) on delete cascade,
  created_at timestamptz not null default now(),
  storage_path text not null,
  sort_order integer not null default 0
);

create table if not exists public.proposal_audit (
  id uuid primary key default extensions.gen_random_uuid(),
  proposal_id uuid not null references public.proposals(id) on delete cascade,
  created_at timestamptz not null default now(),
  event text not null check (event in ('created', 'viewed', 'regenerated', 'expired')),
  detail text,
  ip text
);

alter table public.proposals enable row level security;
alter table public.proposal_images enable row level security;
alter table public.proposal_audit enable row level security;

revoke all on table public.proposals from anon, authenticated;
revoke all on table public.proposal_images from anon, authenticated;
revoke all on table public.proposal_audit from anon, authenticated;

grant select, insert, update, delete on table public.proposals to service_role;
grant select, insert, delete on table public.proposal_images to service_role;
grant select, insert, delete on table public.proposal_audit to service_role;

create index if not exists proposals_token_idx on public.proposals (token);
create index if not exists proposal_audit_proposal_idx
  on public.proposal_audit (proposal_id, created_at desc);

create table if not exists public.desk_users (
  id uuid primary key default extensions.gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null unique check (position('@' in email) > 1),
  name text not null check (char_length(name) between 2 and 80),
  password_hash text not null
);

alter table public.desk_users enable row level security;
revoke all on table public.desk_users from anon, authenticated;
grant select, insert on table public.desk_users to service_role;

create table if not exists public.desk_signups (
  email text primary key check (position('@' in email) > 1),
  name text not null check (char_length(name) between 2 and 80),
  password_hash text not null,
  code_hash text not null,
  attempts integer not null default 0,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

alter table public.desk_signups enable row level security;
revoke all on table public.desk_signups from anon, authenticated;
grant select, insert, update, delete on table public.desk_signups to service_role;

insert into storage.buckets (id, name, public)
values ('proposals', 'proposals', false)
on conflict (id) do update set public = false;

alter table public.proposal_audit drop constraint if exists proposal_audit_event_check;
alter table public.proposal_audit
  add constraint proposal_audit_event_check
  check (event in ('created', 'viewed', 'regenerated', 'expired', 'edited'));

do $$
declare constraint_name text;
begin
  for constraint_name in
    select conname
    from pg_constraint
    where conrelid = 'public.proposals'::regclass
      and contype = 'c'
      and pg_get_constraintdef(oid) ilike '%description%'
  loop
    execute format('alter table public.proposals drop constraint %I', constraint_name);
  end loop;
end $$;

alter table public.proposals
  add constraint proposals_description_check
  check (char_length(description) between 10 and 12000);

grant delete on table public.proposals to service_role;
grant delete on table public.proposal_audit to service_role;

notify pgrst, 'reload schema';
