// ╔══════════════════════════════════════════════════════════════╗
// ║          PLAYHUB PRO - INDEX PAGE JS                        ║
// ║     Enhanced with New Animations & Interactions             ║
// ╚══════════════════════════════════════════════════════════════╝

document.addEventListener('DOMContentLoaded', () => {
    initLoadingScreen();
});

// ╔══════════════════════════════════════════════════════════════╗
// ║           ENHANCED LOADING SCREEN                            ║
// ╚══════════════════════════════════════════════════════════════╝

function initLoadingScreen() {
    const loadingScreen = document.createElement('div');
    loadingScreen.id = 'loadingScreen';
    loadingScreen.innerHTML = `
        <div class="loading-container">
            <div class="loading-logo">
                <div class="logo-glow"></div>
                <div class="logo-rings">
                    <div class="l-ring l-ring-1"></div>
                    <div class="l-ring l-ring-2"></div>
                    <div class="l-ring l-ring-3"></div>
                </div>
                <span class="logo-icon">🎮</span>
                <div class="logo-text-wrapper">
                    <span class="logo-text">PLAYHUB</span>
                    <span class="logo-pro">PRO</span>
                </div>
            </div>
            <div class="loading-bar-container">
                <div class="loading-progress">
                    <div class="loading-fill" id="loadingFill"></div>
                    <div class="loading-shimmer"></div>
                    <div class="loading-particles-bar" id="loadingParticlesBar"></div>
                </div>
                <div class="loading-percentage" id="loadingPercent">0%</div>
            </div>
            <div class="loading-status" id="loadingStatus">Initializing...</div>
            <div class="loading-stats" id="loadingStats">
                <div class="l-stat"><span class="l-label">Assets</span><span class="l-value" id="assetCount">0/24</span></div>
                <div class="l-stat"><span class="l-label">Effects</span><span class="l-value" id="effectCount">0/12</span></div>
                <div class="l-stat"><span class="l-label">Systems</span><span class="l-value" id="systemCount">0/8</span></div>
            </div>
            <div class="loading-particles" id="loadingParticles"></div>
            <div class="loading-rings">
                <div class="ring ring-1"></div>
                <div class="ring ring-2"></div>
                <div class="ring ring-3"></div>
                <div class="ring ring-4"></div>
            </div>
        </div>
    `;
    
    const loadingStyles = document.createElement('style');
    loadingStyles.textContent = `
        #loadingScreen {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: 
                radial-gradient(ellipse at 20% 20%, rgba(0, 245, 255, 0.1) 0%, transparent 50%),
                radial-gradient(ellipse at 80% 80%, rgba(255, 0, 228, 0.1) 0%, transparent 50%),
                linear-gradient(135deg, #050508 0%, #0a0a0f 50%, #050508 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 99999;
            overflow: hidden;
            font-family: 'Orbitron', sans-serif;
        }
        
        .loading-container {
            text-align: center;
            position: relative;
            z-index: 10;
            max-width: 500px;
            width: 90%;
        }
        
        .loading-logo {
            position: relative;
            display: inline-flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 3rem;
            animation: logoEntrance 1s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        
        @keyframes logoEntrance {
            0% { opacity: 0; transform: scale(0.5) translateY(-50px) rotateX(-30deg); }
            60% { transform: scale(1.1) translateY(0) rotateX(5deg); }
            100% { opacity: 1; transform: scale(1) translateY(0) rotateX(0); }
        }
        
        .logo-rings {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 120px;
            height: 120px;
        }
        
        .l-ring {
            position: absolute;
            border: 2px solid transparent;
            border-radius: 50%;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
        
        .l-ring-1 {
            width: 100%;
            height: 100%;
            border-top-color: #00f5ff;
            border-right-color: #ff00e4;
            animation: ringRotate 3s linear infinite;
        }
        
        .l-ring-2 {
            width: 140%;
            height: 140%;
            border-bottom-color: #ff00e4;
            border-left-color: #ffea00;
            animation: ringRotate 5s linear infinite reverse;
        }
        
        .l-ring-3 {
            width: 180%;
            height: 180%;
            border-top-color: #ffea00;
            border-right-color: #00f5ff;
            animation: ringRotate 7s linear infinite;
        }
        
        @keyframes ringRotate {
            0% { transform: translate(-50%, -50%) rotate(0deg); }
            100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
        
        .logo-glow {
            position: absolute;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(0,245,255,0.4) 0%, transparent 70%);
            filter: blur(40px);
            animation: glowPulse 2s ease-in-out infinite;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
        
        @keyframes glowPulse {
            0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
            50% { opacity: 1; transform: translate(-50%, -50%) scale(1.2); }
        }
        
        .loading-logo .logo-icon {
            font-size: 4rem;
            animation: iconFloat 3s ease-in-out infinite;
            filter: drop-shadow(0 0 20px #00f5ff);
            z-index: 2;
            position: relative;
        }
        
        @keyframes iconFloat {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-15px) rotate(5deg); }
        }
        
        .logo-text-wrapper {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            line-height: 1;
            z-index: 2;
            position: relative;
        }
        
        .logo-text {
            font-size: 2.5rem;
            font-weight: 900;
            color: #ffffff;
            letter-spacing: 4px;
            text-transform: uppercase;
            text-shadow: 0 0 30px rgba(0, 245, 255, 0.3);
        }
        
        .logo-pro {
            font-size: 2.5rem;
            font-weight: 900;
            background: linear-gradient(135deg, #00f5ff 0%, #ff00e4 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            letter-spacing: 4px;
            animation: proGlow 2s ease-in-out infinite;
        }
        
        @keyframes proGlow {
            0%, 100% { filter: drop-shadow(0 0 10px #00f5ff); }
            50% { filter: drop-shadow(0 0 30px #ff00e4); }
        }
        
        .loading-bar-container {
            width: 100%;
            margin: 0 auto 2rem;
        }
        
        .loading-progress {
            height: 10px;
            background: rgba(255,255,255,0.05);
            border-radius: 10px;
            overflow: hidden;
            position: relative;
            box-shadow: 0 0 20px rgba(0,245,255,0.1), inset 0 2px 4px rgba(0,0,0,0.3);
        }
        
        .loading-fill {
            height: 100%;
            width: 0%;
            background: linear-gradient(90deg, #00f5ff 0%, #ff00e4 50%, #ffea00 100%);
            background-size: 200% 100%;
            border-radius: 10px;
            transition: width 0.3s ease;
            position: relative;
            box-shadow: 0 0 20px rgba(0,245,255,0.5);
            animation: gradientFlow 2s linear infinite;
        }
        
        @keyframes gradientFlow {
            0% { background-position: 0% 50%; }
            100% { background-position: 200% 50%; }
        }
        
        .loading-shimmer {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
            animation: shimmer 1.5s infinite;
        }
        
        @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
        }
        
        .loading-particles-bar {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
        }
        
        .loading-percentage {
            font-size: 2rem;
            font-weight: 700;
            color: #00f5ff;
            margin-top: 1rem;
            text-shadow: 0 0 20px rgba(0,245,255,0.5);
            font-family: 'Orbitron', sans-serif;
        }
        
        .loading-status {
            font-size: 1rem;
            color: #8b8b9a;
            margin-top: 0.5rem;
            letter-spacing: 3px;
            text-transform: uppercase;
            animation: textPulse 1.5s ease-in-out infinite;
            min-height: 1.5rem;
        }
        
        @keyframes textPulse {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 1; color: #00f5ff; }
        }
        
        .loading-stats {
            display: flex;
            justify-content: center;
            gap: 2rem;
            margin-top: 2rem;
            opacity: 0;
            animation: statsFadeIn 0.5s ease forwards;
            animation-delay: 0.5s;
        }
        
        @keyframes statsFadeIn {
            to { opacity: 1; }
        }
        
        .l-stat {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.3rem;
        }
        
        .l-label {
            font-size: 0.75rem;
            color: #8b8b9a;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .l-value {
            font-size: 1.1rem;
            color: #00f5ff;
            font-weight: 600;
            font-family: 'Orbitron', sans-serif;
        }
        
        .loading-particles {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            pointer-events: none;
        }
        
        .loading-particle {
            position: absolute;
            width: 4px;
            height: 4px;
            background: #00f5ff;
            border-radius: 50%;
            box-shadow: 0 0 10px #00f5ff;
            animation: particleFloat 3s infinite;
        }
        
        @keyframes particleFloat {
            0%, 100% { 
                transform: translateY(100vh) scale(0); 
                opacity: 0; 
            }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { 
                transform: translateY(-100vh) scale(1); 
                opacity: 0; 
            }
        }
        
        .loading-rings {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            pointer-events: none;
        }
        
        .ring {
            position: absolute;
            border: 2px solid transparent;
            border-radius: 50%;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
        
        .ring-1 {
            width: 300px;
            height: 300px;
            border-top-color: #00f5ff;
            border-right-color: #ff00e4;
            animation: ringRotate 4s linear infinite;
        }
        
        .ring-2 {
            width: 450px;
            height: 450px;
            border-bottom-color: #ff00e4;
            border-left-color: #ffea00;
            animation: ringRotate 6s linear infinite reverse;
        }
        
        .ring-3 {
            width: 600px;
            height: 600px;
            border-top-color: #ffea00;
            border-right-color: #00f5ff;
            animation: ringRotate 8s linear infinite;
        }
        
        .ring-4 {
            width: 750px;
            height: 750px;
            border: 1px solid rgba(0, 245, 255, 0.1);
            animation: ringRotate 12s linear infinite reverse;
        }
        
        .loading-exit {
            animation: loadingExit 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        
        @keyframes loadingExit {
            0% { opacity: 1; transform: scale(1); filter: blur(0); }
            40% { opacity: 0.5; transform: scale(1.1); filter: blur(5px); }
            100% { opacity: 0; transform: scale(0); filter: blur(20px); visibility: hidden; }
        }
    `;
    
    document.head.appendChild(loadingStyles);
    document.body.appendChild(loadingScreen);
    document.body.style.overflow = 'hidden';
    
    // Create loading particles
    const particlesContainer = document.getElementById('loadingParticles');
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'loading-particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 3 + 's';
        particle.style.animationDuration = (Math.random() * 3 + 2) + 's';
        
        const colors = ['#00f5ff', '#ff00e4', '#ffea00'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        particle.style.background = color;
        particle.style.boxShadow = `0 0 10px ${color}`;
        
        particlesContainer.appendChild(particle);
    }
    
    // Loading sequence
    const loadingTexts = [
        'Initializing Core Systems...',
        'Loading Assets...',
        'Compiling Shaders...',
        'Optimizing Performance...',
        'Establishing Connection...',
        'Ready to Launch!'
    ];
    
    const loadingFill = document.getElementById('loadingFill');
    const loadingPercent = document.getElementById('loadingPercent');
    const loadingStatus = document.getElementById('loadingStatus');
    const assetCount = document.getElementById('assetCount');
    const effectCount = document.getElementById('effectCount');
    const systemCount = document.getElementById('systemCount');
    
    let progress = 0;
    let assets = 0;
    let effects = 0;
    let systems = 0;
    
    const loadingInterval = setInterval(() => {
        // Variable speed based on progress
        const speed = progress < 30 ? 2 : progress < 70 ? 1.5 : 1;
        progress += Math.random() * speed + 0.5;
        
        if (progress > 100) progress = 100;
        
        loadingFill.style.width = progress + '%';
        loadingPercent.textContent = Math.floor(progress) + '%';
        
        // Update stats
        assets = Math.min(24, Math.floor((progress / 100) * 24));
        effects = Math.min(12, Math.floor((progress / 100) * 12));
        systems = Math.min(8, Math.floor((progress / 100) * 8));
        
        assetCount.textContent = `${assets}/24`;
        effectCount.textContent = `${effects}/12`;
        systemCount.textContent = `${systems}/8`;
        
        // Update status text
        const textIndex = Math.floor((progress / 100) * (loadingTexts.length - 1));
        loadingStatus.textContent = loadingTexts[textIndex];
        
        if (progress >= 100) {
            clearInterval(loadingInterval);
            setTimeout(() => {
                loadingScreen.classList.add('loading-exit');
                setTimeout(() => {
                    loadingScreen.remove();
                    document.body.style.overflow = '';
                    initHomePage();
                }, 800);
            }, 600);
        }
    }, 40);
}

