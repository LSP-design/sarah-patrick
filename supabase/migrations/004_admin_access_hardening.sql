-- The allowlist is only read by the security-definer functions; no API role may
-- access it directly.
create policy "No direct allowlist access" on public.admin_allowlist
for all to anon, authenticated
using (false) with check (false);

revoke execute on function public.claim_admin_access() from anon;
revoke execute on function public.invite_admin(text, text) from anon;
