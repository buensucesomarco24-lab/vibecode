// ╔══════════════════════════════════════════════════════════════╗
// ║                    GALACTIC DEFENDER PRO                     ║
// ║              Ultimate Space Shooter Experience               ║
// ╚══════════════════════════════════════════════════════════════╝

const CANVAS = document.getElementById('gameCanvas');
const CTX = CANVAS.getContext('2d');

// ╔══════════════════════════════════════════════════════════════╗
// ║                    GAME CONFIGURATION                        ║
// ╚══════════════════════════════════════════════════════════════╝

const CONFIG = {
    playerSpeed: 6,
    boostSpeed: 12,
    bulletSpeed: 15,
    fireRate: 150,
    starCount: 200,
    difficulty: 'pilot',
    particleQuality: 'high',
    screenShake: true,
    damageNumbers: true
};

// ╔══════════════════════════════════════════════════════════════╗
// ║                    GAME STATE                                ║
// ╚══════════════════════════════════════════════════════════════╝

const gameState = {
    score: 0,
    bestScore: localStorage.getItem('galacticDefender_bestScore') || 0,
    wave: 1,
    running: false,
    paused: false,
    shield: 100,
    maxShield: 100,
    weaponLevel: 1,
    kills: 0,
    shotsFired: 0,
    shotsHit: 0,
    combo: 0,
    comboTimer: 0,
    stars: [],
    particles: [],
    enemies: [],
    bullets: [],
    enemyBullets: [],
    powerUps: [],
    asteroids: [],
    boss: null,
    shake: 0,
    slowMotion: 1,
    fps: 60,
    frameCount: 0
};

// ╔══════════════════════════════════════════════════════════════╗
// ║                    PLAYER OBJECT                             ║
// ╚══════════════════════════════════════════════════════════════╝

const player = {
    x: 0,
    y: 0,
    width: 50,
    height: 50,
    vx: 0,
    vy: 0,
    angle: 0,
    lastShot: 0,
    boosting: false,
    invulnerable: 0,
    trail: []
};

// ╔══════════════════════════════════════════════════════════════╗
// ║                    DIFFICULTY SETTINGS                       ║
// ╚══════════════════════════════════════════════════════════════╝

const DIFFICULTY = {
    rookie: { enemySpeed: 0.7, spawnRate: 0.018, damage: 0.5, scoreMultiplier: 0.8 },
    pilot: { enemySpeed: 1, spawnRate: 0.025, damage: 1, scoreMultiplier: 1 },
    ace: { enemySpeed: 1.4, spawnRate: 0.04, damage: 1.5, scoreMultiplier: 1.5 }
};

// ╔══════════════════════════════════════════════════════════════╗
// ║                    ENEMY TYPES                               ║
// ╚══════════════════════════════════════════════════════════════╝

const ENEMY_TYPES = {
    drone: { 
        emoji: '👾', 
        health: 1, 
        speed: 2, 
        score: 10, 
        color: '#ff0040', 
        pattern: 'straight',
        description: 'Basic drone'
    },
    interceptor: { 
        emoji: '🚀', 
        health: 2, 
        speed: 4, 
        score: 25, 
        color: '#ffea00', 
        pattern: 'zigzag',
        description: 'Fast interceptor'
    },
    tank: { 
        emoji: '🛸', 
        health: 8, 
        speed: 0.8, 
        score: 80, 
        color: '#ff00e4', 
        pattern: 'slow',
        description: 'Heavy tank'
    },
    stealth: { 
        emoji: '👻', 
        health: 1, 
        speed: 3.5, 
        score: 50, 
        color: '#9d4edd', 
        pattern: 'wave', 
        stealth: true,
        description: 'Stealth unit'
    },
    bomber: { 
        emoji: '💣', 
        health: 3, 
        speed: 1.2, 
        score: 100, 
        color: '#ff6b35', 
        pattern: 'drop',
        description: 'Bomber'
    },
    elite: {
        emoji: '👿',
        health: 15,
        speed: 2.5,
        score: 300,
        color: '#ff0000',
        pattern: 'chase',
        elite: true,
        description: 'Elite fighter'
    }
};

// ╔══════════════════════════════════════════════════════════════╗
// ║                    WEAPON SYSTEM                             ║
// ╚══════════════════════════════════════════════════════════════╝

const WEAPONS = {
    1: { name: 'BASIC', damage: 1, spread: 0, color: '#00f5ff', fireRate: 150 },
    2: { name: 'DUAL', damage: 1, spread: 15, color: '#00f5ff', fireRate: 140 },
    3: { name: 'TRIPLE', damage: 1.5, spread: 20, color: '#ffea00', fireRate: 130 },
    4: { name: 'QUAD', damage: 2, spread: 25, color: '#ffea00', fireRate: 120 },
    5: { name: 'PENTA', damage: 2.5, spread: 30, color: '#ff00e4', fireRate: 110 },
    6: { name: 'MAX', damage: 3, spread: 35, color: '#ff00e4', fireRate: 100 }
};

// ╔══════════════════════════════════════════════════════════════╗
// ║                    INITIALIZATION                            ║
// ╚══════════════════════════════════════════════════════════════╝

function init() {
    resize();
    createStarfield();
    loadBestScore();
    window.addEventListener('resize', resize);
    
    // Performance monitoring
    setInterval(() => {
        gameState.fps = gameState.frameCount;
        gameState.frameCount = 0;
    }, 1000);
}

function resize() {
    CANVAS.width = window.innerWidth;
    CANVAS.height = window.innerHeight;
    player.x = CANVAS.width / 2;
    player.y = CANVAS.height - 100;
}

function loadBestScore() {
    const saved = localStorage.getItem('galacticDefender_bestScore');
    if (saved) {
        gameState.bestScore = parseInt(saved);
        updateBestScoreDisplay();
    }
}

function saveBestScore() {
    if (gameState.score > gameState.bestScore) {
        gameState.bestScore = gameState.score;
        localStorage.setItem('galacticDefender_bestScore', gameState.bestScore);
        updateBestScoreDisplay();
        return true;
    }
    return false;
}

function updateBestScoreDisplay() {
    const bestScoreEl = document.getElementById('bestScore');
    if (bestScoreEl) {
        bestScoreEl.textContent = gameState.bestScore.toLocaleString();
    }
}

