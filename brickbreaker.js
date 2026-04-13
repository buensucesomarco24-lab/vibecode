/**
 * NEON BRICK BREAKER PRO
 * With Best Score History & Improved Visibility
 */

// Score History Manager
const ScoreHistory = {
    STORAGE_KEY: 'brickBreakerHistory_v2',
    MAX_HISTORY: 10,
    
    getHistory() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            return [];
        }
    },
    
    saveHistory(history) {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
        } catch (e) {
            console.warn('Could not save history:', e);
        }
    },
    
    addScore(score, level, bricksDestroyed) {
        const history = this.getHistory();
        const entry = {
            score: score,
            level: level,
            bricksDestroyed: bricksDestroyed,
            date: new Date().toISOString(),
            timestamp: Date.now()
        };
        
        history.unshift(entry);
        if (history.length > this.MAX_HISTORY) {
            history.pop();
        }
        
        this.saveHistory(history);
        return entry;
    },
    
    getBestScore() {
        const history = this.getHistory();
        return history.length > 0 ? Math.max(...history.map(h => h.score)) : 0;
    },
    
    getSessionStats() {
        const history = this.getHistory();
        if (history.length === 0) return null;
        
        const scores = history.map(h => h.score);
        return {
            gamesPlayed: history.length,
            bestScore: Math.max(...scores),
            averageScore: Math.floor(scores.reduce((a, b) => a + b, 0) / scores.length),
            totalBricks: history.reduce((a, h) => a + h.bricksDestroyed, 0)
        };
    },
    
    clearHistory() {
        localStorage.removeItem(this.STORAGE_KEY);
    }
};

// Game Elements
const CANVAS = document.getElementById('gameCanvas');
const CTX = CANVAS.getContext('2d');

// Game Configuration
const CONFIG = {
    paddleWidth: 120,
    paddleHeight: 15,
    ballRadius: 8,
    baseSpeed: 6,
    maxSpeed: 12,
    particleCount: 15,
    colors: {
        paddle: '#00f5ff',
        ball: '#ffea00',
        ballTrail: '#ffea00',
        bricks: ['#ff006e', '#ff00e4', '#00f5ff', '#ffea00', '#00ff88', '#9d4edd']
    }
};

// Game State
const gameState = {
    score: 0,
    level: 1,
    lives: 3,
    running: false,
    paused: false,
    difficulty: 'normal',
    combo: 0,
    comboTimer: 0,
    bricksDestroyed: 0,
    particles: [],
    powerUps: [],
    activePowerUps: {
        multiball: false,
        bigpaddle: false,
        laser: false,
        slowmo: false,
        fireball: false
    },
    powerUpTimers: {},
    shake: 0
};

// Audio Context
let audioCtx = null;

// Game Objects
const paddle = {
    x: 0,
    y: 0,
    width: CONFIG.paddleWidth,
    height: CONFIG.paddleHeight,
    targetX: 0,
    glow: 0
};

let balls = [];
let bricks = [];
let lasers = [];

// Power-up Types
const POWERUP_TYPES = {
    multiball: { emoji: '🔴', color: '#ff0040', duration: 0, instant: true },
    bigpaddle: { emoji: '⬅️', color: '#00f5ff', duration: 10000 },
    laser: { emoji: '⚡', color: '#ffea00', duration: 8000 },
    slowmo: { emoji: '⏱️', color: '#9d4edd', duration: 5000 },
    fireball: { emoji: '🔥', color: '#ff6b35', duration: 6000 }
};

// Initialize Canvas
function initCanvas() {
    const container = CANVAS.parentElement;
    CANVAS.width = container.clientWidth - 40;
    CANVAS.height = container.clientHeight - 40;
    
    paddle.y = CANVAS.height - 50;
    paddle.x = CANVAS.width / 2 - paddle.width / 2;
    paddle.targetX = paddle.x;
}

// Create Ball
function createBall(x, y, dx, dy, speed = CONFIG.baseSpeed) {
    return {
        x: x || CANVAS.width / 2,
        y: y || paddle.y - 20,
        dx: dx || (Math.random() - 0.5) * speed,
        dy: dy || -speed,
        speed: speed,
        radius: CONFIG.ballRadius,
        trail: [],
        fire: false,
        stuck: true
    };
}

// Initialize Audio
function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

