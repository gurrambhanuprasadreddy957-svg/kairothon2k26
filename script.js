// ============================================
// KAIROTHON 2K26 — Cyberpunk Interactive Script
// ============================================

document.addEventListener('DOMContentLoaded', function () {

    // ---- AOS Animations ----
    AOS.init({
        duration: 800,
        once: true,
        offset: 60,
        easing: 'ease-out-cubic'
    });

    // ---- Neon Particle Canvas ----
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let mouseX = -1000;
        let mouseY = -1000;

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class Particle {
            constructor() {
                this.reset();
            }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 1.8 + 0.3;
                this.speedX = (Math.random() - 0.5) * 0.3;
                this.speedY = (Math.random() - 0.5) * 0.3;
                this.opacity = Math.random() * 0.5 + 0.1;
                this.hue = this.pickHue();
                this.pulse = Math.random() * Math.PI * 2;
            }
            pickHue() {
                const hues = [185, 290, 55, 130]; // cyan, magenta, yellow, green
                return hues[Math.floor(Math.random() * hues.length)];
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                this.pulse += 0.02;

                // Mouse attraction (subtle magnetic pull)
                const dx = mouseX - this.x;
                const dy = mouseY - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 180 && dist > 5) {
                    this.x += (dx / dist) * 0.3;
                    this.y += (dy / dist) * 0.3;
                    this.opacity = Math.min(0.8, this.opacity + 0.01);
                } else {
                    this.opacity = Math.max(0.1, this.opacity - 0.005);
                }

                // Wrap
                if (this.x < -10) this.x = canvas.width + 10;
                if (this.x > canvas.width + 10) this.x = -10;
                if (this.y < -10) this.y = canvas.height + 10;
                if (this.y > canvas.height + 10) this.y = -10;
            }
            draw() {
                const pulsedOpacity = this.opacity * (0.7 + 0.3 * Math.sin(this.pulse));
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${this.hue}, 100%, 70%, ${pulsedOpacity})`;
                ctx.fill();

                // Tiny glow
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${this.hue}, 100%, 50%, ${pulsedOpacity * 0.08})`;
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            const count = Math.min(Math.floor((canvas.width * canvas.height) / 15000), 100);
            for (let i = 0; i < count; i++) {
                particles.push(new Particle());
            }
        }

        function drawConnections() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 120) {
                        const alpha = 0.06 * (1 - dist / 120);
                        const avgHue = (particles[i].hue + particles[j].hue) / 2;
                        ctx.beginPath();
                        ctx.strokeStyle = `hsla(${avgHue}, 100%, 60%, ${alpha})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => { p.update(); p.draw(); });
            drawConnections();
            requestAnimationFrame(animate);
        }

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        document.addEventListener('mouseleave', () => {
            mouseX = -1000;
            mouseY = -1000;
        });

        initParticles();
        animate();

        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(initParticles, 200);
        });
    }

    // ---- Navbar Scroll ----
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 40);
    });

    // ---- Mobile Menu ----
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });
    }

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = menuToggle?.querySelector('i');
            if (icon) {
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-times');
            }
        });
    });

    // ---- Smooth Scroll ----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                window.scrollTo({
                    top: targetEl.offsetTop - 90,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ---- Countdown Timer ----
    const countDownDate = new Date("Aug 13, 2026 09:00:00").getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = countDownDate - now;

        const dEl = document.getElementById("days");
        const hEl = document.getElementById("hours");
        const mEl = document.getElementById("minutes");
        const sEl = document.getElementById("seconds");

        if (distance < 0) {
            const c = document.querySelector('.countdown');
            if (c) c.innerHTML = "<h3 style='color: var(--neon-cyan); font-family: var(--font-display); text-shadow: 0 0 15px rgba(119, 232, 255, 0.5);'>⚡ HACKATHON LIVE ⚡</h3>";
            return;
        }

        const d = Math.floor(distance / (1000 * 60 * 60 * 24));
        const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((distance % (1000 * 60)) / 1000);

        animateDigit(dEl, d);
        animateDigit(hEl, h);
        animateDigit(mEl, m);
        animateDigit(sEl, s);
    }

    function animateDigit(el, val) {
        if (!el) return;
        const str = String(val).padStart(2, '0');
        if (el.textContent !== str) {
            el.style.transition = 'all 0.2s ease';
            el.style.transform = 'scale(1.15)';
            el.style.textShadow = '0 0 25px rgba(119, 232, 255, 0.8)';
            setTimeout(() => {
                el.textContent = str;
                el.style.transform = 'scale(1)';
                el.style.textShadow = '0 0 15px rgba(119, 232, 255, 0.4)';
            }, 100);
        }
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);

    // ---- 3D Tilt on Glass Cards (Desktop) ----
    if (window.matchMedia('(hover: hover)').matches) {
        document.querySelectorAll('.glass-card').forEach(card => {
            // Skip the registration modal so it never gets a 3D tilt
            if (card.closest('#reg-modal')) return;
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const rotateX = ((y - rect.height / 2) / rect.height) * 8;
                const rotateY = ((rect.width / 2 - x) / rect.width) * 8;

                card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px) scale(1.01)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0) scale(1)';
            });
        });
    }

    // ---- Active Nav Highlight ----
    const sections = document.querySelectorAll('section[id]');
    const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

    function highlightNav() {
        const scrollPos = window.scrollY + 130;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            if (scrollPos >= top && scrollPos < top + height) {
                navAnchors.forEach(a => {
                    a.classList.remove('active-link');
                    if (a.getAttribute('href') === '#' + id) {
                        a.classList.add('active-link');
                        a.style.color = 'var(--neon-cyan)';
                        a.style.textShadow = '0 0 10px rgba(0,240,255,0.4)';
                    } else {
                        a.style.color = '';
                        a.style.textShadow = '';
                    }
                });
            }
        });
    }
    window.addEventListener('scroll', highlightNav);
    highlightNav();

    // ---- Reveal Animation ----
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.glass-card').forEach(card => {
        card.classList.add('reveal-card');
        revealObserver.observe(card);
    });

    // Add reveal styles dynamically
    const style = document.createElement('style');
    style.textContent = `
        .reveal-card {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                        transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .reveal-card.revealed {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);

    // ---- Logo Click = Scroll to Top ----
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ---- Console Branding ----
    console.log('%c⚡ KAIROTHON 2K26', 'color: var(--neon-cyan); font-size: 28px; font-weight: bold; text-shadow: 0 0 10px var(--neon-cyan);');
    console.log('%c// A Fusion of Innovation — VEMU IT', 'color: #8888aa; font-size: 12px; font-family: monospace;');

    // ============================================
    // Registration Modal — opens the official Google Form
    // ============================================
    // The in-site custom form was replaced with the official Google Form:
    //   https://forms.gle/JM21pp3rQ7GE6NMV9
    // Responses go straight to the Google Form owner's spreadsheet.
    const FORM_VIEW_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSdbDgJ1D2ySPhmpgKCnr-lx2ABsrCU1OdVxvXcb3vDQ5ctAqQ/viewform';
    const EMBED_URL = FORM_VIEW_URL + '?embedded=true';

    const regModal = document.getElementById('reg-modal');
    const regHeader = document.getElementById('reg-header');
    const regFormWrap = document.getElementById('reg-form-wrap');
    const regIframe = document.getElementById('reg-google-form');
    const regSuccess = document.getElementById('reg-success');
    const regSuccessDetails = document.getElementById('reg-success-details');
    const regSuccessClose = document.getElementById('reg-success-close');

    // The embedded form fires one load event for the form itself. A second
    // load means Google navigated to the "Your response has been recorded"
    // confirmation page, i.e. the student finished registering.
    let regIframeLoads = 0;

    function openRegModal() {
        if (!regModal) return;
        regModal.classList.add('open');
        regModal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('reg-open');
        // Reload the iframe so the form is fresh on every open
        regIframeLoads = 0;
        if (regIframe) regIframe.src = EMBED_URL;
    }

    function showRegSuccess() {
        if (regHeader) regHeader.hidden = true;
        if (regFormWrap) regFormWrap.hidden = true;
        if (regSuccessDetails) regSuccessDetails.hidden = true;
        regSuccess.hidden = false;
    }

    function resetRegModal() {
        if (regSuccess) regSuccess.hidden = true;
        if (regHeader) regHeader.hidden = false;
        if (regFormWrap) regFormWrap.hidden = false;
        regIframeLoads = 0;
    }

    function closeRegModal() {
        if (!regModal) return;
        regModal.classList.remove('open');
        regModal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('reg-open');
        setTimeout(resetRegModal, 250);
    }

    if (regIframe) {
        regIframe.addEventListener('load', () => {
            regIframeLoads++;
            if (regIframeLoads > 1 && regModal.classList.contains('open')) {
                showRegSuccess();
            }
        });
    }

    // "Done" on the success screen closes the modal
    if (regSuccessClose) {
        regSuccessClose.addEventListener('click', closeRegModal);
    }

    // Open modal: any anchor that points to the original Google Form, or has
    // a .nav-register / "Register" CTA, or the hero "Register Now" button.
    function isRegisterTrigger(el) {
        if (!el) return false;
        // The "Open in new tab" link inside the modal must not be intercepted
        if (el.classList?.contains('reg-embed-open')) return false;
        if (el.classList?.contains('nav-register')) return true;
        if (el.classList?.contains('btn-primary') && /register/i.test(el.textContent || '')) return true;
        const href = el.getAttribute?.('href') || '';
        if (/forms\.gle|docs\.google\.com\/forms/i.test(href)) return true;
        return false;
    }

    document.querySelectorAll('a').forEach(a => {
        if (isRegisterTrigger(a)) {
            a.addEventListener('click', (e) => {
                // Only intercept in-page register links; let the actual Google
                // Form link open in a new tab if user explicitly wants it
                // (we already replaced it with the modal experience).
                e.preventDefault();
                openRegModal();
            });
        }
    });

    // Close interactions
    if (regModal) {
        regModal.querySelectorAll('[data-reg-close]').forEach(el => {
            el.addEventListener('click', closeRegModal);
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && regModal.classList.contains('open')) closeRegModal();
        });
    }
});
