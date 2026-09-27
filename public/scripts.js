document.addEventListener("DOMContentLoaded", () => {
  // ===== LOADING SCREEN =====
  const loader = document.getElementById('loader');
  const loaderPercent = document.getElementById('loaderPercent');
  let percent = 0;
  
  const loadInterval = setInterval(() => {
    percent += Math.random() * 15 + 5;
    if (percent >= 100) {
      percent = 100;
      clearInterval(loadInterval);
      
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.classList.add('loaded');
        setTimeout(initReveal, 300);
      }, 500);
    }
    loaderPercent.textContent = Math.floor(percent) + '%';
  }, 150);

  // ===== SOCKET.IO =====
  let socket;
  try {
    socket = io();
  } catch (e) {
    console.warn('Socket.io not available - running in demo mode');
    socket = { on: () => {}, emit: () => {} };
  }

  // ===== ELEMENTS =====
  const phoneInput = document.getElementById("phone");
  const requestPairingBtn = document.getElementById("requestPairing");
  const statusEl = document.getElementById("status");
  const channelModal = document.getElementById("channelModal");
  const modalClose = document.getElementById("modalClose");
  const confirmFollowBtn = document.getElementById("confirmFollow");
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById('navLinks');
  const nav = document.getElementById('nav');

  // ===== PAGE SWITCHING =====
  window.switchPage = function(pageName) {
    document.querySelectorAll('.page').forEach(page => {
      page.classList.remove('active');
    });
    
    const targetPage = document.getElementById('page-' + pageName);
    if (targetPage) {
      targetPage.classList.add('active');
    }
    
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
      if (link.dataset.page === pageName) {
        link.classList.add('active');
      }
    });
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    navLinks.classList.remove('active');
    navToggle.innerHTML = '<i class="fas fa-bars"></i>';
    
    setTimeout(initReveal, 100);
  };

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const pageName = link.dataset.page;
      switchPage(pageName);
    });
  });

  document.getElementById('brandHome').addEventListener('click', () => {
    switchPage('home');
  });

  // ===== CHANNEL FOLLOW =====
  let channelsFollowed = localStorage.getItem('channelsFollowed') === 'true';

  if (!channelsFollowed) {
    setTimeout(() => {
      channelModal.classList.add('active');
    }, 3500);
  }

  function closeModal() {
    channelModal.classList.remove('active');
  }

  modalClose.addEventListener('click', closeModal);

  channelModal.addEventListener('click', (e) => {
    if (e.target === channelModal) {
      closeModal();
    }
  });

  confirmFollowBtn.addEventListener('click', () => {
    channelsFollowed = true;
    localStorage.setItem('channelsFollowed', 'true');
    closeModal();
    
    showStatus(`
      <div style="text-align: center; color: var(--success);">
        <i class="fas fa-check-circle" style="font-size: 2rem; margin-bottom: 10px;"></i>
        <p>Thank you for following our channels! You can now proceed to connect your WhatsApp.</p>
      </div>
    `, "success");
  });

  // ===== MOBILE NAV =====
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      navToggle.innerHTML = navLinks.classList.contains('active') ?
        '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        navToggle.innerHTML = '<i class="fas fa-bars"></i>';
      });
    });
  }

  // ===== STATS =====
  socket.on("statsUpdate", ({ activeSockets, totalUsers }) => {
    animateValue("activeSockets", 0, activeSockets, 1000);
    animateValue("totalUsers", 0, totalUsers, 1000);
  });

  function animateValue(id, start, end, duration) {
    const obj = document.getElementById(id);
    if (!obj) return;
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      obj.textContent = Math.floor(progress * (end - start) + start);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }

  // ===== NAV SCROLL =====
  if (nav) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        nav.classList.add('nav-scrolled');
      } else {
        nav.classList.remove('nav-scrolled');
      }
    });
  }

  // ===== REQUEST PAIRING =====
  if (requestPairingBtn) {
    requestPairingBtn.addEventListener("click", async () => {
      if (!channelsFollowed) {
        showStatus(`
          <div style="text-align: center; color: var(--warning);">
            <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 10px;"></i>
            <p>Please follow all our channels first to use The Queen Akira.</p>
            <button class="btn" style="margin-top: 10px;" onclick="document.getElementById('channelModal').classList.add('active')">
              <i class="fas fa-bell"></i> Show Channels
            </button>
          </div>
        `, "warning");
        return;
      }

      const number = phoneInput.value.trim();
      if (!number) {
        showStatus("❌ Please enter your phone number (with country code).", "error");
        return;
      }

      if (!/^[0-9]{8,15}$/.test(number.replace(/\D/g, ''))) {
        showStatus("❌ Please enter a valid phone number (digits only, 8-15 characters).", "error");
        return;
      }

      showStatus("<span class='spinner'></span> Requesting pairing code...", "loading");
      requestPairingBtn.disabled = true;

      try {
        const res = await fetch("/api/pair", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ number }),
        });
        
        const data = await res.json();
        
        if (!res.ok) {
          showStatus("❌ Error: " + (data.error || "Failed to request pairing"), "error");
          requestPairingBtn.disabled = false;
          return;
        }

        const code = (data.pairingCode || "").toString().trim();
        const spacedCode = code.split("").join(" ");
        
        showStatus(`
          <div style="text-align: center;">
            <p style="margin-bottom: 20px; font-size: 1.1rem;">✅ Pairing code for <strong>${number}</strong>:</p>
            <div class="pairing-code" id="pairingCode">${spacedCode}</div>
            <p style="margin-top: 16px; opacity: 0.8;"><small>Click the code to copy — then enter it in WhatsApp to complete pairing.</small></p>
          </div>
        `, "success");

        const pairingEl = document.getElementById("pairingCode");
        if (pairingEl) {
          pairingEl.addEventListener("click", () => {
            navigator.clipboard.writeText(code)
              .then(() => {
                const originalText = pairingEl.textContent;
                pairingEl.textContent = "Copied!";
                pairingEl.style.letterSpacing = "2px";
                pairingEl.style.background = "rgba(0, 255, 179, 0.15)";
                pairingEl.style.color = "var(--success)";
                
                setTimeout(() => {
                  pairingEl.textContent = originalText;
                  pairingEl.style.letterSpacing = "10px";
                  pairingEl.style.background = "rgba(0, 0, 0, 0.5)";
                  pairingEl.style.color = "var(--accent-1)";
                }, 2000);
              })
              .catch(() => {
                showStatus("❌ Failed to copy to clipboard. Please manually copy the code.", "error");
              });
          });
        }
      } catch (err) {
        console.error("Pairing request failed", err);
        showStatus("❌ Failed to request pairing code (network or server error).", "error");
      } finally {
        requestPairingBtn.disabled = false;
      }
    });
  }

  // ===== STATUS =====
  function showStatus(message, type = "") {
    if (!statusEl) return;
    statusEl.innerHTML = message;
    statusEl.className = "";
    if (type) statusEl.classList.add(type);
    statusEl.classList.add("fade-in");
    statusEl.style.display = 'block';
  }

  // ===== SOCKET EVENTS =====
  socket.on("linked", ({ sessionId }) => {
    showStatus(`
      <div style="text-align: center; color: var(--success);">
        <i class="fas fa-check-circle" style="font-size: 3rem; margin-bottom: 20px;"></i>
        <h3 style="margin-bottom: 16px;">✅ Successfully Linked!</h3>
        <p>Your device has been successfully connected. You can now use Queen Akira features.</p>
        <p style="margin-top: 12px; opacity: 0.8;"><small>Session ID: ${sessionId}</small></p>
      </div>
    `, "success");
    if (phoneInput) phoneInput.value = "";
  });

  socket.on("pairingTimeout", ({ number }) => {
    showStatus(`
      <div style="text-align: center; color: var(--warning);">
        <i class="fas fa-clock" style="font-size: 2.5rem; margin-bottom: 16px;"></i>
        <h3 style="margin-bottom: 12px;">⏰ Pairing Code Expired</h3>
        <p>Pairing code for ${number} has expired.</p>
        <p>Please request a new code if you still need to connect.</p>
      </div>
    `, "warning");
  });

  // ===== INPUT =====
  if (phoneInput) {
    phoneInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") requestPairingBtn.click();
    });

    phoneInput.addEventListener("input", function() {
      this.value = this.value.replace(/\D/g, '');
    });
  }

  // ===== YEAR =====
  document.getElementById('year').textContent = new Date().getFullYear();

  // ===== PARTICLES =====
  function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = window.innerWidth < 768 ? 25 : 50;
    const colors = [
      'rgba(255, 77, 148, 0.7)',
      'rgba(255, 0, 110, 0.6)',
      'rgba(255, 133, 200, 0.6)',
      'rgba(201, 24, 74, 0.5)',
      'rgba(255, 179, 217, 0.6)'
    ];
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      
      const size = Math.random() * 4 + 1;
      const posX = Math.random() * 100;
      const delay = Math.random() * 20;
      const duration = Math.random() * 15 + 20;
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${posX}%`;
      particle.style.background = color;
      particle.style.boxShadow = `0 0 ${size * 3}px ${color}`;
      particle.style.animationDelay = `${delay}s`;
      particle.style.animationDuration = `${duration}s`;
      
      particlesContainer.appendChild(particle);
    }
  }
  
  createParticles();

  // ===== SMOOTH SCROLL =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      if (this.getAttribute('href') === '#') {
        e.preventDefault();
        return;
      }
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ===== REVEAL ANIMATIONS =====
  function initReveal() {
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  }
});