// Play Sound
function playSound(type) {
    if (!audioCtx) return;
    
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    const now = audioCtx.currentTime;
    
    switch(type) {
        case 'paddle':
            oscillator.frequency.setValueAtTime(400, now);
            oscillator.frequency.exponentialRampToValueAtTime(600, now + 0.1);
            gainNode.gain.setValueAtTime(0.3, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
            oscillator.start(now);
            oscillator.stop(now + 0.1);
            break;
        case 'brick':
            oscillator.frequency.setValueAtTime(800, now);
            oscillator.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
            gainNode.gain.setValueAtTime(0.2, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
            oscillator.start(now);
            oscillator.stop(now + 0.1);
            break;
        case 'powerup':
            oscillator.frequency.setValueAtTime(600, now);
            oscillator.frequency.exponentialRampToValueAtTime(1000, now + 0.3);
            gainNode.gain.setValueAtTime(0.3, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
            oscillator.start(now);
            oscillator.stop(now + 0.3);
            break;
        case 'explosion':
            oscillator.type = 'sawtooth';
            oscillator.frequency.setValueAtTime(100, now);
            oscillator.frequency.exponentialRampToValueAtTime(50, now + 0.2);
            gainNode.gain.setValueAtTime(0.4, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
            oscillator.start(now);
            oscillator.stop(now + 0.2);
            break;
        case 'highscore':
            oscillator.frequency.setValueAtTime(523.25, now);
            oscillator.frequency.setValueAtTime(659.25, now + 0.1);
            oscillator.frequency.setValueAtTime(783.99, now + 0.2);
            oscillator.frequency.setValueAtTime(1046.50, now + 0.3);
            gainNode.gain.setValueAtTime(0.3, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
            oscillator.start(now);
            oscillator.stop(now + 0.6);
            break;
    }
}

// Create Particles
function createParticles(x, y, color, count = CONFIG.particleCount, speed = 5) {
    for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 / count) * i + Math.random() * 0.5;
        const velocity = Math.random() * speed + 2;
        gameState.particles.push({
            x: x,
            y: y,
            vx: Math.cos(angle) * velocity,
            vy: Math.sin(angle) * velocity,
            life: 1,
            decay: 0.02 + Math.random() * 0.02,
            color: color,
            size: Math.random() * 4 + 2,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.2
        });
    }
}

// Create Floating Text
function createFloatingText(x, y, text, color) {
    gameState.particles.push({
        x: x,
        y: y,
        vx: 0,
        vy: -2,
        life: 1,
        decay: 0.01,
        text: text,
        color: color,
        isText: true
    });
}

// Initialize Bricks
function initBricks() {
    bricks = [];
    const rows = 5 + gameState.level;
    const cols = 8;
    const padding = 10;
    const offsetTop = 80;
    const offsetLeft = (CANVAS.width - (cols * 75) - ((cols - 1) * padding)) / 2;
    
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const health = Math.random() < 0.1 + (gameState.level * 0.05) ? 2 : 1;
            bricks.push({
                x: offsetLeft + c * (75 + padding),
                y: offsetTop + r * (30 + padding),
                width: 75,
                height: 30,
                color: CONFIG.colors.bricks[r % CONFIG.colors.bricks.length],
                health: health,
                maxHealth: health,
                glow: 0,
                visible: true
            });
        }
    }
}

// Spawn Power-up
function spawnPowerUp(x, y) {
    if (Math.random() < 0.15) {
        const types = Object.keys(POWERUP_TYPES);
        const type = types[Math.floor(Math.random() * types.length)];
        gameState.powerUps.push({
            x: x,
            y: y,
            type: type,
            vy: 2,
            radius: 15,
            rotation: 0
        });
    }
}

// Activate Power-up
function activatePowerUp(type) {
    const config = POWERUP_TYPES[type];
    
    if (config.instant) {
        switch(type) {
            case 'multiball':
                const mainBall = balls[0];
                if (mainBall && !mainBall.stuck) {
                    balls.push(
                        createBall(mainBall.x, mainBall.y, mainBall.dx * 0.8, mainBall.dy, mainBall.speed),
                        createBall(mainBall.x, mainBall.y, mainBall.dx * 1.2, mainBall.dy, mainBall.speed)
                    );
                }
                break;
        }
    } else {
        gameState.activePowerUps[type] = true;
        
        if (gameState.powerUpTimers[type]) {
            clearTimeout(gameState.powerUpTimers[type]);
        }
        
        switch(type) {
            case 'bigpaddle':
                paddle.width = CONFIG.paddleWidth * 1.5;
                break;
            case 'slowmo':
                balls.forEach(b => b.speed = Math.max(3, b.speed * 0.5));
                break;
            case 'fireball':
                balls.forEach(b => b.fire = true);
                break;
        }
        
        gameState.powerUpTimers[type] = setTimeout(() => {
            deactivatePowerUp(type);
        }, config.duration);
    }
    
    updatePowerUpUI();
    showNotification(`${type.toUpperCase()} ACTIVATED!`);
    playSound('powerup');
}

// Deactivate Power-up
function deactivatePowerUp(type) {
    gameState.activePowerUps[type] = false;
    
    switch(type) {
        case 'bigpaddle':
            paddle.width = CONFIG.paddleWidth;
            break;
        case 'slowmo':
            balls.forEach(b => b.speed = Math.min(CONFIG.maxSpeed, b.speed * 2));
            break;
        case 'fireball':
            balls.forEach(b => b.fire = false);
            break;
    }
    
    updatePowerUpUI();
}

// Update Power-up UI
function updatePowerUpUI() {
    const container = document.getElementById('activePowerUps');
    if (!container) return;
    
    container.innerHTML = '';
    
    Object.keys(gameState.activePowerUps).forEach(type => {
        if (gameState.activePowerUps[type]) {
            const div = document.createElement('div');
            div.className = 'power-up-slot';
            const timeLeft = gameState.powerUpTimers[type] ? 
                Math.ceil((gameState.powerUpTimers[type] - Date.now()) / 1000) : 0;
            div.innerHTML = `
                ${POWERUP_TYPES[type].emoji}
                ${timeLeft > 0 ? `<div class="timer">${timeLeft}s</div>` : ''}
            `;
            container.appendChild(div);
        }
    });
}

// Show Notification
function showNotification(text) {
    const area = document.getElementById('notificationArea');
    if (!area) return;
    
    const notif = document.createElement('div');
    notif.className = 'notification';
    notif.textContent = text;
    area.appendChild(notif);
    
    setTimeout(() => notif.remove(), 3000);
}

// Shake Screen
function shakeScreen(intensity) {
    gameState.shake = intensity;
}

// Update Game
function update() {
    if (!gameState.running || gameState.paused) return;

    // Update paddle
    paddle.x += (paddle.targetX - paddle.x) * 0.15;
    paddle.x = Math.max(0, Math.min(CANVAS.width - paddle.width, paddle.x));
    paddle.glow = Math.sin(Date.now() / 200) * 10 + 20;

    // Update balls
    balls = balls.filter(ball => {
        if (ball.stuck) {
            ball.x = paddle.x + paddle.width / 2;
            ball.y = paddle.y - ball.radius - 2;
            return true;
        }

        const speedMultiplier = gameState.activePowerUps.slowmo ? 0.5 : 1;
        
        ball.x += ball.dx * speedMultiplier;
        ball.y += ball.dy * speedMultiplier;

        ball.trail.push({ x: ball.x, y: ball.y });
        if (ball.trail.length > 15) ball.trail.shift();

        // Wall collisions
        if (ball.x + ball.radius > CANVAS.width || ball.x - ball.radius < 0) {
            ball.dx = -ball.dx;
            createParticles(ball.x, ball.y, ball.fire ? '#ff6b35' : CONFIG.colors.ball, 5);
            playSound('paddle');
        }
        
        if (ball.y - ball.radius < 0) {
            ball.dy = -ball.dy;
            createParticles(ball.x, ball.y, ball.fire ? '#ff6b35' : CONFIG.colors.ball, 5);
            playSound('paddle');
        }

        // Paddle collision
        if (ball.y + ball.radius > paddle.y && 
            ball.y - ball.radius < paddle.y + paddle.height &&
            ball.x > paddle.x && 
            ball.x < paddle.x + paddle.width) {
            
            const hitPoint = (ball.x - (paddle.x + paddle.width / 2)) / (paddle.width / 2);
            ball.dx = hitPoint * ball.speed * 0.8;
            ball.dy = -Math.abs(ball.dy);
            
            ball.speed = Math.min(ball.speed * 1.02, CONFIG.maxSpeed);
            
            createParticles(ball.x, ball.y, CONFIG.colors.paddle, 8);
            playSound('paddle');
            
            if (gameState.combo > 0) {
                gameState.combo = 0;
                document.getElementById('comboDisplay').classList.add('hidden');
            }
        }

        // Brick collisions
        let hitBrick = false;
        bricks.forEach(brick => {
            if (!brick.visible) return;
            
            if (ball.x > brick.x && ball.x < brick.x + brick.width &&
                ball.y > brick.y && ball.y < brick.y + brick.height) {
                
                hitBrick = true;
                
                if (!ball.fire) {
                    ball.dy = -ball.dy;
                }
                
                brick.health--;
                
                if (brick.health <= 0) {
                    brick.visible = false;
                    gameState.score += 10 * gameState.level * (1 + gameState.combo * 0.5);
                    gameState.bricksDestroyed++;
                    gameState.combo++;
                    gameState.comboTimer = 60;
                    
                    createParticles(brick.x + brick.width/2, brick.y + brick.height/2, brick.color, 20);
                    createFloatingText(brick.x + brick.width/2, brick.y, `+${10 * gameState.level}`, brick.color);
                    shakeScreen(5);
                    playSound('brick');
                    
                    spawnPowerUp(brick.x + brick.width/2, brick.y + brick.height/2);
                    
                    if (gameState.combo > 2) {
                        const comboEl = document.getElementById('comboDisplay');
                        document.getElementById('comboCount').textContent = `x${gameState.combo}`;
                        comboEl.classList.remove('hidden');
                        setTimeout(() => comboEl.classList.add('hidden'), 1000);
                    }
                } else {
                    brick.glow = 20;
                    createParticles(ball.x, ball.y, brick.color, 5);
                }
                
                updateUI();
            }
        });

        // Ball out of bounds
        if (ball.y > CANVAS.height) {
            return false;
        }

        return true;
    });

    // Check if all balls lost
    if (balls.length === 0) {
        gameState.lives--;
        updateUI();
        updateLives();
        shakeScreen(10);
        playSound('explosion');
        
        if (gameState.lives <= 0) {
            gameOver();
        } else {
            balls.push(createBall());
        }
    }

    // Check level complete
    if (bricks.every(b => !b.visible)) {
        levelComplete();
    }

    // Update power-ups
    gameState.powerUps = gameState.powerUps.filter(pu => {
        pu.y += pu.vy;
        pu.rotation += 0.05;
        
        if (pu.y > paddle.y - 20 && 
            pu.y < paddle.y + 20 &&
            pu.x > paddle.x && 
            pu.x < paddle.x + paddle.width) {
            activatePowerUp(pu.type);
            return false;
        }
        
        return pu.y < CANVAS.height + 50;
    });

    // Update lasers
    if (gameState.activePowerUps.laser) {
        if (Math.random() < 0.1) {
            lasers.push({
                x: paddle.x + paddle.width / 2,
                y: paddle.y,
                vy: -10
            });
        }
    }

    lasers = lasers.filter(laser => {
        laser.y += laser.vy;
        
        let hit = false;
        bricks.forEach(brick => {
            if (!brick.visible) return;
            if (laser.x > brick.x && laser.x < brick.x + brick.width &&
                laser.y > brick.y && laser.y < brick.y + brick.height) {
                brick.health--;
                hit = true;
                
                if (brick.health <= 0) {
                    brick.visible = false;
                    gameState.score += 10 * gameState.level;
                    gameState.bricksDestroyed++;
                    createParticles(brick.x + brick.width/2, brick.y + brick.height/2, brick.color, 15);
                    spawnPowerUp(brick.x + brick.width/2, brick.y + brick.height/2);
                }
            }
        });
        
        return laser.y > 0 && !hit;
    });

    // Update combo timer
    if (gameState.comboTimer > 0) {
        gameState.comboTimer--;
    } else {
        gameState.combo = 0;
    }

    // Update particles
    gameState.particles = gameState.particles.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.2;
        p.vx *= 0.98;
        p.life -= p.decay;
        p.rotation += p.rotationSpeed;
        return p.life > 0;
    });

    // Decrease shake
    if (gameState.shake > 0) {
        gameState.shake *= 0.9;
        if (gameState.shake < 0.5) gameState.shake = 0;
    }

    updatePowerUpUI();
}

