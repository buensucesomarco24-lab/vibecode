// ╔══════════════════════════════════════════════════════════════╗
// ║          PLAYHUB PRO - ABOUT PAGE JS                        ║
// ╚══════════════════════════════════════════════════════════════╝

document.addEventListener('DOMContentLoaded', () => {
    initCustomCursor();
    initNavigation();
    initHamburger();
    initMagneticButtons();
    initRevealAnimations();
    initParticles();
});

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
    
    const hoverElements = document.querySelectorAll('a, button, .feature-card, .team-card, .social-icon, .cta-btn');
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
                    nav.classList.add('scrolled');
                } else {
                    nav.classList.remove('scrolled');
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
    const buttons = document.querySelectorAll('.magnetic-btn, .social-icon');
    
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
// ║           REVEAL ANIMATIONS                                  ║
// ╚══════════════════════════════════════════════════════════════╝

function initRevealAnimations() {
    const reveals = document.querySelectorAll('.feature-card, .team-card, .cta-content');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
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
// ║           PARTICLES                                          ║
// ╚══════════════════════════════════════════════════════════════╝

function initParticles() {
    const heroParticles = document.getElementById('heroParticles');
    if (!heroParticles) return;
    
    const particleCount = 25;
    
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
    }
}
// Add this at the bottom of your about.js file or inside DOMContentLoaded

// Members reveal animation
const memberCards = document.querySelectorAll('.member-card');
const memberObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            memberObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

memberCards.forEach(card => {
    memberObserver.observe(card);
});