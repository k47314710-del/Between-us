-- Between Us — Phase 4: location, diary, surprises, music, events
-- run via: supabase db push

-- ============================================================
-- location_updates — explicit opt-in location history
-- ============================================================
create table public.location_updates (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.users(id) on delete cascade,
  latitude      numeric,
  longitude     numeric,
  location_name text,
  created_at    timestamptz not null default now()
);

-- ============================================================
-- diary_entries — private or shared entries
-- ============================================================
create table public.diary_entries (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.users(id) on delete cascade,
  title      text,
  content    text,
  visibility text not null default 'shared',
  created_at timestamptz not null default now()
);

-- ============================================================
-- surprises — "Open when…"
-- ============================================================
create table public.surprises (
  id          uuid primary key default gen_random_uuid(),
  created_by  uuid not null references public.users(id) on delete cascade,
  receiver_id uuid not null references public.users(id) on delete cascade,
  title       text not null,
  message     text,
  media_path  text,
  unlock_at   timestamptz,
  opened_at   timestamptz,
  created_at  timestamptz not null default now()
);

-- ============================================================
-- music — shared collection
-- ============================================================
create table public.music (
  id           uuid primary key default gen_random_uuid(),
  added_by     uuid references public.users(id) on delete set null,
  song_name    text not null,
  artist       text,
  cover_url    text,
  external_url text,
  created_at   timestamptz not null default now()
);

-- ============================================================
-- events — birthdays, anniversaries, trips, meetings
-- ============================================================
create table public.events (
  id          uuid primary key default gen_random_uuid(),
  created_by  uuid references public.users(id) on delete set null,
  title       text not null,
  description text,
  event_date  timestamptz,
  event_type  text
);

-- ============================================================
-- RLS + grants (MVP: no auth, permissive policies)
-- ============================================================
alter table public.location_updates enable row level security;
alter table public.diary_entries enable row level security;
alter table public.surprises enable row level security;
alter table public.music enable row level security;
alter table public.events enable row level security;

do $$
declare t text;
begin
  foreach t in array array['location_updates', 'diary_entries', 'surprises', 'music', 'events']
  loop
    execute format('create policy "Allow all access" on public.%I for all to anon, authenticated using (true) with check (true)', t);
  end loop;
end;
$$;

grant all on public.location_updates to anon, authenticated;
grant all on public.diary_entries to anon, authenticated;
grant all on public.surprises to anon, authenticated;
grant all on public.music to anon, authenticated;
grant all on public.events to anon, authenticated;

-- ============================================================
-- indexes
-- ============================================================
create index idx_location_updates_user_id on public.location_updates(user_id);
create index idx_diary_entries_user_id on public.diary_entries(user_id);
create index idx_surprises_receiver_id on public.surprises(receiver_id);
create index idx_music_added_by on public.music(added_by);
create index idx_events_event_date on public.events(event_date);
