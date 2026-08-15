-- Between Us — mood_updates (mood history)
-- run via: supabase db push

create table public.mood_updates (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.users(id) on delete cascade,
  mood       text not null,
  note       text,
  created_at timestamptz not null default now()
);

alter table public.mood_updates enable row level security;

create policy "Allow all access"
  on public.mood_updates for all
  to anon, authenticated
  using (true) with check (true);

grant all on public.mood_updates to anon, authenticated;

create index idx_mood_updates_user_id on public.mood_updates(user_id);
