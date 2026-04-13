/**
 * TETRIS NEON PRO
 * Modern Tetris with Hold, Ghost Piece, Combo System, and Visual Effects
 */

const CANVAS = document.getElementById('gameCanvas');
const CTX = CANVAS.getContext('2d');

// Constants
const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;
const COLORS = {
    I: '#00f5ff', O: '#ffea00', T: '#a855f7',
    S: '#22c55e', Z: '#ef4444', J: '#3b82f6', L: '#f97316',
    ghost: 'rgba(255,255,255,0.2)'
};

const SHAPES = {
    I: [[1,1,1,1]],
    O: [[1,1],[1,1]],
    T: [[0,1,0],[1,1,1]],
    S: [[0,1,1],[1,1,0]],
    Z: [[1,1,0],[0,1,1]],
    J: [[1,0,0],[1,1,1]],
    L: [[0,0,1],[1,1,1]]
};

// Game State
const gameState = {
    board: [],
    score: 0,
    level: 1,
    lines: 0,
    combo: -1,
    running: false,
    paused: false,
    dropCounter: 0,
    dropInterval: 1000,
    currentPiece: null,
    heldPiece: null,
    canHold: true,
    nextPieces: [],
    particles: [],
    highScore: localStorage.getItem('tetrisHighScore') || 0,
    startTime: 0,
    mode: 'marathon'
};

let currentPiece, heldPiece, nextPieces = [];

// Initialize
function init() {
    resize();
    gameState.board = createBoard();
    window.addEventListener('resize', resize);
    document.getElementById('highScore').textContent = gameState.highScore;
}

function resize() {
    CANVAS.width = COLS * BLOCK_SIZE;
    CANVAS.height = ROWS * BLOCK_SIZE;
}

function createBoard() {
    return Array(ROWS).fill(null).map(() => Array(COLS).fill(0));
}

function createPiece(type) {
    const types = Object.keys(SHAPES);
    const pieceType = type || types[Math.floor(Math.random() * types.length)];
    return {
        type: pieceType,
        shape: SHAPES[pieceType],
        color: COLORS[pieceType],
        x: Math.floor(COLS/2) - Math.floor(SHAPES[pieceType][0].length/2),
        y: 0
    };
}

// Fill next queue
function fillQueue() {
    while (gameState.nextPieces.length < 5) {
        gameState.nextPieces.push(createPiece());
    }
}

function getNextPiece() {
    fillQueue();
    return gameState.nextPieces.shift();
}

// Rotation with wall kicks
function rotatePiece(piece, clockwise = true) {
    const rotated = clockwise 
        ? piece.shape[0].map((_, i) => piece.shape.map(row => row[i]).reverse())
        : piece.shape[0].map((_, i) => piece.shape.map(row => row[row.length-1-i]));
    
    // Try normal rotation
    if (isValidMove({...piece, shape: rotated})) {
        return {...piece, shape: rotated};
    }
    
    // Try wall kicks
    const kicks = clockwise ? [1, -1, 2, -2] : [-1, 1, -2, 2];
    for (let kick of kicks) {
        const kicked = {...piece, shape: rotated, x: piece.x + kick};
        if (isValidMove(kicked)) return kicked;
    }
    
    return piece;
}

function isValidMove(piece, offsetX = 0, offsetY = 0, newShape = null) {
    const shape = newShape || piece.shape;
    for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
            if (shape[y][x]) {
                const newX = piece.x + x + offsetX;
                const newY = piece.y + y + offsetY;
                if (newX < 0 || newX >= COLS || newY >= ROWS) return false;
                if (newY >= 0 && gameState.board[newY][newX]) return false;
            }
        }
    }
    return true;
}

// Lock piece and clear lines
function lockPiece() {
    gameState.currentPiece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                const boardY = gameState.currentPiece.y + y;
                const boardX = gameState.currentPiece.x + x;
                if (boardY >= 0) {
                    gameState.board[boardY][boardX] = gameState.currentPiece.color;
                }
            }
        });
    });
    
    // Create lock particles
    gameState.currentPiece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                createParticles(
                    (gameState.currentPiece.x + x) * BLOCK_SIZE + BLOCK_SIZE/2,
                    (gameState.currentPiece.y + y) * BLOCK_SIZE + BLOCK_SIZE/2,
                    gameState.currentPiece.color
                );
            }
        });
    });
}

