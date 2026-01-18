/**
 * Myo Labs — Neo-Brutalist Interactive Scripts
 * Raw. Responsive. Alive.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize everything behind the loader
    initGridCanvas();
    initRevealAnimations();
    initSmoothScroll();
    initNavScroll();
    initMagneticElements();
    initGlitchEffects();
    initScrollVelocity();
    initWorkCardHovers();
    initHowSteps();
    initStatementAnimation();
    initOwnershipGraph();
    
    // Hide loader once page is ready
    hideLoader();
});

/**
 * Hide loader and reveal content
 */
function hideLoader() {
    const loader = document.getElementById('loader');
    if (!loader) {
        document.body.classList.add('loaded');
        return;
    }
    
    // Wait for fonts and critical resources
    const minLoadTime = 400; // Minimum time to show loader
    const startTime = performance.now();
    
    // Check if fonts are ready
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => {
            const elapsed = performance.now() - startTime;
            const remaining = Math.max(0, minLoadTime - elapsed);
            
            setTimeout(() => {
                loader.classList.add('hidden');
                document.body.classList.add('loaded');
                
                // Remove loader from DOM after transition
                setTimeout(() => {
                    loader.remove();
                }, 400);
            }, remaining);
        });
    } else {
        // Fallback for browsers without font loading API
        setTimeout(() => {
            loader.classList.add('hidden');
            document.body.classList.add('loaded');
            setTimeout(() => loader.remove(), 400);
        }, minLoadTime);
    }
}

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
        '.work-card, .how-step, .why-item, .ownership-text, .ownership-visual, .contact-content > *'
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
 * Ownership D3.js force graph
 */