// ╔══════════════════════════════════════════════════════════════╗
// ║           HOME PAGE INITIALIZATION                           ║
// ╚══════════════════════════════════════════════════════════════╝

function initHomePage() {
    initCustomCursor();
    initCursorTrail();
    initParticles();
    initScrollAnimations();
    init3DCards();
    initCounters();
    initNavigation();
    initHamburger();
    initMagneticButtons();
    initNewsletterForm();
    initLiveTicker();
    initSmoothScroll();
    initTextScramble();
    initParallax();
    initRevealAnimations();
    observeElements();
}

// ╔══════════════════════════════════════════════════════════════╗
// ║           CUSTOM CURSOR - ENHANCED                           ║
// ╚══════════════════════════════════════════════════════════════╝

function initCustomCursor() {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    
    if (!cursor || !follower) return;
    
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let followerX = 0, followerY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.2;
        cursorY += (mouseY - cursorY) * 0.2;
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;
        
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        follower.style.left = followerX + 'px';
        follower.style.top = followerY + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();
    
    // Hover effects
    const hoverElements = document.querySelectorAll('a, button, .game-card, .stat-box, .h-stat, .social-icon, .cta-btn, .magnetic-btn');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
            follower.style.transform = 'translate(-50%, -50%) scale(1.5)';
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
            follower.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });
}

