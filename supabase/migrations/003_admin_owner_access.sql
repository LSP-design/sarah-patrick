-- Email allowlist: an owner can later invite an editor without exposing Supabase.
create table public.admin_allowlist (
  email text primary key check (email = lower(email) and position('@' in email) > 1),
  role text not null check (role in ('owner', 'editor')) default 'editor',
  created_at timestamptz not null default now()
);
alter table public.admin_allowlist enable row level security;

insert into public.admin_allowlist (email, role)
values ('saintpierrelouvensky@gmail.com', 'owner');

create or replace function public.claim_admin_access()
returns text language plpgsql security definer set search_path = public, auth as $$
declare allowed_role text;
begin
  select role into allowed_role from public.admin_allowlist where email = lower(coalesce(auth.jwt() ->> 'email', ''));
  if allowed_role is null then raise exception 'This email address is not authorized for administration'; end if;
  insert into public.admin_users (user_id, role) values (auth.uid(), allowed_role) on conflict (user_id) do update set role = excluded.role;
  return allowed_role;
end;
$$;

create or replace function public.invite_admin(invitee_email text, invitee_role text default 'editor')
returns void language plpgsql security definer set search_path = public, auth as $$
begin
  if not exists (select 1 from public.admin_users where user_id = auth.uid() and role = 'owner') then raise exception 'Only an owner can invite administrators'; end if;
  if position('@' in lower(trim(invitee_email))) <= 1 then raise exception 'A valid email address is required'; end if;
  if invitee_role not in ('owner', 'editor') then raise exception 'Invalid administrator role'; end if;
  insert into public.admin_allowlist (email, role) values (lower(trim(invitee_email)), invitee_role) on conflict (email) do update set role = excluded.role;
end;
$$;

revoke all on function public.claim_admin_access() from public;
revoke all on function public.invite_admin(text, text) from public;
grant execute on function public.claim_admin_access() to authenticated;
grant execute on function public.invite_admin(text, text) to authenticated;
