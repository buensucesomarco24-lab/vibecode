/**
 * NEON SNAKE WARS - Enhanced Edition
 * Classic Snake Game with Premium Neon Aesthetics
 */

const CANVAS = document.getElementById('gameCanvas');
const CTX = CANVAS.getContext('2d');

// Game Settings
const GRID_SIZE = 25;
let GAME_SPEED = 100;
let CELL_SIZE = 25;

// Game State
const gameState = {
    snake: [],
    direction: { x: 1, y: 0 },
    nextDirection: { x: 1, y: 0 },
    food: { x: 0, y: 0 },
    score: 0,
    highScore: localStorage.getItem('snakeHighScore') || 0,
    lives: 3,
    level: 1,
    running: false,
    paused: false,
    particles: [],
    gridWidth: 0,
    gridHeight: 0,
    offsetX: 0,
    offsetY: 0,
    combo: 1,
    lastEatTime: 0,
    gameTime: 0,
    startTime: 0
};

// Resize canvas
function resize() {
    CANVAS.width = window.innerWidth;
    CANVAS.height = window.innerHeight;
    
    gameState.gridWidth = Math.floor(CANVAS.width / GRID_SIZE);
    gameState.gridHeight = Math.floor(CANVAS.height / GRID_SIZE);
    
    const offsetX = (CANVAS.width - gameState.gridWidth * GRID_SIZE) / 2;
    const offsetY = (CANVAS.height - gameState.gridHeight * GRID_SIZE) / 2;
    
    gameState.offsetX = offsetX;
    gameState.offsetY = offsetY;
}

// Initialize floating particles
function initFloatingParticles() {
    const container = document.getElementById('particles');
    container.innerHTML = '';
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'floating-particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 8 + 's';
        particle.style.animationDuration = (Math.random() * 4 + 6) + 's';
        
        const colors = ['#00f5ff', '#ff00e4', '#ffea00', '#ff0040'];
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        particle.style.boxShadow = `0 0 10px ${particle.style.background}`;
        
        container.appendChild(particle);
    }
}

// Initialize game
function initGame() {
    resize();
    initFloatingParticles();
    
    const startX = Math.floor(gameState.gridWidth / 2);
    const startY = Math.floor(gameState.gridHeight / 2);
    
    gameState.snake = [];
    for (let i = 0; i < 5; i++) {
        gameState.snake.push({ x: startX - i, y: startY });
    }
    
    gameState.direction = { x: 1, y: 0 };
    gameState.nextDirection = { x: 1, y: 0 };
    gameState.score = 0;
    gameState.level = 1;
    gameState.lives = 3;
    gameState.particles = [];
    gameState.combo = 1;
    gameState.gameTime = 0;
    gameState.startTime = Date.now();
    
    spawnFood();
    updateUI();
    updateLives();
    updateCombo();
    
    document.getElementById('newRecord').classList.add('hidden');
}

// Spawn food with glow effect
function spawnFood() {
    let valid = false;
    let attempts = 0;
    
    while (!valid && attempts < 100) {
        gameState.food.x = Math.floor(Math.random() * (gameState.gridWidth - 2)) + 1;
        gameState.food.y = Math.floor(Math.random() * (gameState.gridHeight - 2)) + 1;
        
        valid = true;
        for (let segment of gameState.snake) {
            if (segment.x === gameState.food.x && segment.y === gameState.food.y) {
                valid = false;
                break;
            }
        }
        attempts++;
    }
}

// Create enhanced particles
function createParticles(x, y, color, count = 12) {
    for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count;
        const velocity = 2 + Math.random() * 4;
        
        gameState.particles.push({
            x: x * GRID_SIZE + gameState.offsetX + GRID_SIZE / 2,
            y: y * GRID_SIZE + gameState.offsetY + GRID_SIZE / 2,
            vx: Math.cos(angle) * velocity,
            vy: Math.sin(angle) * velocity,
            life: 1,
            color: color,
            size: 3 + Math.random() * 3,
            decay: 0.015 + Math.random() * 0.01
        });
    }
}

// Update particles
function updateParticles() {
    for (let i = gameState.particles.length - 1; i >= 0; i--) {
        let p = gameState.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.98;
        p.vy *= 0.98;
        p.life -= p.decay;
        
        if (p.life <= 0) {
            gameState.particles.splice(i, 1);
        }
    }
}

// Draw enhanced particles
function drawParticles() {
    for (let p of gameState.particles) {
        CTX.save();
        CTX.globalAlpha = p.life;
        CTX.fillStyle = p.color;
        CTX.shadowBlur = 15 * p.life;
        CTX.shadowColor = p.color;
        CTX.beginPath();
        CTX.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        CTX.fill();
        CTX.restore();
    }
}