function initOwnershipGraph() {
    const container = document.getElementById('ownership-graph');
    if (!container || typeof d3 === 'undefined') return;
    
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;
    
    // Clear any existing content
    container.innerHTML = '';
    
    const svg = d3.select(container)
        .append('svg')
        .attr('viewBox', `0 0 ${width} ${height}`)
        .attr('preserveAspectRatio', 'xMidYMid meet');
    
    // Define nodes
    const nodes = [
        { id: 'you', label: 'YOU', type: 'center', radius: 45 },
        { id: 'code', label: 'CODE', type: 'owned', radius: 32 },
        { id: 'infra', label: 'INFRA', type: 'owned', radius: 32 },
        { id: 'data', label: 'DATA', type: 'owned', radius: 32 },
        { id: 'docs', label: 'DOCS', type: 'owned', radius: 28 },
        { id: 'keys', label: 'KEYS', type: 'owned', radius: 28 }
    ];
    
    // Define links (all connect to center)
    const links = [
        { source: 'you', target: 'code' },
        { source: 'you', target: 'infra' },
        { source: 'you', target: 'data' },
        { source: 'you', target: 'docs' },
        { source: 'you', target: 'keys' }
    ];
    
    // Create force simulation
    const simulation = d3.forceSimulation(nodes)
        .force('link', d3.forceLink(links).id(d => d.id).distance(120).strength(0.5))
        .force('charge', d3.forceManyBody().strength(-300))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('collision', d3.forceCollide().radius(d => d.radius + 20));
    
    // Pin the center node
    const centerNode = nodes.find(n => n.id === 'you');
    centerNode.fx = width / 2;
    centerNode.fy = height / 2;
    
    // Create gradient for links
    const defs = svg.append('defs');
    const gradient = defs.append('linearGradient')
        .attr('id', 'link-gradient')
        .attr('gradientUnits', 'userSpaceOnUse');
    gradient.append('stop').attr('offset', '0%').attr('stop-color', '#FF3D00').attr('stop-opacity', 0.8);
    gradient.append('stop').attr('offset', '100%').attr('stop-color', '#FF3D00').attr('stop-opacity', 0.2);
    
    // Draw links
    const link = svg.append('g')
        .selectAll('line')
        .data(links)
        .join('line')
        .attr('stroke', '#FF3D00')
        .attr('stroke-opacity', 0.3)
        .attr('stroke-width', 2);
    
    // Animated particles along links
    const particles = svg.append('g').attr('class', 'particles');
    
    // Draw nodes
    const node = svg.append('g')
        .selectAll('g')
        .data(nodes)
        .join('g')
        .attr('class', d => `node node-${d.type}`)
        .style('cursor', 'pointer');
    
    // Node circles
    node.append('circle')
        .attr('r', d => d.radius)
        .attr('fill', d => d.type === 'center' ? 'rgba(10, 10, 10, 0.9)' : 'rgba(20, 20, 20, 0.9)')
        .attr('stroke', d => d.type === 'center' ? '#FF3D00' : 'rgba(255, 255, 255, 0.2)')
        .attr('stroke-width', d => d.type === 'center' ? 2 : 1);
    
    // Pulse ring for center
    node.filter(d => d.type === 'center')
        .append('circle')
        .attr('r', d => d.radius + 10)
        .attr('fill', 'none')
        .attr('stroke', '#FF3D00')
        .attr('stroke-opacity', 0.3)
        .attr('class', 'pulse-ring');
    
    // Node labels
    node.append('text')
        .text(d => d.label)
        .attr('text-anchor', 'middle')
        .attr('dy', '0.35em')
        .attr('fill', d => d.type === 'center' ? '#FF3D00' : 'rgba(255, 255, 255, 0.7)')
        .attr('font-family', 'Space Grotesk, sans-serif')
        .attr('font-size', d => d.type === 'center' ? '16px' : '11px')
        .attr('font-weight', d => d.type === 'center' ? '700' : '500')
        .attr('letter-spacing', '0.05em');
    
    // Update positions on tick
    simulation.on('tick', () => {
        link
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);
        
        node.attr('transform', d => `translate(${d.x}, ${d.y})`);
    });
    
    // Animate particles along links
    function animateParticles() {
        links.forEach((link, i) => {
            const particle = particles.append('circle')
                .attr('r', 3)
                .attr('fill', '#FF3D00')
                .attr('opacity', 0.8);
            
            const source = nodes.find(n => n.id === link.source.id || n.id === link.source);
            const target = nodes.find(n => n.id === link.target.id || n.id === link.target);
            
            if (source && target) {
                particle
                    .attr('cx', source.x || width/2)
                    .attr('cy', source.y || height/2)
                    .transition()
                    .duration(1500)
                    .delay(i * 300)
                    .ease(d3.easeQuadOut)
                    .attr('cx', target.x || width/2)
                    .attr('cy', target.y || height/2)
                    .attr('opacity', 0)
                    .remove();
            }
        });
    }
    
    // Start particle animation loop
    animateParticles();
    setInterval(animateParticles, 2500);
    
    // Hover effects
    node.on('mouseenter', function(event, d) {
        d3.select(this).select('circle')
            .transition()
            .duration(200)
            .attr('stroke', '#FF3D00')
            .attr('stroke-width', 2);
        
        d3.select(this).select('text')
            .transition()
            .duration(200)
            .attr('fill', '#ffffff');
    })
    .on('mouseleave', function(event, d) {
        d3.select(this).select('circle')
            .transition()
            .duration(200)
            .attr('stroke', d.type === 'center' ? '#FF3D00' : 'rgba(255, 255, 255, 0.2)')
            .attr('stroke-width', d.type === 'center' ? 2 : 1);
        
        d3.select(this).select('text')
            .transition()
            .duration(200)
            .attr('fill', d.type === 'center' ? '#FF3D00' : 'rgba(255, 255, 255, 0.7)');
    });
    
    // Add pulse animation via CSS
    const style = document.createElement('style');
    style.textContent = `
        .pulse-ring {
            animation: ownership-pulse 2s ease-out infinite;
            transform-origin: center;
        }
        @keyframes ownership-pulse {
            0% { transform: scale(1); opacity: 0.3; }
            100% { transform: scale(1.5); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

/**
 * Statement animation - "The difference" section
 */
function initStatementAnimation() {
    const statement = document.querySelector('[data-statement-animate]');
    if (!statement) return;
    
    // Initialize the flowing lines canvas
    initDifferenceCanvas();
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                statement.classList.add('animate-in');
                
                // Trigger particle burst when "freedom" appears
                setTimeout(() => {
                    const freedomWord = statement.querySelector('.statement-freedom');
                    if (freedomWord) {
                        createFreedomBurst(freedomWord);
                    }
                }, 1700); // Timing matches the word reveal delay
                
                observer.unobserve(statement);
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px'
    });
    
    observer.observe(statement);
}

/**
 * Create a particle burst effect around the "freedom" word
 */
function createFreedomBurst(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const particleCount = 20;
    const colors = ['#FF3D00', '#FF6B35', '#FF8C42', '#FFB067', '#FFFFFF'];
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        const angle = (Math.PI * 2 / particleCount) * i + Math.random() * 0.5;
        const velocity = 80 + Math.random() * 120;
        const size = 3 + Math.random() * 5;
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        particle.style.cssText = `
            position: fixed;
            left: ${centerX}px;
            top: ${centerY}px;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            border-radius: 50%;
            pointer-events: none;
            z-index: 10000;
            box-shadow: 0 0 ${size * 2}px ${color};
        `;
        
        document.body.appendChild(particle);
        
        // Animate the particle
        const destX = Math.cos(angle) * velocity;
        const destY = Math.sin(angle) * velocity;
        const duration = 600 + Math.random() * 400;
        
        particle.animate([
            { 
                transform: 'translate(-50%, -50%) scale(1)',
                opacity: 1 
            },
            { 
                transform: `translate(calc(-50% + ${destX}px), calc(-50% + ${destY}px)) scale(0)`,
                opacity: 0 
            }
        ], {
            duration: duration,
            easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
            fill: 'forwards'
        });
        
        // Clean up
        setTimeout(() => particle.remove(), duration);
    }
    
    // Add a brief flash effect
    const flash = document.createElement('div');
    flash.style.cssText = `
        position: fixed;
        left: ${rect.left - 20}px;
        top: ${rect.top - 10}px;
        width: ${rect.width + 40}px;
        height: ${rect.height + 20}px;
        background: radial-gradient(ellipse at center, rgba(255, 61, 0, 0.4) 0%, transparent 70%);
        pointer-events: none;
        z-index: 9999;
    `;
    document.body.appendChild(flash);
    
    flash.animate([
        { opacity: 1, transform: 'scale(1)' },
        { opacity: 0, transform: 'scale(1.5)' }
    ], {
        duration: 500,
        easing: 'ease-out',
        fill: 'forwards'
    });
    
    setTimeout(() => flash.remove(), 500);
}

/**
 * Flowing orange lines canvas animation - Enhanced with depth, glow, and interaction
 */
function initDifferenceCanvas() {
    const canvas = document.getElementById('differenceCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const section = canvas.parentElement;
    let width, height;
    let animationId;
    let time = 0;
    
    // Mouse tracking for interaction
    let mouseX = -1000;
    let mouseY = -1000;
    let targetMouseX = -1000;
    let targetMouseY = -1000;
    
    // Wave layers configuration - back to front
    const waveLayers = [];
    const particles = [];
    
    // Perlin-style noise function for organic movement
    function noise(x, y, t) {
        const n1 = Math.sin(x * 0.01 + t * 0.3) * Math.cos(y * 0.01 + t * 0.2);
        const n2 = Math.sin(x * 0.02 - t * 0.4) * Math.sin(y * 0.015 + t * 0.25);
        const n3 = Math.cos(x * 0.008 + t * 0.2) * Math.sin(y * 0.02 - t * 0.15);
        return (n1 + n2 + n3) / 3;
    }
    
    function resize() {
        const rect = section.getBoundingClientRect();
        width = canvas.width = rect.width;
        height = canvas.height = rect.height;
        initWaveLayers();
        initParticles();
    }
    
    function initWaveLayers() {
        waveLayers.length = 0;
        
        // Background layer (very subtle, blurred feel)
        for (let i = 0; i < 4; i++) {
            waveLayers.push({
                layer: 'back',
                baseY: height * (0.25 + i * 0.15),
                amplitude: 80 + Math.random() * 60,
                frequency: 0.0015 + Math.random() * 0.001,
                phase: Math.random() * Math.PI * 2,
                speed: 0.2 + Math.random() * 0.15,
                opacity: 0.04 + Math.random() * 0.03,
                lineWidth: 4 + Math.random() * 3,
                blur: 8,
                color: { r: 255, g: 61, b: 0 }
            });
        }
        
        // Middle layer (medium intensity)
        for (let i = 0; i < 5; i++) {
            waveLayers.push({
                layer: 'mid',
                baseY: height * (0.2 + i * 0.13),
                amplitude: 50 + Math.random() * 40,
                frequency: 0.002 + Math.random() * 0.0015,
                phase: Math.random() * Math.PI * 2,
                speed: 0.35 + Math.random() * 0.25,
                opacity: 0.12 + Math.random() * 0.08,
                lineWidth: 2.5 + Math.random() * 1.5,
                blur: 3,
                color: { r: 255, g: 80, b: 20 }
            });
        }
        
        // Foreground layer (brightest, sharpest)
        for (let i = 0; i < 4; i++) {
            waveLayers.push({
                layer: 'front',
                baseY: height * (0.3 + i * 0.12),
                amplitude: 35 + Math.random() * 30,
                frequency: 0.003 + Math.random() * 0.002,
                phase: Math.random() * Math.PI * 2,
                speed: 0.5 + Math.random() * 0.3,
                opacity: 0.25 + Math.random() * 0.15,
                lineWidth: 1.5 + Math.random() * 1,
                blur: 0,
                color: { r: 255, g: 100, b: 40 }
            });
        }
        
        // Hero wave - the main bright one
        waveLayers.push({
            layer: 'hero',
            baseY: height * 0.5,
            amplitude: 45,
            frequency: 0.0025,
            phase: 0,
            speed: 0.4,
            opacity: 0.5,
            lineWidth: 2.5,
            blur: 0,
            glow: true,
            glowSize: 20,
            glowOpacity: 0.3,
            color: { r: 255, g: 61, b: 0 }
        });
    }
    
    function initParticles() {
        particles.length = 0;
        const particleCount = Math.floor(width / 60);
        
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                baseY: height * (0.2 + Math.random() * 0.6),
                size: 1.5 + Math.random() * 2.5,
                speed: 0.3 + Math.random() * 0.4,
                brightness: 0.3 + Math.random() * 0.5,
                pulseSpeed: 1 + Math.random() * 2,
                pulsePhase: Math.random() * Math.PI * 2,
                waveAffinity: Math.random() // How much it follows wave movement
            });
        }
    }
    
    function getWaveY(x, wave, t, mouseInfluence = 0) {
        // Primary wave
        let y = Math.sin(x * wave.frequency + t * wave.speed + wave.phase) * wave.amplitude;
        
        // Secondary harmonic
        y += Math.sin(x * wave.frequency * 1.7 + t * wave.speed * 0.8 + wave.phase * 0.5) * (wave.amplitude * 0.35);
        
        // Tertiary harmonic for complexity
        y += Math.sin(x * wave.frequency * 2.3 - t * wave.speed * 0.6) * (wave.amplitude * 0.15);
        
        // Add organic noise
        y += noise(x, wave.baseY, t) * (wave.amplitude * 0.4);
        
        // Mouse interaction - create a repulsion/attraction field
        if (mouseInfluence > 0) {
            const dx = x - mouseX;
            const dy = (wave.baseY + y) - mouseY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const maxDist = 200;
            
            if (distance < maxDist) {
                const force = (1 - distance / maxDist) * mouseInfluence * 50;
                y += (dy / distance) * force;
            }
        }
        
        return wave.baseY + y;
    }
    
    function drawWave(wave, t) {
        ctx.save();
        
        // Apply blur for depth effect
        if (wave.blur > 0) {
            ctx.filter = `blur(${wave.blur}px)`;
        }
        
        // Draw glow layer first if enabled
        if (wave.glow) {
            ctx.shadowColor = `rgba(${wave.color.r}, ${wave.color.g}, ${wave.color.b}, ${wave.glowOpacity})`;
            ctx.shadowBlur = wave.glowSize;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
        }
        
        // Create gradient stroke for more visual interest
        const gradient = ctx.createLinearGradient(0, 0, width, 0);
        const baseColor = `rgba(${wave.color.r}, ${wave.color.g}, ${wave.color.b}`;
        gradient.addColorStop(0, `${baseColor}, ${wave.opacity * 0.3})`);
        gradient.addColorStop(0.2, `${baseColor}, ${wave.opacity})`);
        gradient.addColorStop(0.5, `${baseColor}, ${wave.opacity * 1.2})`);
        gradient.addColorStop(0.8, `${baseColor}, ${wave.opacity})`);
        gradient.addColorStop(1, `${baseColor}, ${wave.opacity * 0.3})`);
        
        ctx.beginPath();
        ctx.strokeStyle = gradient;
        ctx.lineWidth = wave.lineWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        const mouseInfluence = wave.layer === 'front' || wave.layer === 'hero' ? 1 : 
                              wave.layer === 'mid' ? 0.5 : 0.2;
        
        for (let x = -10; x <= width + 10; x += 3) {
            const y = getWaveY(x, wave, t, mouseInfluence);
            
            if (x === -10) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        
        ctx.stroke();
        
        // Add a second pass for extra glow on hero wave
        if (wave.glow) {
            ctx.shadowBlur = wave.glowSize * 2;
            ctx.shadowColor = `rgba(${wave.color.r}, ${wave.color.g}, ${wave.color.b}, ${wave.glowOpacity * 0.5})`;
            ctx.stroke();
        }
        
        ctx.restore();
    }
    
    function drawParticles(t) {
        particles.forEach(p => {
            // Particle follows a wave-like path
            const waveY = Math.sin(p.x * 0.003 + t * p.speed) * 40 * p.waveAffinity;
            const y = p.baseY + waveY + noise(p.x, p.baseY, t * 0.5) * 30;
            
            // Pulsing brightness
            const pulse = (Math.sin(t * p.pulseSpeed + p.pulsePhase) + 1) / 2;
            const brightness = p.brightness * (0.5 + pulse * 0.5);
            
            // Draw particle with glow
            ctx.save();
            ctx.shadowColor = `rgba(255, 61, 0, ${brightness * 0.8})`;
            ctx.shadowBlur = 10;
            
            ctx.beginPath();
            ctx.arc(p.x, y, p.size * (0.8 + pulse * 0.4), 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 120, 60, ${brightness})`;
            ctx.fill();
            
            // Bright core
            ctx.beginPath();
            ctx.arc(p.x, y, p.size * 0.4, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 200, 150, ${brightness * 1.2})`;
            ctx.fill();
            
            ctx.restore();
            
            // Slowly drift particles
            p.x += 0.1;
            if (p.x > width + 20) {
                p.x = -20;
            }
        });
    }
    
    function drawAmbientGlow(t) {
        // Draw a subtle ambient glow that pulses
        const centerY = height / 2;
        const pulse = (Math.sin(t * 0.3) + 1) / 2;
        
        const gradient = ctx.createRadialGradient(
            width / 2, centerY, 0,
            width / 2, centerY, width * 0.6
        );
        gradient.addColorStop(0, `rgba(255, 61, 0, ${0.03 + pulse * 0.02})`);
        gradient.addColorStop(0.5, `rgba(255, 61, 0, ${0.01 + pulse * 0.01})`);
        gradient.addColorStop(1, 'rgba(255, 61, 0, 0)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
    }
    
    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        // Smooth mouse follow
        mouseX += (targetMouseX - mouseX) * 0.08;
        mouseY += (targetMouseY - mouseY) * 0.08;
        
        time += 0.016;
        
        // Draw ambient glow first
        drawAmbientGlow(time);
        
        // Draw waves from back to front
        waveLayers
            .sort((a, b) => {
                const order = { back: 0, mid: 1, front: 2, hero: 3 };
                return order[a.layer] - order[b.layer];
            })
            .forEach(wave => {
                drawWave(wave, time);
            });
        
        // Draw particles on top
        drawParticles(time);
        
        animationId = requestAnimationFrame(animate);
    }
    
    // Mouse tracking
    section.addEventListener('mousemove', (e) => {
        const rect = section.getBoundingClientRect();
        targetMouseX = e.clientX - rect.left;
        targetMouseY = e.clientY - rect.top;
    });
    
    section.addEventListener('mouseleave', () => {
        targetMouseX = -1000;
        targetMouseY = -1000;
    });
    
    // Check if section is in view to pause/resume animation
    const visibilityObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (!animationId) animate();
            } else {
                if (animationId) {
                    cancelAnimationFrame(animationId);
                    animationId = null;
                }
            }
        });
    }, { threshold: 0 });
    
    visibilityObserver.observe(section);
    
    window.addEventListener('resize', resize);
    resize();
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