function clearLines() {
    let linesCleared = 0;
    const clearedRows = [];
    
    for (let y = ROWS - 1; y >= 0; y--) {
        if (gameState.board[y].every(cell => cell !== 0)) {
            clearedRows.push(y);
            linesCleared++;
        }
    }
    
    if (linesCleared > 0) {
        // Visual effects
        clearedRows.forEach(row => {
            for (let x = 0; x < COLS; x++) {
                createParticles(
                    x * BLOCK_SIZE + BLOCK_SIZE/2,
                    row * BLOCK_SIZE + BLOCK_SIZE/2,
                    gameState.board[row][x],
                    10
                );
            }
        });
        
        // Remove lines
        clearedRows.forEach(row => {
            gameState.board.splice(row, 1);
            gameState.board.unshift(Array(COLS).fill(0));
        });
        
        // Scoring
        const points = [0, 100, 300, 500, 800];
        const linePoints = points[linesCleared] * gameState.level;
        
        // Combo bonus
        gameState.combo++;
        const comboBonus = gameState.combo > 0 ? gameState.combo * 50 * gameState.level : 0;
        
        gameState.score += linePoints + comboBonus;
        gameState.lines += linesCleared;
        
        // Level up
        const newLevel = Math.floor(gameState.lines / 10) + 1;
        if (newLevel > gameState.level) {
            gameState.level = newLevel;
            gameState.dropInterval = Math.max(100, 1000 - (gameState.level - 1) * 80);
        }
        
        // Show effects
        if (linesCleared === 4) {
            showTetrisEffect();
        } else if (linesCleared > 0) {
            showLineClearEffect(linesCleared);
        }
        
        updateCombo();
        updateUI();
    } else {
        gameState.combo = -1;
        updateCombo();
    }
}

function showLineClearEffect(count) {
    const el = document.getElementById('lineClearEffect');
    document.getElementById('clearCount').textContent = count;
    el.classList.remove('hidden');
    setTimeout(() => el.classList.add('hidden'), 1000);
}

function showTetrisEffect() {
    const el = document.getElementById('tetrisEffect');
    el.classList.remove('hidden');
    setTimeout(() => el.classList.add('hidden'), 1500);
}

function updateCombo() {
    const box = document.getElementById('comboBox');
    const value = document.getElementById('comboValue');
    
    if (gameState.combo > 0) {
        value.textContent = 'x' + (gameState.combo + 1);
        box.classList.add('active');
    } else {
        box.classList.remove('active');
    }
}

// Hold piece
function holdPiece() {
    if (!gameState.canHold) return;
    
    if (gameState.heldPiece) {
        const temp = gameState.heldPiece;
        gameState.heldPiece = gameState.currentPiece.type;
        gameState.currentPiece = createPiece(temp);
    } else {
        gameState.heldPiece = gameState.currentPiece.type;
        gameState.currentPiece = getNextPiece();
    }
    
    gameState.canHold = false;
    updateHoldDisplay();
    updateNextDisplay();
}

function updateHoldDisplay() {
    const display = document.getElementById('holdDisplay');
    if (gameState.heldPiece) {
        display.innerHTML = renderPieceSVG(gameState.heldPiece, 100);
    } else {
        display.innerHTML = '<div class="empty-hold">PRESS C</div>';
    }
}

function updateNextDisplay() {
    const container = document.getElementById('nextQueue');
    container.innerHTML = '';
    gameState.nextPieces.slice(0, 3).forEach((piece, i) => {
        const div = document.createElement('div');
        div.className = 'next-piece';
        div.innerHTML = renderPieceSVG(piece.type, 80);
        container.appendChild(div);
    });
}

function renderPieceSVG(type, size) {
    const shape = SHAPES[type];
    const color = COLORS[type];
    const blockSize = size / 4;
    let html = `<svg width="${size}" height="${size/2}" viewBox="0 0 ${shape[0].length} ${shape.length}">`;
    
    shape.forEach((row, y) => {
        row.forEach((cell, x) => {
            if (cell) {
                html += `<rect x="${x}" y="${y}" width="0.95" height="0.95" fill="${color}" />`;
            }
        });
    });
    
    html += '</svg>';
    return html;
}

// Hard drop
function hardDrop() {
    let dropDistance = 0;
    while (isValidMove(gameState.currentPiece, 0, dropDistance + 1)) {
        dropDistance++;
    }
    gameState.currentPiece.y += dropDistance;
    gameState.score += dropDistance * 2;
    lockPiece();
    clearLines();
    spawnPiece();
}

