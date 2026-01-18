/**
 * Myo Labs — Neo-Brutalist Interactive Scripts
 * Raw. Responsive. Alive.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize everything behind the loader
    initGridCanvas();
    initHeroNetwork();
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
 * Hero Network Visualization
 * Grid-aligned lines with data pulses and click ripple effect
 */
function initHeroNetwork() {
    const canvas = document.getElementById('heroNetworkCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const hero = document.querySelector('.hero');
    let width, height;
    let animationId;
    
    // Grid matches the background grid
    const gridSize = 40;
    
    // Network configuration
    const nodes = [];
    const connections = [];
    const pulses = [];
    const ripples = [];
    
    function resize() {
        const rect = hero.getBoundingClientRect();
        width = canvas.width = rect.width;
        height = canvas.height = rect.height;
        initNetwork();
    }
    
    function snapToGrid(value) {
        return Math.round(value / gridSize) * gridSize;
    }
    
    function initNetwork() {
        nodes.length = 0;
        connections.length = 0;
        
        // Text content is on the left, so exclusion zone shifted left
        const textCenterX = width * 0.35;
        const textCenterY = height * 0.5;
        const exclusionW = width * 0.45;
        const exclusionH = height * 0.35;
        
        function isInExclusion(x, y) {
            return x > textCenterX - exclusionW * 0.5 && 
                   x < textCenterX + exclusionW * 0.5 &&
                   y > textCenterY - exclusionH * 0.5 && 
                   y < textCenterY + exclusionH * 0.5;
        }
        
        // Create a denser grid of nodes
        const positions = [];
        
        // Top area - full width
        for (let x = gridSize; x < width - gridSize; x += gridSize * 2) {
            const y = snapToGrid(height * 0.08);
            positions.push({ x: snapToGrid(x), y });
        }
        
        // Upper row
        for (let x = gridSize * 2; x < width - gridSize * 2; x += gridSize * 2) {
            const y = snapToGrid(height * 0.18);
            if (!isInExclusion(x, y)) {
                positions.push({ x: snapToGrid(x), y });
            }
        }
        
        // Mid-upper
        for (let x = gridSize * 2; x < width - gridSize * 2; x += gridSize * 2.5) {
            const y = snapToGrid(height * 0.32);
            if (!isInExclusion(x, y)) {
                positions.push({ x: snapToGrid(x), y });
            }
        }
        
        // Mid-lower
        for (let x = gridSize * 2; x < width - gridSize * 2; x += gridSize * 2.5) {
            const y = snapToGrid(height * 0.68);
            if (!isInExclusion(x, y)) {
                positions.push({ x: snapToGrid(x), y });
            }
        }
        
        // Lower row
        for (let x = gridSize * 2; x < width - gridSize * 2; x += gridSize * 2) {
            const y = snapToGrid(height * 0.82);
            if (!isInExclusion(x, y)) {
                positions.push({ x: snapToGrid(x), y });
            }
        }
        
        // Bottom area - full width
        for (let x = gridSize; x < width - gridSize; x += gridSize * 2) {
            const y = snapToGrid(height * 0.92);
            positions.push({ x: snapToGrid(x), y });
        }
        
        // Left edge
        for (let y = gridSize * 2; y < height - gridSize * 2; y += gridSize * 1.5) {
            positions.push({ x: snapToGrid(width * 0.03), y: snapToGrid(y) });
        }
        
        // Right side - more nodes since it's open
        for (let y = gridSize * 2; y < height - gridSize * 2; y += gridSize * 1.2) {
            positions.push({ x: snapToGrid(width * 0.97), y: snapToGrid(y) });
            positions.push({ x: snapToGrid(width * 0.88), y: snapToGrid(y) });
            positions.push({ x: snapToGrid(width * 0.78), y: snapToGrid(y) });
        }
        
        // Interior points - mostly on the right where there's space
        const interiorPoints = [
            // Right side cluster
            { x: 0.65, y: 0.25 }, { x: 0.72, y: 0.35 },
            { x: 0.68, y: 0.45 }, { x: 0.75, y: 0.5 },
            { x: 0.7, y: 0.55 }, { x: 0.65, y: 0.65 },
            { x: 0.72, y: 0.75 }, { x: 0.68, y: 0.4 },
            // Top and bottom (avoiding text area)
            { x: 0.4, y: 0.12 }, { x: 0.5, y: 0.1 },
            { x: 0.4, y: 0.88 }, { x: 0.5, y: 0.9 },
        ];
        
        interiorPoints.forEach(p => {
            const x = snapToGrid(width * p.x);
            const y = snapToGrid(height * p.y);
            if (!isInExclusion(x, y)) {
                positions.push({ x, y });
            }
        });
        
        // Deduplicate positions
        const seen = new Set();
        positions.forEach(pos => {
            const key = `${pos.x},${pos.y}`;
            if (!seen.has(key)) {
                seen.add(key);
                nodes.push({ x: pos.x, y: pos.y });
            }
        });
        
        // Create connections with extended range
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            
            for (let j = i + 1; j < nodes.length; j++) {
                const other = nodes[j];
                const dx = Math.abs(node.x - other.x);
                const dy = Math.abs(node.y - other.y);
                
                // Horizontal connections
                const isHorizontal = dy === 0 && dx > 0 && dx <= gridSize * 8;
                // Vertical connections
                const isVertical = dx === 0 && dy > 0 && dy <= gridSize * 5;
                // Diagonal connections (45 degrees)
                const isDiagonal = Math.abs(dx - dy) < 5 && dx <= gridSize * 4 && dx > 0;
                
                if (isHorizontal || isVertical || isDiagonal) {
                    const midX = (node.x + other.x) / 2;
                    const midY = (node.y + other.y) / 2;
                    
                    // Don't draw lines through the text area
                    if (!isInExclusion(midX, midY)) {
                        connections.push({
                            from: i,
                            to: j,
                            opacity: 0.02 + Math.random() * 0.03
                        });
                    }
                }
            }
        }
        
        // Add long spanning lines along edges
        const leftNodes = nodes.filter(n => n.x < width * 0.15).sort((a, b) => a.y - b.y);
        const rightNodes = nodes.filter(n => n.x > width * 0.85).sort((a, b) => a.y - b.y);
        const topNodes = nodes.filter(n => n.y < height * 0.2).sort((a, b) => a.x - b.x);
        const bottomNodes = nodes.filter(n => n.y > height * 0.8).sort((a, b) => a.x - b.x);
        
        // Connect sequential nodes on edges
        [leftNodes, rightNodes, topNodes, bottomNodes].forEach(edgeNodes => {
            for (let i = 0; i < edgeNodes.length - 1; i++) {
                const fromIdx = nodes.indexOf(edgeNodes[i]);
                const toIdx = nodes.indexOf(edgeNodes[i + 1]);
                if (fromIdx !== -1 && toIdx !== -1) {
                    const exists = connections.some(c => 
                        (c.from === fromIdx && c.to === toIdx) || (c.from === toIdx && c.to === fromIdx)
                    );
                    if (!exists) {
                        connections.push({ from: fromIdx, to: toIdx, opacity: 0.025 });
                    }
                }
            }
        });
    }
    
    function spawnPulse(fromNode = null) {
        if (connections.length === 0) return;
        
        let conn;
        if (fromNode !== null) {
            // Find connections from this node
            const nodeConns = connections.filter(c => c.from === fromNode || c.to === fromNode);
            if (nodeConns.length > 0) {
                conn = nodeConns[Math.floor(Math.random() * nodeConns.length)];
            } else {
                conn = connections[Math.floor(Math.random() * connections.length)];
            }
        } else {
            conn = connections[Math.floor(Math.random() * connections.length)];
        }
        
        const reverse = fromNode !== null ? conn.to === fromNode : Math.random() > 0.5;
        
        pulses.push({
            connection: conn,
            progress: 0,
            speed: 0.005 + Math.random() * 0.007,
            reverse,
            opacity: 0.4 + Math.random() * 0.35
        });
    }
    
    function spawnRipple(x, y) {
        // Snap click to grid
        const gridX = snapToGrid(x);
        const gridY = snapToGrid(y);
        
        ripples.push({
            x: gridX,
            y: gridY,
            radius: 0,
            maxRadius: Math.max(width, height) * 0.6,
            speed: 4,
            opacity: 0.4
        });
        
        // Spawn pulses from nearby nodes
        const nearbyNodes = nodes
            .map((n, i) => ({ node: n, index: i, dist: Math.sqrt(Math.pow(n.x - gridX, 2) + Math.pow(n.y - gridY, 2)) }))
            .filter(n => n.dist < 200)
            .sort((a, b) => a.dist - b.dist)
            .slice(0, 5);
        
        nearbyNodes.forEach((n, i) => {
            setTimeout(() => spawnPulse(n.index), i * 50);
        });
    }
    
    function drawConnection(conn, rippleBoost = 0) {
        const from = nodes[conn.from];
        const to = nodes[conn.to];
        
        const opacity = Math.min(0.15, conn.opacity + rippleBoost);
        
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.strokeStyle = `rgba(255, 61, 0, ${opacity})`;
        ctx.lineWidth = 1;
        ctx.stroke();
    }
    
    function drawPulse(pulse) {
        const conn = pulse.connection;
        const from = nodes[conn.from];
        const to = nodes[conn.to];
        
        const startNode = pulse.reverse ? to : from;
        const endNode = pulse.reverse ? from : to;
        
        const x = startNode.x + (endNode.x - startNode.x) * pulse.progress;
        const y = startNode.y + (endNode.y - startNode.y) * pulse.progress;
        
        const trailLength = 0.25;
        const trailStart = Math.max(0, pulse.progress - trailLength);
        
        const startX = startNode.x + (endNode.x - startNode.x) * trailStart;
        const startY = startNode.y + (endNode.y - startNode.y) * trailStart;
        
        const gradient = ctx.createLinearGradient(startX, startY, x, y);
        gradient.addColorStop(0, 'rgba(255, 61, 0, 0)');
        gradient.addColorStop(0.6, `rgba(255, 80, 40, ${pulse.opacity * 0.5})`);
        gradient.addColorStop(1, `rgba(255, 120, 70, ${pulse.opacity})`);
        
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(x, y);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.stroke();
    }
    
    function drawRipple(ripple) {
        // Draw expanding grid-aligned ripple
        ctx.save();
        
        // Horizontal lines of ripple
        const lineSpacing = gridSize;
        const rippleWidth = 3;
        
        for (let offset = -ripple.radius; offset <= ripple.radius; offset += lineSpacing) {
            const y = ripple.y + offset;
            if (y < 0 || y > height) continue;
            
            // Calculate horizontal extent at this y level
            const distFromCenter = Math.abs(offset);
            const horizontalExtent = Math.sqrt(Math.max(0, ripple.radius * ripple.radius - distFromCenter * distFromCenter));
            
            if (horizontalExtent > 0) {
                // Fade based on distance from ripple edge
                const edgeDist = ripple.radius - Math.sqrt(offset * offset);
                const fadeZone = 40;
                const edgeFade = Math.max(0, Math.min(1, (fadeZone - Math.abs(edgeDist - ripple.radius + fadeZone)) / fadeZone));
                
                const opacity = ripple.opacity * edgeFade * (1 - ripple.radius / ripple.maxRadius);
                
                if (opacity > 0.01) {
                    ctx.beginPath();
                    ctx.moveTo(Math.max(0, ripple.x - horizontalExtent), y);
                    ctx.lineTo(Math.min(width, ripple.x + horizontalExtent), y);
                    ctx.strokeStyle = `rgba(255, 61, 0, ${opacity * 0.3})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }
        
        // Vertical lines of ripple
        for (let offset = -ripple.radius; offset <= ripple.radius; offset += lineSpacing) {
            const x = ripple.x + offset;
            if (x < 0 || x > width) continue;
            
            const distFromCenter = Math.abs(offset);
            const verticalExtent = Math.sqrt(Math.max(0, ripple.radius * ripple.radius - distFromCenter * distFromCenter));
            
            if (verticalExtent > 0) {
                const edgeDist = ripple.radius - Math.sqrt(offset * offset);
                const fadeZone = 40;
                const edgeFade = Math.max(0, Math.min(1, (fadeZone - Math.abs(edgeDist - ripple.radius + fadeZone)) / fadeZone));
                
                const opacity = ripple.opacity * edgeFade * (1 - ripple.radius / ripple.maxRadius);
                
                if (opacity > 0.01) {
                    ctx.beginPath();
                    ctx.moveTo(x, Math.max(0, ripple.y - verticalExtent));
                    ctx.lineTo(x, Math.min(height, ripple.y + verticalExtent));
                    ctx.strokeStyle = `rgba(255, 61, 0, ${opacity * 0.3})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }
        
        ctx.restore();
    }
    
    function getConnectionRippleBoost(conn) {
        let boost = 0;
        const from = nodes[conn.from];
        const to = nodes[conn.to];
        const midX = (from.x + to.x) / 2;
        const midY = (from.y + to.y) / 2;
        
        ripples.forEach(ripple => {
            const dist = Math.sqrt(Math.pow(midX - ripple.x, 2) + Math.pow(midY - ripple.y, 2));
            const rippleEdge = ripple.radius;
            const edgeWidth = 60;
            
            if (Math.abs(dist - rippleEdge) < edgeWidth) {
                const intensity = 1 - Math.abs(dist - rippleEdge) / edgeWidth;
                const fade = 1 - ripple.radius / ripple.maxRadius;
                boost += intensity * fade * 0.08;
            }
        });
        
        return boost;
    }
    
    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        // Update and draw ripples first (behind everything)
        for (let i = ripples.length - 1; i >= 0; i--) {
            const ripple = ripples[i];
            ripple.radius += ripple.speed;
            
            if (ripple.radius >= ripple.maxRadius) {
                ripples.splice(i, 1);
            } else {
                drawRipple(ripple);
            }
        }
        
        // Draw connections with ripple boost
        connections.forEach(conn => {
            const boost = getConnectionRippleBoost(conn);
            drawConnection(conn, boost);
        });
        
        // Draw and update pulses
        for (let i = pulses.length - 1; i >= 0; i--) {
            const pulse = pulses[i];
            pulse.progress += pulse.speed;
            
            if (pulse.progress >= 1) {
                pulses.splice(i, 1);
            } else {
                drawPulse(pulse);
            }
        }
        
        // Spawn new pulses occasionally
        if (Math.random() < 0.025) {
            spawnPulse();
        }
        
        animationId = requestAnimationFrame(animate);
    }
    
    // Click handler for ripple effect
    canvas.style.pointerEvents = 'auto';
    canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        spawnRipple(x, y);
    });
    
    // Only animate when hero is visible
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
    
    visibilityObserver.observe(hero);
    
    window.addEventListener('resize', resize);
    resize();
    
    // Initial pulses
    setTimeout(() => spawnPulse(), 800);
    setTimeout(() => spawnPulse(), 1500);
    setTimeout(() => spawnPulse(), 2200);
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
    let time = 0;
    
    const distortRadius = 120;
    const distortStrength = 25;
    
    // Mycelium network - branching growth
    let branches = [];
    
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        generateMycelium();
    }
    
    // Noise function for organic movement
    function noise(x, y, t) {
        const n1 = Math.sin(x * 0.008 + t * 0.2) * Math.cos(y * 0.01 + t * 0.15);
        const n2 = Math.sin(x * 0.012 - t * 0.18) * Math.sin(y * 0.007 + t * 0.12);
        const n3 = Math.cos(x * 0.006 + t * 0.1) * Math.sin(y * 0.009 - t * 0.14);
        return (n1 + n2 + n3) / 3;
    }
    
    function generateMycelium() {
        branches = [];
        
        // Create growth points (spore origins)
        const sporeCount = 6 + Math.floor(Math.random() * 4);
        
        for (let i = 0; i < sporeCount; i++) {
            const sporeX = Math.random() * width;
            const sporeY = Math.random() * height;
            
            // Each spore sends out multiple initial branches
            const branchCount = 4 + Math.floor(Math.random() * 4);
            for (let j = 0; j < branchCount; j++) {
                const angle = (Math.PI * 2 / branchCount) * j + (Math.random() - 0.5) * 0.5;
                growBranch(sporeX, sporeY, angle, 1.0, 0);
            }
        }
        
        // Add some edge growth points
        for (let i = 0; i < 8; i++) {
            let sporeX, sporeY, angle;
            const edge = Math.floor(Math.random() * 4);
            
            switch(edge) {
                case 0: // top
                    sporeX = Math.random() * width;
                    sporeY = 0;
                    angle = Math.PI / 2 + (Math.random() - 0.5) * 0.8;
                    break;
                case 1: // bottom
                    sporeX = Math.random() * width;
                    sporeY = height;
                    angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.8;
                    break;
                case 2: // left
                    sporeX = 0;
                    sporeY = Math.random() * height;
                    angle = (Math.random() - 0.5) * 0.8;
                    break;
                case 3: // right
                    sporeX = width;
                    sporeY = Math.random() * height;
                    angle = Math.PI + (Math.random() - 0.5) * 0.8;
                    break;
            }
            
            growBranch(sporeX, sporeY, angle, 0.8, 0);
        }
    }
    
    function growBranch(startX, startY, angle, thickness, depth) {
        if (depth > 5 || thickness < 0.1) return;
        if (startX < -50 || startX > width + 50 || startY < -50 || startY > height + 50) return;
        
        const points = [];
        let x = startX;
        let y = startY;
        let currentAngle = angle;
        
        // Branch length decreases with depth
        const maxLength = (80 + Math.random() * 60) * (1 - depth * 0.12);
        const segmentLength = 8 + Math.random() * 6;
        const segments = Math.floor(maxLength / segmentLength);
        
        for (let i = 0; i < segments; i++) {
            points.push({ x, y, phase: Math.random() * Math.PI * 2 });
            
            // Organic wandering
            currentAngle += (Math.random() - 0.5) * 0.4;
            
            // Slight tendency to grow away from edges
            if (x < 100) currentAngle += 0.05;
            if (x > width - 100) currentAngle -= 0.05;
            if (y < 100) currentAngle += (currentAngle > 0 ? 0.05 : -0.05);
            if (y > height - 100) currentAngle -= (currentAngle > 0 ? 0.05 : -0.05);
            
            x += Math.cos(currentAngle) * segmentLength;
            y += Math.sin(currentAngle) * segmentLength;
            
            // Chance to branch
            const branchChance = 0.08 + depth * 0.02;
            if (i > 2 && Math.random() < branchChance) {
                const branchAngle = currentAngle + (Math.random() > 0.5 ? 1 : -1) * (0.4 + Math.random() * 0.6);
                growBranch(x, y, branchAngle, thickness * 0.7, depth + 1);
            }
        }
        
        // Add final point
        points.push({ x, y, phase: Math.random() * Math.PI * 2 });
        
        if (points.length > 1) {
            branches.push({
                points,
                thickness,
                depth,
                opacity: (0.025 + Math.random() * 0.02) * thickness,
                pulseSpeed: 0.2 + Math.random() * 0.3,
                pulsePhase: Math.random() * Math.PI * 2
            });
        }
        
        // End branching - thinner offshoots
        if (depth < 4 && Math.random() > 0.4) {
            const endBranches = 1 + Math.floor(Math.random() * 2);
            for (let i = 0; i < endBranches; i++) {
                const branchAngle = currentAngle + (Math.random() - 0.5) * 1.2;
                growBranch(x, y, branchAngle, thickness * 0.5, depth + 1);
            }
        }
    }
    
    function drawMycelium() {
        ctx.clearRect(0, 0, width, height);
        
        time += 0.016;
        
        // Smooth mouse follow
        mouseX += (targetMouseX - mouseX) * 0.08;
        mouseY += (targetMouseY - mouseY) * 0.08;
        
        // Sort branches by depth (draw thicker/main branches last)
        const sortedBranches = [...branches].sort((a, b) => b.depth - a.depth);
        
        // Draw all branches
        sortedBranches.forEach(branch => {
            if (branch.points.length < 2) return;
            
            // Subtle pulse animation
            const pulse = (Math.sin(time * branch.pulseSpeed + branch.pulsePhase) + 1) / 2;
            const opacity = branch.opacity * (0.6 + pulse * 0.4);
            
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.lineWidth = Math.max(0.5, branch.thickness * 1.5);
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            
            for (let i = 0; i < branch.points.length; i++) {
                const p = branch.points[i];
                
                // Organic movement - subtler for thinner branches
                const movementScale = 2 + branch.thickness * 2;
                const noiseOffset = noise(p.x, p.y, time) * movementScale;
                const breathe = Math.sin(time * 0.4 + p.phase) * movementScale * 0.5;
                
                let drawX = p.x + noiseOffset + breathe;
                let drawY = p.y + noise(p.y, p.x, time * 0.7) * movementScale;
                
                // Cursor interaction
                const dx = drawX - mouseX;
                const dy = drawY - mouseY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < distortRadius && dist > 0) {
                    const force = (1 - dist / distortRadius) * distortStrength * branch.thickness;
                    drawX += (dx / dist) * force;
                    drawY += (dy / dist) * force;
                }
                
                if (i === 0) {
                    ctx.moveTo(drawX, drawY);
                } else {
                    // Smooth curves
                    const prev = branch.points[i - 1];
                    const prevNoiseOffset = noise(prev.x, prev.y, time) * movementScale;
                    const prevBreathe = Math.sin(time * 0.4 + prev.phase) * movementScale * 0.5;
                    let prevX = prev.x + prevNoiseOffset + prevBreathe;
                    let prevY = prev.y + noise(prev.y, prev.x, time * 0.7) * movementScale;
                    
                    const prevDx = prevX - mouseX;
                    const prevDy = prevY - mouseY;
                    const prevDist = Math.sqrt(prevDx * prevDx + prevDy * prevDy);
                    if (prevDist < distortRadius && prevDist > 0) {
                        const force = (1 - prevDist / distortRadius) * distortStrength * branch.thickness;
                        prevX += (prevDx / prevDist) * force;
                        prevY += (prevDy / prevDist) * force;
                    }
                    
                    const midX = (prevX + drawX) / 2;
                    const midY = (prevY + drawY) / 2;
                    ctx.quadraticCurveTo(prevX, prevY, midX, midY);
                }
            }
            ctx.stroke();
        });
        
        // Subtle glow near cursor
        if (mouseX > 0 && mouseY > 0) {
            const gradient = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, distortRadius * 0.8);
            gradient.addColorStop(0, 'rgba(255, 61, 0, 0.02)');
            gradient.addColorStop(1, 'rgba(255, 61, 0, 0)');
            ctx.fillStyle = gradient;
            ctx.fillRect(mouseX - distortRadius, mouseY - distortRadius, distortRadius * 2, distortRadius * 2);
        }
        
        requestAnimationFrame(drawMycelium);
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
    drawMycelium();
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

