// ╔══════════════════════════════════════════════════════════════╗
// ║          PLAYHUB PRO - GAMES PAGE JS                        ║
// ║     Matching Index.html Functionality                       ║
// ╚══════════════════════════════════════════════════════════════╝

document.addEventListener('DOMContentLoaded', () => {
    initLoadingScreen();
});

// ╔══════════════════════════════════════════════════════════════╗
// ║           ENHANCED LOADING SCREEN (MATCHING INDEX)          ║
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
        'Loading Game Library...',
        'Preparing Game Cards...',
        'Setting Up Filters...',
        'Optimizing Visuals...',
        'Ready to Play!'
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
        const speed = progress < 30 ? 2 : progress < 70 ? 1.5 : 1;
        progress += Math.random() * speed + 0.5;
        
        if (progress > 100) progress = 100;
        
        loadingFill.style.width = progress + '%';
        loadingPercent.textContent = Math.floor(progress) + '%';
        
        assets = Math.min(24, Math.floor((progress / 100) * 24));
        effects = Math.min(12, Math.floor((progress / 100) * 12));
        systems = Math.min(8, Math.floor((progress / 100) * 8));
        
        assetCount.textContent = `${assets}/24`;
        effectCount.textContent = `${effects}/12`;
        systemCount.textContent = `${systems}/8`;
        
        const textIndex = Math.floor((progress / 100) * (loadingTexts.length - 1));
        loadingStatus.textContent = loadingTexts[textIndex];
        
        if (progress >= 100) {
            clearInterval(loadingInterval);
            setTimeout(() => {
                loadingScreen.classList.add('loading-exit');
                setTimeout(() => {
                    loadingScreen.remove();
                    document.body.style.overflow = '';
                    initGamesPage();
                }, 800);
            }, 600);
        }
    }, 40);
}

// ╔══════════════════════════════════════════════════════════════╗
// ║           GAMES PAGE INITIALIZATION                          ║
// ╚══════════════════════════════════════════════════════════════╝

function initGamesPage() {
    initCustomCursor();
    initParticles();
    initScrollAnimations();
    init3DCards();
    initCounters();
    initNavigation();
    initHamburger();
    initMagneticButtons();
    initFilterSystem();
    initLiveTicker();
    initSmoothScroll();
    initLoadMore();
    observeElements();
}

// ╔══════════════════════════════════════════════════════════════╗
// ║           CUSTOM CURSOR                                      ║
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
    
    const hoverElements = document.querySelectorAll('a, button, .game-card, .stat-box, .h-stat, .social-icon, .cta-btn, .filter-btn');
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
// ║           PARTICLE SYSTEM                                    ║
// ╚══════════════════════════════════════════════════════════════╝

function initParticles() {
    const heroParticles = document.getElementById('heroParticles');
    if (!heroParticles) return;
    
    for (let i = 0; i < 30; i++) {
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
    }
}

// ╔══════════════════════════════════════════════════════════════╗
// ║           SCROLL ANIMATIONS                                  ║
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
                
                if (entry.target.classList.contains('game-card') || 
                    entry.target.classList.contains('stat-box')) {
                    const siblings = Array.from(entry.target.parentElement.children);
                    const index = siblings.indexOf(entry.target);
                    entry.target.style.transitionDelay = `${index * 0.1}s`;
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    const elements = document.querySelectorAll(
        '.game-card, .stat-box, .cta-content'
    );
    
    elements.forEach(el => observer.observe(el));
}

function initScrollAnimations() {
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
// ║           3D CARD TILT EFFECT                                ║
// ╚══════════════════════════════════════════════════════════════╝

function init3DCards() {
    const cards = document.querySelectorAll('[data-tilt]');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', handleTilt);
        card.addEventListener('mouseleave', resetTilt);
        
        card.addEventListener('click', () => {
            const game = card.getAttribute('data-game');
            if (game) {
                const gameUrls = {
                    'spaceshooter': 'pages/spaceshooter.html',
                    'brickbreaker': 'pages/brickbreaker.html',
                    'fruitslice': 'pages/fruitslice.html',
                    'tetris': 'pages/tetris.html',
                    'snake': 'pages/snake.html'
                };
                window.location.href = gameUrls[game] || '#';
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
// ║           STATS COUNTER ANIMATION                            ║
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
                
                animateValue(entry.target, 0, target, 2000, isDecimal, suffix);
                
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
        }
    };
    window.requestAnimationFrame(step);
}

// ╔══════════════════════════════════════════════════════════════╗
// ║           NAVIGATION                                         ║
// ╚══════════════════════════════════════════════════════════════╝

function initNavigation() {
    const nav = document.querySelector('.navbar');
    let lastScroll = 0;
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const currentScroll = window.pageYOffset;
                
                if (currentScroll > 100) {
                    nav.style.background = 'rgba(10, 10, 15, 0.95)';
                    nav.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.5), 0 0 30px rgba(0, 245, 255, 0.1)';
                } else {
                    nav.style.background = 'rgba(10, 10, 15, 0.7)';
                    nav.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.3)';
                }
                
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
    
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}

