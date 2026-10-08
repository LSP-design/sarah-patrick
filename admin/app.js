const navItems = document.querySelectorAll('.nav-item');
const views = document.querySelectorAll('.view');
const pageTitle = document.getElementById('pageTitle');
const toast = document.getElementById('toast');
const titles = { dashboard: 'Bonjour Sarah & Patrick', site: 'Contenu du site', rsvps: 'Réservations', payments: 'Paiements & contributions', photos: 'Photos', settings: 'Paramètres' };

function showView(id) {
  views.forEach(view => view.classList.toggle('active', view.id === id));
  navItems.forEach(item => item.classList.toggle('active', item.dataset.view === id));
  pageTitle.textContent = titles[id];
  document.querySelector('.sidebar').classList.remove('open');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
function notify(message) {
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(notify.timer);
  notify.timer = window.setTimeout(() => toast.classList.remove('show'), 3600);
}
navItems.forEach(item => item.addEventListener('click', () => showView(item.dataset.view)));
document.querySelectorAll('[data-go]').forEach(button => button.addEventListener('click', () => showView(button.dataset.go)));
document.querySelectorAll('[data-save]').forEach(button => button.addEventListener('click', () => notify('La connexion sécurisée est en cours de configuration. Les données pourront ensuite être enregistrées.')));
document.querySelector('.menu-toggle').addEventListener('click', () => document.querySelector('.sidebar').classList.toggle('open'));
document.getElementById('exportRsvps').addEventListener('click', () => notify('Il n’y a pas encore de réservations à exporter.'));
document.getElementById('uploadPhotos').addEventListener('click', () => notify('L’ajout de photos sera activé avec le stockage sécurisé.'));
document.getElementById('inviteAdmin').addEventListener('click', () => notify('L’invitation sera disponible après l’activation des comptes administrateurs.'));
document.getElementById('signOut').addEventListener('click', () => notify('La connexion sécurisée sera activée avec Supabase.'));
