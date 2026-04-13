// ╔══════════════════════════════════════════════════════════════╗
// ║          PLAYHUB PRO - ENHANCED CONTACT PAGE JS              ║
// ║     Next-Gen Gaming Experience with 2024 Features            ║
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
                <div class="l-stat"><span class="l-label">Assets</span><span class="l-value" id="assetCount">0/18</span></div>
                <div class="l-stat"><span class="l-label">Effects</span><span class="l-value" id="effectCount">0/9</span></div>
                <div class="l-stat"><span class="l-label">Systems</span><span class="l-value" id="systemCount">0/6</span></div>
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
        
        @keyframes ringRotate {
            0% { transform: translate(-50%, -50%) rotate(0deg); }
            100% { transform: translate(-50%, -50%) rotate(360deg); }
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
        'Loading Contact Assets...',
        'Preparing Form Interface...',
        'Loading Animations...',
        'Establishing Secure Connection...',
        'Ready to Connect!'
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
        assets = Math.min(18, Math.floor((progress / 100) * 18));
        effects = Math.min(9, Math.floor((progress / 100) * 9));
        systems = Math.min(6, Math.floor((progress / 100) * 6));
        
        assetCount.textContent = `${assets}/18`;
        effectCount.textContent = `${effects}/9`;
        systemCount.textContent = `${systems}/6`;
        
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
                    initMainContent();
                }, 800);
            }, 600);
        }
    }, 40);
}

// ╔══════════════════════════════════════════════════════════════╗
// ║           MAIN CONTENT INITIALIZER                           ║
// ╚══════════════════════════════════════════════════════════════╝

function initMainContent() {
    initCustomCursor();
    initParticles();
    initNavigation();
    initHamburger();
    initInfoCards();
    initSocialButtons();
    initContactForm();
    initKeyboardShortcuts();
    initEasterEggs();
}

// ╔══════════════════════════════════════════════════════════════╗
// ║           ENHANCED CUSTOM CURSOR                             ║
// ╚══════════════════════════════════════════════════════════════╝

function initCustomCursor() {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);
    
    const follower = document.createElement('div');
    follower.className = 'cursor-follower';
    document.body.appendChild(follower);
    
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
    const hoverElements = document.querySelectorAll('a, button, .info-card, .social-btn, input, textarea, select');
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
    const contactPage = document.querySelector('.contact-page');
    if (!contactPage) return;
    
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'contact-particles';
    contactPage.insertBefore(particlesContainer, contactPage.firstChild);
    
    // Create floating particles
    for (let i = 0; i < 25; i++) {
        const particle = document.createElement('div');
        particle.className = 'c-particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (Math.random() * 5 + 10) + 's';
        
        const colors = ['#00f5ff', '#ff00e4', '#ffea00'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        particle.style.background = color;
        particle.style.boxShadow = `0 0 10px ${color}, 0 0 20px ${color}`;
        
        particlesContainer.appendChild(particle);
    }
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
// ║           INFO CARDS WITH 3D TILT                            ║
// ╚══════════════════════════════════════════════════════════════╝

function initInfoCards() {
    const cards = document.querySelectorAll('.info-card');
    
    cards.forEach(card => {
        // 3D tilt effect
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;
            
            card.style.transform = `
                perspective(1000px) 
                rotateX(${rotateX}deg) 
                rotateY(${rotateY}deg) 
                translateX(15px) 
                scale(1.02)
            `;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateX(0) scale(1)';
        });
        
        // Click to copy
        card.addEventListener('click', () => {
            const text = card.querySelector('p').textContent;
            navigator.clipboard.writeText(text).then(() => {
                showToast(`📋 Copied: ${text}`);
            });
            
            // Visual feedback
            card.style.transform = 'scale(0.95)';
            setTimeout(() => {
                card.style.transform = '';
            }, 150);
        });
    });
}

// ╔══════════════════════════════════════════════════════════════╗
// ║           SOCIAL BUTTONS WITH MAGNETIC EFFECT                ║
// ╚══════════════════════════════════════════════════════════════╝

