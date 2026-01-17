/**
 * Myo Labs — Neo-Brutalist Interactive Scripts
 * Raw. Responsive. Alive.
 */

document.addEventListener('DOMContentLoaded', () => {
    initGridCanvas();
    initRevealAnimations();
    initSmoothScroll();
    initNavScroll();
    initMagneticElements();
    initGlitchEffects();
    initScrollVelocity();
    initWorkCardHovers();
    initHowSteps();
});

/**
 * Cursor-reactive grid canvas
 * Creates a grid that distorts around the cursor
 */
function initGridCanvas() {
    const canvas = document.getElementById('gridCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let width, height;
    let mouseX = -1000;
    let mouseY = -1000;
    let targetMouseX = -1000;
    let targetMouseY = -1000;
    
    const gridSize = 40;
    const distortRadius = 150;
    const distortStrength = 20;
    
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    
    function drawGrid() {
        ctx.clearRect(0, 0, width, height);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
        ctx.lineWidth = 1;
        
        // Smooth mouse follow
        mouseX += (targetMouseX - mouseX) * 0.1;
        mouseY += (targetMouseY - mouseY) * 0.1;
        
        // Draw vertical lines
        for (let x = 0; x <= width; x += gridSize) {
            ctx.beginPath();
            for (let y = 0; y <= height; y += 5) {
                const dx = x - mouseX;
                const dy = y - mouseY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                let offsetX = 0;
                if (distance < distortRadius) {
                    const force = (1 - distance / distortRadius) * distortStrength;
                    offsetX = (dx / distance) * force || 0;
                }
                
                if (y === 0) {
                    ctx.moveTo(x + offsetX, y);
                } else {
                    ctx.lineTo(x + offsetX, y);
                }
            }
            ctx.stroke();
        }
        
        // Draw horizontal lines
        for (let y = 0; y <= height; y += gridSize) {
            ctx.beginPath();
            for (let x = 0; x <= width; x += 5) {
                const dx = x - mouseX;
                const dy = y - mouseY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                let offsetY = 0;
                if (distance < distortRadius) {
                    const force = (1 - distance / distortRadius) * distortStrength;
                    offsetY = (dy / distance) * force || 0;
                }
                
                if (x === 0) {
                    ctx.moveTo(x, y + offsetY);
                } else {
                    ctx.lineTo(x, y + offsetY);
                }
            }
            ctx.stroke();
        }
        
        // Draw accent points at intersections near cursor
        ctx.fillStyle = 'rgba(255, 61, 0, 0.3)';
        for (let x = 0; x <= width; x += gridSize) {
            for (let y = 0; y <= height; y += gridSize) {
                const dx = x - mouseX;
                const dy = y - mouseY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < distortRadius * 0.7) {
                    const size = (1 - distance / (distortRadius * 0.7)) * 4;
                    ctx.beginPath();
                    ctx.arc(x, y, size, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }
        
        requestAnimationFrame(drawGrid);
    }
    
    window.addEventListener('resize', resize);
    document.addEventListener('mousemove', (e) => {
        targetMouseX = e.clientX;
        targetMouseY = e.clientY;
    });
    
    document.addEventListener('mouseleave', () => {
        targetMouseX = -1000;
        targetMouseY = -1000;
    });
    
    resize();
    drawGrid();
}

/**
 * Reveal animations on scroll
 */
function initRevealAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
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
    
    // Add reveal class to elements
    const elementsToReveal = document.querySelectorAll(
        '.work-card, .how-step, .why-item, .why-statement, .ownership-text, .ownership-visual, .contact-content > *'
    );
    
    elementsToReveal.forEach((el, index) => {
        el.classList.add('reveal');
        el.style.transitionDelay = `${(index % 4) * 0.1}s`;
        revealObserver.observe(el);
    });
}

/**
 * Smooth scroll for anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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
 * Navigation effects on scroll
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
                    nav.style.background = 'rgba(10, 10, 10, 0.95)';
                } else {
                    nav.style.background = 'rgba(10, 10, 10, 0.8)';
                }
                ticking = false;
            });
            ticking = true;
        }
    });
}

/**
 * Magnetic effect for buttons and interactive elements
 */
function initMagneticElements() {
    const magneticElements = document.querySelectorAll('.btn, .nav-cta, .contact-email');
    
    magneticElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });
        
        el.addEventListener('mouseleave', () => {
            el.style.transform = '';
        });
    });
    
    // Logo magnetic effect
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('mousemove', (e) => {
            const rect = logo.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            logo.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });
        
        logo.addEventListener('mouseleave', () => {
            logo.style.transform = '';
        });
    }
}

/**
 * Glitch effects on scroll and interaction
 */