// Draw Game
function draw() {
    // Clear with trail effect
    CTX.fillStyle = 'rgba(10, 10, 15, 0.3)';
    CTX.fillRect(0, 0, CANVAS.width, CANVAS.height);

    // Apply screen shake
    CTX.save();
    if (gameState.shake > 0) {
        const dx = (Math.random() - 0.5) * gameState.shake;
        const dy = (Math.random() - 0.5) * gameState.shake;
        CTX.translate(dx, dy);
    }

    // Draw grid
    CTX.strokeStyle = 'rgba(0, 245, 255, 0.03)';
    CTX.lineWidth = 1;
    for (let x = 0; x < CANVAS.width; x += 40) {
        CTX.beginPath();
        CTX.moveTo(x, 0);
        CTX.lineTo(x, CANVAS.height);
        CTX.stroke();
    }
    for (let y = 0; y < CANVAS.height; y += 40) {
        CTX.beginPath();
        CTX.moveTo(0, y);
        CTX.lineTo(CANVAS.width, y);
        CTX.stroke();
    }

    // Draw bricks
    bricks.forEach(brick => {
        if (!brick.visible) return;
        
        CTX.save();
        
        if (brick.glow > 0) {
            CTX.shadowBlur = brick.glow;
            CTX.shadowColor = brick.color;
            brick.glow *= 0.9;
        }
        
        CTX.fillStyle = brick.color;
        CTX.fillRect(brick.x, brick.y, brick.width, brick.height);
        
        if (brick.maxHealth > 1) {
            const healthWidth = (brick.width - 10) * (brick.health / brick.maxHealth);
            CTX.fillStyle = 'rgba(255,255,255,0.5)';
            CTX.fillRect(brick.x + 5, brick.y + brick.height - 8, healthWidth, 4);
        }
        
        CTX.fillStyle = 'rgba(255,255,255,0.3)';
        CTX.fillRect(brick.x, brick.y, brick.width, 5);
        CTX.fillRect(brick.x, brick.y, 5, brick.height);
        
        CTX.fillStyle = 'rgba(0,0,0,0.3)';
        CTX.fillRect(brick.x + brick.width - 5, brick.y, 5, brick.height);
        CTX.fillRect(brick.x, brick.y + brick.height - 5, brick.width, 5);
        
        CTX.restore();
    });

    // Draw paddle
    CTX.save();
    CTX.shadowBlur = paddle.glow;
    CTX.shadowColor = CONFIG.colors.paddle;
    
    const gradient = CTX.createLinearGradient(paddle.x, paddle.y, paddle.x, paddle.y + paddle.height);
    gradient.addColorStop(0, CONFIG.colors.paddle);
    gradient.addColorStop(1, '#0088aa');
    CTX.fillStyle = gradient;
    CTX.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    
    CTX.fillStyle = 'rgba(255,255,255,0.4)';
    CTX.fillRect(paddle.x + 5, paddle.y + 3, paddle.width - 10, 4);
    
    CTX.fillStyle = CONFIG.colors.paddle;
    CTX.shadowBlur = 30;
    CTX.fillRect(paddle.x, paddle.y + 5, 3, paddle.height - 10);
    CTX.fillRect(paddle.x + paddle.width - 3, paddle.y + 5, 3, paddle.height - 10);
    
    CTX.restore();

    // Draw lasers
    CTX.save();
    CTX.strokeStyle = '#ffea00';
    CTX.lineWidth = 4;
    CTX.shadowBlur = 20;
    CTX.shadowColor = '#ffea00';
    lasers.forEach(laser => {
        CTX.beginPath();
        CTX.moveTo(laser.x, laser.y);
        CTX.lineTo(laser.x, laser.y + 20);
        CTX.stroke();
    });
    CTX.restore();

    // Draw balls
    balls.forEach(ball => {
        CTX.save();
        
        if (ball.fire) {
            ball.trail.forEach((pos, i) => {
                const alpha = (i / ball.trail.length) * 0.5;
                CTX.globalAlpha = alpha;
                CTX.fillStyle = '#ff6b35';
                CTX.beginPath();
                CTX.arc(pos.x, pos.y, ball.radius * (i / ball.trail.length) * 1.5, 0, Math.PI * 2);
                CTX.fill();
            });
        }
        
        CTX.globalAlpha = 0.3;
        CTX.fillStyle = ball.fire ? '#ff6b35' : CONFIG.colors.ballTrail;
        ball.trail.forEach((pos, i) => {
            const alpha = (i / ball.trail.length) * 0.5;
            CTX.globalAlpha = alpha;
            CTX.beginPath();
            CTX.arc(pos.x, pos.y, ball.radius * (i / ball.trail.length), 0, Math.PI * 2);
            CTX.fill();
        });
        
        CTX.globalAlpha = 1;
        CTX.shadowBlur = ball.fire ? 30 : 20;
        CTX.shadowColor = ball.fire ? '#ff6b35' : CONFIG.colors.ball;
        
        if (ball.fire) {
            const fireGrad = CTX.createRadialGradient(ball.x, ball.y, 0, ball.x, ball.y, ball.radius * 2);
            fireGrad.addColorStop(0, '#ffffff');
            fireGrad.addColorStop(0.3, '#ff6b35');
            fireGrad.addColorStop(1, '#ff0040');
            CTX.fillStyle = fireGrad;
        } else {
            CTX.fillStyle = CONFIG.colors.ball;
        }
        
        CTX.beginPath();
        CTX.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        CTX.fill();
        
        CTX.fillStyle = 'rgba(255,255,255,0.8)';
        CTX.beginPath();
        CTX.arc(ball.x - 3, ball.y - 3, ball.radius * 0.3, 0, Math.PI * 2);
        CTX.fill();
        
        CTX.restore();
    });

    // Draw power-ups
    gameState.powerUps.forEach(pu => {
        CTX.save();
        CTX.translate(pu.x, pu.y);
        CTX.rotate(pu.rotation);
        
        CTX.shadowBlur = 20;
        CTX.shadowColor = POWERUP_TYPES[pu.type].color;
        
        CTX.fillStyle = 'rgba(0,0,0,0.8)';
        CTX.beginPath();
        CTX.arc(0, 0, pu.radius, 0, Math.PI * 2);
        CTX.fill();
        
        CTX.strokeStyle = POWERUP_TYPES[pu.type].color;
        CTX.lineWidth = 3;
        CTX.stroke();
        
        CTX.font = '20px Arial';
        CTX.textAlign = 'center';
        CTX.textBaseline = 'middle';
        CTX.fillText(POWERUP_TYPES[pu.type].emoji, 0, 0);
        
        CTX.restore();
    });

    // Draw particles
    gameState.particles.forEach(p => {
        CTX.save();
        CTX.globalAlpha = p.life;
        
        if (p.isText) {
            CTX.font = 'bold 20px Orbitron';
            CTX.fillStyle = p.color;
            CTX.textAlign = 'center';
            CTX.fillText(p.text, p.x, p.y);
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

    CTX.restore();
}

// Game Loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// UI Updates
function updateUI() {
    const scoreEl = document.getElementById('score');
    const bestScoreEl = document.getElementById('bestScore');
    const levelEl = document.getElementById('level');
    const progressEl = document.getElementById('levelProgress');
    
    if (scoreEl) scoreEl.textContent = gameState.score.toLocaleString();
    
    const currentBest = ScoreHistory.getBestScore();
    const displayBest = Math.max(currentBest, gameState.score);
    if (bestScoreEl) bestScoreEl.textContent = displayBest.toLocaleString();
    
    if (levelEl) levelEl.textContent = gameState.level;
    
    const totalBricks = bricks.length;
    const destroyedBricks = bricks.filter(b => !b.visible).length;
    const progress = totalBricks > 0 ? (destroyedBricks / totalBricks) * 100 : 0;
    if (progressEl) progressEl.style.width = progress + '%';
}

// UPDATE LIVES FUNCTION WITH TEXT DISPLAY
function updateLives() {
    const container = document.getElementById('lives');
    const livesText = document.getElementById('livesText');
    if (!container || !livesText) return;
    
    // Update hearts
    container.innerHTML = '';
    for (let i = 0; i < 3; i++) {
        const life = document.createElement('div');
        life.className = 'life' + (i < gameState.lives ? ' active' : ' lost');
        container.appendChild(life);
    }
    
    // Update text display
    livesText.textContent = `${gameState.lives} / 3 LIVES`;
    
    // Remove all status classes
    livesText.classList.remove('low', 'critical');
    
    // Add warning classes based on remaining lives
    if (gameState.lives === 1) {
        livesText.classList.add('critical');
        livesText.textContent = `⚠️ ${gameState.lives} LIFE LEFT!`;
    } else if (gameState.lives === 2) {
        livesText.classList.add('low');
    }
}

// Load History Display
function loadHistoryDisplay() {
    const history = ScoreHistory.getHistory();
    const bestScore = ScoreHistory.getBestScore();
    
    const startBestEl = document.getElementById('startBestScore');
    if (startBestEl) startBestEl.textContent = bestScore.toLocaleString();
    
    const historyList = document.getElementById('historyList');
    if (!historyList) return;
    
    historyList.innerHTML = '';
    
    if (history.length === 0) {
        historyList.innerHTML = '<div class="history-item"><span style="color: #888;">No games yet! Play your first game!</span></div>';
    } else {
        history.slice(0, 5).forEach((entry, index) => {
            const item = document.createElement('div');
            item.className = 'history-item' + (entry.score === bestScore ? ' best' : '');
            
            const date = new Date(entry.date);
            const dateStr = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            
            item.innerHTML = `
                <span class="history-rank">#${index + 1}</span>
                <span class="history-score">${entry.score.toLocaleString()}</span>
                <span class="history-date">${dateStr}</span>
            `;
            historyList.appendChild(item);
        });
    }
}

// Level Complete
function levelComplete() {
    gameState.running = false;
    
    const levelBonus = 1000 * gameState.level;
    const livesBonus = gameState.lives * 300;
    gameState.score += levelBonus + livesBonus;
    
    const levelBonusEl = document.getElementById('levelBonus');
    const livesBonusEl = document.getElementById('livesBonus');
    const screenEl = document.getElementById('levelCompleteScreen');
    
    if (levelBonusEl) levelBonusEl.textContent = '+' + levelBonus;
    if (livesBonusEl) livesBonusEl.textContent = '+' + livesBonus;
    if (screenEl) screenEl.classList.remove('hidden');
    
    updateUI();
}

// Game Over
function gameOver() {
    gameState.running = false;
    
    // Save score to history
    ScoreHistory.addScore(gameState.score, gameState.level, gameState.bricksDestroyed);
    
    // Check if new high score
    const allTimeBest = ScoreHistory.getBestScore();
    const isHighScore = gameState.score >= allTimeBest && gameState.score > 0;
    
    if (isHighScore) {
        playSound('highscore');
    }
    
    // Update final stats
    const finalScoreEl = document.getElementById('finalScore');
    const finalLevelEl = document.getElementById('finalLevel');
    const finalBricksEl = document.getElementById('finalBricks');
    const badgeEl = document.getElementById('highScoreBadge');
    const screenEl = document.getElementById('gameOverScreen');
    
    if (finalScoreEl) finalScoreEl.textContent = gameState.score.toLocaleString();
    if (finalLevelEl) finalLevelEl.textContent = gameState.level;
    if (finalBricksEl) finalBricksEl.textContent = gameState.bricksDestroyed;
    
    if (badgeEl) {
        if (isHighScore) {
            badgeEl.classList.remove('hidden');
            badgeEl.classList.add('show');
        } else {
            badgeEl.classList.add('hidden');
            badgeEl.classList.remove('show');
        }
    }
    
    // Update session stats
    const sessionStats = ScoreHistory.getSessionStats();
    if (sessionStats) {
        const sessionGamesEl = document.getElementById('sessionGames');
        const sessionBestEl = document.getElementById('sessionBest');
        const sessionAvgEl = document.getElementById('sessionAvg');
        
        if (sessionGamesEl) sessionGamesEl.textContent = sessionStats.gamesPlayed;
        if (sessionBestEl) sessionBestEl.textContent = sessionStats.bestScore.toLocaleString();
        if (sessionAvgEl) sessionAvgEl.textContent = sessionStats.averageScore.toLocaleString();
    }
    
    if (screenEl) screenEl.classList.remove('hidden');
    
    // Reload history for next time
    setTimeout(loadHistoryDisplay, 100);
}

// Start Game
function startGame() {
    // Reset game state
    gameState.score = 0;
    gameState.level = 1;
    gameState.lives = 3;
    gameState.bricksDestroyed = 0;
    gameState.combo = 0;
    gameState.running = true;
    gameState.paused = false;
    gameState.particles = [];
    gameState.powerUps = [];
    gameState.shake = 0;
    
    // Reset power-ups
    Object.keys(gameState.activePowerUps).forEach(key => {
        gameState.activePowerUps[key] = false;
        if (gameState.powerUpTimers[key]) {
            clearTimeout(gameState.powerUpTimers[key]);
        }
    });
    
    // Reset paddle
    paddle.width = CONFIG.paddleWidth;
    
    // Initialize
    initCanvas();
    initBricks();
    balls = [createBall()];
    lasers = [];
    
    updateUI();
    updateLives();
    
    // Hide screens
    const screens = ['startScreen', 'gameOverScreen', 'levelCompleteScreen', 'pauseScreen'];
    screens.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('hidden');
    });
    
    // Init audio
    initAudio();
    
    // Start loop
    if (!window.gameRunning) {
        window.gameRunning = true;
        gameLoop();
    }
}

// Next Level
function nextLevel() {
    gameState.level++;
    gameState.running = true;
    
    balls = [createBall()];
    lasers = [];
    
    Object.keys(gameState.activePowerUps).forEach(key => {
        gameState.activePowerUps[key] = false;
    });
    paddle.width = CONFIG.paddleWidth;
    
    initBricks();
    updateUI();
    
    const screenEl = document.getElementById('levelCompleteScreen');
    if (screenEl) screenEl.classList.add('hidden');
}

// Toggle Pause
function togglePause() {
    if (!gameState.running) return;
    
    gameState.paused = !gameState.paused;
    
    const pauseScreen = document.getElementById('pauseScreen');
    const pauseScoreEl = document.getElementById('pauseScore');
    const pauseLevelEl = document.getElementById('pauseLevel');
    const pauseBestEl = document.getElementById('pauseBestScore');
    
    if (gameState.paused) {
        if (pauseScoreEl) pauseScoreEl.textContent = gameState.score.toLocaleString();
        if (pauseLevelEl) pauseLevelEl.textContent = gameState.level;
        if (pauseBestEl) pauseBestEl.textContent = document.getElementById('bestScore').textContent;
        if (pauseScreen) pauseScreen.classList.remove('hidden');
    } else {
        if (pauseScreen) pauseScreen.classList.add('hidden');
    }
}

// Event Listeners
window.addEventListener('resize', () => {
    if (gameState.running) {
        initCanvas();
    }
});

// Mouse/Touch Controls
if (CANVAS) {
    CANVAS.addEventListener('mousemove', (e) => {
        const rect = CANVAS.getBoundingClientRect();
        const x = e.clientX - rect.left;
        paddle.targetX = x - paddle.width / 2;
    });

    CANVAS.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const rect = CANVAS.getBoundingClientRect();
        const x = e.touches[0].clientX - rect.left;
        paddle.targetX = x - paddle.width / 2;
    }, { passive: false });

    CANVAS.addEventListener('click', () => {
        if (!gameState.running || gameState.paused) return;
        
        balls.forEach(ball => {
            if (ball.stuck) {
                ball.stuck = false;
                ball.dx = (Math.random() - 0.5) * ball.speed;
                ball.dy = -ball.speed;
            }
        });
    });
}

