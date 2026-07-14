/**
 * Premium Wedding Photography Website
 * JavaScript Functionality
 */

(function() {
    'use strict';

    // ===========================================
    // DOM Elements
    // ===========================================
    const DOM = {
        pageLoader: document.getElementById('pageLoader'),
        header: document.getElementById('header'),
        navMenu: document.getElementById('navMenu'),
        navToggle: document.getElementById('navToggle'),
        navLinks: document.querySelectorAll('.nav-link'),
        themeToggle: document.getElementById('themeToggle'),
        scrollProgress: document.getElementById('scrollProgress'),
        backToTop: document.getElementById('backToTop'),
        cursorDot: document.getElementById('cursorDot'),
        cursorOutline: document.getElementById('cursorOutline'),
        heroParticles: document.getElementById('heroParticles'),
        portfolioGrid: document.getElementById('portfolioGrid'),
        filterBtns: document.querySelectorAll('.filter-btn'),
        loadMoreBtn: document.getElementById('loadMore'),
        faqItems: document.querySelectorAll('.faq-item'),
        testimonialSlider: document.getElementById('testimonialSlider'),
        prevSlide: document.getElementById('prevSlide'),
        nextSlide: document.getElementById('nextSlide'),
        sliderDots: document.getElementById('sliderDots'),
        lightbox: document.getElementById('lightbox'),
        lightboxImg: document.getElementById('lightboxImg'),
        lightboxClose: document.getElementById('lightboxClose'),
        contactForm: document.getElementById('contactForm'),
        newsletterForm: document.getElementById('newsletterForm'),
        statNumbers: document.querySelectorAll('.stat-number'),
        revealElements: document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right'),
        magneticBtns: document.querySelectorAll('.magnetic')
    };

    // ===========================================
    // Page Loader
    // ===========================================
    function initPageLoader() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                DOM.pageLoader.classList.add('hidden');
                document.body.classList.remove('loading');
            }, 2000);
        });
    }

    // ===========================================
    // Theme Toggle
    // ===========================================
    function initThemeToggle() {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);

        DOM.themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    // ===========================================
    // Custom Cursor
    // ===========================================
    function initCustomCursor() {
        if (window.matchMedia('(hover: none)').matches) return;

        let mouseX = 0, mouseY = 0;
        let dotX = 0, dotY = 0;
        let outlineX = 0, outlineY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animateCursor() {
            // Dot follows immediately
            dotX += (mouseX - dotX) * 0.5;
            dotY += (mouseY - dotY) * 0.5;
            DOM.cursorDot.style.left = `${dotX}px`;
            DOM.cursorDot.style.top = `${dotY}px`;

            // Outline follows with lag
            outlineX += (mouseX - outlineX) * 0.15;
            outlineY += (mouseY - outlineY) * 0.15;
            DOM.cursorOutline.style.left = `${outlineX}px`;
            DOM.cursorOutline.style.top = `${outlineY}px`;

            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Hover effects
        const hoverElements = document.querySelectorAll('a, button, .portfolio-item, .service-card');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                DOM.cursorOutline.classList.add('hover');
            });
            el.addEventListener('mouseleave', () => {
                DOM.cursorOutline.classList.remove('hover');
            });
        });
    }

    // ===========================================
    // Scroll Effects
    // ===========================================
    function initScrollEffects() {
        let ticking = false;

        function onScroll() {
            const scrollY = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollY / docHeight) * 100;

            // Scroll progress
            DOM.scrollProgress.style.width = `${scrollPercent}%`;

            // Header state
            if (scrollY > 100) {
                DOM.header.classList.add('scrolled');
            } else {
                DOM.header.classList.remove('scrolled');
            }

            // Back to top visibility
            if (scrollY > 500) {
                DOM.backToTop.classList.add('visible');
            } else {
                DOM.backToTop.classList.remove('visible');
            }

            // Update active nav link
            updateActiveNavLink();

            ticking = false;
        }

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(onScroll);
                ticking = true;
            }
        });

        // Back to top click
        DOM.backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ===========================================
    // Active Navigation Link
    // ===========================================
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                DOM.navLinks.forEach(link => link.classList.remove('active'));
                if (navLink) navLink.classList.add('active');
            }
        });
    }

    // ===========================================
    // Mobile Navigation
    // ===========================================
    function initMobileNav() {
        DOM.navToggle.addEventListener('click', () => {
            DOM.navToggle.classList.toggle('active');
            DOM.navMenu.classList.toggle('active');
            document.body.style.overflow = DOM.navMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu on link click
        DOM.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                DOM.navToggle.classList.remove('active');
                DOM.navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close menu on outside click
        document.addEventListener('click', (e) => {
            if (!DOM.navMenu.contains(e.target) && !DOM.navToggle.contains(e.target)) {
                DOM.navToggle.classList.remove('active');
                DOM.navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // ===========================================
    // Hero Particles
    // ===========================================
    function initHeroParticles() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        DOM.heroParticles.appendChild(canvas);

        let particles = [];
        let animationFrame;

        function resize() {
            canvas.width = DOM.heroParticles.offsetWidth;
            canvas.height = DOM.heroParticles.offsetHeight;
        }

        function createParticles() {
            particles = [];
            const count = Math.floor((canvas.width * canvas.height) / 15000);
            
            for (let i = 0; i < count; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    size: Math.random() * 2 + 1,
                    speedX: (Math.random() - 0.5) * 0.5,
                    speedY: (Math.random() - 0.5) * 0.5,
                    opacity: Math.random() * 0.5 + 0.2
                });
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(p => {
                p.x += p.speedX;
                p.y += p.speedY;

                // Wrap around
                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(212, 175, 55, ${p.opacity})`;
                ctx.fill();
            });

            animationFrame = requestAnimationFrame(animate);
        }

        resize();
        createParticles();
        animate();

        window.addEventListener('resize', () => {
            resize();
            createParticles();
        });
    }

    // ===========================================
    // Portfolio Filter
    // ===========================================
    function initPortfolioFilter() {
        const items = DOM.portfolioGrid.querySelectorAll('.portfolio-item');

        DOM.filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active button
                DOM.filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.dataset.filter;

                items.forEach(item => {
                    const category = item.dataset.category;
                    
                    if (filter === 'all' || category === filter) {
                        item.classList.remove('hidden');
                        item.style.animation = 'fadeIn 0.5s ease forwards';
                    } else {
                        item.classList.add('hidden');
                    }
                });
            });
        });

        // Add fadeIn animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; transform: scale(0.9); }
                to { opacity: 1; transform: scale(1); }
            }
        `;
        document.head.appendChild(style);
    }

    // ===========================================
    // Lightbox
    // ===========================================
    function initLightbox() {
        const viewBtns = document.querySelectorAll('.portfolio-view');

        viewBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const src = btn.dataset.src;
                DOM.lightboxImg.src = src;
                DOM.lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        DOM.lightboxClose.addEventListener('click', closeLightbox);
        DOM.lightbox.addEventListener('click', (e) => {
            if (e.target === DOM.lightbox) closeLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && DOM.lightbox.classList.contains('active')) {
                closeLightbox();
            }
        });

        function closeLightbox() {
            DOM.lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // ===========================================
    // FAQ Accordion
    // ===========================================
    function initFAQ() {
        DOM.faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all others
                DOM.faqItems.forEach(i => i.classList.remove('active'));
                
                // Toggle current
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        });
    }

    // ===========================================
    // Testimonials Slider
    // ===========================================
    function initTestimonialsSlider() {
        const track = DOM.testimonialSlider.querySelector('.testimonials-track');
        const cards = track.querySelectorAll('.testimonial-card');
        let currentIndex = 0;
        const totalSlides = cards.length;

        // Create dots
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            DOM.sliderDots.appendChild(dot);
        }

        const dots = DOM.sliderDots.querySelectorAll('.dot');

        function updateSlider() {
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
        }

        function goToSlide(index) {
            currentIndex = index;
            updateSlider();
        }

        function nextSlide() {
            currentIndex = (currentIndex + 1) % totalSlides;
            updateSlider();
        }

        function prevSlide() {
            currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
            updateSlider();
        }

        DOM.nextSlide.addEventListener('click', nextSlide);
        DOM.prevSlide.addEventListener('click', prevSlide);

        // Auto-play
        let autoPlay = setInterval(nextSlide, 5000);

        DOM.testimonialSlider.addEventListener('mouseenter', () => {
            clearInterval(autoPlay);
        });

        DOM.testimonialSlider.addEventListener('mouseleave', () => {
            autoPlay = setInterval(nextSlide, 5000);
        });

        // Touch support
        let touchStartX = 0;
        let touchEndX = 0;

        track.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        track.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });

        function handleSwipe() {
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) nextSlide();
                else prevSlide();
            }
        }
    }

    // ===========================================
    // Counter Animation
    // ===========================================
    function initCounters() {
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        DOM.statNumbers.forEach(counter => observer.observe(counter));

        function animateCounter(element) {
            const target = parseInt(element.dataset.count);
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            function update() {
                current += step;
                if (current < target) {
                    element.textContent = Math.floor(current);
                    requestAnimationFrame(update);
                } else {
                    element.textContent = target;
                }
            }

            update();
        }
    }

    // ===========================================
    // Scroll Reveal
    // ===========================================
    function initScrollReveal() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        DOM.revealElements.forEach(el => observer.observe(el));
    }

    // ===========================================
    // Magnetic Buttons
    // ===========================================
    function initMagneticButtons() {
        if (window.matchMedia('(hover: none)').matches) return;

        DOM.magneticBtns.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate(0, 0)';
            });
        });
    }

    // ===========================================
    // Form Handling
    // ===========================================
    function initForms() {
        // Contact Form
        if (DOM.contactForm) {
            DOM.contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // Simulate form submission
                const btn = DOM.contactForm.querySelector('button[type="submit"]');
                const originalText = btn.innerHTML;
                btn.innerHTML = '<span>Sending...</span>';
                btn.disabled = true;

                setTimeout(() => {
                    btn.innerHTML = '<span>Message Sent! ✓</span>';
                    btn.style.background = '#22c55e';
                    
                    setTimeout(() => {
                        btn.innerHTML = originalText;
                        btn.style.background = '';
                        btn.disabled = false;
                        DOM.contactForm.reset();
                    }, 2000);
                }, 1500);
            });
        }

        // Newsletter Form
        if (DOM.newsletterForm) {
            DOM.newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const input = DOM.newsletterForm.querySelector('input');
                const btn = DOM.newsletterForm.querySelector('button');
                
                btn.innerHTML = '✓';
                btn.style.background = '#22c55e';
                
                setTimeout(() => {
                    btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>`;
                    btn.style.background = '';
                    input.value = '';
                }, 2000);
            });
        }
    }

    // ===========================================
    // Smooth Scroll for Anchor Links
    // ===========================================
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#') return;
                
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ===========================================
    // Lazy Loading Images
    // ===========================================
    function initLazyLoading() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src || img.src;
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        }
    }

    // ===========================================
    // Keyboard Navigation
    // ===========================================
    function initKeyboardNav() {
        document.addEventListener('keydown', (e) => {
            // ESC to close mobile menu
            if (e.key === 'Escape') {
                if (DOM.navMenu.classList.contains('active')) {
                    DOM.navToggle.classList.remove('active');
                    DOM.navMenu.classList.remove('active');
                    document.body.style.overflow = '';
                }
            }
        });
    }

    // ===========================================
    // Initialize Everything
    // ===========================================
    function init() {
        initPageLoader();
        initThemeToggle();
        initCustomCursor();
        initScrollEffects();
        initMobileNav();
        initHeroParticles();
        initPortfolioFilter();
        initLightbox();
        initFAQ();
        initTestimonialsSlider();
        initCounters();
        initScrollReveal();
        initMagneticButtons();
        initForms();
        initSmoothScroll();
        initLazyLoading();
        initKeyboardNav();
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