// ╔══════════════════════════════════════════════════════════════╗
// ║           NEW: CURSOR TRAIL EFFECT                           ║
// ╚══════════════════════════════════════════════════════════════╝

function initCursorTrail() {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    
    const trailCount = 5;
    const trails = [];
    
    for (let i = 0; i < trailCount; i++) {
        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        document.body.appendChild(trail);
        trails.push({ element: trail, x: 0, y: 0 });
    }
    
    let mouseX = 0, mouseY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animateTrails() {
        trails.forEach((trail, index) => {
            const delay = (index + 1) * 0.1;
            trail.x += (mouseX - trail.x) * (0.3 - delay * 0.05);
            trail.y += (mouseY - trail.y) * (0.3 - delay * 0.05);
            
            trail.element.style.left = trail.x + 'px';
            trail.element.style.top = trail.y + 'px';
            trail.element.style.opacity = 1 - (index * 0.15);
            trail.element.style.transform = `translate(-50%, -50%) scale(${1 - index * 0.15})`;
        });
        
        requestAnimationFrame(animateTrails);
    }
    animateTrails();
}

// ╔══════════════════════════════════════════════════════════════╗
// ║           PARTICLE SYSTEM - ENHANCED                         ║
// ╚══════════════════════════════════════════════════════════════╝