/**
 * Logo Easter Egg
 */
function initLogoEasterEgg() {
    const logo = document.getElementById('logo-easter-egg');
    if (!logo) return;
    
    const dot = logo.querySelector('.logo-dot');
    let particles = [];
    let isActive = false;
    
    function createParticles() {
        if (!dot) return;
        
        const rect = dot.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Create orbiting particles
        for (let i = 0; i < 6; i++) {
            const particle = document.createElement('div');
            const angle = (Math.PI * 2 / 6) * i;
            const size = 3 + Math.random() * 3;
            
            particle.style.cssText = `
                position: fixed;
                width: ${size}px;
                height: ${size}px;
                background: var(--color-accent);
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                box-shadow: 0 0 ${size * 2}px rgba(255, 61, 0, 0.6);
                transition: opacity 0.3s ease;
            `;
            
            document.body.appendChild(particle);
            particles.push({
                element: particle,
                angle: angle,
                radius: 15 + Math.random() * 10,
                speed: 0.03 + Math.random() * 0.02,
                centerX,
                centerY
            });
        }
    }
    
    function animateParticles() {
        if (!isActive) {
            // Fade out and remove particles
            particles.forEach(p => {
                p.element.style.opacity = '0';
                setTimeout(() => p.element.remove(), 300);
            });
            particles = [];
            return;
        }
        
        const rect = dot.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        particles.forEach(p => {
            p.angle += p.speed;
            p.centerX = centerX;
            p.centerY = centerY;
            
            const x = p.centerX + Math.cos(p.angle) * p.radius;
            const y = p.centerY + Math.sin(p.angle) * p.radius;
            
            p.element.style.left = `${x}px`;
            p.element.style.top = `${y}px`;
            p.element.style.transform = 'translate(-50%, -50%)';
        });
        
        requestAnimationFrame(animateParticles);
    }
    
    logo.addEventListener('mouseenter', () => {
        isActive = true;
        logo.classList.add('easter-egg-active');
        createParticles();
        animateParticles();
        
        // Log something fun to console
        console.log('%c👋 Hey there, curious one!', 'color: #FF3D00; font-size: 16px; font-weight: bold;');
        console.log('%cWe like people who dig into the code.', 'color: #888; font-size: 12px;');
    });
    
    logo.addEventListener('mouseleave', () => {
        isActive = false;
        logo.classList.remove('easter-egg-active');
    });
}

// Initialize logo easter egg
document.addEventListener('DOMContentLoaded', initLogoEasterEgg);
