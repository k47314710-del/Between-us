-- Between Us — Seed Krishna & Varshini + their relationship
-- run via: supabase db push

insert into public.users (name, username)
values
  ('Krishna', 'krishna'),
  ('Varshini', 'varshini');

insert into public.relationship (person_one_id, person_two_id)
select k.id, v.id
from public.users k
cross join public.users v
where k.username = 'krishna'
  and v.username = 'varshini';

-- Default profile row per user so updates are simple upserts.
insert into public.user_profiles (user_id)
select id from public.users
on conflict (user_id) do nothing;