function spawnPiece() {
    gameState.currentPiece = getNextPiece();
    gameState.canHold = true;
    
    if (!isValidMove(gameState.currentPiece)) {
        gameOver();
        return false;
    }
    
    updateNextDisplay();
    return true;
}

// Particles
function createParticles(x, y, color, count = 8) {
    for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 / count) * i;
        const speed = Math.random() * 5 + 2;
        gameState.particles.push({
            x, y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 1,
            decay: 0.02,
            color,
            size: Math.random() * 4 + 2
        });
    }
}

// Update
function update(time = 0) {
    if (!gameState.running || gameState.paused) return;
    
    const deltaTime = time - gameState.dropCounter;
    
    if (deltaTime > gameState.dropInterval) {
        if (isValidMove(gameState.currentPiece, 0, 1)) {
            gameState.currentPiece.y++;
        } else {
            lockPiece();
            clearLines();
            if (!spawnPiece()) return;
        }
        gameState.dropCounter = time;
    }
    
    // Update particles
    gameState.particles = gameState.particles.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.3;
        p.life -= p.decay;
        return p.life > 0;
    });
    
    // Update time
    const elapsed = Math.floor((Date.now() - gameState.startTime) / 1000);
    const mins = Math.floor(elapsed / 60).toString().padStart(2, '0');
    const secs = (elapsed % 60).toString().padStart(2, '0');
    document.getElementById('time').textContent = `${mins}:${secs}`;
    
    draw();
    requestAnimationFrame(update);
}

// Draw
function draw() {
    // Clear
    CTX.fillStyle = '#0a0a0f';
    CTX.fillRect(0, 0, CANVAS.width, CANVAS.height);
    
    // Grid
    CTX.strokeStyle = 'rgba(0, 245, 255, 0.03)';
    CTX.lineWidth = 1;
    for (let x = 0; x <= COLS; x++) {
        CTX.beginPath();
        CTX.moveTo(x * BLOCK_SIZE, 0);
        CTX.lineTo(x * BLOCK_SIZE, CANVAS.height);
        CTX.stroke();
    }
    for (let y = 0; y <= ROWS; y++) {
        CTX.beginPath();
        CTX.moveTo(0, y * BLOCK_SIZE);
        CTX.lineTo(CANVAS.width, y * BLOCK_SIZE);
        CTX.stroke();
    }
    
    // Board
    gameState.board.forEach((row, y) => {
        row.forEach((color, x) => {
            if (color) drawBlock(x, y, color);
        });
    });
    
    // Ghost piece
    if (gameState.currentPiece) {
        let ghostY = 0;
        while (isValidMove(gameState.currentPiece, 0, ghostY + 1)) ghostY++;
        
        CTX.globalAlpha = 0.2;
        gameState.currentPiece.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value) {
                    drawBlock(
                        gameState.currentPiece.x + x,
                        gameState.currentPiece.y + y + ghostY,
                        gameState.currentPiece.color,
                        true
                    );
                }
            });
        });
        CTX.globalAlpha = 1;
        
        // Current piece
        gameState.currentPiece.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value) {
                    drawBlock(
                        gameState.currentPiece.x + x,
                        gameState.currentPiece.y + y,
                        gameState.currentPiece.color
                    );
                }
            });
        });
    }
    
    // Particles
    gameState.particles.forEach(p => {
        CTX.save();
        CTX.globalAlpha = p.life;
        CTX.fillStyle = p.color;
        CTX.fillRect(p.x, p.y, p.size, p.size);
        CTX.restore();
    });
}

function drawBlock(x, y, color, isGhost = false) {
    const px = x * BLOCK_SIZE;
    const py = y * BLOCK_SIZE;
    
    CTX.fillStyle = color;
    CTX.fillRect(px + 1, py + 1, BLOCK_SIZE - 2, BLOCK_SIZE - 2);
    
    if (!isGhost) {
        // Highlight
        CTX.fillStyle = 'rgba(255,255,255,0.3)';
        CTX.fillRect(px + 1, py + 1, BLOCK_SIZE - 2, 4);
        CTX.fillRect(px + 1, py + 1, 4, BLOCK_SIZE - 2);
        
        // Shadow
        CTX.fillStyle = 'rgba(0,0,0,0.3)';
        CTX.fillRect(px + BLOCK_SIZE - 5, py + 1, 4, BLOCK_SIZE - 2);
        CTX.fillRect(px + 1, py + BLOCK_SIZE - 5, BLOCK_SIZE - 2, 4);
    }
}

