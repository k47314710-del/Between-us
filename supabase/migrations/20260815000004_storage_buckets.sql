-- Between Us — Storage buckets + access policies
-- run via: supabase db push

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('profile-photos', 'profile-photos', true, 5242880, array['image/jpeg', 'image/png', 'image/webp']),
  ('photos',         'photos',         true, 10485760, array['image/jpeg', 'image/png', 'image/webp']),
  ('snaps',          'snaps',          true, 10485760, array['image/jpeg', 'image/png', 'image/webp']),
  ('surprises',      'surprises',      true, 10485760, array['image/jpeg', 'image/png', 'image/webp', 'video/mp4'])
on conflict (id) do nothing;

drop policy if exists "Public bucket access" on storage.objects;
drop policy if exists "Public bucket uploads" on storage.objects;
drop policy if exists "Public bucket updates" on storage.objects;
drop policy if exists "Public bucket deletes" on storage.objects;

create policy "Public bucket access"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id in ('profile-photos', 'photos', 'snaps', 'surprises'));

create policy "Public bucket uploads"
  on storage.objects for insert
  to anon, authenticated
  with check (bucket_id in ('profile-photos', 'photos', 'snaps', 'surprises'));

create policy "Public bucket updates"
  on storage.objects for update
  to anon, authenticated
  using (bucket_id in ('profile-photos', 'photos', 'snaps', 'surprises'))
  with check (bucket_id in ('profile-photos', 'photos', 'snaps', 'surprises'));

create policy "Public bucket deletes"
  on storage.objects for delete
  to anon, authenticated
  using (bucket_id in ('profile-photos', 'photos', 'snaps', 'surprises'));
