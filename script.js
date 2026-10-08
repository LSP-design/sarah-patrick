const eventDate = new Date('2027-04-24T00:00:00-04:00');
const siteHeader = document.querySelector('.site-header');
const layout = document.querySelector('.layout');
const contentPanel = document.getElementById('contentPanel');
const menuButton = document.getElementById('menuBtn');
const sideNav = document.getElementById('sideNav');
const navOverlay = document.getElementById('navOverlay');
const overlays = [...document.querySelectorAll('.page-overlay')];
const guestName = document.getElementById('guestName');
const rsvpStatus = document.getElementById('rsvpStatus');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const mobileLayout = window.matchMedia('(max-width: 900px)');
let activeOverlay = null;
let returnFocus = null;
let menuReturnFocus = null;
let focusTimer;

function updateCountdown() {
  const now = new Date();
  const elapsed = Math.floor(Math.abs(now - eventDate) / 1000);
  const days = Math.floor(elapsed / 86400);
  const hours = Math.floor((elapsed % 86400) / 3600);
  const mins = Math.floor((elapsed % 3600) / 60);
  const secs = elapsed % 60;
  document.getElementById('countdown').textContent = now >= eventDate
    ? 'Le grand jour est arrivé !'
    : `${days} j · ${hours} h · ${mins} min · ${secs} s avant notre union`;
}

function setSiteInert(value) {
  siteHeader.inert = value;
  layout.inert = value;
}

function openMenu() {
  if (sideNav.classList.contains('active')) return;
  menuReturnFocus = document.activeElement;
  sideNav.inert = false;
  setSiteInert(true);
  sideNav.classList.add('active');
  navOverlay.classList.add('active');
  menuButton.setAttribute('aria-expanded', 'true');
  document.body.classList.add('menu-open');
  sideNav.querySelector('.nav-close').focus();
}

function closeMenu(restoreFocus = true, immediate = false) {
  if (!sideNav.classList.contains('active')) return;
  if (immediate) {
    sideNav.style.transition = 'none';
    navOverlay.style.transition = 'none';
  }
  sideNav.classList.remove('active');
  navOverlay.classList.remove('active');
  sideNav.inert = true;
  setSiteInert(false);
  menuButton.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('menu-open');
  if (immediate) {
    void sideNav.offsetWidth;
    sideNav.style.transition = '';
    navOverlay.style.transition = '';
  }
  if (restoreFocus && menuReturnFocus?.isConnected) menuReturnFocus.focus();
}

function openOverlay(id) {
  const target = document.getElementById(id);
  if (!target?.classList.contains('page-overlay')) return;
  const focusTarget = sideNav.classList.contains('active') ? menuButton : document.activeElement;
  closeMenu(false, true);
  closeOverlay(false);
  returnFocus = focusTarget;
  activeOverlay = target;
  target.inert = false;
  setSiteInert(true);
  target.classList.add('active');
  target.scrollTop = 0;
  document.body.classList.add('overlay-open');
  if (id === 'rsvpOverlay') rsvpStatus.textContent = '';
  clearTimeout(focusTimer);
  focusTimer = setTimeout(() => {
    target.querySelector('.story-close, .venue-close, .rsvp-close, .overlay-close')?.focus();
  }, reducedMotion.matches ? 0 : 220);
}

function closeOverlay(restoreFocus = true) {
  if (!activeOverlay) return;
  clearTimeout(focusTimer);
  activeOverlay.classList.remove('active');
  activeOverlay.inert = true;
  activeOverlay = null;
  setSiteInert(false);
  document.body.classList.remove('overlay-open');
  if (restoreFocus && returnFocus?.isConnected) returnFocus.focus();
}

function openStory() { openOverlay('storyOverlay'); }
function closeStory() { if (activeOverlay?.id === 'storyOverlay') closeOverlay(); }
function openVenue() { openOverlay('venueOverlay'); }
function closeVenue() { if (activeOverlay?.id === 'venueOverlay') closeOverlay(); }
function openRSVP() { openOverlay('rsvpOverlay'); }
function closeRSVP() { if (activeOverlay?.id === 'rsvpOverlay') closeOverlay(); }
function openInfo(id) { openOverlay(id); }

function showPage(pageName) {
  const target = document.getElementById(`page-${pageName}`);
  if (!target) return;
  document.querySelectorAll('.page').forEach(page => page.classList.toggle('active', page === target));
  if (mobileLayout.matches) window.scrollTo({ top: 0, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
  else contentPanel.scrollTop = 0;
  handleScrollAnimations();
}

function returnHome() {
  closeOverlay(false);
  closeMenu(false);
  showPage('home');
}

function scrollToSection(sectionName) {
  if (!document.getElementById('page-home').classList.contains('active')) showPage('home');
  const section = document.getElementById(`section-${sectionName}`);
  if (!section) return;
  if (mobileLayout.matches) {
    section.scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth', block: 'start' });
  } else {
    const offset = section.getBoundingClientRect().top - contentPanel.getBoundingClientRect().top;
    contentPanel.scrollTo({ top: contentPanel.scrollTop + offset, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
  }
}

function submitRSVP(event) {
  event.preventDefault();
  if (!guestName.value.trim()) {
    guestName.setCustomValidity('Veuillez saisir votre prénom et votre nom.');
    guestName.reportValidity();
    return;
  }
  rsvpStatus.textContent = 'Les réservations seront ouvertes prochainement. Nous communiquerons les détails de votre invitation dès qu’ils seront disponibles.';
}

function handleScrollAnimations() {
  const threshold = mobileLayout.matches ? window.innerHeight - 50 : contentPanel.getBoundingClientRect().bottom - 50;
  contentPanel.querySelectorAll('.page.active .section').forEach(section => {
    if (section.getBoundingClientRect().top < threshold) section.classList.add('visible');
  });
}

menuButton.addEventListener('click', openMenu);
navOverlay.addEventListener('click', () => closeMenu());
document.getElementById('rsvpForm').addEventListener('submit', submitRSVP);
guestName.addEventListener('input', () => {
  guestName.setCustomValidity('');
  rsvpStatus.textContent = '';
});
overlays.forEach(overlay => overlay.addEventListener('click', event => {
  if (event.target === overlay) closeOverlay();
}));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    if (activeOverlay) closeOverlay();
    else closeMenu();
  }
  const activeDialog = activeOverlay || (sideNav.classList.contains('active') ? sideNav : null);
  if (event.key !== 'Tab' || !activeDialog) return;
  const focusable = [...activeDialog.querySelectorAll('a[href], button:not([disabled]), input:not([disabled])')];
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (!first) return;
  if (event.shiftKey && (document.activeElement === first || !activeDialog.contains(document.activeElement))) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && (document.activeElement === last || !activeDialog.contains(document.activeElement))) {
    event.preventDefault();
    first.focus();
  }
});
contentPanel.addEventListener('scroll', handleScrollAnimations, { passive: true });
window.addEventListener('scroll', handleScrollAnimations, { passive: true });
window.addEventListener('resize', handleScrollAnimations);
updateCountdown();
setInterval(updateCountdown, 1000);
document.documentElement.classList.add('js');
handleScrollAnimations();
