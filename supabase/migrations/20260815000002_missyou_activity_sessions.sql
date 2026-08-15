-- Between Us — Phase 3: miss_you, activity_log, phone_sessions
-- run via: supabase db push

-- ============================================================
-- miss_you — one row per tap, counts are computed
-- ============================================================
create table public.miss_you (
  id          uuid primary key default gen_random_uuid(),
  sender_id   uuid not null references public.users(id) on delete cascade,
  receiver_id uuid not null references public.users(id) on delete cascade,
  created_at  timestamptz not null default now()
);

-- ============================================================
-- activity_log — feed of everything that happens
-- ============================================================
create table public.activity_log (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.users(id) on delete cascade,
  activity_type text not null,
  reference_id  uuid,
  metadata      jsonb,
  created_at    timestamptz not null default now()
);

-- ============================================================
-- phone_sessions — when someone checked their phone
-- ============================================================
create table public.phone_sessions (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.users(id) on delete cascade,
  viewing_user_id uuid not null references public.users(id) on delete cascade,
  opened_at       timestamptz not null default now(),
  closed_at       timestamptz
);

-- ============================================================
-- RLS + grants (MVP: no auth, permissive policies)
-- ============================================================
alter table public.miss_you enable row level security;
alter table public.activity_log enable row level security;
alter table public.phone_sessions enable row level security;

do $$
declare t text;
begin
  foreach t in array array['miss_you', 'activity_log', 'phone_sessions']
  loop
    execute format('create policy "Allow all access" on public.%I for all to anon, authenticated using (true) with check (true)', t);
  end loop;
end;
$$;

grant all on public.miss_you to anon, authenticated;
grant all on public.activity_log to anon, authenticated;
grant all on public.phone_sessions to anon, authenticated;

-- ============================================================
-- indexes
-- ============================================================
create index idx_miss_you_sender_id on public.miss_you(sender_id);
create index idx_miss_you_created_at on public.miss_you(created_at desc);
create index idx_activity_log_user_id on public.activity_log(user_id, created_at desc);
create index idx_phone_sessions_user_id on public.phone_sessions(user_id);