function initGlitchEffects() {
    const sections = document.querySelectorAll('section');
    let lastSection = null;
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.target !== lastSection) {
                // Trigger glitch on section change
                triggerGlitch();
                lastSection = entry.target;
            }
        });
    }, { threshold: 0.3 });
    
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
    
    // Glitch on click for certain elements
    document.querySelectorAll('.section-tag').forEach(tag => {
        tag.addEventListener('click', () => {
            tag.classList.add('glitch');
            setTimeout(() => tag.classList.remove('glitch'), 300);
        });
    });
}

/**
 * Trigger a brief glitch effect on the page
 */
function triggerGlitch() {
    const body = document.body;
    body.style.animation = 'none';
    body.offsetHeight; // Trigger reflow
    
    // Brief RGB split effect
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 9999;
        mix-blend-mode: screen;
        animation: glitchOverlay 0.15s ease-out forwards;
    `;
    
    document.body.appendChild(overlay);
    
    // Add keyframes if not already present
    if (!document.getElementById('glitchStyles')) {
        const style = document.createElement('style');
        style.id = 'glitchStyles';
        style.textContent = `
            @keyframes glitchOverlay {
                0% {
                    background: linear-gradient(90deg, 
                        rgba(255, 0, 0, 0.1) 0%, 
                        transparent 50%, 
                        rgba(0, 255, 255, 0.1) 100%
                    );
                    transform: translateX(-5px);
                }
                50% {
                    background: linear-gradient(90deg, 
                        rgba(0, 255, 255, 0.1) 0%, 
                        transparent 50%, 
                        rgba(255, 0, 0, 0.1) 100%
                    );
                    transform: translateX(5px);
                }
                100% {
                    background: transparent;
                    transform: translateX(0);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    setTimeout(() => overlay.remove(), 150);
}

/**
 * Scroll velocity effects
 * Elements respond to how fast the user is scrolling
 */
function initScrollVelocity() {
    let lastScrollY = window.pageYOffset;
    let lastTime = performance.now();
    let velocity = 0;
    let ticking = false;
    
    const workCards = document.querySelectorAll('.work-card');
    const heroLines = document.querySelectorAll('.hero-line');
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const currentScrollY = window.pageYOffset;
                const currentTime = performance.now();
                const deltaY = currentScrollY - lastScrollY;
                const deltaTime = currentTime - lastTime;
                
                // Calculate velocity (pixels per millisecond)
                velocity = deltaY / deltaTime;
                
                // Apply effects based on velocity
                const skewAmount = Math.min(Math.max(velocity * 20, -5), 5);
                
                // Apply to work cards
                workCards.forEach(card => {
                    card.style.transform = `skewY(${skewAmount}deg)`;
                });
                
                // Apply subtle effect to hero if visible
                if (currentScrollY < window.innerHeight) {
                    heroLines.forEach(line => {
                        line.style.transform = `translateX(${velocity * 10}px)`;
                    });
                }
                
                lastScrollY = currentScrollY;
                lastTime = currentTime;
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Reset transforms when scroll stops
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            workCards.forEach(card => {
                card.style.transform = '';
            });
            heroLines.forEach(line => {
                line.style.transform = '';
            });
        }, 150);
    });
}

/**
 * Work card hover effects
 */
function initWorkCardHovers() {
    const cards = document.querySelectorAll('.work-card, .why-item, .ownership-item');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 25;
            const rotateY = (centerX - x) / 25;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

/**
 * How section step animations
 */
function initHowSteps() {
    const steps = document.querySelectorAll('.how-step');
    if (!steps.length) return;
    
    steps.forEach((step) => {
        step.addEventListener('mouseenter', () => {
            // Pulse the step number
            const number = step.querySelector('.how-step-number');
            if (number) {
                number.style.transform = 'scale(1.1)';
                number.style.background = 'var(--color-accent)';
                number.style.color = 'var(--color-bg)';
                number.style.borderColor = 'var(--color-accent)';
            }
        });
        
        step.addEventListener('mouseleave', () => {
            const number = step.querySelector('.how-step-number');
            if (number) {
                number.style.transform = '';
                number.style.background = '';
                number.style.color = '';
                number.style.borderColor = '';
            }
        });
    });
}

/**
 * Initialize scroll progress indicator
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
        background: var(--color-accent, #FF3D00);
        transition: width 0.1s ease-out;
    }
`;
document.head.appendChild(progressStyle);

// Initialize scroll progress
initScrollProgress();

/**
 * Easter egg: Konami code triggers intense glitch
 */
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            // Intense glitch sequence
            let glitchCount = 0;
            const glitchInterval = setInterval(() => {
                triggerGlitch();
                glitchCount++;
                if (glitchCount >= 10) {
                    clearInterval(glitchInterval);
                }
            }, 100);
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});