// Check collision
function checkCollision() {
    const head = gameState.snake[0];
    
    if (head.x < 0 || head.x >= gameState.gridWidth || 
        head.y < 0 || head.y >= gameState.gridHeight) {
        return true;
    }
    
    for (let i = 1; i < gameState.snake.length; i++) {
        if (head.x === gameState.snake[i].x && head.y === gameState.snake[i].y) {
            return true;
        }
    }
    
    return false;
}

// Update combo display
function updateCombo() {
    const comboEl = document.getElementById('combo');
    const now = Date.now();
    
    if (now - gameState.lastEatTime < 3000 && gameState.combo > 1) {
        comboEl.textContent = 'x' + gameState.combo;
        comboEl.classList.add('show');
    } else {
        comboEl.classList.remove('show');
        gameState.combo = 1;
    }
}

// Update game
function update() {
    if (!gameState.running || gameState.paused) return;
    
    gameState.direction = { ...gameState.nextDirection };
    
    const head = { ...gameState.snake[0] };
    head.x += gameState.direction.x;
    head.y += gameState.direction.y;
    
    if (checkCollision()) {
        handleDeath();
        return;
    }
    
    gameState.snake.unshift(head);
    
    if (head.x === gameState.food.x && head.y === gameState.food.y) {
        const now = Date.now();
        if (now - gameState.lastEatTime < 3000) {
            gameState.combo++;
        } else {
            gameState.combo = 1;
        }
        gameState.lastEatTime = now;
        
        const points = 10 * gameState.level * gameState.combo;
        gameState.score += points;
        
        createParticles(gameState.food.x, gameState.food.y, '#ff0040', 16);
        createParticles(gameState.food.x, gameState.food.y, '#00f5ff', 8);
        
        if (gameState.score % 50 === 0) {
            gameState.level++;
            GAME_SPEED = Math.max(50, GAME_SPEED - 10);
        }
        
        spawnFood();
        updateUI();
        updateCombo();
    } else {
        gameState.snake.pop();
    }
    
    updateParticles();
    draw();
    
    setTimeout(update, GAME_SPEED);
}

// Handle death with screen shake
function handleDeath() {
    gameState.lives--;
    updateLives();
    
    createParticles(gameState.snake[0].x, gameState.snake[0].y, '#ff0040', 20);
    
    document.body.style.animation = 'shake 0.5s ease-in-out';
    setTimeout(() => {
        document.body.style.animation = '';
    }, 500);
    
    if (gameState.lives <= 0) {
        gameOver();
    } else {
        setTimeout(() => {
            const startX = Math.floor(gameState.gridWidth / 2);
            const startY = Math.floor(gameState.gridHeight / 2);
            
            gameState.snake = [];
            for (let i = 0; i < 5; i++) {
                gameState.snake.push({ x: startX - i, y: startY });
            }
            
            gameState.direction = { x: 1, y: 0 };
            gameState.nextDirection = { x: 1, y: 0 };
            
            if (gameState.running && !gameState.paused) {
                update();
            }
        }, 800);
    }
}

// Add shake animation
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
        20%, 40%, 60%, 80% { transform: translateX(10px); }
    }
