const eventDate = new Date('2027-05-15T00:00:00-04:00');
const contentPanel = document.getElementById('contentPanel');
const menuButton = document.getElementById('menuBtn');
const sideNav = document.getElementById('sideNav');
const navOverlay = document.getElementById('navOverlay');
const rsvpModal = document.getElementById('rsvpModal');
const storyOverlay = document.getElementById('storyOverlay');
const guestName = document.getElementById('guestName');
const rsvpStatus = document.getElementById('rsvpStatus');
const layout = document.querySelector('.layout');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const mobileLayout = window.matchMedia('(max-width: 900px)');
let previousFocus = null;
let focusTimer;

// The date and venue come from the project's Drive folder.
function updateCountdown() {
  const now = new Date();
  const elapsed = Math.floor(Math.abs(now - eventDate) / 1000);
  const days = Math.floor(elapsed / 86400);
  const hours = Math.floor((elapsed % 86400) / 3600);
  const mins = Math.floor((elapsed % 3600) / 60);
  const secs = elapsed % 60;
  document.getElementById('countdown').textContent =
    `${days} days ${hours} hrs ${mins} mins ${secs} secs${now >= eventDate ? ' ago' : ''}`;
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
  if (mobileLayout.matches) {
    window.scrollTo({ top: 0, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
  } else {
    contentPanel.scrollTop = 0;
  }
  handleScrollAnimations();
}

function scrollToSection(sectionName) {
  if (!document.getElementById('page-home').classList.contains('active')) {
    showPage('home');
  }
  const section = document.getElementById(`section-${sectionName}`);
  if (!section) return;
  if (mobileLayout.matches) {
    section.scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth', block: 'start' });
    return;
  }
  const offset = section.getBoundingClientRect().top - contentPanel.getBoundingClientRect().top;
  contentPanel.scrollTo({ top: contentPanel.scrollTop + offset, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
}

function openRSVP() {
  closeMenu();
  previousFocus = document.activeElement;
  rsvpStatus.textContent = '';
  rsvpModal.inert = false;
  layout.inert = true;
  document.body.classList.add('modal-open');
  rsvpModal.classList.add('active');
  clearTimeout(focusTimer);
  focusTimer = setTimeout(() => guestName.focus(), reducedMotion.matches ? 0 : 300);
}

function closeRSVP() {
  clearTimeout(focusTimer);
  if (!rsvpModal.classList.contains('active')) return;
  rsvpModal.classList.remove('active');
  rsvpModal.inert = true;
  layout.inert = false;
  document.body.classList.remove('modal-open');
  previousFocus?.focus();
}

function openStory() {
  closeRSVP();
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
  const threshold = mobileLayout.matches ? window.innerHeight - 50 : contentPanel.getBoundingClientRect().bottom - 50;
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
rsvpModal.addEventListener('click', event => {
  if (event.target === rsvpModal) closeRSVP();
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    closeMenu();
    closeRSVP();
    closeStory();
  }
  const activeDialog = storyOverlay.classList.contains('active') ? storyOverlay : rsvpModal.classList.contains('active') ? rsvpModal :
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