// ╔══════════════════════════════════════════════════════════════╗
// ║                    ENHANCED STARFIELD                        ║
// ╚══════════════════════════════════════════════════════════════╝

function createStarfield() {
    const container = document.getElementById('starfield');
    container.innerHTML = '';
    gameState.stars = [];
    
    for (let i = 0; i < CONFIG.starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        const size = Math.random() * 4 + 1;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const duration = Math.random() * 4 + 2;
        const delay = Math.random() * 5;
        const brightness = Math.random();
        
        star.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${x}%;
            top: ${y}%;
            animation-duration: ${duration}s;
            animation-delay: ${delay}s;
            opacity: ${0.3 + brightness * 0.7};
            box-shadow: 0 0 ${size * 2}px rgba(255, 255, 255, ${brightness});
        `;
        
        container.appendChild(star);
        
        gameState.stars.push({
            x: x / 100 * CANVAS.width,
            y: y / 100 * CANVAS.height,
            size: size,
            speed: size * 0.8,
            parallax: size / 3,
            brightness: brightness
        });
    }
}

// ╔══════════════════════════════════════════════════════════════╗
// ║                    ENHANCED PARTICLE SYSTEM                  ║
// ╚══════════════════════════════════════════════════════════════╝

function createParticles(x, y, color, count = 10, type = 'explosion', velocity = null) {
    const particleCount = CONFIG.particleQuality === 'ultra' ? count * 2 :
                          CONFIG.particleQuality === 'high' ? count :
                          CONFIG.particleQuality === 'medium' ? Math.floor(count * 0.7) :
                          Math.floor(count * 0.4);
    
    for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 / particleCount) * i + Math.random() * 0.8;
        const speed = velocity ? velocity : Math.random() * 6 + 2;
        const size = Math.random() * 5 + 2;
        
        gameState.particles.push({
            x: x,
            y: y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 1,
            maxLife: 1,
            decay: 0.015 + Math.random() * 0.01,
            color: color,
            size: size,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.3,
            type: type,
            gravity: type === 'spark' ? 0.1 : 0
        });
    }
}

function createExplosion(x, y, color, size = 'medium') {
    const sizes = { small: 15, medium: 25, large: 40, massive: 60 };
    const count = sizes[size] || 25;
    
    createParticles(x, y, color, count, 'explosion');
    createParticles(x, y, '#ffffff', Math.floor(count * 0.5), 'spark');
    
    gameState.particles.push({
        x: x,
        y: y,
        vx: 0,
        vy: 0,
        life: 0.5,
        maxLife: 0.5,
        decay: 0.02,
        size: 10,
        color: color,
        type: 'shockwave',
        isRing: true
    });
    
    if (CONFIG.screenShake) {
        const shakeIntensity = size === 'massive' ? 20 : size === 'large' ? 12 : size === 'medium' ? 8 : 5;
        shakeScreen(shakeIntensity);
    }
}

function createFloatingText(x, y, text, color, size = 20) {
    gameState.particles.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 2,
        vy: -3,
        life: 1.5,
        maxLife: 1.5,
        decay: 0.008,
        text: text,
        color: color,
        isText: true,
        size: size,
        pulse: 0
    });
}

function createDamageNumber(x, y, damage, isCrit = false) {
    if (!CONFIG.damageNumbers) return;
    
    gameState.particles.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 3,
        vy: -2,
        life: 1,
        maxLife: 1,
        decay: 0.02,
        text: damage.toString(),
        color: isCrit ? '#ffea00' : '#ffffff',
        isText: true,
        size: isCrit ? 28 : 18,
        isCrit: isCrit
    });
}

// ╔══════════════════════════════════════════════════════════════╗
// ║                    ENHANCED ENEMY SPAWNING                   ║
// ╚══════════════════════════════════════════════════════════════╝

function spawnEnemy() {
    const diff = DIFFICULTY[CONFIG.difficulty];
    const waveMultiplier = Math.min(gameState.wave * 0.15, 2);
    
    let types = ['drone', 'interceptor'];
    if (gameState.wave >= 2) types.push('tank');
    if (gameState.wave >= 3) types.push('stealth');
    if (gameState.wave >= 4) types.push('bomber');
    if (gameState.wave >= 6) types.push('elite');
    
    const typeName = types[Math.floor(Math.random() * types.length)];
    const type = ENEMY_TYPES[typeName];
    
    const enemy = {
        x: Math.random() * (CANVAS.width - 100) + 50,
        y: -60,
        type: typeName,
        ...type,
        currentHealth: type.health * (1 + waveMultiplier * 0.3),
        maxHealth: type.health * (1 + waveMultiplier * 0.3),
        phase: Math.random() * Math.PI * 2,
        stealthTimer: type.stealth ? Math.random() * 120 : 0,
        eliteTimer: type.elite ? 0 : null
    };
    
    gameState.enemies.push(enemy);
}

function spawnBoss() {
    const bossTypes = [
        { emoji: '👹', name: 'DEMON LORD', health: 100, color: '#ff0040', pattern: 'aggressive' },
        { emoji: '🐉', name: 'DRAGON KING', health: 150, color: '#ff6b00', pattern: 'fire' },
        { emoji: '👾', name: 'MOTHER SHIP', health: 200, color: '#9d00ff', pattern: 'summon' }
    ];
    
    const bossType = bossTypes[Math.floor((gameState.wave / 5 - 1) % bossTypes.length)];
    
    gameState.boss = {
        x: CANVAS.width / 2,
        y: -200,
        width: 250,
        height: 200,
        health: bossType.health + (gameState.wave * 20),
        maxHealth: bossType.health + (gameState.wave * 20),
        phase: 0,
        pattern: 'entrance',
        ...bossType,
        attackTimer: 0,
        summonTimer: 0
    };
    
    const warning = document.getElementById('bossWarning');
    warning.textContent = `⚠️ ${bossType.name} INCOMING ⚠️`;
    warning.classList.remove('hidden');
    
    gameState.slowMotion = 0.3;
    setTimeout(() => {
        warning.classList.add('hidden');
        gameState.slowMotion = 1;
    }, 4000);
}

// ╔══════════════════════════════════════════════════════════════╗
// ║                    ENHANCED SHOOTING SYSTEM                  ║
// ╚══════════════════════════════════════════════════════════════╝

function shoot() {
    const now = Date.now();
    const weapon = WEAPONS[Math.min(gameState.weaponLevel, 6)];
    
    if (now - player.lastShot < weapon.fireRate) return;
    
    player.lastShot = now;
    gameState.shotsFired++;
    
    const spreadCount = Math.min(gameState.weaponLevel + 1, 6);
    const spreadAngle = weapon.spread * (Math.PI / 180);
    
    for (let i = 0; i < spreadCount; i++) {
        const angleOffset = spreadCount === 1 ? 0 : 
                           (i - (spreadCount - 1) / 2) * spreadAngle;
        
        gameState.bullets.push({
            x: player.x + Math.sin(angleOffset) * 10,
            y: player.y - 20,
            vx: Math.sin(angleOffset) * 3,
            vy: -CONFIG.bulletSpeed * Math.cos(angleOffset),
            damage: weapon.damage,
            color: weapon.color,
            size: 4 + gameState.weaponLevel,
            trail: []
        });
    }
    
    const flashIntensity = Math.min(gameState.weaponLevel * 2, 10);
    createParticles(player.x, player.y - 25, weapon.color, flashIntensity, 'muzzle');
    player.vy += 0.5;
    
    if (gameState.comboTimer > 0) {
        gameState.comboTimer = 60;
    }
}

// ╔══════════════════════════════════════════════════════════════╗
// ║                    ENHANCED UPDATE LOOP                      ║
// ╚══════════════════════════════════════════════════════════════╝

function update() {
    if (!gameState.running || gameState.paused) return;
    
    gameState.frameCount++;
    const diff = DIFFICULTY[CONFIG.difficulty];
    
    if (gameState.shake > 0) {
        gameState.shake *= 0.92;
        if (gameState.shake < 0.5) gameState.shake = 0;
    }
    
    if (gameState.comboTimer > 0) {
        gameState.comboTimer--;
        if (gameState.comboTimer === 0) {
            if (gameState.combo >= 5) {
                createFloatingText(player.x, player.y - 80, `COMBO x${gameState.combo}!`, '#ffea00', 30);
                gameState.score += gameState.combo * 10;
            }
            gameState.combo = 0;
        }
    }
    
    if (player.invulnerable > 0) player.invulnerable--;
    
    player.trail.push({ x: player.x, y: player.y, life: 10 });
    player.trail = player.trail.filter(t => --t.life > 0);
    
    const targetSpeed = player.boosting ? CONFIG.boostSpeed : CONFIG.playerSpeed;
    const accel = 0.8;
    
    if (keys['ArrowLeft'] || keys['KeyA']) player.vx -= accel;
    if (keys['ArrowRight'] || keys['KeyD']) player.vx += accel;
    if (keys['ArrowUp'] || keys['KeyW']) player.vy -= accel;
    if (keys['ArrowDown'] || keys['KeyS']) player.vy += accel;
    
    player.vx *= 0.92;
    player.vy *= 0.92;
    
    player.x += player.vx * targetSpeed * gameState.slowMotion;
    player.y += player.vy * targetSpeed * gameState.slowMotion;
    
    if (player.x < 25) { player.x = 25; player.vx *= -0.5; }
    if (player.x > CANVAS.width - 25) { player.x = CANVAS.width - 25; player.vx *= -0.5; }
    if (player.y < 50) { player.y = 50; player.vy *= -0.5; }
    if (player.y > CANVAS.height - 50) { player.y = CANVAS.height - 50; player.vy *= -0.5; }
    
    player.angle = player.vx * 0.08;
    
    if (keys['Space']) shoot();
    
    gameState.stars.forEach(star => {
        const speed = star.speed + (player.boosting ? 8 : 0) + (star.parallax * Math.abs(player.vx) * 0.5);
        star.y += speed * gameState.slowMotion;
        star.x -= player.vx * star.parallax * 0.1;
        
        if (star.y > CANVAS.height) {
            star.y = 0;
            star.x = Math.random() * CANVAS.width;
        }
        if (star.x < 0) star.x = CANVAS.width;
        if (star.x > CANVAS.width) star.x = 0;
    });
    
    if (!gameState.boss && Math.random() < diff.spawnRate * (1 + gameState.wave * 0.08)) {
        spawnEnemy();
    }
    
    if (gameState.wave % 5 === 0 && !gameState.boss && gameState.enemies.length === 0) {
        if (Math.random() < 0.008) spawnBoss();
    }
    
    if (gameState.boss) {
        updateBoss();
    }
    
    updateEnemies();
    
    gameState.bullets = gameState.bullets.filter(b => {
        b.x += b.vx;
        b.y += b.vy;
        b.trail.push({ x: b.x, y: b.y });
        if (b.trail.length > 5) b.trail.shift();
        return b.y > -10 && b.y < CANVAS.height + 10 && b.x > -10 && b.x < CANVAS.width + 10;
    });
    
    gameState.enemyBullets = gameState.enemyBullets.filter(b => {
        b.x += b.vx;
        b.y += b.vy;
        
        if (b.homing && gameState.frameCount % 10 === 0) {
            const dx = player.x - b.x;
            const dy = player.y - b.y;
            const dist = Math.hypot(dx, dy);
            if (dist > 0) {
                b.vx += (dx / dist) * 0.3;
                b.vy += (dy / dist) * 0.3;
                const speed = Math.hypot(b.vx, b.vy);
                if (speed > 6) {
                    b.vx = (b.vx / speed) * 6;
                    b.vy = (b.vy / speed) * 6;
                }
            }
        }
        
        if (player.invulnerable <= 0) {
            const dist = Math.hypot(player.x - b.x, player.y - b.y);
            if (dist < 30) {
                takeDamage(15 * b.damage);
                createExplosion(b.x, b.y, '#ff0040', 'small');
                return false;
            }
        }
        
        return b.y < CANVAS.height + 10;
    });
    
    gameState.powerUps = gameState.powerUps.filter(p => {
        const dist = Math.hypot(player.x - p.x, player.y - p.y);
        if (dist < 150) {
            p.x += (player.x - p.x) * 0.05;
            p.y += (player.y - p.y) * 0.05;
            p.vy = Math.max(p.vy - 0.1, -3);
        } else {
            p.y += p.vy;
        }
        
        p.rotation = (p.rotation || 0) + 0.05;
        
        if (dist < 40) {
            collectPowerUp(p.type);
            return false;
        }
        
        return p.y < CANVAS.height + 50;
    });
    
    gameState.particles = gameState.particles.filter(p => {
        if (p.isRing) {
            p.size += 8;
            p.life -= p.decay;
            return p.life > 0;
        }
        
        p.x += p.vx * gameState.slowMotion;
        p.y += p.vy * gameState.slowMotion;
        p.vy += p.gravity || 0;
        p.life -= p.decay;
        p.rotation += p.rotationSpeed;
        
        if (p.life < 0.3) {
            p.vx *= 0.95;
            p.vy *= 0.95;
        }
        
        return p.life > 0;
    });
    
    updateUI();
    
    if (!gameState.boss && gameState.enemies.length === 0 && gameState.kills > 0) {
        if (Math.random() < 0.002) showWaveComplete();
    }
}

function updateBoss() {
    const boss = gameState.boss;
    boss.phase += 0.02;
    boss.attackTimer++;
    
    switch(boss.pattern) {
        case 'entrance':
            boss.y += 1.5;
            if (boss.y > 120) {
                boss.pattern = ['combat', 'charge', 'summon'][Math.floor(Math.random() * 3)];
            }
            break;
            
        case 'combat':
            boss.x += Math.sin(boss.phase) * 4;
            boss.y = 120 + Math.sin(boss.phase * 1.5) * 30;
            
            if (boss.attackTimer % 40 === 0) {
                for (let i = -2; i <= 2; i++) {
                    gameState.enemyBullets.push({
                        x: boss.x,
                        y: boss.y + boss.height/2,
                        vx: i * 1.5,
                        vy: 5,
                        damage: 2
                    });
                }
            }
            
            if (boss.attackTimer > 200) {
                boss.pattern = 'charge';
                boss.attackTimer = 0;
            }
            break;
            
        case 'charge':
            if (boss.attackTimer < 60) {
                boss.x += (player.x - boss.x) * 0.02;
                boss.y -= 2;
            } else if (boss.attackTimer < 100) {
                const dx = player.x - boss.x;
                const dy = player.y - boss.y;
                const dist = Math.hypot(dx, dy);
                boss.x += (dx / dist) * 15;
                boss.y += (dy / dist) * 15;
            } else {
                boss.pattern = 'combat';
                boss.attackTimer = 0;
            }
            break;
            
        case 'summon':
            boss.x = CANVAS.width / 2 + Math.sin(boss.phase) * 100;
            boss.y = 100;
            
            if (boss.attackTimer % 120 === 0 && boss.summonTimer < 3) {
                spawnEnemy();
                boss.summonTimer++;
            }
            
            if (boss.summonTimer >= 3) {
                boss.pattern = 'combat';
                boss.summonTimer = 0;
                boss.attackTimer = 0;
            }
            break;
    }
    
    if (boss.health <= 0) {
        createExplosion(boss.x, boss.y, boss.color, 'massive');
        const bonus = 2000 * gameState.wave;
        gameState.score += bonus;
        createFloatingText(boss.x, boss.y, `+${bonus.toLocaleString()}`, '#ffea00', 40);
        gameState.boss = null;
        gameState.shield = Math.min(gameState.shield + 50, gameState.maxShield);
        setTimeout(showWaveComplete, 2000);
    }
}

function updateEnemies() {
    const diff = DIFFICULTY[CONFIG.difficulty];
    
    gameState.enemies = gameState.enemies.filter(enemy => {
        enemy.phase += 0.05;
        
        switch(enemy.pattern) {
            case 'zigzag':
                enemy.x += Math.sin(enemy.phase) * 4;
                break;
            case 'wave':
                enemy.x += Math.sin(enemy.phase * 2) * 3;
                break;
            case 'drop':
                if (enemy.y > CANVAS.height / 4 && !enemy.hasDropped) {
                    enemy.hasDropped = true;
                    gameState.enemyBullets.push({
                        x: enemy.x,
                        y: enemy.y,
                        vx: 0,
                        vy: 10,
                        damage: 2
                    });
                }
                break;
            case 'chase':
                if (enemy.y > 100) {
                    enemy.x += (player.x - enemy.x) * 0.02;
                }
                break;
        }
        
        if (enemy.stealth) {
            enemy.stealthTimer--;
        }
        
        enemy.y += enemy.speed * diff.enemySpeed * gameState.slowMotion;
        
        let shootChance = 0.008 * gameState.wave;
        if (enemy.elite) shootChance *= 2;
        
        if (Math.random() < shootChance) {
            const bullet = {
                x: enemy.x,
                y: enemy.y + 20,
                vx: (player.x - enemy.x) * 0.015,
                vy: 4 + gameState.wave * 0.15,
                damage: enemy.elite ? 2 : 1
            };
            
            if (enemy.elite) {
                bullet.homing = true;
                bullet.color = '#ff0000';
            }
            
            gameState.enemyBullets.push(bullet);
        }
        
        for (let i = gameState.bullets.length - 1; i >= 0; i--) {
            const bullet = gameState.bullets[i];
            const dist = Math.hypot(bullet.x - enemy.x, bullet.y - enemy.y);
            
            if (dist < 35 && (!enemy.stealth || enemy.stealthTimer < 0)) {
                const damage = bullet.damage;
                enemy.currentHealth -= damage;
                gameState.bullets.splice(i, 1);
                gameState.shotsHit++;
                
                const isCrit = Math.random() < 0.1;
                const finalDamage = isCrit ? damage * 2 : damage;
                enemy.currentHealth += damage - finalDamage;
                createDamageNumber(enemy.x, enemy.y, Math.floor(finalDamage), isCrit);
                createParticles(bullet.x, bullet.y, enemy.color, 3, 'spark');
                
                gameState.combo++;
                gameState.comboTimer = 90;
                
                if (enemy.currentHealth <= 0) {
                    let points = enemy.score * diff.scoreMultiplier;
                    if (gameState.combo > 5) points *= (1 + gameState.combo * 0.05);
                    
                    gameState.score += Math.floor(points);
                    gameState.kills++;
                    
                    createExplosion(enemy.x, enemy.y, enemy.color, enemy.elite ? 'large' : 'medium');
                    createFloatingText(enemy.x, enemy.y, `+${Math.floor(points)}`, enemy.color, enemy.elite ? 28 : 20);
                    
                    const dropChance = enemy.elite ? 0.4 : 0.08;
                    if (Math.random() < dropChance) {
                        const types = ['weapon', 'shield', 'boost', 'weapon'];
                        gameState.powerUps.push({
                            x: enemy.x,
                            y: enemy.y,
                            type: types[Math.floor(Math.random() * types.length)],
                            vy: 2,
                            rotation: 0
                        });
                    }
                    
                    return false;
                }
            }
        }
        
        if (player.invulnerable <= 0) {
            const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);
            if (dist < 45) {
                takeDamage(enemy.elite ? 35 : 25);
                createExplosion(enemy.x, enemy.y, enemy.color, 'medium');
                return false;
            }
        }
        
        return enemy.y < CANVAS.height + 60 && enemy.currentHealth > 0;
    });
}

function takeDamage(amount) {
    const diff = DIFFICULTY[CONFIG.difficulty];
    const actualDamage = amount * diff.damage;
    gameState.shield -= actualDamage;
    player.invulnerable = 90;
    shakeScreen(15);
    
    const flash = document.createElement('div');
    flash.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 0, 64, 0.3);
        pointer-events: none;
        z-index: 50;
        animation: damageFlash 0.3s ease-out forwards;
    `;
    document.body.appendChild(flash);
    setTimeout(() => flash.remove(), 300);
    
    createExplosion(player.x, player.y, '#00f5ff', 'small');
    
    if (gameState.shield <= 0) {
        gameState.shield = 0;
        createExplosion(player.x, player.y, '#00f5ff', 'massive');
        gameOver();
    }
}

function collectPowerUp(type) {
    switch(type) {
        case 'weapon':
            if (gameState.weaponLevel < 6) {
                gameState.weaponLevel++;
                createFloatingText(player.x, player.y - 60, `WEAPON UP! LVL ${gameState.weaponLevel}`, '#ffea00', 32);
            } else {
                gameState.score += 1000;
                createFloatingText(player.x, player.y - 60, 'MAX WEAPON! +1000', '#ffea00', 28);
            }
            break;
        case 'shield':
            const heal = 40;
            gameState.shield = Math.min(gameState.shield + heal, gameState.maxShield);
            createFloatingText(player.x, player.y - 60, `SHIELD +${heal}%`, '#00f5ff', 28);
            break;
        case 'boost':
            gameState.score += 500;
            createFloatingText(player.x, player.y - 60, 'SCORE +500', '#00ff88', 28);
            const originalFireRate = CONFIG.fireRate;
            CONFIG.fireRate = 80;
            setTimeout(() => CONFIG.fireRate = originalFireRate, 5000);
            break;
    }
    createParticles(player.x, player.y, '#ffffff', 15, 'spark');
}

// ╔══════════════════════════════════════════════════════════════╗
// ║                    ENHANCED RENDERING                        ║
// ╚══════════════════════════════════════════════════════════════╝

function draw() {
    CTX.fillStyle = 'rgba(5, 5, 8, 0.3)';
    CTX.fillRect(0, 0, CANVAS.width, CANVAS.height);
    
    CTX.save();
    if (gameState.shake > 0) {
        const dx = (Math.random() - 0.5) * gameState.shake;
        const dy = (Math.random() - 0.5) * gameState.shake;
        CTX.translate(dx, dy);
    }
    
    gameState.stars.forEach(star => {
        const twinkle = 0.7 + Math.sin(Date.now() * 0.003 + star.x) * 0.3;
        CTX.fillStyle = `rgba(255, 255, 255, ${star.brightness * twinkle})`;
        CTX.shadowBlur = star.size * 2;
        CTX.shadowColor = 'white';
        CTX.beginPath();
        CTX.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        CTX.fill();
    });
    CTX.shadowBlur = 0;
    
    player.trail.forEach((t, i) => {
        const alpha = t.life / 10;
        const size = (t.life / 10) * 20;
        CTX.fillStyle = `rgba(0, 245, 255, ${alpha * 0.3})`;
        CTX.beginPath();
        CTX.arc(t.x, t.y, size, 0, Math.PI * 2);
        CTX.fill();
    });
    
    if (gameState.boss) {
        drawBoss();
    }
    
    gameState.enemies.forEach(enemy => {
        CTX.save();
        CTX.translate(enemy.x, enemy.y);
        
        if (enemy.stealth && enemy.stealthTimer > 0) {
            CTX.globalAlpha = 0.25 + Math.sin(enemy.stealthTimer / 10) * 0.15;
        }
        
        if (enemy.elite) {
            CTX.shadowBlur = 30;
            CTX.shadowColor = enemy.color;
        } else {
            CTX.shadowBlur = 20;
            CTX.shadowColor = enemy.color;
        }
        
        const bob = Math.sin(Date.now() * 0.005 + enemy.phase) * 3;
        
        CTX.font = enemy.elite ? '4rem Arial' : '3rem Arial';
        CTX.textAlign = 'center';
        CTX.textBaseline = 'middle';
        CTX.fillText(enemy.emoji, 0, bob);
        
        if (enemy.health > 1 || enemy.elite) {
            const barWidth = enemy.elite ? 60 : 50;
            const healthPercent = enemy.currentHealth / enemy.maxHealth;
            
            CTX.fillStyle = 'rgba(0,0,0,0.6)';
            CTX.fillRect(-barWidth/2, 30, barWidth, 8);
            
            CTX.fillStyle = healthPercent > 0.5 ? '#00ff88' : healthPercent > 0.25 ? '#ffea00' : '#ff0040';
            CTX.fillRect(-barWidth/2, 30, barWidth * healthPercent, 8);
            
            if (enemy.elite) {
                CTX.strokeStyle = '#ff0000';
                CTX.lineWidth = 2;
                CTX.strokeRect(-barWidth/2 - 2, 28, barWidth + 4, 12);
            }
        }
        
        CTX.restore();
    });
    
    drawPlayer();
    
    gameState.bullets.forEach(b => {
        CTX.save();
        
        if (b.trail.length > 1) {
            CTX.strokeStyle = b.color;
            CTX.lineWidth = 2;
            CTX.lineCap = 'round';
            CTX.beginPath();
            CTX.moveTo(b.trail[0].x, b.trail[0].y);
            for (let i = 1; i < b.trail.length; i++) {
                CTX.lineTo(b.trail[i].x, b.trail[i].y);
            }
            CTX.stroke();
        }
        
        CTX.shadowBlur = 15;
        CTX.shadowColor = b.color;
        CTX.fillStyle = '#ffffff';
        CTX.beginPath();
        CTX.arc(b.x, b.y, b.size, 0, Math.PI * 2);
        CTX.fill();
        
        CTX.fillStyle = b.color;
        CTX.beginPath();
        CTX.arc(b.x, b.y, b.size * 0.6, 0, Math.PI * 2);
        CTX.fill();
        
        CTX.restore();
    });
    
    gameState.enemyBullets.forEach(b => {
        CTX.save();
        CTX.shadowBlur = 12;
        CTX.shadowColor = b.homing ? '#ff0000' : '#ff6b6b';
        
        const pulse = b.homing ? 1 + Math.sin(Date.now() * 0.02) * 0.2 : 1;
        
        CTX.fillStyle = b.homing ? '#ff0000' : '#ff6b6b';
        CTX.beginPath();
        CTX.arc(b.x, b.y, 6 * pulse, 0, Math.PI * 2);
        CTX.fill();
        
        CTX.fillStyle = '#ffffff';
        CTX.beginPath();
        CTX.arc(b.x, b.y, 3, 0, Math.PI * 2);
        CTX.fill();
        
        CTX.restore();
    });
    
    gameState.powerUps.forEach(p => {
        CTX.save();
        CTX.translate(p.x, p.y);
        CTX.rotate(p.rotation || 0);
        
        const colors = { weapon: '#ffea00', shield: '#00f5ff', boost: '#00ff88' };
        const emojis = { weapon: '⚡', shield: '🛡️', boost: '💎' };
        
        CTX.shadowBlur = 25;
        CTX.shadowColor = colors[p.type];
        
        CTX.strokeStyle = colors[p.type];
        CTX.lineWidth = 2;
        CTX.beginPath();
        CTX.arc(0, 0, 25, 0, Math.PI * 2);
        CTX.stroke();
        
        CTX.fillStyle = colors[p.type] + '40';
        CTX.beginPath();
        CTX.arc(0, 0, 20, 0, Math.PI * 2);
        CTX.fill();
        
        CTX.font = '2rem Arial';
        CTX.textAlign = 'center';
        CTX.textBaseline = 'middle';
        CTX.fillText(emojis[p.type], 0, 0);
        
        CTX.restore();
    });
    
    gameState.particles.forEach(p => {
        CTX.save();
        CTX.globalAlpha = Math.min(p.life / p.maxLife * 2, 1);
        
        if (p.isText) {
            CTX.font = `${p.isCrit ? 'bold' : ''} ${p.size}px Orbitron`;
            CTX.fillStyle = p.color;
            CTX.strokeStyle = 'black';
            CTX.lineWidth = 3;
            CTX.textAlign = 'center';
            CTX.strokeText(p.text, p.x, p.y);
            CTX.fillText(p.text, p.x, p.y);
            
            if (p.isCrit) {
                CTX.shadowBlur = 20;
                CTX.shadowColor = p.color;
                CTX.fillText(p.text, p.x, p.y);
            }
        } else if (p.isRing) {
            CTX.strokeStyle = p.color;
            CTX.lineWidth = 3;
            CTX.globalAlpha = p.life;
            CTX.beginPath();
            CTX.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            CTX.stroke();
        } else {
            CTX.translate(p.x, p.y);
            CTX.rotate(p.rotation);
            CTX.fillStyle = p.color;
            CTX.shadowBlur = 10;
            CTX.shadowColor = p.color;
            CTX.fillRect(-p.size/2, -p.size/2, p.size, p.size);
        }
        
        CTX.restore();
    });
    
    if (gameState.combo > 5) {
        CTX.save();
        CTX.font = 'bold 24px Orbitron';
        CTX.fillStyle = '#ffea00';
        CTX.textAlign = 'center';
        CTX.shadowBlur = 20;
        CTX.shadowColor = '#ffea00';
        CTX.fillText(`COMBO x${gameState.combo}`, CANVAS.width / 2, 150);
        
        const barWidth = 200;
        CTX.fillStyle = 'rgba(255,255,255,0.2)';
        CTX.fillRect(CANVAS.width / 2 - barWidth/2, 170, barWidth, 6);
        
        CTX.fillStyle = '#ffea00';
        CTX.fillRect(CANVAS.width / 2 - barWidth/2, 170, barWidth * (gameState.comboTimer / 90), 6);
        CTX.restore();
    }
    
    CTX.restore();
}

function drawPlayer() {
    CTX.save();
    CTX.translate(player.x, player.y);
    CTX.rotate(player.angle);
    
    if (player.invulnerable > 0 && Math.floor(player.invulnerable / 5) % 2 === 0) {
        CTX.globalAlpha = 0.4;
    }
    
    const trailLength = player.boosting ? 80 : 50;
    const gradient = CTX.createLinearGradient(0, 20, 0, 20 + trailLength);
    gradient.addColorStop(0, '#00f5ff');
    gradient.addColorStop(0.3, '#0088aa');
    gradient.addColorStop(0.7, '#004455');
    gradient.addColorStop(1, 'transparent');
    
    const flicker = 0.8 + Math.random() * 0.4;
    CTX.fillStyle = gradient;
    CTX.globalAlpha = flicker;
    CTX.beginPath();
    CTX.moveTo(-12, 20);
    CTX.lineTo(0, 20 + trailLength + Math.random() * 15);
    CTX.lineTo(12, 20);
    CTX.fill();
    CTX.globalAlpha = 1;
    
    CTX.shadowBlur = 40;
    CTX.shadowColor = '#00f5ff';
    
    CTX.font = '4rem Arial';
    CTX.textAlign = 'center';
    CTX.textBaseline = 'middle';
    CTX.fillText('🚀', 0, 0);
    
    if (gameState.weaponLevel > 1) {
        CTX.shadowBlur = 30;
        CTX.shadowColor = WEAPONS[Math.min(gameState.weaponLevel, 6)].color;
        CTX.fillText('🚀', 0, 0);
    }
    
    CTX.restore();
}

function drawBoss() {
    const boss = gameState.boss;
    CTX.save();
    CTX.translate(boss.x, boss.y);
    
    if (boss.pattern === 'entrance') {
        CTX.translate((Math.random() - 0.5) * 4, (Math.random() - 0.5) * 4);
    }
    
    CTX.shadowBlur = 80;
    CTX.shadowColor = boss.color;
    
    const breathe = 1 + Math.sin(Date.now() * 0.003) * 0.05;
    CTX.scale(breathe, breathe);
    
    CTX.font = '10rem Arial';
    CTX.textAlign = 'center';
    CTX.textBaseline = 'middle';
    CTX.fillText(boss.emoji, 0, 0);
    
    const barWidth = 300;
    const barHeight = 20;
    CTX.fillStyle = 'rgba(0,0,0,0.8)';
    CTX.fillRect(-barWidth/2, boss.height/2 + 30, barWidth, barHeight);
    
    const healthPercent = boss.health / boss.maxHealth;
    const healthGradient = CTX.createLinearGradient(-barWidth/2, 0, barWidth/2, 0);
    healthGradient.addColorStop(0, '#ff0040');
    healthGradient.addColorStop(0.5, healthPercent > 0.5 ? '#ffea00' : '#ff0040');
    healthGradient.addColorStop(1, healthPercent > 0.25 ? '#00ff88' : '#ff0040');
    
    CTX.fillStyle = healthGradient;
    CTX.fillRect(-barWidth/2, boss.height/2 + 30, barWidth * healthPercent, barHeight);
    
    CTX.strokeStyle = boss.color;
    CTX.lineWidth = 3;
    CTX.strokeRect(-barWidth/2, boss.height/2 + 30, barWidth, barHeight);
    
    CTX.font = 'bold 20px Orbitron';
    CTX.fillStyle = boss.color;
    CTX.textAlign = 'center';
    CTX.fillText(boss.name, 0, boss.height/2 + 70);
    
    if (boss.pattern === 'charge') {
        CTX.fillStyle = '#ff0000';
        CTX.font = 'bold 30px Orbitron';
        CTX.fillText('⚠️ CHARGING ⚠️', 0, -boss.height/2 - 30);
    }
    
    CTX.restore();
}

// ╔══════════════════════════════════════════════════════════════╗
// ║                    UI UPDATES                                ║
// ╚══════════════════════════════════════════════════════════════╝

function updateUI() {
    document.getElementById('score').textContent = gameState.score.toLocaleString();
    document.getElementById('wave').textContent = gameState.wave;
    
    const shieldPercent = (gameState.shield / gameState.maxShield) * 100;
    document.getElementById('shieldBar').style.width = shieldPercent + '%';
    document.getElementById('shieldText').textContent = Math.ceil(shieldPercent) + '%';
    
    const shieldBar = document.getElementById('shieldBar');
    if (shieldPercent > 60) {
        shieldBar.style.background = 'linear-gradient(90deg, #00ff88, #00f5ff)';
    } else if (shieldPercent > 30) {
        shieldBar.style.background = 'linear-gradient(90deg, #ffea00, #ffaa00)';
    } else {
        shieldBar.style.background = 'linear-gradient(90deg, #ff0040, #ff6b6b)';
    }
    
    const weapon = WEAPONS[Math.min(gameState.weaponLevel, 6)];
    document.getElementById('weaponDisplay').textContent = `⚡ ${weapon.name}`;
    document.getElementById('weaponDisplay').style.color = weapon.color;
    document.getElementById('weaponDisplay').style.borderColor = weapon.color;
    document.getElementById('weaponDisplay').style.boxShadow = `0 0 15px ${weapon.color}40`;
    
    const now = Date.now();
    const chargePercent = Math.min((now - player.lastShot) / weapon.fireRate, 1);
    document.getElementById('weaponCharge').style.width = (chargePercent * 100) + '%';
}

function shakeScreen(intensity) {
    if (CONFIG.screenShake) {
        gameState.shake = intensity;
    }
}

// ╔══════════════════════════════════════════════════════════════╗
// ║                    GAME FLOW CONTROL                         ║
// ╚══════════════════════════════════════════════════════════════╝

function showWaveComplete() {
    gameState.running = false;
    
    const accuracy = gameState.shotsFired > 0 ? Math.round((gameState.shotsHit / gameState.shotsFired) * 100) : 0;
    const waveBonus = gameState.wave * 150;
    const comboBonus = gameState.combo * 20;
    
    gameState.score += waveBonus + comboBonus;
    
    document.getElementById('waveStats').innerHTML = `
        <div class="wave-stat-row">
            <span>Enemies Destroyed</span>
            <span class="stat-value">${gameState.kills}</span>
        </div>
        <div class="wave-stat-row">
            <span>Accuracy</span>
            <span class="stat-value">${accuracy}%</span>
        </div>
        <div class="wave-stat-row">
            <span>Max Combo</span>
            <span class="stat-value">x${gameState.combo}</span>
        </div>
        <div class="wave-stat-row">
            <span>Wave Bonus</span>
            <span class="stat-value">+${waveBonus}</span>
        </div>
        ${comboBonus > 0 ? `<div class="wave-stat-row"><span>Combo Bonus</span><span class="stat-value">+${comboBonus}</span></div>` : ''}
        <div class="wave-stat-row total">
            <span>Total Score</span>
            <span class="stat-value highlight">${gameState.score.toLocaleString()}</span>
        </div>
    `;
    
    document.getElementById('waveScreen').classList.remove('hidden');
}

function startGame() {
    gameState.score = 0;
    gameState.wave = 1;
    gameState.shield = 100;
    gameState.maxShield = 100;
    gameState.weaponLevel = 1;
    gameState.kills = 0;
    gameState.shotsFired = 0;
    gameState.shotsHit = 0;
    gameState.combo = 0;
    gameState.comboTimer = 0;
    gameState.enemies = [];
    gameState.bullets = [];
    gameState.enemyBullets = [];
    gameState.particles = [];
    gameState.powerUps = [];
    gameState.boss = null;
    gameState.running = true;
    gameState.paused = false;
    
    player.x = CANVAS.width / 2;
    player.y = CANVAS.height - 100;
    player.vx = 0;
    player.vy = 0;
    player.trail = [];
    
    document.getElementById('startScreen').classList.add('hidden');
    document.getElementById('gameOverScreen').classList.add('hidden');
    document.getElementById('waveScreen').classList.add('hidden');
    
    gameLoop();
}

function nextWave() {
    gameState.wave++;
    gameState.running = true;
    gameState.enemies = [];
    gameState.bullets = [];
    gameState.enemyBullets = [];
    gameState.combo = 0;
    gameState.comboTimer = 0;
    gameState.shield = Math.min(gameState.shield + 20, gameState.maxShield);
    
    document.getElementById('waveScreen').classList.add('hidden');
}

function gameOver() {
    gameState.running = false;
    
    const isNewBest = saveBestScore();
    const accuracy = gameState.shotsFired > 0 ? Math.round((gameState.shotsHit / gameState.shotsFired) * 100) : 0;
    
    document.getElementById('finalScore').textContent = gameState.score.toLocaleString();
    document.getElementById('finalBestScore').textContent = gameState.bestScore.toLocaleString();
    document.getElementById('finalWave').textContent = gameState.wave;
    document.getElementById('finalKills').textContent = gameState.kills;
    document.getElementById('finalAccuracy').textContent = accuracy + '%';
    
    let rank = 'SPACE CADET';
    let rankColor = '#8b8b9a';
    if (gameState.score > 5000) { rank = 'PILOT'; rankColor = '#00f5ff'; }
    if (gameState.score > 15000) { rank = 'STAR FIGHTER'; rankColor = '#00ff88'; }
    if (gameState.score > 30000) { rank = 'GALACTIC ACE'; rankColor = '#ffea00'; }
    if (gameState.score > 60000) { rank = 'COSMIC LEGEND'; rankColor = '#ff00e4'; }
    if (gameState.score > 100000) { rank = 'UNIVERSAL GOD'; rankColor = '#ff0040'; }
    
    const rankName = document.querySelector('.rank-name');
    rankName.textContent = rank;
    rankName.style.color = rankColor;
    rankName.style.textShadow = `0 0 20px ${rankColor}`;
    
    if (isNewBest) {
        const bestIndicator = document.createElement('div');
        bestIndicator.className = 'new-best';
        bestIndicator.textContent = '🏆 NEW BEST SCORE! 🏆';
        
        const screen = document.getElementById('gameOverScreen');
        const existing = screen.querySelector('.new-best');
        if (existing) existing.remove();
        screen.appendChild(bestIndicator);
    }
    
    document.getElementById('gameOverScreen').classList.remove('hidden');
}

// ╔══════════════════════════════════════════════════════════════╗
// ║                    INPUT HANDLING                            ║
// ╚══════════════════════════════════════════════════════════════╝

const keys = {};
const joystick = { active: false, x: 0, y: 0, originX: 0, originY: 0 };

document.addEventListener('keydown', (e) => {
    keys[e.code] = true;
    
    if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
        player.boosting = true;
    }
    
    if (e.code === 'KeyP' && gameState.running) {
        gameState.paused = !gameState.paused;
    }
});