// Keyboard Controls
document.addEventListener('keydown', (e) => {
    switch(e.code) {
        case 'Space':
            e.preventDefault();
            if (!gameState.running || gameState.paused) return;
            balls.forEach(ball => {
                if (ball.stuck) {
                    ball.stuck = false;
                    ball.dx = (Math.random() - 0.5) * ball.speed;
                    ball.dy = -ball.speed;
                }
            });
            break;
        case 'KeyP':
        case 'Escape':
            togglePause();
            break;
        case 'ArrowLeft':
        case 'KeyA':
            paddle.targetX -= 30;
            break;
        case 'ArrowRight':
        case 'KeyD':
            paddle.targetX += 30;
            break;
    }
});

// DOMContentLoaded Event
document.addEventListener('DOMContentLoaded', () => {
    // Hide start screen initially, show main menu instead
    const startScreen = document.getElementById('startScreen');
    const mainMenuScreen = document.getElementById('mainMenuScreen');
    
    if (startScreen) startScreen.classList.add('hidden');
    if (mainMenuScreen) mainMenuScreen.classList.remove('hidden');
    
    // Initialize displays
    initCanvas();
    updateLives();
    loadHistoryDisplay();
    updateMainMenuStats();
    
    // Set initial difficulty
    const normalBtn = document.querySelector('[data-diff="normal"]');
    if (normalBtn) normalBtn.click();
    
    // Update best score display
    const bestScore = ScoreHistory.getBestScore();
    const bestScoreEl = document.getElementById('bestScore');
    const menuBestScoreEl = document.getElementById('menuBestScore');
    if (bestScoreEl) bestScoreEl.textContent = bestScore.toLocaleString();
    if (menuBestScoreEl) menuBestScoreEl.textContent = bestScore.toLocaleString();
    
    // ============================================
    // MAIN MENU BUTTONS
    // ============================================
    
    // Play Button - Go to Start Screen (with difficulty select)
    const menuPlayBtn = document.getElementById('menuPlayBtn');
    if (menuPlayBtn) {
        menuPlayBtn.addEventListener('click', () => {
            mainMenuScreen.classList.add('hidden');
            if (startScreen) startScreen.classList.remove('hidden');
        });
    }
    
    // Instructions Button
    const menuInstructionsBtn = document.getElementById('menuInstructionsBtn');
    const instructionsScreen = document.getElementById('instructionsScreen');
    const backFromInstructions = document.getElementById('backFromInstructions');
    
    if (menuInstructionsBtn && instructionsScreen) {
        menuInstructionsBtn.addEventListener('click', () => {
            mainMenuScreen.classList.add('hidden');
            instructionsScreen.classList.remove('hidden');
        });
    }
    
    if (backFromInstructions && instructionsScreen) {
        backFromInstructions.addEventListener('click', () => {
            instructionsScreen.classList.add('hidden');
            mainMenuScreen.classList.remove('hidden');
        });
    }
    
    // Settings Button
    const menuSettingsBtn = document.getElementById('menuSettingsBtn');
    const settingsScreen = document.getElementById('settingsScreen');
    const backFromSettings = document.getElementById('backFromSettings');
    
    if (menuSettingsBtn && settingsScreen) {
        menuSettingsBtn.addEventListener('click', () => {
            mainMenuScreen.classList.add('hidden');
            settingsScreen.classList.remove('hidden');
        });
    }
    
    if (backFromSettings && settingsScreen) {
        backFromSettings.addEventListener('click', () => {
            settingsScreen.classList.add('hidden');
            mainMenuScreen.classList.remove('hidden');
        });
    }
    
    // Settings Sound Toggle
    const settingsSoundToggle = document.getElementById('settingsSoundToggle');
    if (settingsSoundToggle) {
        settingsSoundToggle.addEventListener('click', function() {
            const isActive = this.classList.contains('active');
            if (isActive) {
                this.classList.remove('active');
                this.textContent = '🔇 OFF';
            } else {
                this.classList.add('active');
                this.textContent = '🔊 ON';
            }
        });
    }
    
    // Settings Difficulty Selection
    document.querySelectorAll('.settings-diff .diff-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.settings-diff .diff-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            gameState.difficulty = btn.dataset.diff;
            
            // Update main difficulty select too
            document.querySelectorAll('.difficulty-select:not(.settings-diff) .diff-btn').forEach(b => {
                b.classList.remove('active');
                if (b.dataset.diff === btn.dataset.diff) b.classList.add('active');
            });
            
            // Update config
            switch(gameState.difficulty) {
                case 'easy':
                    CONFIG.baseSpeed = 5;
                    CONFIG.paddleWidth = 140;
                    break;
                case 'normal':
                    CONFIG.baseSpeed = 6;
                    CONFIG.paddleWidth = 120;
                    break;
                case 'hard':
                    CONFIG.baseSpeed = 8;
                    CONFIG.paddleWidth = 100;
                    break;
            }
            paddle.width = CONFIG.paddleWidth;
        });
    });
    
    // Reset Progress Button
    const resetProgressBtn = document.getElementById('resetProgressBtn');
    if (resetProgressBtn) {
        resetProgressBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to clear all your game data? This cannot be undone!')) {
                ScoreHistory.clearHistory();
                updateMainMenuStats();
                const bestScoreEl = document.getElementById('menuBestScore');
                if (bestScoreEl) bestScoreEl.textContent = '0';
                alert('All game data has been cleared!');
            }
        });
    }
    
    // ============================================
    // ORIGINAL BUTTONS (Start Screen)
    // ============================================
    
    const startBtn = document.getElementById('startBtn');
    const playAgainBtn = document.getElementById('playAgainBtn');
    const restartBtnPause = document.getElementById('restartBtnPause');
    const resumeBtn = document.getElementById('resumeBtn');
    const nextLevelBtn = document.getElementById('nextLevelBtn');
    const soundToggle = document.getElementById('soundToggle');
    const mainMenuBtn = document.getElementById('mainMenuBtn');
    
    if (startBtn) startBtn.addEventListener('click', startGame);
    if (playAgainBtn) playAgainBtn.addEventListener('click', startGame);
    if (restartBtnPause) restartBtnPause.addEventListener('click', () => {
        const pauseScreen = document.getElementById('pauseScreen');
        if (pauseScreen) pauseScreen.classList.add('hidden');
        startGame();
    });
    if (resumeBtn) resumeBtn.addEventListener('click', togglePause);
    if (nextLevelBtn) nextLevelBtn.addEventListener('click', nextLevel);
    
    // Main Menu Button from Game Over
    if (mainMenuBtn) {
        mainMenuBtn.addEventListener('click', () => {
            // Reset game state
            gameState.running = false;
            gameState.paused = false;
            
            // Clear any active timers
            Object.keys(gameState.powerUpTimers).forEach(key => {
                if (gameState.powerUpTimers[key]) {
                    clearTimeout(gameState.powerUpTimers[key]);
                }
            });
            
            // Hide all screens
            const screens = ['gameOverScreen', 'pauseScreen', 'levelCompleteScreen', 'startScreen'];
            screens.forEach(id => {
                const el = document.getElementById(id);
                if (el) el.classList.add('hidden');
            });
            
            // Show main menu
            if (mainMenuScreen) mainMenuScreen.classList.remove('hidden');
            
            // Reload stats
            updateMainMenuStats();
        });
    }
    
    // Difficulty Selection (Start Screen)
    document.querySelectorAll('.difficulty-select:not(.settings-diff) .diff-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.difficulty-select:not(.settings-diff) .diff-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            gameState.difficulty = btn.dataset.diff;
            
            // Update settings screen too
            document.querySelectorAll('.settings-diff .diff-btn').forEach(b => {
                b.classList.remove('active');
                if (b.dataset.diff === btn.dataset.diff) b.classList.add('active');
            });
            
            switch(gameState.difficulty) {
                case 'easy':
                    CONFIG.baseSpeed = 5;
                    CONFIG.paddleWidth = 140;
                    break;
                case 'normal':
                    CONFIG.baseSpeed = 6;
                    CONFIG.paddleWidth = 120;
                    break;
                case 'hard':
                    CONFIG.baseSpeed = 8;
                    CONFIG.paddleWidth = 100;
                    break;
            }
            paddle.width = CONFIG.paddleWidth;
        });
    });
    
    // Sound Toggle (Top Bar)
    if (soundToggle) {
        soundToggle.addEventListener('click', function() {
            const isMuted = this.textContent === '🔇';
            this.textContent = isMuted ? '🔊' : '🔇';
            
            // Update settings toggle too
            if (settingsSoundToggle) {
                if (isMuted) {
                    settingsSoundToggle.classList.add('active');
                    settingsSoundToggle.textContent = '🔊 ON';
                } else {
                    settingsSoundToggle.classList.remove('active');
                    settingsSoundToggle.textContent = '🔇 OFF';
                }
            }
        });
    }
});

// Function to update Main Menu stats
function updateMainMenuStats() {
    const sessionStats = ScoreHistory.getSessionStats();
    
    const gamesPlayedEl = document.getElementById('menuGamesPlayed');
    const totalBricksEl = document.getElementById('menuTotalBricks');
    
    if (gamesPlayedEl) {
        gamesPlayedEl.textContent = sessionStats ? sessionStats.gamesPlayed : 0;
    }
    
    if (totalBricksEl) {
        totalBricksEl.textContent = sessionStats ? sessionStats.totalBricks.toLocaleString() : 0;
    }
    
    const bestScoreEl = document.getElementById('menuBestScore');
    if (bestScoreEl) {
        bestScoreEl.textContent = ScoreHistory.getBestScore().toLocaleString();
    }
}