// UI Update
function updateUI() {
    document.getElementById('score').textContent = gameState.score.toLocaleString();
    document.getElementById('level').textContent = gameState.level.toString().padStart(2, '0');
    document.getElementById('lines').textContent = gameState.lines;
    
    // Progress to next level
    const progress = ((gameState.lines % 10) / 10) * 100;
    document.getElementById('progressFill').style.width = progress + '%';
    
    if (gameState.score > gameState.highScore) {
        gameState.highScore = gameState.score;
        localStorage.setItem('tetrisHighScore', gameState.highScore);
        document.getElementById('highScore').textContent = gameState.highScore;
    }
}

// Game Control
function startGame() {
    gameState.board = createBoard();
    gameState.score = 0;
    gameState.level = 1;
    gameState.lines = 0;
    gameState.combo = -1;
    gameState.dropInterval = 1000;
    gameState.heldPiece = null;
    gameState.nextPieces = [];
    gameState.particles = [];
    gameState.running = true;
    gameState.paused = false;
    gameState.startTime = Date.now();
    gameState.canHold = true;
    
    fillQueue();
    gameState.currentPiece = getNextPiece();
    
    updateUI();
    updateHoldDisplay();
    updateNextDisplay();
    updateCombo();
    
    document.getElementById('startScreen').classList.add('hidden');
    document.getElementById('gameOverScreen').classList.add('hidden');
    document.getElementById('pauseScreen').classList.add('hidden');
    
    gameState.dropCounter = performance.now();
    requestAnimationFrame(update);
}

function pauseGame() {
    if (!gameState.running) return;
    gameState.paused = !gameState.paused;
    
    if (gameState.paused) {
        document.getElementById('pauseScore').textContent = gameState.score;
        document.getElementById('pauseLevel').textContent = gameState.level;
        document.getElementById('pauseScreen').classList.remove('hidden');
    } else {
        document.getElementById('pauseScreen').classList.add('hidden');
        gameState.dropCounter = performance.now();
        requestAnimationFrame(update);
    }
}

function gameOver() {
    gameState.running = false;
    
    const elapsed = Math.floor((Date.now() - gameState.startTime) / 1000);
    const mins = Math.floor(elapsed / 60).toString().padStart(2, '0');
    const secs = (elapsed % 60).toString().padStart(2, '0');
    
    document.getElementById('finalScore').textContent = gameState.score.toLocaleString();
    document.getElementById('finalLevel').textContent = gameState.level;
    document.getElementById('finalLines').textContent = gameState.lines;
    document.getElementById('finalTime').textContent = `${mins}:${secs}`;
    
    document.getElementById('gameOverScreen').classList.remove('hidden');
}

// Input
document.addEventListener('keydown', (e) => {
    if (!gameState.running) return;
    
    switch(e.code) {
        case 'ArrowLeft':
        case 'KeyA':
            if (isValidMove(gameState.currentPiece, -1, 0)) {
                gameState.currentPiece.x--;
            }
            break;
        case 'ArrowRight':
        case 'KeyD':
            if (isValidMove(gameState.currentPiece, 1, 0)) {
                gameState.currentPiece.x++;
            }
            break;
        case 'ArrowDown':
        case 'KeyS':
            if (isValidMove(gameState.currentPiece, 0, 1)) {
                gameState.currentPiece.y++;
                gameState.score++;
                updateUI();
            }
            break;
        case 'ArrowUp':
        case 'KeyW':
        case 'KeyX':
            gameState.currentPiece = rotatePiece(gameState.currentPiece, true);
            break;
        case 'KeyZ':
            gameState.currentPiece = rotatePiece(gameState.currentPiece, false);
            break;
        case 'Space':
            e.preventDefault();
            hardDrop();
            break;
        case 'KeyC':
        case 'ShiftLeft':
        case 'ShiftRight':
            holdPiece();
            break;
        case 'KeyP':
        case 'Escape':
            pauseGame();
            break;
    }
    
    if (!gameState.paused) draw();
});

// Button Listeners
document.getElementById('startBtn').addEventListener('click', startGame);
document.getElementById('playAgainBtn').addEventListener('click', startGame);
document.getElementById('resumeBtn').addEventListener('click', pauseGame);
document.getElementById('restartBtn').addEventListener('click', startGame);

// Mode Selection
document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        gameState.mode = btn.dataset.mode;
    });
});

// Initialize
init();