// ╔══════════════════════════════════════════════════════════════╗
// ║           MAGNETIC BUTTONS                                   ║
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
    });
}

// ╔══════════════════════════════════════════════════════════════╗
// ║           FILTER SYSTEM                                      ║
// ╚══════════════════════════════════════════════════════════════╝

function initFilterSystem() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const gameCards = document.querySelectorAll('.game-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            
            gameCards.forEach((card, index) => {
                const category = card.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(30px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
            
            createFilterBurst(btn);
        });
    });
}

function createFilterBurst(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < 12; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            left: ${centerX}px;
            top: ${centerY}px;
            width: 6px;
            height: 6px;
            background: linear-gradient(135deg, #00f5ff, #ff00e4);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            box-shadow: 0 0 10px #00f5ff;
        `;
        
        const angle = (i / 12) * Math.PI * 2;
        const velocity = 50 + Math.random() * 50;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        document.body.appendChild(particle);
        
        let posX = 0, posY = 0, opacity = 1;
        
        const animate = () => {
            posX += vx * 0.1;
            posY += vy * 0.1;
            opacity -= 0.02;
            
            particle.style.transform = `translate(${posX}px, ${posY}px) scale(${opacity})`;
            particle.style.opacity = opacity;
            
            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                particle.remove();
            }
        };
        
        requestAnimationFrame(animate);
    }
}

// ╔══════════════════════════════════════════════════════════════╗
// ║           LIVE TICKER                                        ║
// ╚══════════════════════════════════════════════════════════════╝

function initLiveTicker() {
    const ticker = document.getElementById('ticker');
    if (!ticker) return;
    
    ticker.innerHTML += ticker.innerHTML;
    
    const items = ticker.querySelectorAll('.activity-item');
    const totalWidth = Array.from(items).reduce((acc, item) => acc + item.offsetWidth + 48, 0);
    const duration = totalWidth / 50;
    
    ticker.style.animationDuration = duration + 's';
}

// ╔══════════════════════════════════════════════════════════════╗
// ║           SMOOTH SCROLL                                      ║
// ╚══════════════════════════════════════════════════════════════╝

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ╔══════════════════════════════════════════════════════════════╗
// ║           LOAD MORE BUTTON                                   ║
// ╚══════════════════════════════════════════════════════════════╝

function initLoadMore() {
    const loadMoreBtn = document.querySelector('.load-more-btn');
    if (!loadMoreBtn) return;
    
    loadMoreBtn.addEventListener('click', () => {
        loadMoreBtn.innerHTML = '<span>Loading...</span><span class="loading-dots">...</span>';
        loadMoreBtn.style.pointerEvents = 'none';
        
        setTimeout(() => {
            showToast('🎮 More games coming soon!');
            loadMoreBtn.innerHTML = `
                <span>Load More Games</span>
                <span class="btn-icon">↓</span>
            `;
            loadMoreBtn.style.pointerEvents = 'auto';
        }, 1500);
    });
}

function showToast(message) {
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) existingToast.remove();
    
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        background: linear-gradient(135deg, #00f5ff, #ff00e4);
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

document.addEventListener('visibilitychange', () => {
    const animatedElements = document.querySelectorAll('.h-particle, .ticker-content, .loading-particle, .ring, .l-ring');
    animatedElements.forEach(el => {
        el.style.animationPlayState = document.hidden ? 'paused' : 'running';
    });
});

let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {}, 250);
});

console.log('%c🎮 PLAYHUB PRO - GAMES PAGE 🎮', 'font-size: 30px; font-weight: bold; background: linear-gradient(45deg, #00f5ff, #ff00e4); -webkit-background-clip: text; -webkit-text-fill-color: transparent;');
console.log('%cWelcome to the Game Library!', 'font-size: 14px; color: #00f5ff;');