function initParticles() {
    const heroParticles = document.getElementById('heroParticles');
    if (!heroParticles) return;
    
    // Create floating particles with connection lines
    const particles = [];
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'h-particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 10 + 's';
        particle.style.animationDuration = (Math.random() * 5 + 10) + 's';
        
        const colors = ['#00f5ff', '#ff00e4', '#ffea00'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        particle.style.background = color;
        particle.style.boxShadow = `0 0 10px ${color}`;
        
        heroParticles.appendChild(particle);
        particles.push({
            element: particle,
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5
        });
    }
    
    // Interactive particles on mouse move
    document.addEventListener('mousemove', (e) => {
        particles.forEach(p => {
            const dx = e.clientX - p.x;
            const dy = e.clientY - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 150) {
                p.vx -= dx * 0.001;
                p.vy -= dy * 0.001;
            }
        });
    });
}

// ╔══════════════════════════════════════════════════════════════╗
// ║           NEW: TEXT SCRAMBLE EFFECT                          ║
// ╚══════════════════════════════════════════════════════════════╝

function initTextScramble() {
    const glitchLines = document.querySelectorAll('.glitch-line');
    const chars = '!<>-_\\/[]{}—=+*^?#________';
    
    glitchLines.forEach(line => {
        const originalText = line.textContent;
        
        line.addEventListener('mouseenter', () => {
            let iteration = 0;
            const interval = setInterval(() => {
                line.textContent = originalText
                    .split('')
                    .map((letter, index) => {
                        if (index < iteration) {
                            return originalText[index];
                        }
                        return chars[Math.floor(Math.random() * chars.length)];
                    })
                    .join('');
                
                if (iteration >= originalText.length) {
                    clearInterval(interval);
                }
                iteration += 1 / 3;
            }, 30);
        });
    });
}

