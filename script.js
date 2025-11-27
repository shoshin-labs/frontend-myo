/**
 * Myo Labs — Interactive Scripts
 * Gentle, organic interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    initRevealAnimations();
    initSmoothScroll();
    initNavScroll();
    initFormInteractions();
    initParallaxOrbs();
    initEnsōInteraction();
    initTextReveal();
    initMagneticButtons();
    initDryBrushStreaks();
});

/**
 * Reveal animations on scroll
 * Elements with .reveal class fade in when entering viewport
 */
function initRevealAnimations() {
    const revealElements = document.querySelectorAll('.reveal');

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -80px 0px',
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });
}

/**
 * Smooth scroll for anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));

            if (target) {
                const navHeight = document.querySelector('.nav').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Navigation scroll effects
 * Subtle background change on scroll
 */
function initNavScroll() {
    const nav = document.querySelector('.nav');
    let lastScroll = 0;
    let ticking = false;

    window.addEventListener('scroll', () => {
        lastScroll = window.pageYOffset;

        if (!ticking) {
            window.requestAnimationFrame(() => {
                if (lastScroll > 100) {
                    nav.style.background = 'rgba(250, 248, 245, 0.95)';
                    nav.style.boxShadow = '0 1px 20px rgba(0, 0, 0, 0.05)';
                } else {
                    nav.style.background = 'rgba(250, 248, 245, 0.8)';
                    nav.style.boxShadow = 'none';
                }
                ticking = false;
            });
            ticking = true;
        }
    });
}

/**
 * Form interactions
 * Gentle feedback and submission handling
 */
function initFormInteractions() {
    const form = document.getElementById('contactForm');
    const inputs = form.querySelectorAll('input, textarea');

    // Add focus/blur animations
    inputs.forEach(input => {
        const formGroup = input.closest('.form-group');

        input.addEventListener('focus', () => {
            formGroup.style.transform = 'translateX(4px)';
        });

        input.addEventListener('blur', () => {
            formGroup.style.transform = 'translateX(0)';
        });
    });

    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalContent = submitBtn.innerHTML;

        // Show loading state
        submitBtn.innerHTML = `
            <span>Sending...</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin">
                <circle cx="12" cy="12" r="10" stroke-dasharray="50" stroke-dashoffset="20"/>
            </svg>
        `;
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';

        // Simulate form submission (replace with actual endpoint)
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Show success state
        submitBtn.innerHTML = `
            <span>Message Sent!</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;
        submitBtn.style.background = '#7A8A72';
        form.reset();

        // Reset button after delay
        setTimeout(() => {
            submitBtn.innerHTML = originalContent;
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
            submitBtn.style.background = '';
        }, 3000);
    });
}

/**
 * Parallax effect for ambient orbs
 * Subtle movement on mouse move
 */
function initParallaxOrbs() {
    const orbs = document.querySelectorAll('.orb');
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    function animateOrbs() {
        // Smooth interpolation
        currentX += (mouseX - currentX) * 0.02;
        currentY += (mouseY - currentY) * 0.02;

        orbs.forEach((orb, index) => {
            const speed = (index + 1) * 15;
            const x = currentX * speed;
            const y = currentY * speed;

            orb.style.transform = `translate(${x}px, ${y}px)`;
        });

        requestAnimationFrame(animateOrbs);
    }

    animateOrbs();
}

/**
 * Add spinning animation for loading state
 */
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    .spin {
        animation: spin 1s linear infinite;
    }
`;
document.head.appendChild(style);

/**
 * Ensō interaction
 * Responds to mouse proximity with subtle scaling
 */
function initEnsōInteraction() {
    const zenCircle = document.querySelector('.hero-visual .zen-circle');
    if (!zenCircle) return;

    let isHovering = false;

    zenCircle.addEventListener('mouseenter', () => {
        isHovering = true;
        zenCircle.style.animationPlayState = 'paused';
    });

    zenCircle.addEventListener('mouseleave', () => {
        isHovering = false;
        zenCircle.style.animationPlayState = 'running';
    });

    zenCircle.addEventListener('mousemove', (e) => {
        if (!isHovering) return;

        const rect = zenCircle.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = (e.clientX - centerX) / rect.width;
        const deltaY = (e.clientY - centerY) / rect.height;

        const rotateX = deltaY * 15;
        const rotateY = deltaX * -15;

        zenCircle.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    });

    zenCircle.addEventListener('mouseleave', () => {
        zenCircle.style.transform = '';
    });
}

/**
 * Text reveal animation for section headers
 */
function initTextReveal() {
    const sectionHeaders = document.querySelectorAll('.section-header h2');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('text-revealed');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    sectionHeaders.forEach(header => {
        observer.observe(header);
    });
}

/**
 * Magnetic button effect
 * Buttons subtly follow cursor when hovering
 */
function initMagneticButtons() {
    const buttons = document.querySelectorAll('.btn-primary, .nav-cta');

    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });
}