`;
document.head.appendChild(shakeStyle);

// Draw enhanced game
function draw() {
    CTX.fillStyle = '#050508';
    CTX.fillRect(0, 0, CANVAS.width, CANVAS.height);
    
    // Draw animated grid
    const time = Date.now() * 0.001;
    CTX.strokeStyle = `rgba(0, 245, 255, ${0.05 + Math.sin(time) * 0.02})`;
    CTX.lineWidth = 1;
    
    for (let x = 0; x <= gameState.gridWidth; x++) {
        CTX.beginPath();
        CTX.moveTo(gameState.offsetX + x * GRID_SIZE, gameState.offsetY);
        CTX.lineTo(gameState.offsetX + x * GRID_SIZE, gameState.offsetY + gameState.gridHeight * GRID_SIZE);
        CTX.stroke();
    }
    
    for (let y = 0; y <= gameState.gridHeight; y++) {
        CTX.beginPath();
        CTX.moveTo(gameState.offsetX, gameState.offsetY + y * GRID_SIZE);
        CTX.lineTo(gameState.offsetX + gameState.gridWidth * GRID_SIZE, gameState.offsetY + y * GRID_SIZE);
        CTX.stroke();
    }
    
    // Draw glowing border
    CTX.strokeStyle = 'rgba(0, 245, 255, 0.4)';
    CTX.lineWidth = 3;
    CTX.shadowBlur = 20;
    CTX.shadowColor = 'rgba(0, 245, 255, 0.5)';
    CTX.strokeRect(
        gameState.offsetX, 
        gameState.offsetY, 
        gameState.gridWidth * GRID_SIZE, 
        gameState.gridHeight * GRID_SIZE
    );
    CTX.shadowBlur = 0;
    
    // Draw food with pulse
    const foodX = gameState.offsetX + gameState.food.x * GRID_SIZE + GRID_SIZE / 2;
    const foodY = gameState.offsetY + gameState.food.y * GRID_SIZE + GRID_SIZE / 2;
    const pulse = 1 + Math.sin(time * 5) * 0.1;
    
    CTX.save();
    CTX.fillStyle = '#ff0040';
    CTX.shadowBlur = 25 * pulse;
    CTX.shadowColor = '#ff0040';
    CTX.beginPath();
    CTX.arc(foodX, foodY, (GRID_SIZE / 2 - 2) * pulse, 0, Math.PI * 2);
    CTX.fill();
    
    CTX.fillStyle = '#ff6080';
    CTX.shadowBlur = 10;
    CTX.beginPath();
    CTX.arc(foodX, foodY, GRID_SIZE / 4, 0, Math.PI * 2);
    CTX.fill();
    CTX.restore();
    
    // Draw snake with gradient trail
    gameState.snake.forEach((segment, index) => {
        const x = gameState.offsetX + segment.x * GRID_SIZE;
        const y = gameState.offsetY + segment.y * GRID_SIZE;
        
        CTX.save();
        
        if (index === 0) {
            // Enhanced head
            const gradient = CTX.createRadialGradient(
                x + GRID_SIZE/2, y + GRID_SIZE/2, 0,
                x + GRID_SIZE/2, y + GRID_SIZE/2, GRID_SIZE/2
            );
            gradient.addColorStop(0, '#ffffff');
            gradient.addColorStop(0.3, '#00f5ff');
            gradient.addColorStop(1, '#00a0b0');
            
            CTX.fillStyle = gradient;
            CTX.shadowBlur = 25;
            CTX.shadowColor = '#00f5ff';
            
            CTX.beginPath();
            CTX.arc(x + GRID_SIZE / 2, y + GRID_SIZE / 2, GRID_SIZE / 2 - 1, 0, Math.PI * 2);
            CTX.fill();
            
            // Animated eyes
            CTX.fillStyle = '#0a0a0f';
            const eyeOffset = GRID_SIZE / 4;
            const dir = gameState.direction;
            const eyePulse = Math.sin(time * 10) * 0.5 + 1;
            
            if (dir.x === 1) {
                CTX.beginPath();
                CTX.arc(x + GRID_SIZE / 2 + 3, y + GRID_SIZE / 2 - 3, 3 * eyePulse, 0, Math.PI * 2);
                CTX.arc(x + GRID_SIZE / 2 + 3, y + GRID_SIZE / 2 + 3, 3 * eyePulse, 0, Math.PI * 2);
                CTX.fill();
            } else if (dir.x === -1) {
                CTX.beginPath();
                CTX.arc(x + GRID_SIZE / 2 - 3, y + GRID_SIZE / 2 - 3, 3 * eyePulse, 0, Math.PI * 2);
                CTX.arc(x + GRID_SIZE / 2 - 3, y + GRID_SIZE / 2 + 3, 3 * eyePulse, 0, Math.PI * 2);
                CTX.fill();
            } else if (dir.y === -1) {
                CTX.beginPath();
                CTX.arc(x + GRID_SIZE / 2 - 3, y + GRID_SIZE / 2 - 3, 3 * eyePulse, 0, Math.PI * 2);
                CTX.arc(x + GRID_SIZE / 2 + 3, y + GRID_SIZE / 2 - 3, 3 * eyePulse, 0, Math.PI * 2);
                CTX.fill();
            } else {
                CTX.beginPath();
                CTX.arc(x + GRID_SIZE / 2 - 3, y + GRID_SIZE / 2 + 3, 3 * eyePulse, 0, Math.PI * 2);
                CTX.arc(x + GRID_SIZE / 2 + 3, y + GRID_SIZE / 2 + 3, 3 * eyePulse, 0, Math.PI * 2);
                CTX.fill();
            }
        } else {
            // Enhanced body with gradient
            const alpha = Math.max(0.3, 1 - (index / gameState.snake.length) * 0.7);
            const size = (GRID_SIZE / 2 - 2) * (1 - (index / gameState.snake.length) * 0.2);
            
            CTX.fillStyle = `rgba(0, 245, 255, ${alpha})`;
            CTX.shadowBlur = 15 * alpha;
            CTX.shadowColor = `rgba(0, 245, 255, ${alpha})`;
            
            CTX.beginPath();
            CTX.arc(x + GRID_SIZE / 2, y + GRID_SIZE / 2, size, 0, Math.PI * 2);
            CTX.fill();
        }
        
        CTX.restore();
    });
    
    drawParticles();
}

// Update UI
function updateUI() {
    document.getElementById('score').textContent = gameState.score;
    document.getElementById('highScore').textContent = gameState.highScore;
    document.getElementById('level').textContent = gameState.level;
    
    const levelFill = document.getElementById('levelFill');
    const progress = (gameState.score % 50) / 50 * 100;
    levelFill.style.width = progress + '%';
}

// Update lives
function updateLives() {
    const livesContainer = document.getElementById('lives');
    livesContainer.innerHTML = '';
    
    for (let i = 0; i < 3; i++) {
        const life = document.createElement('span');
        life.className = 'life';
        life.textContent = '❤️';
        
        if (i >= gameState.lives) {
            life.classList.add('lost');
        }
        
        livesContainer.appendChild(life);
    }
}

// Format time
function formatTime(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Game Over
function gameOver() {
    gameState.running = false;
    
    const isNewRecord = gameState.score > gameState.highScore;
    
    if (isNewRecord) {
        gameState.highScore = gameState.score;
        localStorage.setItem('snakeHighScore', gameState.highScore);
    }
    
    document.getElementById('finalScore').textContent = gameState.score;
    document.getElementById('finalHighScore').textContent = gameState.highScore;
    document.getElementById('finalLength').textContent = gameState.snake.length;
    
    if (isNewRecord) {
        document.getElementById('newRecord').classList.remove('hidden');
    }
    
    document.getElementById('gameOverScreen').classList.remove('hidden');
}

// Start game
function startGame() {
    const activeDiff = document.querySelector('.diff-btn.active');
    GAME_SPEED = parseInt(activeDiff.dataset.speed);
    
    initGame();
    gameState.running = true;
    gameState.paused = false;
    
    document.getElementById('startScreen').classList.add('hidden');
    document.getElementById('gameOverScreen').classList.add('hidden');
    document.getElementById('pauseScreen').classList.add('hidden');
    
    update();
}

// Toggle pause
function togglePause() {
    if (!gameState.running) return;
    
    gameState.paused = !gameState.paused;
    
    if (gameState.paused) {
        gameState.gameTime += Date.now() - gameState.startTime;
        
        document.getElementById('pauseScore').textContent = gameState.score;
        document.getElementById('pauseLength').textContent = gameState.snake.length;
        document.getElementById('pauseTime').textContent = formatTime(gameState.gameTime);
        document.getElementById('pauseScreen').classList.remove('hidden');
    } else {
        gameState.startTime = Date.now();
        document.getElementById('pauseScreen').classList.add('hidden');
        update();
    }
}

// Event Listeners
document.getElementById('playBtn').addEventListener('click', startGame);
document.getElementById('retryBtn').addEventListener('click', startGame);
document.getElementById('resumeBtn').addEventListener('click', togglePause);
document.getElementById('restartBtn').addEventListener('click', () => {
    togglePause();
    startGame();
});

// Difficulty selection
document.querySelectorAll('.diff-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});

// Keyboard controls
document.addEventListener('keydown', (e) => {
    if(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
    }
    
    if (e.code === 'Space' && gameState.running) {
        togglePause();
        return;
    }
    
    if (!gameState.running || gameState.paused) return;
    
    switch(e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
            if (gameState.direction.y === 0) {
                gameState.nextDirection = { x: 0, y: -1 };
            }
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            if (gameState.direction.y === 0) {
                gameState.nextDirection = { x: 0, y: 1 };
            }
            break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
            if (gameState.direction.x === 0) {
                gameState.nextDirection = { x: -1, y: 0 };
            }
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            if (gameState.direction.x === 0) {
                gameState.nextDirection = { x: 1, y: 0 };
            }
            break;
    }
});

// Window resize
window.addEventListener('resize', () => {
    resize();
    if (!gameState.running) {
        draw();
    }
});

// Initialize
resize();
initFloatingParticles();
draw();
document.getElementById('highScore').textContent = gameState.highScore;

console.log('%c🐍 NEON SNAKE WARS', 'color: #00f5ff; font-size: 24px; font-weight: bold; text-shadow: 0 0 20px #00f5ff;');
console.log('%c✨ Enhanced Edition', 'color: #ff00e4; font-size: 14px;');
console.log('%cControls:', 'color: #ffea00; font-weight: bold;');
console.log('%c↑ ↓ ← → or WASD: Move', 'color: #8b8b9a;');
console.log('%cSPACE: Pause/Resume', 'color: #8b8b9a;');