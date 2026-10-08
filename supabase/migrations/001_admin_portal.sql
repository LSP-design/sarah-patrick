-- Sarah & Patrick: contenu public, administration et réservations.
create extension if not exists pgcrypto;

create table public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('owner', 'editor')) default 'editor',
  created_at timestamptz not null default now()
);

create table public.site_settings (
  id boolean primary key default true check (id),
  couple_names text not null default 'Sarah & Patrick',
  event_date date not null default date '2027-05-15',
  venue_name text not null default 'Manoir Hovey',
  venue_city text not null default 'North Hatley, Québec',
  hero_message text not null default 'Nous nous marions ! Nous avons hâte de célébrer cette journée avec vous.',
  contact_email text,
  contact_message text,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);
insert into public.site_settings (id) values (true) on conflict (id) do nothing;

create table public.site_content (
  slug text primary key check (slug in ('story', 'programme', 'menu')),
  body text not null default '',
  is_published boolean not null default true,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);
insert into public.site_content (slug, body) values
  ('story', 'Nous sommes heureux de vous compter parmi nous pour célébrer le début de ce nouveau chapitre.'), ('programme', ''), ('menu', '')
on conflict (slug) do nothing;

create table public.payment_links (
  kind text primary key check (kind in ('reservation', 'contribution')),
  label text not null,
  destination_url text,
  is_active boolean not null default false,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);
insert into public.payment_links (kind, label) values ('reservation', 'Réserver votre place'), ('contribution', 'Contribuer') on conflict (kind) do nothing;

create table public.rsvps (
  id uuid primary key default gen_random_uuid(),
  guest_name text not null check (char_length(guest_name) between 2 and 120),
  email text,
  attendance text not null check (attendance in ('yes', 'no', 'pending')) default 'pending',
  party_size integer not null default 1 check (party_size between 1 and 12),
  dietary_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index rsvps_created_at_idx on public.rsvps (created_at desc);
create index rsvps_attendance_idx on public.rsvps (attendance);

alter table public.admin_users enable row level security;
alter table public.site_settings enable row level security;
alter table public.site_content enable row level security;
alter table public.payment_links enable row level security;
alter table public.rsvps enable row level security;

grant usage on schema public to anon, authenticated;
grant select on public.site_settings, public.site_content, public.payment_links to anon;
grant select, insert, update, delete on public.site_settings, public.site_content, public.payment_links, public.rsvps to authenticated;
grant select on public.admin_users to authenticated;

create policy "Public can read site settings" on public.site_settings for select to anon, authenticated using (true);
create policy "Public can read published content" on public.site_content for select to anon, authenticated using (is_published or auth.uid() is not null);
create policy "Public can read active payment links" on public.payment_links for select to anon, authenticated using (is_active or auth.uid() is not null);
create policy "Guests can submit RSVP" on public.rsvps for insert to anon, authenticated with check (true);
create policy "Users can read their own admin role" on public.admin_users for select to authenticated using (user_id = (select auth.uid()));
create policy "Administrators can manage settings" on public.site_settings for all to authenticated using (exists (select 1 from public.admin_users where user_id = (select auth.uid()))) with check (exists (select 1 from public.admin_users where user_id = (select auth.uid())));
create policy "Administrators can manage content" on public.site_content for all to authenticated using (exists (select 1 from public.admin_users where user_id = (select auth.uid()))) with check (exists (select 1 from public.admin_users where user_id = (select auth.uid())));
create policy "Administrators can manage payment links" on public.payment_links for all to authenticated using (exists (select 1 from public.admin_users where user_id = (select auth.uid()))) with check (exists (select 1 from public.admin_users where user_id = (select auth.uid())));
create policy "Administrators can read and manage RSVPs" on public.rsvps for all to authenticated using (exists (select 1 from public.admin_users where user_id = (select auth.uid()))) with check (exists (select 1 from public.admin_users where user_id = (select auth.uid())));

create or replace function public.set_updated_fields() returns trigger language plpgsql security invoker set search_path = public as $$
begin new.updated_at = now(); new.updated_by = auth.uid(); return new; end;
$$;
create trigger site_settings_updated before update on public.site_settings for each row execute function public.set_updated_fields();
create trigger site_content_updated before update on public.site_content for each row execute function public.set_updated_fields();
create trigger payment_links_updated before update on public.payment_links for each row execute function public.set_updated_fields();

-- After creating the first Supabase Auth user, explicitly assign the owner role:
-- insert into public.admin_users (user_id, role) values ('AUTH_USER_UUID', 'owner');
