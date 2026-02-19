/* ╔══════════════════════════════════════════════════════════╗
   ║  RYAN FARAHANI — PORTFOLIO JAVASCRIPT                    ║
   ╚══════════════════════════════════════════════════════════╝ */

document.addEventListener('DOMContentLoaded', () => {

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ==================== CUSTOM CURSOR ====================
    const cursorDot = document.getElementById('cursorDot');
    const cursorRing = document.getElementById('cursorRing');

    if (window.innerWidth > 768 && !prefersReducedMotion) {
        let mouseX = 0, mouseY = 0;
        let ringX = 0, ringY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.left = mouseX - 4 + 'px';
            cursorDot.style.top = mouseY - 4 + 'px';
        });

        function animateRing() {
            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;
            cursorRing.style.left = ringX - 20 + 'px';
            cursorRing.style.top = ringY - 20 + 'px';
            requestAnimationFrame(animateRing);
        }
        animateRing();

        // Hover effects on interactive elements
        const hoverTargets = document.querySelectorAll('a, button, .project-card, .skill-card, .contact-card');
        hoverTargets.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorRing.style.transform = 'scale(1.5)';
                cursorRing.style.opacity = '0.3';
                cursorDot.style.transform = 'scale(1.5)';
            });
            el.addEventListener('mouseleave', () => {
                cursorRing.style.transform = 'scale(1)';
                cursorRing.style.opacity = '0.5';
                cursorDot.style.transform = 'scale(1)';
            });
        });
    }
    // ==================== IMAGE CAPTIONING DEMO ====================
    const captionInput = document.getElementById('captionImageInput');
    const captionPreview = document.getElementById('captionImagePreview');
    const captionBtn = document.getElementById('captionSubmitBtn');
    const captionStatus = document.getElementById('captionStatus');
    const captionResult = document.getElementById('captionResult');

    const CAPTION_API_URL = 'https://ryanfafa-image-captioning-model.hf.space/caption';

    if (captionInput && captionBtn) {
        captionInput.addEventListener('change', () => {
            const file = captionInput.files[0];
            captionResult.textContent = '';
            captionStatus.textContent = '';
            if (!file) {
                captionPreview.style.display = 'none';
                return;
            }
            const reader = new FileReader();
            reader.onload = e => {
                captionPreview.src = e.target.result;
                captionPreview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        });

        captionBtn.addEventListener('click', async () => {
            const file = captionInput.files[0];
            if (!file) {
                captionStatus.textContent = 'Please choose an image first.';
                return;
            }

            captionStatus.textContent = 'Generating caption...';
            captionResult.textContent = '';
            captionBtn.disabled = true;

            try {
                const formData = new FormData();
                formData.append('file', file);

                const resp = await fetch(CAPTION_API_URL, {
                    method: 'POST',
                    body: formData,
                });

                console.log('Response status:', resp.status);
                const text = await resp.text();
                console.log('Raw response:', text);

                if (!resp.ok) {
                    captionStatus.textContent = `Error: ${resp.status}`;
                    return;
                }

                const data = JSON.parse(text);
                captionResult.textContent = data.caption || '(No caption returned)';
                captionStatus.textContent = '';
            } catch (err) {
                console.error(err);
                captionStatus.textContent = 'Error generating caption. Check console for details.';
            } finally {
                captionBtn.disabled = false;
            }
        });
    }
    // ==================== TYPING EFFECT ====================
    const typedElement = document.getElementById('typedText');
    const titles = [
        'Data Analyst.',
        'AI Engineer.',
        'Python Developer.',
        'Dashboard Builder.',
        'Problem Solver.'
    ];
    let titleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 80;

    function typeEffect() {
        const currentTitle = titles[titleIndex];

        if (isDeleting) {
            typedElement.textContent = currentTitle.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 40;
        } else {
            typedElement.textContent = currentTitle.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 80;
        }

        if (!isDeleting && charIndex === currentTitle.length) {
            typingSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            titleIndex = (titleIndex + 1) % titles.length;
            typingSpeed = 400; // Pause before new word
        }

        setTimeout(typeEffect, typingSpeed);
    }

    if (prefersReducedMotion) {
        typedElement.textContent = titles[0];
    } else {
        typeEffect();
    }

    // ==================== NAVBAR SCROLL ====================
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ==================== ACTIVE NAV LINK ====================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function highlightNav() {
        const scrollPos = window.scrollY + 200;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('data-section') === id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightNav);

    // ==================== MOBILE MENU ====================
    const hamburger = document.getElementById('hamburger');
    const navLinksContainer = document.getElementById('navLinks');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinksContainer.classList.toggle('active');
        document.body.style.overflow = navLinksContainer.classList.contains('active') ? 'hidden' : '';
    });

    // Close on link click
    navLinksContainer.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinksContainer.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!navLinksContainer.contains(e.target) && !hamburger.contains(e.target)) {
            hamburger.classList.remove('active');
            navLinksContainer.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // ==================== THEME TOGGLE ====================
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;

    // Check saved preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', savedTheme);

    themeToggle.addEventListener('click', () => {
        const current = html.getAttribute('data-theme');
        const next = current === 'light' ? 'dark' : 'light';
        html.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
    });

    // ==================== SCROLL PROGRESS BAR ====================
    const scrollProgress = document.getElementById('scrollProgress');

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        scrollProgress.style.width = scrollPercent + '%';
    });

    // ==================== BACK TO TOP ====================
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 600) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });

    // ==================== COUNTER ANIMATION ====================
    const statNumbers = document.querySelectorAll('.stat-number');
    let statsCounted = false;

    function animateCounters() {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            function updateCount() {
                current += step;
                if (current < target) {
                    stat.textContent = Math.floor(current);
                    requestAnimationFrame(updateCount);
                } else {
                    stat.textContent = target;
                }
            }
            updateCount();
        });
    }

    // ==================== PROJECT FILTER ====================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            projectCards.forEach((card, index) => {
                const category = card.getAttribute('data-category');

                if (filter === 'all' || category === filter) {
                    card.classList.remove('hidden');
                    card.style.animation = `fadeInUp 0.5s ease ${index * 0.08}s forwards`;
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    // ==================== SCROLL REVEAL ====================
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');

                // Trigger stat counter when stats section is visible
                if (entry.target.closest('.stats-bar') && !statsCounted) {
                    statsCounted = true;
                    animateCounters();
                }

                // Trigger skill level bars
                const skillBar = entry.target.querySelector('.skill-level-bar');
                if (skillBar) {
                    const width = skillBar.getAttribute('data-width');
                    setTimeout(() => {
                        skillBar.style.width = width + '%';
                    }, 300);
                }
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe elements for reveal
    const revealElements = document.querySelectorAll(
    '.stat-item, .skill-card, .project-card, .contact-card, ' +
    '.about-text-col, .about-tech-col, .detail-card, .section-header, ' +
    '.dm-card, .dm-stats-row'
);

    revealElements.forEach((el, index) => {
        el.classList.add('reveal');
        el.style.transitionDelay = `${index % 4 * 0.1}s`;
        revealObserver.observe(el);
    });

    // Observe stats bar
    const statsBar = document.querySelector('.stats-bar');
    if (statsBar) {
        statsBar.classList.add('reveal');
        revealObserver.observe(statsBar);
    }

    // ==================== SMOOTH SCROLL FOR ALL ANCHORS ====================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

});
