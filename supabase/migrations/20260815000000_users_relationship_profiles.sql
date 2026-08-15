-- Between Us — Phase 1: users, relationship, user_profiles
-- run via: supabase db push

-- ============================================================
-- users — the two people
-- ============================================================
create table public.users (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  username        text unique not null,
  profile_photo   text,
  created_at      timestamptz not null default now(),
  last_opened_at  timestamptz,
  is_online       boolean not null default false
);

-- ============================================================
-- relationship — one record linking the two people
-- ============================================================
create table public.relationship (
  id                 uuid primary key default gen_random_uuid(),
  person_one_id      uuid not null references public.users(id) on delete cascade,
  person_two_id      uuid not null references public.users(id) on delete cascade,
  relationship_start date,
  next_meeting       timestamptz,
  anniversary        date,
  created_at         timestamptz not null default now()
);

-- ============================================================
-- user_profiles — things each person chooses to share
-- ============================================================
create table public.user_profiles (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references public.users(id) on delete cascade,
  bio              text,
  status           text,
  current_thought  text,
  mood             text,
  activity         text,
  breakfast        text,
  lunch            text,
  dinner           text,
  current_location text,
  location_lat     numeric,
  location_lng     numeric,
  location_enabled boolean not null default false,
  music            text,
  updated_at       timestamptz not null default now(),
  unique (user_id)
);

-- ============================================================
-- shared updated_at trigger
-- ============================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_user_profiles_updated_at
  before update on public.user_profiles
  for each row execute function public.set_updated_at();

-- ============================================================
-- RLS + grants (MVP: no auth, permissive policies)
-- ============================================================
alter table public.users enable row level security;
alter table public.relationship enable row level security;
alter table public.user_profiles enable row level security;

do $$
declare t text;
begin
  foreach t in array array['users', 'relationship', 'user_profiles']
  loop
    execute format('create policy "Allow all access" on public.%I for all to anon, authenticated using (true) with check (true)', t);
  end loop;
end;
$$;

grant usage on schema public to anon, authenticated;
grant all on public.users to anon, authenticated;
grant all on public.relationship to anon, authenticated;
grant all on public.user_profiles to anon, authenticated;

-- ============================================================
-- indexes
-- ============================================================
create index idx_user_profiles_user_id on public.user_profiles(user_id);
create index idx_relationship_person_one_id on public.relationship(person_one_id);
create index idx_relationship_person_two_id on public.relationship(person_two_id);