// ╔══════════════════════════════════════════════════════════════╗
// ║           NEW: PARALLAX EFFECTS                              ║
// ╚══════════════════════════════════════════════════════════════╝

function initParallax() {
    const parallaxElements = document.querySelectorAll('.shape, .hero-glow, .stats-glow');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach((el, index) => {
            const speed = 0.5 + (index * 0.1);
            el.style.transform = `translateY(${scrolled * speed}px)`;
        });
    }, { passive: true });
}

// ╔══════════════════════════════════════════════════════════════╗
// ║           SCROLL ANIMATIONS - ENHANCED                       ║
// ╚══════════════════════════════════════════════════════════════╝

function initScrollAnimations() {
    // Parallax effect for hero
    const hero = document.querySelector('.hero-section');
    const heroContent = document.querySelector('.hero-content');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        if (hero && scrolled < window.innerHeight) {
            heroContent.style.transform = `translateY(${scrolled * 0.4}px)`;
            heroContent.style.opacity = 1 - (scrolled / window.innerHeight);
        }
    }, { passive: true });
}

// ╔══════════════════════════════════════════════════════════════╗
// ║           NEW: REVEAL ANIMATIONS                             ║
// ╚══════════════════════════════════════════════════════════════╝

function initRevealAnimations() {
    const reveals = document.querySelectorAll('.section-header, .game-card, .stat-box, .newsletter-content, .cta-content');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    
    reveals.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        revealObserver.observe(el);
    });
}

// ╔══════════════════════════════════════════════════════════════╗
// ║           3D CARD TILT EFFECT - ENHANCED                     ║
// ╚══════════════════════════════════════════════════════════════╝

function init3DCards() {
    const cards = document.querySelectorAll('[data-tilt]');
    
    cards.forEach((card, index) => {
        card.style.setProperty('--index', index);
        
        card.addEventListener('mousemove', handleTilt);
        card.addEventListener('mouseleave', resetTilt);
        
        // Click navigation
        card.addEventListener('click', () => {
            // Ripple effect on click
            const ripple = document.createElement('div');
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(0, 245, 255, 0.3);
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            const rect = card.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = (rect.width / 2 - size / 2) + 'px';
            ripple.style.top = (rect.height / 2 - size / 2) + 'px';
            
            card.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
            
            const game = card.getAttribute('data-game');
            if (game) {
                const gameUrls = {
                    'spaceshooter': 'pages/spaceshooter.html',
                    'brickbreaker': 'pages/brickbreaker.html',
                    'fruitslice': 'pages/fruitslice.html',
                    'tetris': 'pages/tetris.html',
                    'snake': 'pages/snake.html'
                };
                window.location.href = gameUrls[game] || 'games.html';
            }
        });
    });
    
    function handleTilt(e) {
        const card = this;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -15;
        const rotateY = ((x - centerX) / centerX) * 15;
        
        card.style.transform = `
            perspective(1000px) 
            rotateX(${rotateX}deg) 
            rotateY(${rotateY}deg) 
            scale3d(1.05, 1.05, 1.05)
        `;
        
        // Dynamic glow
        const glow = card.querySelector('.card-glow');
        if (glow) {
            const glowX = (x / rect.width) * 100;
            const glowY = (y / rect.height) * 100;
            glow.style.background = `
                radial-gradient(circle at ${glowX}% ${glowY}%, 
                rgba(0,245,255,0.3), 
                transparent 60%)
            `;
        }
    }
    
    function resetTilt() {
        this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        const glow = this.querySelector('.card-glow');
        if (glow) {
            glow.style.background = '';
        }
    }
}