document.addEventListener('keyup', (e) => {
    keys[e.code] = false;
    
    if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
        player.boosting = false;
    }
});

// Mobile Controls
const joystickArea = document.getElementById('joystickArea');
const joystickKnob = document.getElementById('joystick');
const fireBtn = document.getElementById('fireBtn');

if (joystickArea && fireBtn) {
    joystickArea.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const rect = joystickArea.getBoundingClientRect();
        joystick.active = true;
        joystick.originX = rect.left + rect.width / 2;
        joystick.originY = rect.top + rect.height / 2;
        updateJoystick(touch.clientX, touch.clientY);
    });
    
    joystickArea.addEventListener('touchmove', (e) => {
        e.preventDefault();
        if (joystick.active) {
            updateJoystick(e.touches[0].clientX, e.touches[0].clientY);
        }
    });
    
    joystickArea.addEventListener('touchend', () => {
        joystick.active = false;
        joystickKnob.style.transform = `translate(-50%, -50%)`;
        player.vx = 0;
        player.vy = 0;
    });
    
    fireBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        keys['Space'] = true;
        fireBtn.style.transform = 'scale(0.9)';
    });
    
    fireBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        keys['Space'] = false;
        fireBtn.style.transform = 'scale(1)';
    });
}

function updateJoystick(clientX, clientY) {
    const maxDist = 50;
    let dx = clientX - joystick.originX;
    let dy = clientY - joystick.originY;
    const dist = Math.hypot(dx, dy);
    
    if (dist > maxDist) {
        dx = (dx / dist) * maxDist;
        dy = (dy / dist) * maxDist;
    }
    
    joystickKnob.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
    
    player.vx = (dx / maxDist) * 2;
    player.vy = (dy / maxDist) * 2;
}

