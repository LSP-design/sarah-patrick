const eventDate = new Date('2027-04-24T00:00:00-04:00');
const contentPanel = document.getElementById('contentPanel');
const menuButton = document.getElementById('menuBtn');
const sideNav = document.getElementById('sideNav');
const navOverlay = document.getElementById('navOverlay');
const rsvpOverlay = document.getElementById('rsvpOverlay');
const storyOverlay = document.getElementById('storyOverlay');
const venueOverlay = document.getElementById('venueOverlay');
const guestName = document.getElementById('guestName');
const rsvpStatus = document.getElementById('rsvpStatus');
const layout = document.querySelector('.layout');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const mobileLayout = window.matchMedia('(max-width: 900px)');
let previousFocus = null;
let focusTimer;

// Official event date supplied with the updated design reference.
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

function openMenu() {
  closeRSVP();
  previousFocus = document.activeElement;
  sideNav.inert = false;
  layout.inert = true;
  sideNav.classList.add('active');
  navOverlay.classList.add('active');
  menuButton.setAttribute('aria-expanded', 'true');
  sideNav.querySelector('.nav-close').focus();
}

function closeMenu() {
  if (!sideNav.classList.contains('active')) return;
  sideNav.classList.remove('active');
  navOverlay.classList.remove('active');
  menuButton.setAttribute('aria-expanded', 'false');
  sideNav.inert = true;
  layout.inert = false;
  previousFocus?.focus();
}

function showPage(pageName) {
  const target = document.getElementById(`page-${pageName}`);
  if (!target) return;
  document.querySelectorAll('.page').forEach(page => {
    page.classList.toggle('active', page === target);
  });
  window.scrollTo({ top: 0, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
  handleScrollAnimations();
}

function scrollToSection(sectionName) {
  if (!document.getElementById('page-home').classList.contains('active')) {
    showPage('home');
  }
  const section = document.getElementById(`section-${sectionName}`);
  if (!section) return;
  section.scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth', block: 'start' });
}

function openRSVP() {
  closeMenu();
  closeStory();
  closeVenue();
  previousFocus = document.activeElement;
  rsvpStatus.textContent = '';
  rsvpOverlay.inert = false;
  layout.inert = true;
  document.body.classList.add('rsvp-open');
  rsvpOverlay.classList.add('active');
  clearTimeout(focusTimer);
  focusTimer = setTimeout(() => rsvpOverlay.querySelector('.rsvp-close').focus(), reducedMotion.matches ? 0 : 220);
}

function closeRSVP() {
  clearTimeout(focusTimer);
  if (!rsvpOverlay.classList.contains('active')) return;
  rsvpOverlay.classList.remove('active');
  rsvpOverlay.inert = true;
  layout.inert = false;
  document.body.classList.remove('rsvp-open');
  previousFocus?.focus();
}

function openStory() {
  closeRSVP();
  closeVenue();
  previousFocus = document.activeElement;
  storyOverlay.inert = false;
  layout.inert = true;
  document.body.classList.add('story-open');
  storyOverlay.classList.add('active');
  clearTimeout(focusTimer);
  focusTimer = setTimeout(() => storyOverlay.querySelector('.story-close').focus(), reducedMotion.matches ? 0 : 220);
}

function closeStory() {
  clearTimeout(focusTimer);
  if (!storyOverlay.classList.contains('active')) return;
  storyOverlay.classList.remove('active');
  storyOverlay.inert = true;
  layout.inert = false;
  document.body.classList.remove('story-open');
  previousFocus?.focus();
}

function openVenue() {
  closeMenu();
  closeRSVP();
  closeStory();
  previousFocus = document.activeElement;
  venueOverlay.inert = false;
  layout.inert = true;
  document.body.classList.add('venue-open');
  venueOverlay.classList.add('active');
  clearTimeout(focusTimer);
  focusTimer = setTimeout(() => venueOverlay.querySelector('.venue-close').focus(), reducedMotion.matches ? 0 : 220);
}

function closeVenue() {
  clearTimeout(focusTimer);
  if (!venueOverlay.classList.contains('active')) return;
  venueOverlay.classList.remove('active');
  venueOverlay.inert = true;
  layout.inert = false;
  document.body.classList.remove('venue-open');
  previousFocus?.focus();
}

function submitRSVP(event) {
  event.preventDefault();
  if (!guestName.value.trim()) {
    guestName.setCustomValidity('Veuillez saisir votre prénom et votre nom.');
    guestName.reportValidity();
    return;
  }
  // Presentation only: no guest list or RSVP service was supplied.
  rsvpStatus.textContent = 'Les réservations seront ouvertes prochainement. Nous communiquerons les détails de votre invitation dès qu’ils seront disponibles.';
}

function handleScrollAnimations() {
  const threshold = window.innerHeight - 50;
  contentPanel.querySelectorAll('.page.active .section').forEach(section => {
    if (section.getBoundingClientRect().top < threshold) {
      section.classList.add('visible');
    }
  });
}

menuButton.addEventListener('click', openMenu);
document.getElementById('rsvpForm').addEventListener('submit', submitRSVP);
guestName.addEventListener('input', () => {
  guestName.setCustomValidity('');
  rsvpStatus.textContent = '';
});
rsvpOverlay.addEventListener('click', event => {
  if (event.target === rsvpOverlay) closeRSVP();
});
venueOverlay.addEventListener('click', event => {
  if (event.target === venueOverlay) closeVenue();
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    closeMenu();
    closeRSVP();
    closeStory();
    closeVenue();
  }
  const activeDialog = venueOverlay.classList.contains('active') ? venueOverlay : storyOverlay.classList.contains('active') ? storyOverlay : rsvpOverlay.classList.contains('active') ? rsvpOverlay :
    sideNav.classList.contains('active') ? sideNav : null;
  if (event.key !== 'Tab' || !activeDialog) return;
  const focusable = activeDialog.querySelectorAll('a[href], button, input');
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
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
handleScrollAnimations();
document.documentElement.classList.add('js');