// ╔══════════════════════════════════════════════════════════════╗
// ║           STATS COUNTER ANIMATION - ENHANCED                 ║
// ╚══════════════════════════════════════════════════════════════╝

function initCounters() {
    const stats = document.querySelectorAll('.h-value[data-target], .s-number[data-target]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                
                const target = parseFloat(entry.target.getAttribute('data-target'));
                const suffix = entry.target.getAttribute('data-suffix') || '';
                const isDecimal = target % 1 !== 0;
                
                // Add counting animation class
                entry.target.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    entry.target.style.transform = 'scale(1)';
                }, 200);
                
                animateValue(entry.target, 0, target, 2000, isDecimal, suffix);
                
                // Animate progress bar if exists
                const progressFill = entry.target.closest('.stat-box, .h-stat')?.querySelector('.s-fill, .stat-progress-fill');
                if (progressFill) {
                    setTimeout(() => {
                        progressFill.style.width = '100%';
                    }, 200);
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    stats.forEach(stat => observer.observe(stat));
}

function animateValue(element, start, end, duration, isDecimal = false, suffix = '') {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = start + (end - start) * easeOutQuart;
        
        if (isDecimal) {
            element.textContent = current.toFixed(1) + suffix;
        } else {
            element.textContent = Math.floor(current) + suffix;
        }
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            element.textContent = end + suffix;
            // Pulse effect on complete
            element.style.animation = 'valuePulse 0.5s ease';
            setTimeout(() => {
                element.style.animation = '';
            }, 500);
        }
    };
    window.requestAnimationFrame(step);
}

// ╔══════════════════════════════════════════════════════════════╗
// ║           NAVIGATION - ENHANCED                              ║
// ╚══════════════════════════════════════════════════════════════╝

function initNavigation() {
    const nav = document.querySelector('.navbar');
    let lastScroll = 0;
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const currentScroll = window.pageYOffset;
                
                // Add/remove scrolled class
                if (currentScroll > 100) {
                    nav.classList.add('scrolled');
                } else {
                    nav.classList.remove('scrolled');
                }
                
                // Hide/show on scroll direction
                if (currentScroll > lastScroll && currentScroll > 200) {
                    nav.style.transform = 'translateX(-50%) translateY(-150%)';
                } else {
                    nav.style.transform = 'translateX(-50%) translateY(0)';
                }
                
                lastScroll = currentScroll;
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

function initHamburger() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (!hamburger || !navLinks) return;
    
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
    
    // Close menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}

// ╔══════════════════════════════════════════════════════════════╗
// ║           MAGNETIC BUTTONS - ENHANCED                        ║
// ╚══════════════════════════════════════════════════════════════╝

function initMagneticButtons() {
    const buttons = document.querySelectorAll('.magnetic-btn, .magnetic-icon');
    
    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
        
        // Click ripple
        btn.addEventListener('click', (e) => {
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255,255,255,0.6);
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            const rect = btn.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
            ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
            
            btn.style.position = 'relative';
            btn.style.overflow = 'hidden';
            btn.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });
}

// ╔══════════════════════════════════════════════════════════════╗
// ║           NEWSLETTER FORM - ENHANCED                         ║
// ╚══════════════════════════════════════════════════════════════╝

