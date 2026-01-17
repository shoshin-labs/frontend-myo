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
 * Flowing orange lines canvas animation
 */
function initDifferenceCanvas() {
    const canvas = document.getElementById('differenceCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const section = canvas.parentElement;
    let width, height;
    let animationId;
    let time = 0;
    
    // Line configuration
    const lines = [];
    const lineCount = 7;
    
    function resize() {
        const rect = section.getBoundingClientRect();
        width = canvas.width = rect.width;
        height = canvas.height = rect.height;
        
        // Reinitialize lines on resize
        initLines();
    }
    
    function initLines() {
        lines.length = 0;
        for (let i = 0; i < lineCount; i++) {
            lines.push({
                baseY: height * (0.2 + (i * 0.1)),
                amplitude: 40 + Math.random() * 50,
                frequency: 0.002 + Math.random() * 0.002,
                phase: Math.random() * Math.PI * 2,
                speed: 0.4 + Math.random() * 0.4,
                opacity: 0.15 + Math.random() * 0.2
            });
        }
    }
    
    function drawLine(line, t) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(255, 61, 0, ${line.opacity})`;
        ctx.lineWidth = 2;
        
        for (let x = 0; x <= width; x += 3) {
            const y = line.baseY + 
                Math.sin(x * line.frequency + t * line.speed + line.phase) * line.amplitude +
                Math.sin(x * line.frequency * 0.5 + t * line.speed * 0.7) * (line.amplitude * 0.5);
            
            if (x === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        
        ctx.stroke();
    }
    
    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        time += 0.016; // ~60fps
        
        lines.forEach(line => {
            drawLine(line, time);
        });
        
        animationId = requestAnimationFrame(animate);
    }
    
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