/**
 * Scroll progress indicator
 */
function initScrollProgress() {
    const indicator = document.createElement('div');
    indicator.className = 'scroll-progress';
    indicator.innerHTML = '<div class="scroll-progress-bar"></div>';
    document.body.appendChild(indicator);

    const bar = indicator.querySelector('.scroll-progress-bar');

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;

        bar.style.width = `${scrollPercent}%`;
    });
}

// Add scroll progress styles
const progressStyle = document.createElement('style');
progressStyle.textContent = `
    .scroll-progress {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 2px;
        z-index: 1000;
        background: transparent;
    }
    .scroll-progress-bar {
        height: 100%;
        width: 0;
        background: linear-gradient(90deg, var(--color-sage) 0%, var(--color-terracotta) 100%);
        transition: width 0.1s ease-out;
    }
`;
document.head.appendChild(progressStyle);

// Initialize scroll progress
initScrollProgress();

/**
 * Generate randomized dry brush streaks for the ensō
 * Creates organic white gaps through the brush stroke
 */
function initDryBrushStreaks() {
    const container = document.querySelector('.ensō-dry-streaks');
    if (!container) return;

    const cx = 100, cy = 100, r = 70;
    const streakCount = 18 + Math.floor(Math.random() * 8); // 18-25 streaks

    for (let i = 0; i < streakCount; i++) {
        // Distribute around the circle, but more density on right side (end of stroke)
        // Angle 0 = right, PI/2 = bottom, PI = left, 3PI/2 = top
        let angle;
        const rand = Math.random();
        if (rand < 0.6) {
            // 60% on right side and bottom-right (where brush dries out)
            angle = -Math.PI/3 + Math.random() * Math.PI * 0.8;
        } else if (rand < 0.85) {
            // 25% on top arc
            angle = -Math.PI/2 + Math.random() * Math.PI * 0.4 - Math.PI * 0.2;
        } else {
            // 15% scattered elsewhere (but not on left side where ink is fresh)
            angle = Math.random() * Math.PI * 2;
            // Skip left side (fresh ink)
            if (angle > Math.PI * 0.6 && angle < Math.PI * 1.4) continue;
        }

        // Calculate start point on the circle
        const x1 = cx + Math.cos(angle) * r;
        const y1 = cy + Math.sin(angle) * r;

        // Streak follows the tangent with slight curve
        const tangentAngle = angle + Math.PI/2;
        const streakLength = 8 + Math.random() * 20;
        const curve = (Math.random() - 0.5) * 10;

        const midX = x1 + Math.cos(tangentAngle) * streakLength * 0.5 + curve;
        const midY = y1 + Math.sin(tangentAngle) * streakLength * 0.5 + curve;
        const x2 = x1 + Math.cos(tangentAngle) * streakLength;
        const y2 = y1 + Math.sin(tangentAngle) * streakLength;

        // Create the streak path
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', `M ${x1.toFixed(1)} ${y1.toFixed(1)} Q ${midX.toFixed(1)} ${midY.toFixed(1)}, ${x2.toFixed(1)} ${y2.toFixed(1)}`);
        path.classList.add('dry-streak');

        // Randomize width - thinner at start of stroke, thicker at end
        const isEndSection = angle > -Math.PI/4 && angle < Math.PI/2;
        const baseWidth = isEndSection ? 1.5 + Math.random() * 2.5 : 0.8 + Math.random() * 1.5;
        path.style.strokeWidth = `${baseWidth}px`;

        // Randomize timing - appears as brush passes that section
        // Map angle to delay (0.1s to 0.4s range)
        const normalizedAngle = (angle + Math.PI) / (Math.PI * 2);
        const baseDelay = 0.08 + normalizedAngle * 0.35;
        const delay = baseDelay + (Math.random() - 0.5) * 0.05;
        path.style.animationDelay = `${delay.toFixed(3)}s`;

        // Randomize opacity slightly
        const opacity = 0.6 + Math.random() * 0.35;
        path.style.setProperty('--streak-opacity', opacity);

        container.appendChild(path);
    }
}
