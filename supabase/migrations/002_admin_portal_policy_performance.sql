-- Keep the public read policies anon-only. Authenticated administrators use the
-- dedicated administrator policies, avoiding duplicated policy evaluation.
drop policy "Public can read site settings" on public.site_settings;
drop policy "Public can read published content" on public.site_content;
drop policy "Public can read active payment links" on public.payment_links;
drop policy "Guests can submit RSVP" on public.rsvps;

create policy "Public can read site settings" on public.site_settings for select to anon using (true);
create policy "Public can read published content" on public.site_content for select to anon using (is_published);
create policy "Public can read active payment links" on public.payment_links for select to anon using (is_active);
create policy "Guests can submit RSVP" on public.rsvps for insert to anon with check (true);

create index site_settings_updated_by_idx on public.site_settings (updated_by);
create index site_content_updated_by_idx on public.site_content (updated_by);
create index payment_links_updated_by_idx on public.payment_links (updated_by);