function initSocialButtons() {
    const buttons = document.querySelectorAll('.social-btn');
    
    buttons.forEach(btn => {
        // Magnetic effect
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px) scale(1.05)`;
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0) scale(1)';
        });
        
        // Particle burst on click
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            createParticleBurst(e.clientX, e.clientY);
            showToast('🚀 Coming Soon!');
        });
    });
}

function createParticleBurst(x, y) {
    for (let i = 0; i < 12; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 8px;
            height: 8px;
            background: linear-gradient(135deg, #00f5ff, #ff00e4);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            box-shadow: 0 0 10px #00f5ff;
        `;
        
        const angle = (i / 12) * Math.PI * 2;
        const velocity = 80 + Math.random() * 40;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        document.body.appendChild(particle);
        
        let posX = 0, posY = 0, opacity = 1, scale = 1;
        
        const animate = () => {
            posX += vx * 0.15;
            posY += vy * 0.15;
            opacity -= 0.02;
            scale -= 0.01;
            
            particle.style.transform = `translate(${posX}px, ${posY}px) scale(${scale})`;
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
// ║           ENHANCED CONTACT FORM (CONTINUED)                  ║
// ╚══════════════════════════════════════════════════════════════╝

function initContactForm() {
    const form = document.getElementById('contactForm');
    const successMessage = document.getElementById('successMessage');
    const submitBtn = form.querySelector('.submit-btn');
    
    // Input animations and effects
    const inputs = form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
        // Typing progress effect
        if (input.tagName !== 'SELECT') {
            input.addEventListener('input', () => {
                const maxLength = 50;
                const progress = Math.min(input.value.length / maxLength, 1);
                input.style.setProperty('--progress', `${progress * 100}%`);
                
                if (input.value.length > 0) {
                    input.classList.add('typing');
                } else {
                    input.classList.remove('typing');
                }
            });
        }
        
        // Focus effects
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            input.parentElement.classList.remove('focused');
            if (input.value) {
                input.parentElement.classList.add('has-value');
            } else {
                input.parentElement.classList.remove('has-value');
            }
        });
    });
    
    // Submit button 3D tilt effect
    submitBtn.addEventListener('mousemove', (e) => {
        const rect = submitBtn.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;
        
        submitBtn.style.transform = `
            perspective(1000px) 
            rotateX(${rotateX}deg) 
            rotateY(${rotateY}deg) 
            translateY(-3px) 
            scale(1.02)
        `;
    });
    
    submitBtn.addEventListener('mouseleave', () => {
        submitBtn.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)';
    });
    
    // Ripple effect on click
    submitBtn.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: ${y}px;
            width: 0;
            height: 0;
            background: radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            pointer-events: none;
            animation: btnRipple 0.6s ease-out;
        `;
        
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    });
    
    // Form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Validation
        let isValid = true;
        inputs.forEach(input => {
            if (!input.value && input.hasAttribute('required')) {
                isValid = false;
                shakeElement(input.parentElement);
            }
        });
        
        if (!isValid) {
            showToast('❌ Please fill in all fields!');
            return;
        }
        
        // Loading state
        const originalText = submitBtn.querySelector('span').textContent;
        submitBtn.classList.add('sending');
        submitBtn.querySelector('span').innerHTML = 'SENDING<span></span>';
        
        // Animate progress
        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += 5;
            submitBtn.style.setProperty('--progress', `${progress}%`);
            
            if (progress >= 100) {
                clearInterval(progressInterval);
            }
        }, 75);
        
        // Simulate submission
        setTimeout(() => {
            clearInterval(progressInterval);
            submitBtn.classList.remove('sending');
            submitBtn.style.background = '';
            
            // Transition to success
            form.style.opacity = '0';
            form.style.transform = 'scale(0.9) rotateY(-10deg)';
            
            setTimeout(() => {
                form.classList.add('hidden');
                successMessage.classList.remove('hidden');
                
                // Success animation
                successMessage.style.opacity = '0';
                successMessage.style.transform = 'scale(0.5)';
                
                setTimeout(() => {
                    successMessage.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                    successMessage.style.opacity = '1';
                    successMessage.style.transform = 'scale(1)';
                    createConfetti();
                }, 100);
            }, 300);
            
            // Reset form after delay
            setTimeout(() => {
                successMessage.style.opacity = '0';
                successMessage.style.transform = 'scale(0.9)';
                
                setTimeout(() => {
                    form.reset();
                    form.classList.remove('hidden');
                    successMessage.classList.add('hidden');
                    
                    form.style.opacity = '0';
                    form.style.transform = 'scale(0.9) rotateY(10deg)';
                    
                    setTimeout(() => {
                        form.style.transition = 'all 0.5s ease';
                        form.style.opacity = '1';
                        form.style.transform = 'scale(1) rotateY(0)';
                    }, 50);
                    
                    submitBtn.querySelector('span').textContent = originalText;
                    inputs.forEach(input => {
                        input.parentElement.classList.remove('has-value', 'typing');
                        input.style.setProperty('--progress', '0%');
                    });
                }, 300);
            }, 4000);
        }, 1500);
    });
}

function shakeElement(element) {
    element.classList.add('shake');
    element.style.borderColor = '#ff00e4';
    setTimeout(() => {
        element.classList.remove('shake');
        element.style.borderColor = '';
    }, 500);
}

function createConfetti() {
    const colors = ['#00f5ff', '#ff00e4', '#ffea00', '#ffffff'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            left: ${50 + (Math.random() - 0.5) * 30}%;
            top: 50%;
            width: ${Math.random() * 10 + 5}px;
            height: ${Math.random() * 10 + 5}px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
            pointer-events: none;
            z-index: 10000;
            box-shadow: 0 0 10px currentColor;
        `;
        
        document.body.appendChild(confetti);
        
        const angle = (Math.random() - 0.5) * Math.PI;
        const velocity = 200 + Math.random() * 300;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity - 200;
        let x = 0, y = 0, rotation = 0, opacity = 1;
        
        const animate = () => {
            x += vx * 0.016;
            y += vy * 0.016 + 5;
            vy += 10;
            rotation += 10;
            opacity -= 0.01;
            
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
// ║           KEYBOARD SHORTCUTS                                 ║
// ╚══════════════════════════════════════════════════════════════╝

function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        
        switch(e.key.toLowerCase()) {
            case 'h':
                window.location.href = 'index.html';
                break;
            case 'g':
                window.location.href = 'games.html';
                break;
            case 'a':
                window.location.href = 'about.html';
                break;
            case 'c':
                window.location.href = 'contact.html';
                break;
            case 'escape':
                const hamburger = document.querySelector('.hamburger');
                const navLinks = document.querySelector('.nav-links');
                if (hamburger && navLinks && navLinks.classList.contains('active')) {
                    hamburger.click();
                }
                break;
        }
    });
}

