-- EduLongView school identity foundation.
-- School and membership writes are performed only by the trusted backend.
-- Never expose the Supabase service-role key to the browser.

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table if not exists public.schools (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 2 and 160),
  status text not null default 'active' check (status in ('active', 'suspended')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.school_memberships (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete restrict,
  user_id uuid not null references auth.users(id) on delete restrict,
  role text not null check (role in ('school_admin', 'teacher')),
  status text not null default 'invited' check (status in ('invited', 'active', 'suspended')),
  invited_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (school_id, user_id)
);

-- An account can belong to only one school in this version of EduLongView.
create unique index if not exists school_memberships_one_school_per_user
  on public.school_memberships(user_id);

create index if not exists school_memberships_school_status_idx
  on public.school_memberships(school_id, status);

create table if not exists public.school_audit_events (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete restrict,
  actor_user_id uuid references auth.users(id) on delete set null,
  event_type text not null check (char_length(event_type) between 3 and 80),
  target_user_id uuid references auth.users(id) on delete set null,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists school_audit_events_school_created_idx
  on public.school_audit_events(school_id, created_at desc);

create index if not exists school_memberships_invited_by_idx
  on public.school_memberships(invited_by)
  where invited_by is not null;

create index if not exists school_audit_events_actor_user_idx
  on public.school_audit_events(actor_user_id)
  where actor_user_id is not null;

create index if not exists school_audit_events_target_user_idx
  on public.school_audit_events(target_user_id)
  where target_user_id is not null;

-- This narrowly scoped SECURITY DEFINER helper is required to avoid recursive
-- membership-table RLS checks. It lives in a non-exposed schema, fixes search_path,
-- and derives identity only from the verified Supabase auth.uid().
create or replace function private.is_school_admin(target_school_id uuid)
returns boolean
language sql
stable
security definer
set search_path = pg_catalog, public
as $$
  select exists (
    select 1
    from public.school_memberships membership
    join public.schools school on school.id = membership.school_id
    where membership.school_id = target_school_id
      and membership.user_id = (select auth.uid())
      and membership.role = 'school_admin'
      and membership.status = 'active'
      and school.status = 'active'
  );
$$;

revoke all on function private.is_school_admin(uuid) from public, anon;
grant usage on schema private to authenticated;
grant execute on function private.is_school_admin(uuid) to authenticated;

alter table public.schools enable row level security;
alter table public.school_memberships enable row level security;
alter table public.school_audit_events enable row level security;

revoke all on public.schools, public.school_memberships, public.school_audit_events from anon, authenticated;
grant select on public.schools, public.school_memberships to authenticated;
grant select on public.school_audit_events to authenticated;

drop policy if exists "Members can read their own school" on public.schools;
create policy "Members can read their own school"
  on public.schools for select to authenticated
  using (
    exists (
      select 1 from public.school_memberships membership
      where membership.school_id = schools.id
        and membership.user_id = (select auth.uid())
        and membership.status = 'active'
    )
  );

drop policy if exists "Users can read their own membership or school admins can read school memberships" on public.school_memberships;
create policy "Users can read their own membership or school admins can read school memberships"
  on public.school_memberships for select to authenticated
  using (
    user_id = (select auth.uid())
    or private.is_school_admin(school_id)
  );

drop policy if exists "School admins can read school audit events" on public.school_audit_events;
create policy "School admins can read school audit events"
  on public.school_audit_events for select to authenticated
  using (private.is_school_admin(school_id));

-- No INSERT/UPDATE/DELETE policies are granted to browser-authenticated users.
-- Trusted backend operations use the server-only service-role credential after
-- independently verifying the caller's JWT and active school membership.