// Button Listeners - PLAY AGAIN / RETRY
document.getElementById('launchBtn').addEventListener('click', startGame);
document.getElementById('retryBtn').addEventListener('click', startGame);
document.getElementById('continueBtn').addEventListener('click', nextWave);

// Play Again button sa Game Over screen
const playAgainBtn = document.getElementById('playAgainBtn');
if (playAgainBtn) {
    playAgainBtn.addEventListener('click', startGame);
}

// Difficulty Selection
document.querySelectorAll('.diff-option').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.diff-option').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        CONFIG.difficulty = btn.dataset.diff;
    });
});

// ╔══════════════════════════════════════════════════════════════╗
// ║                    GAME LOOP                                 ║
// ╚══════════════════════════════════════════════════════════════╝

function gameLoop() {
    if (gameState.running && !gameState.paused) {
        update();
        draw();
    } else if (gameState.paused) {
        CTX.fillStyle = 'rgba(0, 0, 0, 0.7)';
        CTX.fillRect(0, 0, CANVAS.width, CANVAS.height);
        
        CTX.font = 'bold 40px Orbitron';
        CTX.fillStyle = '#00f5ff';
        CTX.textAlign = 'center';
        CTX.shadowBlur = 20;
        CTX.shadowColor = '#00f5ff';
        CTX.fillText('PAUSED', CANVAS.width / 2, CANVAS.height / 2);
        
        CTX.font = '20px Poppins';
        CTX.fillStyle = '#8b8b9a';
        CTX.shadowBlur = 0;
        CTX.fillText('Press P to resume', CANVAS.width / 2, CANVAS.height / 2 + 50);
    }
    
    requestAnimationFrame(gameLoop);
}

// ╔══════════════════════════════════════════════════════════════╗
// ║                    INITIALIZE                                ║
// ╚══════════════════════════════════════════════════════════════╝

init();