// ╔══════════════════════════════════════════════════════════════╗
// ║           EASTER EGGS                                        ║
// ╚══════════════════════════════════════════════════════════════╝

function initEasterEggs() {
    // Konami Code
    let konamiCode = [];
    const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    
    document.addEventListener('keydown', (e) => {
        konamiCode.push(e.key);
        konamiCode = konamiCode.slice(-10);
        
        if (konamiCode.join(',') === konamiSequence.join(',')) {
            activateRainbowMode();
        }
    });
    
    // Click title 5 times
    const title = document.querySelector('.glitch');
    let titleClicks = 0;
    
    if (title) {
        title.addEventListener('click', () => {
            titleClicks++;
            if (titleClicks === 5) {
                title.textContent = 'LET\'S TALK! 🚀';
                title.setAttribute('data-text', 'LET\'S TALK! 🚀');
                showToast('🎉 Secret message unlocked!');
                titleClicks = 0;
            }
        });
    }
}

function activateRainbowMode() {
    document.body.style.animation = 'rainbow 3s linear infinite';
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes rainbow {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
    
    showToast('🌈 RAINBOW MODE ACTIVATED! 🌈');
}

// ╔══════════════════════════════════════════════════════════════╗
// ║           TOAST NOTIFICATIONS                                ║
// ╚══════════════════════════════════════════════════════════════╝

function showToast(message) {
    // Remove existing toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // Trigger animation
    requestAnimationFrame(() => {
        toast.classList.add('show');
    });
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

// ╔══════════════════════════════════════════════════════════════╗
// ║           PERFORMANCE OPTIMIZATION                           ║
// ╚══════════════════════════════════════════════════════════════╝

document.addEventListener('visibilitychange', () => {
    document.querySelectorAll('.logo-icon, .glitch, .loading-logo .logo-icon').forEach(el => {
        el.style.animationPlayState = document.hidden ? 'paused' : 'running';
    });
});

// Console welcome message
console.log('%c🎮 PLAYHUB PRO - CONTACT PAGE 🎮', 'font-size: 24px; font-weight: bold; background: linear-gradient(45deg, #00f5ff, #ff00e4); -webkit-background-clip: text; -webkit-text-fill-color: transparent;');
console.log('%cLet\'s get in touch!', 'font-size: 14px; color: #00f5ff;');
console.log('%cShortcuts: H=Home | G=Games | A=About | C=Contact', 'font-size: 12px; color: #8b8b9a;');
console.log('%cClick "GET IN TOUCH" 5 times for a surprise!', 'font-size: 12px; color: #ff00e4; font-style: italic;');
console.log('%cKonami Code: ↑↑↓↓←→←→BA', 'font-size: 12px; color: #ffea00;');

// ╔══════════════════════════════════════════════════════════════╗
// ║           EXPORTS                                            ║
// ╚══════════════════════════════════════════════════════════════╝

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initLoadingScreen,
        initMainContent,
        initContactForm,
        showToast
    };
}