// ===== COUNTDOWN TIMER =====
function updateCountdown() {
  const eventDate = new Date('2024-05-18T00:00:00');
    const now = new Date();
      const diff = Math.abs(now - eventDate);

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
              const secs = Math.floor((diff % (1000 * 60)) / 1000);

                const el = document.getElementById('countdown');
                  if (el) {
                      if (now > eventDate) {
                            el.textContent = `${days} days ${hours} hrs ${mins} mins ${secs} secs ago`;
                                } else {
                                      el.textContent = `${days} days ${hours} hrs ${mins} mins ${secs} secs`;
                                          }
                                            }
                                            }

                                            updateCountdown();
                                            setInterval(updateCountdown, 1000);

                                            // ===== MENU =====
                                            function openMenu() {
                                              document.getElementById('sideNav').classList.add('active');
                                                document.getElementById('navOverlay').classList.add('active');
                                                  document.body.style.overflow = 'hidden';
                                                  }

                                                  function closeMenu() {
                                                    document.getElementById('sideNav').classList.remove('active');
                                                      document.getElementById('navOverlay').classList.remove('active');
                                                        document.body.style.overflow = '';
                                                        }

                                                        document.getElementById('menuBtn').addEventListener('click', openMenu);

                                                        // Close menu on Escape key
                                                        document.addEventListener('keydown', function(e) {
                                                          if (e.key === 'Escape') {
                                                              closeMenu();
                                                                  closeRSVP();
                                                                    }
                                                                    });

                                                                    // ===== PAGE NAVIGATION =====
                                                                    function showPage(pageName) {
                                                                      const pages = document.querySelectorAll('.page');
                                                                        pages.forEach(p => p.classList.remove('active'));

                                                                          const target = document.getElementById('page-' + pageName);
                                                                            if (target) {
                                                                                target.classList.add('active');
                                                                                    // Scroll content panel to top
                                                                                        document.getElementById('contentPanel').scrollTop = 0;
                                                                                          }
                                                                                          }

                                                                                          // ===== RSVP MODAL =====
                                                                                          function openRSVP() {
                                                                                            document.getElementById('rsvpModal').classList.add('active');
                                                                                              document.body.style.overflow = 'hidden';
                                                                                                setTimeout(() => {
                                                                                                    document.getElementById('guestName').focus();
                                                                                                      }, 300);
                                                                                                      }
                                                                                                      
                                                                                                      function closeRSVP() {
                                                                                                        document.getElementById('rsvpModal').classList.remove('active');
                                                                                                          document.body.style.overflow = '';
                                                                                                          }
                                                                                                          
                                                                                                          function submitRSVP() {
                                                                                                            const name = document.getElementById('guestName').value.trim();
                                                                                                              if (name) {
                                                                                                                  alert('Bienvenue, ' + name + '! Les details de l\'evenement seront bientot disponibles.');
                                                                                                                      closeRSVP();
                                                                                                                        }
                                                                                                                        }
                                                                                                                        
                                                                                                                        // Submit on Enter key in RSVP input
                                                                                                                        document.getElementById('guestName').addEventListener('keydown', function(e) {
                                                                                                                          if (e.key === 'Enter') {
                                                                                                                              submitRSVP();
                                                                                                                                }
                                                                                                                                });
                                                                                                                                
                                                                                                                                // ===== SCROLL ANIMATIONS =====
                                                                                                                                const contentPanel = document.getElementById('contentPanel');
                                                                                                                                
                                                                                                                                function handleScrollAnimations() {
                                                                                                                                  const sections = contentPanel.querySelectorAll('.section');
                                                                                                                                    sections.forEach(section => {
                                                                                                                                        const rect = section.getBoundingClientRect();
                                                                                                                                            const panelRect = contentPanel.getBoundingClientRect();
                                                                                                                                            
                                                                                                                                                if (rect.top < panelRect.bottom - 50) {
                                                                                                                                                      section.classList.add('visible');
                                                                                                                                                          }
                                                                                                                                                            });
                                                                                                                                                            }
                                                                                                                                                            
                                                                                                                                                            contentPanel.addEventListener('scroll', handleScrollAnimations);
                                                                                                                                                            handleScrollAnimations();
                                                                                                                                                            
                                                                                                                                                            // ===== SMOOTH SCROLL FOR VIEW DETAILS =====
                                                                                                                                                            document.querySelector('.scroll-indicator')?.addEventListener('click', function() {
                                                                                                                                                              const scheduleSection = document.querySelector('.section-schedule');
                                                                                                                                                                if (scheduleSection) {
                                                                                                                                                                    scheduleSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                                                                                                                                                      }
                                                                                                                                                                      });
