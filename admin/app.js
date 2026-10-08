import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from './config.js';

const navItems = document.querySelectorAll('.nav-item');
const views = document.querySelectorAll('.view');
const pageTitle = document.getElementById('pageTitle');
const toast = document.getElementById('toast');
const authGate = document.getElementById('authGate');
const authForm = document.getElementById('authForm');
const authButton = document.getElementById('authButton');
const authCopy = document.getElementById('authCopy');
const authStatus = document.getElementById('authStatus');
const titles = { dashboard: 'Bonjour Sarah & Patrick', site: 'Contenu du site', rsvps: 'Réservations', payments: 'Paiements & contributions', photos: 'Photos', settings: 'Paramètres' };
const configured = SUPABASE_URL.startsWith('https://') && SUPABASE_PUBLISHABLE_KEY.length > 20;
const supabase = configured ? createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY) : null;

function showView(id) { views.forEach(view => view.classList.toggle('active', view.id === id)); navItems.forEach(item => item.classList.toggle('active', item.dataset.view === id)); pageTitle.textContent = titles[id]; document.querySelector('.sidebar').classList.remove('open'); window.scrollTo({ top: 0, behavior: 'smooth' }); }
function notify(message) { toast.textContent = message; toast.classList.add('show'); window.clearTimeout(notify.timer); notify.timer = window.setTimeout(() => toast.classList.remove('show'), 3600); }
function setField(name, value) { const field = document.querySelector(`[name="${name}"]`); if (field && value != null) field.value = value; }
navItems.forEach(item => item.addEventListener('click', () => showView(item.dataset.view)));
document.querySelectorAll('[data-go]').forEach(button => button.addEventListener('click', () => showView(button.dataset.go)));
document.querySelector('.menu-toggle').addEventListener('click', () => document.querySelector('.sidebar').classList.toggle('open'));

async function loadDashboard() {
  const [{ data: settings }, { data: content }, { data: links }, { data: rsvps, error }] = await Promise.all([supabase.from('site_settings').select('*').eq('id', true).single(), supabase.from('site_content').select('*'), supabase.from('payment_links').select('*'), supabase.from('rsvps').select('*')]);
  if (error) return notify('Impossible de charger les réservations.');
  ['couple_names', 'event_date', 'venue_name', 'venue_city', 'hero_message', 'contact_email', 'contact_message'].forEach(key => setField(key, settings[key]));
  content.forEach(item => setField(item.slug, item.body));
  links.forEach(link => { document.getElementById(link.kind === 'reservation' ? 'bookingLabel' : 'giftLabel').value = link.label; document.getElementById(link.kind === 'reservation' ? 'bookingUrl' : 'giftUrl').value = link.destination_url || ''; });
  document.querySelector('#dashboard .stats article:nth-child(1) strong').textContent = rsvps.length;
  document.querySelector('#dashboard .stats article:nth-child(2) strong').textContent = rsvps.filter(r => r.attendance === 'yes').reduce((sum, r) => sum + r.party_size, 0);
  document.querySelector('.nav-item[data-view="rsvps"] b').textContent = rsvps.length;
}
async function saveSite() {
  const form = new FormData(document.getElementById('siteForm'));
  const settings = Object.fromEntries(['couple_names', 'event_date', 'venue_name', 'venue_city', 'hero_message', 'contact_email', 'contact_message'].map(key => [key, form.get(key) || null]));
  const { error: settingsError } = await supabase.from('site_settings').update(settings).eq('id', true);
  const { error: contentError } = await supabase.from('site_content').upsert(['story', 'programme', 'menu'].map(slug => ({ slug, body: form.get(slug) || '' })));
  notify(settingsError || contentError ? 'La sauvegarde a échoué.' : 'Contenu enregistré.');
}
async function savePayments() {
  const bookingUrl = document.getElementById('bookingUrl').value, giftUrl = document.getElementById('giftUrl').value;
  const { error } = await supabase.from('payment_links').upsert([{ kind: 'reservation', label: document.getElementById('bookingLabel').value, destination_url: bookingUrl || null, is_active: Boolean(bookingUrl) }, { kind: 'contribution', label: document.getElementById('giftLabel').value, destination_url: giftUrl || null, is_active: Boolean(giftUrl) }]);
  notify(error ? 'La sauvegarde a échoué.' : 'Liens enregistrés.');
}
document.querySelector('[data-save="site"]').addEventListener('click', () => supabase ? saveSite() : notify('La base sécurisée est en cours d’activation.'));
document.querySelector('[data-save="payments"]').addEventListener('click', () => supabase ? savePayments() : notify('La base sécurisée est en cours d’activation.'));
document.getElementById('exportRsvps').addEventListener('click', () => notify('L’export CSV sera disponible après l’activation des réservations.'));
document.getElementById('uploadPhotos').addEventListener('click', () => notify('Le stockage sécurisé des photos sera ajouté dans Supabase Storage.'));
document.getElementById('inviteAdmin').addEventListener('click', () => notify('Ajoutez un compte administrateur depuis Supabase Auth, puis attribuez-lui le rôle éditeur.'));
document.getElementById('signOut').addEventListener('click', async () => { if (supabase) await supabase.auth.signOut(); location.reload(); });
if (!configured) authCopy.textContent = 'La base sécurisée est prête à être reliée. La connexion sera disponible dès la création du projet Supabase.';
else {
  authButton.disabled = false; authCopy.textContent = 'Entrez votre adresse courriel pour recevoir un lien de connexion sécurisé.';
  const { data: { session } } = await supabase.auth.getSession();
  if (session) { const { data: role } = await supabase.from('admin_users').select('role').eq('user_id', session.user.id).maybeSingle(); if (role) { authGate.classList.add('hidden'); loadDashboard(); } else authStatus.textContent = 'Ce compte ne possède pas encore l’accès administrateur.'; }
}
authForm.addEventListener('submit', async event => { event.preventDefault(); if (!supabase) return; authButton.disabled = true; const { error } = await supabase.auth.signInWithOtp({ email: document.getElementById('authEmail').value, options: { emailRedirectTo: window.location.href } }); authStatus.textContent = error ? error.message : 'Un lien de connexion vient d’être envoyé.'; authButton.disabled = false; });