function initNewsletterForm() {
    const form = document.querySelector('.newsletter-form');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = form.querySelector('input');
        const button = form.querySelector('button');
        
        if (input.value) {
            // Loading state
            button.innerHTML = '<span class="btn-loading">⌛</span>';
            button.disabled = true;
            
            setTimeout(() => {
                // Success animation
                button.classList.add('success');
                button.innerHTML = '<span>✓ Subscribed!</span>';
                button.style.background = '#00ff88';
                button.style.boxShadow = '0 0 30px rgba(0, 255, 136, 0.5)';
                
                showToast('🎉 Welcome to the elite! Check your email.');
                
                // Confetti effect
                createConfetti(button);
                
                setTimeout(() => {
                    button.classList.remove('success');
                    button.innerHTML = '<span>Subscribe</span><span class="btn-icon">→</span>';
                    button.style.background = '';
                    button.style.boxShadow = '';
                    button.disabled = false;
                    input.value = '';
                }, 3000);
            }, 1500);
        }
    });
}

function createConfetti(element) {
    const rect = element.getBoundingClientRect();
    const colors = ['#00f5ff', '#ff00e4', '#ffea00', '#00ff88'];
    
    for (let i = 0; i < 30; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            left: ${rect.left + rect.width / 2}px;
            top: ${rect.top + rect.height / 2}px;
            width: 8px;
            height: 8px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
            pointer-events: none;
            z-index: 10000;
        `;
        
        document.body.appendChild(confetti);
        
        const angle = (Math.random() - 0.5) * Math.PI * 2;
        const velocity = 100 + Math.random() * 200;
        let x = 0, y = 0, rotation = 0, opacity = 1;
        
        const animate = () => {
            x += Math.cos(angle) * velocity * 0.1;
            y += Math.sin(angle) * velocity * 0.1 + 5;
            rotation += 10;
            opacity -= 0.02;
            
            confetti.style.transform = `translate(${x}px, ${y}px) rotate(${rotation}deg)`;
            confetti.style.opacity = opacity;
            
            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                confetti.remove();
            }
        };
        
        requestAnimationFrame(animate);
    }
}

// ╔══════════════════════════════════════════════════════════════╗
// ║           LIVE TICKER - ENHANCED                             ║
// ╚══════════════════════════════════════════════════════════════╝

function initLiveTicker() {
    const ticker = document.getElementById('ticker');
    if (!ticker) return;
    
    // Clone for seamless loop
    ticker.innerHTML += ticker.innerHTML;
    
    // Dynamic speed based on content
    const items = ticker.querySelectorAll('.activity-item');
    const totalWidth = Array.from(items).reduce((acc, item) => acc + item.offsetWidth + 48, 0);
    const duration = totalWidth / 50;
    
    ticker.style.animationDuration = duration + 's';
    
    // NEW: Add random activity updates
    const activities = [
        '🎮 Player123 just scored 15,420 in Space Shooter',
        '🏆 Maria_Gamer achieved rank #1 in Tetris',
        '⚡ SpeedDemon unlocked "Lightning Fast" achievement',
        '🎯 ProPlayer hit 100 combo in Fruit Slice',
        '🔥 New high score: 99,999 in Neon Snake Wars',
        '🌟 New player joined from Philippines',
        '🎮 EliteSniper completed "Headshot Master" challenge',
        '🏅 SpeedRunner beat the record by 2.5 seconds',
        '💎 VIP member unlocked exclusive skin',
        '🔥 Trending: Space Shooter hits 10k players'
    ];
    
    setInterval(() => {
        const randomActivity = activities[Math.floor(Math.random() * activities.length)];
        const newItem = document.createElement('span');
        newItem.className = 'activity-item';
        newItem.textContent = randomActivity;
        ticker.appendChild(newItem);
    }, 10000);
}

// ╔══════════════════════════════════════════════════════════════╗
// ║           SMOOTH SCROLL - ENHANCED                           ║
// ╚══════════════════════════════════════════════════════════════╝

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                // Add highlight effect
                target.style.boxShadow = '0 0 50px rgba(0, 245, 255, 0.5)';
                setTimeout(() => {
                    target.style.boxShadow = '';
                }, 1000);
                
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ╔══════════════════════════════════════════════════════════════╗
// ║           OBSERVE ELEMENTS - ENHANCED                        ║
// ╚══════════════════════════════════════════════════════════════╝

function observeElements() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Staggered animation for grids
                if (entry.target.classList.contains('game-card') || 
                    entry.target.classList.contains('stat-box')) {
                    const siblings = Array.from(entry.target.parentElement.children);
                    const index = siblings.indexOf(entry.target);
                    entry.target.style.transitionDelay = `${index * 0.1}s`;
                }
                
                // Special animation for stat boxes
                if (entry.target.classList.contains('stat-box')) {
                    entry.target.style.animation = 'statPop 0.5s ease';
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements
    const elements = document.querySelectorAll(
        '.game-card, .stat-box, .newsletter-content, .cta-content'
    );
    
    elements.forEach(el => observer.observe(el));
}

// ╔══════════════════════════════════════════════════════════════╗
// ║           TOAST NOTIFICATIONS - ENHANCED                       ║
// ╚══════════════════════════════════════════════════════════════╝

function showToast(message, type = 'success') {
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) existingToast.remove();
    
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    
    const colors = {
        success: 'linear-gradient(135deg, #00f5ff, #ff00e4)',
        error: 'linear-gradient(135deg, #ff3333, #ff00e4)',
        warning: 'linear-gradient(135deg, #ffea00, #ff00e4)'
    };
    
    toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        background: ${colors[type] || colors.success};
        color: #050508;
        padding: 1rem 2rem;
        border-radius: 50px;
        font-weight: 700;
        font-family: 'Orbitron', sans-serif;
        z-index: 10000;
        box-shadow: 0 10px 40px rgba(0,245,255,0.4);
        transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        font-size: 1rem;
        text-align: center;
        min-width: 250px;
        animation: toastSlide 0.3s ease;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    requestAnimationFrame(() => {
        toast.style.transform = 'translateX(-50%) translateY(0)';
    });
    
    setTimeout(() => {
        toast.style.transform = 'translateX(-50%) translateY(100px)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ╔══════════════════════════════════════════════════════════════╗
// ║           PERFORMANCE OPTIMIZATION                           ║
// ╚══════════════════════════════════════════════════════════════╝

// Pause animations when tab is hidden
document.addEventListener('visibilitychange', () => {
    const animatedElements = document.querySelectorAll('.h-particle, .ticker-content, .loading-particle, .ring, .l-ring');
    animatedElements.forEach(el => {
        el.style.animationPlayState = document.hidden ? 'paused' : 'running';
    });
});

// Debounce resize events
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Recalculate positions if needed
    }, 250);
});

// NEW: Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // ESC to close mobile menu
    if (e.key === 'Escape') {
        const hamburger = document.querySelector('.hamburger');
        const navLinks = document.querySelector('.nav-links');
        if (hamburger && hamburger.classList.contains('active')) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        }
    }
});

// Console welcome message
console.log('%c🎮 PLAYHUB PRO 🎮', 'font-size: 30px; font-weight: bold; background: linear-gradient(45deg, #00f5ff, #ff00e4); -webkit-background-clip: text; -webkit-text-fill-color: transparent;');
console.log('%cWelcome to the next generation of gaming!', 'font-size: 14px; color: #00f5ff;');

// Add ripple animation keyframes
const rippleStyles = document.createElement('style');
rippleStyles.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes valuePulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.2); }
    }
    
    @keyframes toastSlide {
        from { transform: translateX(-50%) translateY(100px); opacity: 0; }
        to { transform: translateX(-50%) translateY(0); opacity: 1; }
    }
    
    @keyframes statPop {
        0% { transform: scale(0.8) translateY(30px); }
        50% { transform: scale(1.05) translateY(-5px); }
        100% { transform: scale(1) translateY(0); }
    }
    
    .btn-loading {
        display: inline-block;
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(rippleStyles);