-- Between Us — Phase 2: photos, snaps, messages, daily_updates
-- run via: supabase db push

-- ============================================================
-- photos — normal shared photos
-- ============================================================
create table public.photos (
  id            uuid primary key default gen_random_uuid(),
  uploaded_by   uuid not null references public.users(id) on delete cascade,
  storage_path  text not null,
  caption       text,
  is_favorite   boolean not null default false,
  created_at    timestamptz not null default now()
);

-- ============================================================
-- snaps — snaps behave differently (open/receive tracking)
-- ============================================================
create table public.snaps (
  id            uuid primary key default gen_random_uuid(),
  sender_id     uuid not null references public.users(id) on delete cascade,
  receiver_id   uuid not null references public.users(id) on delete cascade,
  storage_path  text not null,
  caption       text,
  created_at    timestamptz not null default now(),
  opened_at     timestamptz,
  expires_at    timestamptz,
  is_opened     boolean not null default false
);

-- ============================================================
-- messages — notes between the two
-- ============================================================
create table public.messages (
  id           uuid primary key default gen_random_uuid(),
  sender_id    uuid not null references public.users(id) on delete cascade,
  receiver_id  uuid not null references public.users(id) on delete cascade,
  message      text not null,
  message_type text not null default 'normal',
  is_read      boolean not null default false,
  created_at   timestamptz not null default now()
);

-- ============================================================
-- daily_updates — meals, sleep, activity, thought per day
-- ============================================================
create table public.daily_updates (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.users(id) on delete cascade,
  date        date not null,
  wake_time   timestamptz,
  breakfast   text,
  lunch       text,
  snack       text,
  dinner      text,
  sleep_time  timestamptz,
  activity    text,
  thought     text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (user_id, date)
);

create trigger trg_daily_updates_updated_at
  before update on public.daily_updates
  for each row execute function public.set_updated_at();

-- ============================================================
-- RLS + grants (MVP: no auth, permissive policies)
-- ============================================================
alter table public.photos enable row level security;
alter table public.snaps enable row level security;
alter table public.messages enable row level security;
alter table public.daily_updates enable row level security;

do $$
declare t text;
begin
  foreach t in array array['photos', 'snaps', 'messages', 'daily_updates']
  loop
    execute format('create policy "Allow all access" on public.%I for all to anon, authenticated using (true) with check (true)', t);
  end loop;
end;
$$;

grant all on public.photos to anon, authenticated;
grant all on public.snaps to anon, authenticated;
grant all on public.messages to anon, authenticated;
grant all on public.daily_updates to anon, authenticated;

-- ============================================================
-- indexes
-- ============================================================
create index idx_photos_uploaded_by on public.photos(uploaded_by);
create index idx_photos_created_at on public.photos(created_at desc);
create index idx_snaps_sender_id on public.snaps(sender_id);
create index idx_snaps_receiver_id on public.snaps(receiver_id);
create index idx_snaps_created_at on public.snaps(created_at desc);
create index idx_messages_sender_id on public.messages(sender_id);
create index idx_messages_receiver_id on public.messages(receiver_id);
create index idx_daily_updates_user_id on public.daily_updates(user_id, date);
