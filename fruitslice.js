/**
 * FRUIT SLICE PRO - COMPLETE VERSION
 * Advanced HTML5 Canvas Fruit Slicing Game
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // Get DOM elements
    const CANVAS = document.getElementById('gameCanvas');
    const CTX = CANVAS ? CANVAS.getContext('2d') : null;
    
    if (!CANVAS || !CTX) {
        console.error('Canvas not found!');
        return;
    }
    
    // Game Configuration
    const CONFIG = {
        baseGravity: 0.25,
        baseSpawnRate: 1500,
        minSpawnRate: 400,
        bladeLength: 12,
        bladeWidth: 8,
        particleCount: 25,
        colors: {
            blade: '#00f5ff',
            bladeGlow: 'rgba(0, 245, 255, 0.8)',
            bomb: '#ff0040'
        }
    };
    
    // Audio Context
    let audioCtx = null;
    
    // Game State
    const gameState = {
        score: 0,
        bestScore: 0,
        lives: 3,
        combo: 0,
        maxCombo: 0,
        comboTimer: 0,
        fruitsSliced: 0,
        fruitsDropped: 0,
        totalFruits: 0,
        running: false,
        paused: false,
        gameOver: false,
        fruits: [],
        particles: [],
        slicedPieces: [],
        blade: [],
        spawnAccumulator: 0,
        spawnRate: CONFIG.baseSpawnRate,
        difficulty: 1,
        lastTime: 0
    };
    
    // Fruit Types
    const FRUIT_TYPES = [
        { emoji: '🍉', color: '#ff6b6b', points: 10, weight: 25 },
        { emoji: '🍊', color: '#feca57', points: 15, weight: 20 },
        { emoji: '🍎', color: '#ff4757', points: 10, weight: 20 },
        { emoji: '🍋', color: '#feca57', points: 15, weight: 15 },
        { emoji: '🥝', color: '#1dd1a1', points: 20, weight: 10 },
        { emoji: '🍇', color: '#5f27cd', points: 20, weight: 5 },
        { emoji: '🍓', color: '#ff0040', points: 25, weight: 3 },
        { emoji: '🥥', color: '#dfe6e9', points: 30, weight: 2 }
    ];
    
    // Load best score from localStorage
    try {
        const savedBest = localStorage.getItem('fruitSliceBest');
        if (savedBest) {
            gameState.bestScore = parseInt(savedBest) || 0;
        }
    } catch (e) {
        console.log('localStorage not available');
    }
    
    // Resize Canvas
    function resize() {
        const container = CANVAS.parentElement;
        if (!container) {
            CANVAS.width = window.innerWidth;
            CANVAS.height = window.innerHeight;
            return;
        }
        
        const rect = container.getBoundingClientRect();
        CANVAS.width = rect.width;
        CANVAS.height = rect.height;
    }
    
    // Initialize Audio
    function initAudio() {
        if (!audioCtx) {
            try {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            } catch (e) {
                console.log('Audio not supported');
            }
        }
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    }
    
    // Play Sound
    function playSound(type) {
        if (!audioCtx) return;
        
        try {
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            
            const now = audioCtx.currentTime;
            
            switch(type) {
                case 'slice':
                    oscillator.frequency.setValueAtTime(800, now);
                    oscillator.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
                    gainNode.gain.setValueAtTime(0.3, now);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
                    oscillator.start(now);
                    oscillator.stop(now + 0.1);
                    break;
                case 'bomb':
                    oscillator.type = 'sawtooth';
                    oscillator.frequency.setValueAtTime(100, now);
                    oscillator.frequency.exponentialRampToValueAtTime(50, now + 0.3);
                    gainNode.gain.setValueAtTime(0.5, now);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
                    oscillator.start(now);
                    oscillator.stop(now + 0.3);
                    break;
                case 'combo':
                    oscillator.frequency.setValueAtTime(400, now);
                    oscillator.frequency.exponentialRampToValueAtTime(800, now + 0.2);
                    gainNode.gain.setValueAtTime(0.3, now);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
                    oscillator.start(now);
                    oscillator.stop(now + 0.2);
                    break;
                case 'life':
                    oscillator.frequency.setValueAtTime(300, now);
                    oscillator.frequency.exponentialRampToValueAtTime(100, now + 0.4);
                    gainNode.gain.setValueAtTime(0.4, now);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
                    oscillator.start(now);
                    oscillator.stop(now + 0.4);
                    break;
                case 'gameover':
                    oscillator.type = 'sawtooth';
                    oscillator.frequency.setValueAtTime(200, now);
                    oscillator.frequency.exponentialRampToValueAtTime(50, now + 0.5);
                    gainNode.gain.setValueAtTime(0.4, now);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
                    oscillator.start(now);
                    oscillator.stop(now + 0.5);
                    break;
            }
        } catch (e) {
            console.log('Sound play failed');
        }
    }
    
    // Get Random Fruit
    function getRandomFruit() {
        const totalWeight = FRUIT_TYPES.reduce((sum, f) => sum + f.weight, 0);
        let random = Math.random() * totalWeight;
        
        for (const fruit of FRUIT_TYPES) {
            random -= fruit.weight;
            if (random <= 0) return fruit;
        }
        return FRUIT_TYPES[0];
    }
    
    // Spawn Fruit or Bomb
    function spawnFruit() {
        // Don't spawn if game is over
        if (gameState.gameOver || !gameState.running) return;
        
        const isBomb = Math.random() < (0.1 + gameState.difficulty * 0.02);
        const padding = 80;
        const spawnWidth = Math.max(100, CANVAS.width - padding * 2);
        const x = padding + Math.random() * spawnWidth;
        const speedMultiplier = 1 + (gameState.difficulty * 0.1);
        
        gameState.totalFruits++;
        
        if (isBomb) {
            gameState.fruits.push({
                x: x,
                y: CANVAS.height + 60,
                vx: (Math.random() - 0.5) * 3,
                vy: -(Math.random() * 4 + 12) * speedMultiplier,
                radius: 40,
                type: 'bomb',
                emoji: '💣',
                color: CONFIG.colors.bomb,
                rotation: 0,
                rotationSpeed: (Math.random() - 0.5) * 0.15,
                sliced: false,
                pulse: 0
            });
        } else {
            const fruitType = getRandomFruit();
            gameState.fruits.push({
                x: x,
                y: CANVAS.height + 60,
                vx: (Math.random() - 0.5) * 3,
                vy: -(Math.random() * 4 + 12) * speedMultiplier,
                radius: 40,
                type: 'fruit',
                ...fruitType,
                rotation: 0,
                rotationSpeed: (Math.random() - 0.5) * 0.15,
                sliced: false
            });
        }
    }
    
    // Create Juice Particles
    function createJuice(x, y, color, amount) {
        amount = amount || CONFIG.particleCount;
        for (let i = 0; i < amount; i++) {
            const angle = (Math.PI * 2 / amount) * i + (Math.random() - 0.5) * 0.5;
            const speed = Math.random() * 6 + 3;
            gameState.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1,
                decay: 0.015 + Math.random() * 0.01,
                color: color,
                size: Math.random() * 5 + 3,
                gravity: 0.2,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.2
            });
        }
    }
    
    // Create Sliced Pieces
    function createSlicedPieces(fruit, angle) {
        const piece1 = {
            x: fruit.x,
            y: fruit.y,
            vx: fruit.vx - Math.cos(angle) * 2,
            vy: fruit.vy - Math.sin(angle) * 2,
            radius: fruit.radius,
            color: fruit.color,
            rotation: angle,
            rotationSpeed: -0.1,
            life: 1,
            half: 1
        };
        
        const piece2 = {
            x: fruit.x,
            y: fruit.y,
            vx: fruit.vx + Math.cos(angle) * 2,
            vy: fruit.vy + Math.sin(angle) * 2,
            radius: fruit.radius,
            color: fruit.color,
            rotation: angle + Math.PI,
            rotationSpeed: 0.1,
            life: 1,
            half: 2
        };
        
        gameState.slicedPieces.push(piece1, piece2);
    }
    
    // Line-Circle Intersection
    function lineIntersectsCircle(p1, p2, circle) {
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const fx = p1.x - circle.x;
        const fy = p1.y - circle.y;
        
        const a = dx * dx + dy * dy;
        const b = 2 * (fx * dx + fy * dy);
        const c = (fx * fx + fy * fy) - (circle.radius * circle.radius);
        
        const discriminant = b * b - 4 * a * c;
        if (discriminant < 0) return false;
        
        const t1 = (-b - Math.sqrt(discriminant)) / (2 * a);
        const t2 = (-b + Math.sqrt(discriminant)) / (2 * a);
        
        return (t1 >= 0 && t1 <= 1) || (t2 >= 0 && t2 <= 1);
    }
    
    // Show Notification
    function showNotification(text, color) {
        const area = document.getElementById('notificationArea');
        if (!area) return;
        
        // Clear existing notifications
        while (area.firstChild) {
            area.removeChild(area.firstChild);
        }
        
        const notif = document.createElement('div');
        notif.className = 'notification';
        notif.textContent = text;
        notif.style.color = color || '#fff';
        notif.style.borderColor = color || '#fff';
        area.appendChild(notif);
        
        setTimeout(function() {
            if (notif.parentNode) notif.remove();
        }, 2500);
    }
    
    // Show Floating Score
    function showFloatingScore(x, y, points, color) {
        const container = document.getElementById('floatingScores');
        if (!container) return;
        
        const score = document.createElement('div');
        score.className = 'floating-score';
        score.textContent = '+' + points;
        score.style.left = x + 'px';
        score.style.top = y + 'px';
        score.style.color = color;
        container.appendChild(score);
        
        setTimeout(function() {
            if (score.parentNode) score.remove();
        }, 1000);
    }
    
    // Update UI
    function updateUI() {
        const scoreEl = document.getElementById('score');
        const bestEl = document.getElementById('bestScore');
        const scoreFill = document.getElementById('scoreFill');
        
        if (scoreEl) scoreEl.textContent = gameState.score.toLocaleString();
        if (bestEl) bestEl.textContent = gameState.bestScore.toLocaleString();
        
        if (scoreFill) {
            const progress = (gameState.score % 400) / 400 * 100;
            scoreFill.style.width = progress + '%';
        }
        
        // Update preview stats
        const previewCombo = document.getElementById('previewCombo');
        const previewBest = document.getElementById('previewBest');
        
        if (previewCombo && gameState.maxCombo > 0) {
            previewCombo.textContent = gameState.maxCombo;
        }
        if (previewBest) {
            previewBest.textContent = gameState.bestScore.toLocaleString();
        }
    }
    
    // Update Lives
    function updateLives() {
        const container = document.getElementById('lives');
        if (!container) return;
        
        container.innerHTML = '';
        for (let i = 0; i < 3; i++) {
            const heart = document.createElement('span');
            heart.className = 'life' + (i < gameState.lives ? '' : ' lost');
            heart.textContent = '❤️';
            container.appendChild(heart);
        }
    }
    
    // Update Difficulty
    function updateDifficulty() {
        const diffValue = document.getElementById('diffValue');
        const diffStars = document.getElementById('diffStars');
        
        if (diffValue) diffValue.textContent = gameState.difficulty;
        if (diffStars) {
            const stars = '⭐'.repeat(Math.min(gameState.difficulty, 5));
            diffStars.textContent = stars;
        }
    }
    
    // Show Combo UI
    function showComboUI() {
        const display = document.getElementById('comboDisplay');
        const count = document.getElementById('comboCount');
        const bonus = document.getElementById('comboBonus');
        
        if (!display || !count || !bonus) return;
        
        count.textContent = 'x' + gameState.combo;
        const multiplier = Math.floor(gameState.combo / 3) * 50;
        bonus.textContent = '+' + multiplier + '%';
        
        display.classList.remove('hidden');
        
        // Reset animation
        display.style.animation = 'none';
        void display.offsetWidth;
        display.style.animation = 'comboIn 0.5s ease';
    }
    
    // Hide Combo UI
    function hideComboUI() {
        const display = document.getElementById('comboDisplay');
        if (display) display.classList.add('hidden');
    }
    
    // Update Game Logic
    function update(deltaTime) {
        if (!gameState.running || gameState.paused || gameState.gameOver) return;
        
        // Spawning
        gameState.spawnAccumulator += deltaTime;
        
        if (gameState.spawnAccumulator >= gameState.spawnRate) {
            spawnFruit();
            gameState.spawnAccumulator = 0;
            
            // Double spawn chance
            if (Math.random() < 0.25 + (gameState.difficulty * 0.05)) {
                setTimeout(function() {
                    if (!gameState.gameOver) spawnFruit();
                }, 150);
            }
        }
        
        // Update difficulty
        const newDifficulty = 1 + Math.floor(gameState.score / 400);
        if (newDifficulty > gameState.difficulty) {
            gameState.difficulty = newDifficulty;
            updateDifficulty();
            showNotification('LEVEL ' + newDifficulty + '!', '#ffea00');
        }
        gameState.spawnRate = Math.max(CONFIG.minSpawnRate, CONFIG.baseSpawnRate - (gameState.difficulty * 90));
        
        // Update fruits
        gameState.fruits = gameState.fruits.filter(function(fruit) {
            // Skip if game is over
            if (gameState.gameOver) return false;
            
            fruit.x += fruit.vx;
            fruit.y += fruit.vy;
            fruit.vy += CONFIG.baseGravity;
            fruit.rotation += fruit.rotationSpeed;
            
            // Bomb pulse
            if (fruit.type === 'bomb') {
                fruit.pulse = Math.sin(Date.now() / 200) * 0.3 + 0.7;
            }
            
            // Check blade collision
            if (!fruit.sliced && gameState.blade.length > 2) {
                for (let i = 1; i < gameState.blade.length; i++) {
                    if (lineIntersectsCircle(gameState.blade[i-1], gameState.blade[i], fruit)) {
                        const sliceAngle = Math.atan2(
                            gameState.blade[i].y - gameState.blade[i-1].y,
                            gameState.blade[i].x - gameState.blade[i-1].x
                        );
                        
                        if (fruit.type === 'bomb') {
                            gameState.lives--;
                            gameState.combo = 0;
                            createJuice(fruit.x, fruit.y, CONFIG.colors.bomb, 40);
                            playSound('bomb');
                            updateLives();
                            
                            // Screen shake
                            document.body.classList.add('screen-shake');
                            setTimeout(function() {
                                document.body.classList.remove('screen-shake');
                            }, 500);
                            
                            showNotification('💣 BOMB HIT!', '#ff0040');
                            
                            if (gameState.lives <= 0) {
                                triggerGameOver();
                            }
                            return false;
                        } else {
                            fruit.sliced = true;
                            gameState.fruitsSliced++;
                            
                            const comboMultiplier = 1 + Math.floor(gameState.combo / 3) * 0.5;
                            const points = Math.floor(fruit.points * comboMultiplier);
                            gameState.score += points;
                            
                            // Check high score
                            if (gameState.score > gameState.bestScore) {
                                gameState.bestScore = gameState.score;
                                try {
                                    localStorage.setItem('fruitSliceBest', gameState.bestScore);
                                } catch (e) {}
                            }
                            
                            gameState.combo++;
                            if (gameState.combo > gameState.maxCombo) {
                                gameState.maxCombo = gameState.combo;
                            }
                            gameState.comboTimer = 90;
                            
                            createJuice(fruit.x, fruit.y, fruit.color);
                            createSlicedPieces(fruit, sliceAngle);
                            playSound('slice');
                            
                            showFloatingScore(fruit.x, fruit.y - 50, points, fruit.color);
                            
                            if (gameState.combo > 2) {
                                showComboUI();
                            }
                            
                            if (comboMultiplier > 1) {
                                showNotification('+' + points + ' x' + comboMultiplier.toFixed(1), fruit.color);
                            }
                            
                            updateUI();
                            return false;
                        }
                    }
                }
            }
            
            // Remove if off screen
            if (fruit.y > CANVAS.height + 100) {
                if (!fruit.sliced && fruit.type !== 'bomb') {
                    gameState.fruitsDropped++;
                    gameState.lives--;
                    gameState.combo = 0;
                    updateLives();
                    playSound('life');
                    showNotification('❌ FRUIT DROPPED!', '#ff4757');
                    
                    if (gameState.lives <= 0) {
                        triggerGameOver();
                    }
                }
                return false;
            }
            return true;
        });
        
        // Update sliced pieces
        gameState.slicedPieces = gameState.slicedPieces.filter(function(piece) {
            piece.x += piece.vx;
            piece.y += piece.vy;
            piece.vy += CONFIG.baseGravity;
            piece.rotation += piece.rotationSpeed;
            piece.life -= 0.02;
            return piece.life > 0 && piece.y < CANVAS.height + 100;
        });
        
        // Update combo timer
        if (gameState.comboTimer > 0) {
            gameState.comboTimer--;
        } else if (gameState.combo > 0) {
            if (gameState.combo >= 3) {
                playSound('combo');
            }
            gameState.combo = 0;
            hideComboUI();
        }
        
        // Update particles
        gameState.particles = gameState.particles.filter(function(p) {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += p.gravity;
            p.vx *= 0.98;
            p.life -= p.decay;
            p.rotation += p.rotationSpeed;
            return p.life > 0;
        });
    }
    
    // TRIGGER GAME OVER
    function triggerGameOver() {
        if (gameState.gameOver) return;
        
        gameState.gameOver = true;
        gameState.running = false;
        playSound('gameover');
        
        setTimeout(function() {
            showGameOverScreen();
        }, 500);
    }
    
    // SHOW GAME OVER SCREEN
    function showGameOverScreen() {
        const isHighScore = gameState.score > 0 && gameState.score >= gameState.bestScore;
        
        // Update final stats
        const finalScore = document.getElementById('finalScore');
        const finalBest = document.getElementById('finalBest');
        const finalFruits = document.getElementById('finalFruits');
        const finalCombo = document.getElementById('finalCombo');
        const finalAccuracy = document.getElementById('finalAccuracy');
        
        if (finalScore) finalScore.textContent = gameState.score.toLocaleString();
        if (finalBest) finalBest.textContent = gameState.bestScore.toLocaleString();
        if (finalFruits) finalFruits.textContent = gameState.fruitsSliced;
        if (finalCombo) finalCombo.textContent = gameState.maxCombo;
        
        // Calculate accuracy
        let accuracy = 0;
        const totalHit = gameState.fruitsSliced + gameState.fruitsDropped;
        if (totalHit > 0) {
            accuracy = Math.round((gameState.fruitsSliced / totalHit) * 100);
        }
        if (finalAccuracy) finalAccuracy.textContent = accuracy + '%';
        
        // Performance rating
        const ratingStars = document.querySelector('.rating-stars');
        const ratingText = document.querySelector('.rating-text');
        
        let stars = '⭐';
        let text = 'KEEP PRACTICING!';
        
        if (accuracy >= 90 && gameState.score > 1000) {
            stars = '⭐⭐⭐⭐⭐';
            text = 'LEGENDARY!';
        } else if (accuracy >= 80 && gameState.score > 500) {
            stars = '⭐⭐⭐⭐';
            text = 'MASTER SLICER!';
        } else if (accuracy >= 70 && gameState.score > 200) {
            stars = '⭐⭐⭐';
            text = 'SKILLED!';
        } else if (accuracy >= 50) {
            stars = '⭐⭐';
            text = 'GETTING THERE!';
        }
        
        if (ratingStars) ratingStars.textContent = stars;
        if (ratingText) ratingText.textContent = text;
        
        // High score badge
        const badge = document.getElementById('newHighScore');
        if (badge) {
            if (isHighScore) {
                badge.classList.remove('hidden');
                setTimeout(function() {
                    playSound('combo');
                }, 300);
            } else {
                badge.classList.add('hidden');
            }
        }
        
        // Show game over screen
        const gameOverScreen = document.getElementById('gameOverScreen');
        const pauseBtn = document.getElementById('pauseBtn');
        const diffIndicator = document.getElementById('difficultyIndicator');
        const comboDisplay = document.getElementById('comboDisplay');
        
        if (gameOverScreen) {
            gameOverScreen.classList.remove('hidden');
            gameOverScreen.style.opacity = '0';
            setTimeout(function() {
                gameOverScreen.style.transition = 'opacity 0.5s ease';
                gameOverScreen.style.opacity = '1';
            }, 10);
        }
        
        if (pauseBtn) pauseBtn.classList.add('hidden');
        if (diffIndicator) diffIndicator.classList.add('hidden');
        if (comboDisplay) comboDisplay.classList.add('hidden');
        
        // Clear notifications
        const notifArea = document.getElementById('notificationArea');
        if (notifArea) notifArea.innerHTML = '';
    }
    
    // Draw Game
    function draw() {
        // Clear with trail effect
        CTX.fillStyle = 'rgba(10, 10, 15, 0.4)';
        CTX.fillRect(0, 0, CANVAS.width, CANVAS.height);
        
        // Apply screen shake
        CTX.save();
        if (document.body.classList.contains('screen-shake')) {
            const shakeX = (Math.random() - 0.5) * 10;
            const shakeY = (Math.random() - 0.5) * 10;
            CTX.translate(shakeX, shakeY);
        }
        
        // Draw blade trail
        if (gameState.blade.length > 1) {
            CTX.save();
            CTX.shadowBlur = 20;
            CTX.shadowColor = CONFIG.colors.blade;
            
            CTX.strokeStyle = CONFIG.colors.blade;
            CTX.lineWidth = CONFIG.bladeWidth;
            CTX.lineCap = 'round';
            CTX.lineJoin = 'round';
            
            CTX.beginPath();
            CTX.moveTo(gameState.blade[0].x, gameState.blade[0].y);
            
            for (let i = 1; i < gameState.blade.length - 1; i++) {
                const xc = (gameState.blade[i].x + gameState.blade[i + 1].x) / 2;
                const yc = (gameState.blade[i].y + gameState.blade[i + 1].y) / 2;
                CTX.quadraticCurveTo(gameState.blade[i].x, gameState.blade[i].y, xc, yc);
            }
            
            CTX.stroke();
            
            CTX.strokeStyle = 'rgba(255, 255, 255, 0.8)';
            CTX.lineWidth = CONFIG.bladeWidth / 2;
            CTX.stroke();
            
            CTX.restore();
        }
        
        // Draw sliced pieces
        gameState.slicedPieces.forEach(function(piece) {
            CTX.save();
            CTX.translate(piece.x, piece.y);
            CTX.rotate(piece.rotation);
            CTX.globalAlpha = piece.life;
            
            CTX.beginPath();
            const startAngle = piece.half === 1 ? -Math.PI/2 : Math.PI/2;
            const endAngle = piece.half === 1 ? Math.PI/2 : -Math.PI/2;
            CTX.arc(0, 0, piece.radius, startAngle, endAngle);
            CTX.fillStyle = piece.color;
            CTX.fill();
            
            CTX.beginPath();
            CTX.arc(0, 0, piece.radius - 5, startAngle, endAngle);
            CTX.fillStyle = 'rgba(255, 255, 255, 0.3)';
            CTX.fill();
            
            CTX.restore();
        });
        
        // Draw fruits
        gameState.fruits.forEach(function(fruit) {
            CTX.save();
            CTX.translate(fruit.x, fruit.y);
            CTX.rotate(fruit.rotation);
            
            if (fruit.type === 'bomb') {
                CTX.shadowBlur = 30 * fruit.pulse;
                CTX.shadowColor = CONFIG.colors.bomb;
                
                CTX.beginPath();
                CTX.arc(0, 0, fruit.radius + 10 + Math.sin(Date.now() / 100) * 5, 0, Math.PI * 2);
                CTX.strokeStyle = 'rgba(255, 0, 64, ' + (0.3 + fruit.pulse * 0.4) + ')';
                CTX.lineWidth = 3;
                CTX.stroke();
            } else {
                CTX.shadowBlur = 15;
                CTX.shadowColor = 'rgba(255, 255, 255, 0.2)';
            }
            
            CTX.font = (fruit.radius * 1.5) + 'px Arial';
            CTX.textAlign = 'center';
            CTX.textBaseline = 'middle';
            CTX.fillText(fruit.emoji, 0, 5);
            
            CTX.restore();
        });
        
        // Draw particles
        gameState.particles.forEach(function(p) {
            CTX.save();
            CTX.globalAlpha = p.life;
            CTX.translate(p.x, p.y);
            CTX.rotate(p.rotation);
            
            CTX.fillStyle = p.color;
            CTX.shadowBlur = 10;
            CTX.shadowColor = p.color;
            CTX.fillRect(-p.size/2, -p.size/2, p.size, p.size);
            
            CTX.restore();
        });
        
        CTX.restore();
    }
    
    // Game Loop
    function gameLoop(currentTime) {
        const deltaTime = currentTime - gameState.lastTime;
        gameState.lastTime = currentTime;
        
        update(deltaTime);
        draw();
        
        requestAnimationFrame(gameLoop);
    }
    
    // FULL RESET GAME
    function fullResetGame() {
        console.log('Full reset triggered');
        
        // Reset all game state
        gameState.score = 0;
        gameState.lives = 3;
        gameState.combo = 0;
        gameState.maxCombo = 0;
        gameState.fruitsSliced = 0;
        gameState.fruitsDropped = 0;
        gameState.totalFruits = 0;
        gameState.fruits = [];
        gameState.particles = [];
        gameState.slicedPieces = [];
        gameState.blade = [];
        gameState.running = true;
        gameState.paused = false;
        gameState.gameOver = false;
        gameState.spawnAccumulator = 0;
        gameState.spawnRate = CONFIG.baseSpawnRate;
        gameState.difficulty = 1;
        
        // Clear all visual elements
        const floatingScores = document.getElementById('floatingScores');
        const bladeEffects = document.getElementById('bladeEffects');
        const notificationArea = document.getElementById('notificationArea');
        
        if (floatingScores) floatingScores.innerHTML = '';
        if (bladeEffects) bladeEffects.innerHTML = '';
        if (notificationArea) notificationArea.innerHTML = '';
        
        resize();
        
        // Hide all screens
        const startScreen = document.getElementById('startScreen');
        const gameOverScreen = document.getElementById('gameOverScreen');
        const pauseScreen = document.getElementById('pauseScreen');
        const pauseBtn = document.getElementById('pauseBtn');
        const diffIndicator = document.getElementById('difficultyIndicator');
        
        if (startScreen) startScreen.classList.add('hidden');
        
        if (gameOverScreen) {
            gameOverScreen.style.opacity = '0';
            setTimeout(function() {
                gameOverScreen.classList.add('hidden');
            }, 300);
        }
        
        if (pauseScreen) {
            pauseScreen.style.opacity = '0';
            setTimeout(function() {
                pauseScreen.classList.add('hidden');
            }, 300);
        }
        
        if (pauseBtn) pauseBtn.classList.remove('hidden');
        if (diffIndicator) diffIndicator.classList.remove('hidden');
        
        hideComboUI();
        updateUI();
        updateLives();
        updateDifficulty();
        
        initAudio();
        
        // Play restart sound
        if (audioCtx) {
            try {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.frequency.setValueAtTime(440, audioCtx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.2);
                gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
                osc.start();
                osc.stop(audioCtx.currentTime + 0.3);
            } catch (e) {}
        }
        
        console.log('Game restarted successfully!');
    }
    
    // Start Game (First Time)
    function startGame() {
        fullResetGame();
    }
    
    // Toggle Pause
    function togglePause() {
        if (!gameState.running || gameState.gameOver) return;
        
        gameState.paused = !gameState.paused;
        
        const pauseScreen = document.getElementById('pauseScreen');
        const pauseScore = document.getElementById('pauseScore');
        const pauseCombo = document.getElementById('pauseCombo');
        const pauseLevel = document.getElementById('pauseLevel');
        
        if (gameState.paused) {
            if (pauseScore) pauseScore.textContent = gameState.score.toLocaleString();
            if (pauseCombo) pauseCombo.textContent = 'x' + gameState.combo;
            if (pauseLevel) pauseLevel.textContent = gameState.difficulty;
            if (pauseScreen) {
                pauseScreen.classList.remove('hidden');
                pauseScreen.style.opacity = '0';
                setTimeout(function() {
                    pauseScreen.style.transition = 'opacity 0.3s ease';
                    pauseScreen.style.opacity = '1';
                }, 10);
            }
        } else {
            if (pauseScreen) {
                pauseScreen.style.opacity = '0';
                setTimeout(function() {
                    pauseScreen.classList.add('hidden');
                }, 300);
            }
        }
    }
    
    // Input Handling
    let isMouseDown = false;
    let lastMousePos = null;
    
    function handleInput(x, y) {
        if (!gameState.running || gameState.paused || gameState.gameOver) return;
        
        if (lastMousePos) {
            const dx = x - lastMousePos.x;
            const dy = y - lastMousePos.y;
            const velocity = Math.sqrt(dx * dx + dy * dy);
            CONFIG.bladeWidth = Math.min(15, 4 + velocity * 0.15);
        }
        lastMousePos = { x: x, y: y };
        
        gameState.blade.push({ x: x, y: y, time: Date.now() });
    }
    
    // Mouse Events
    CANVAS.addEventListener('mousedown', function(e) {
        isMouseDown = true;
        lastMousePos = null;
        handleInput(e.clientX, e.clientY);
    });
    
    CANVAS.addEventListener('mousemove', function(e) {
        if (isMouseDown) {
            handleInput(e.clientX, e.clientY);
        }
    });
    
    CANVAS.addEventListener('mouseup', function() {
        isMouseDown = false;
        gameState.blade = [];
        lastMousePos = null;
        CONFIG.bladeWidth = 8;
    });
    
    // Touch Events
    CANVAS.addEventListener('touchstart', function(e) {
        e.preventDefault();
        const touch = e.touches[0];
        isMouseDown = true;
        lastMousePos = null;
        handleInput(touch.clientX, touch.clientY);
    }, { passive: false });
    
    CANVAS.addEventListener('touchmove', function(e) {
        e.preventDefault();
        const touch = e.touches[0];
        handleInput(touch.clientX, touch.clientY);
    }, { passive: false });
    
    CANVAS.addEventListener('touchend', function(e) {
        e.preventDefault();
        isMouseDown = false;
        gameState.blade = [];
        lastMousePos = null;
        CONFIG.bladeWidth = 8;
    });
    
    // Keyboard Controls
    document.addEventListener('keydown', function(e) {
        // Prevent space from scrolling
        if (e.code === 'Space') {
            e.preventDefault();
        }
        
        if (e.code === 'KeyP' || e.code === 'Escape') {
            togglePause();
        }
        
        if (e.code === 'Space' || e.code === 'Enter' || e.code === 'KeyR') {
            const gameOverScreen = document.getElementById('gameOverScreen');
            const startScreen = document.getElementById('startScreen');
            
            // Restart if game over
            if (gameOverScreen && !gameOverScreen.classList.contains('hidden')) {
                fullResetGame();
                return;
            }
            
            // Start if on start screen
            if (startScreen && !startScreen.classList.contains('hidden')) {
                startGame();
            }
        }
    });
    
    // ============================================
    // BUTTON EVENT LISTENERS - ALL BUTTONS
    // ============================================
    
    // Start Button (from start screen)
    const startBtn = document.getElementById('startBtn');
    if (startBtn) {
        startBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Start button clicked');
            startGame();
        });
    }
    
    // Play Again Button (from game over screen)
    const playAgainBtn = document.getElementById('playAgainBtn');
    if (playAgainBtn) {
        playAgainBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Play Again button clicked');
            fullResetGame();
        });
    }
    
    // Restart Game Button (legacy)
    const restartGameBtn = document.getElementById('restartGameBtn');
    if (restartGameBtn) {
        restartGameBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Restart game button clicked');
            fullResetGame();
        });
    }
    
    // Restart Button (legacy)
    const restartBtn = document.getElementById('restartBtn');
    if (restartBtn) {
        restartBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            fullResetGame();
        });
    }
    
    // Resume Button (from pause screen)
    const resumeBtn = document.getElementById('resumeBtn');
    if (resumeBtn) {
        resumeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            togglePause();
        });
    }
    
    // Pause Button (in-game)
    const pauseBtn = document.getElementById('pauseBtn');
    if (pauseBtn) {
        pauseBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            togglePause();
        });
    }
    
    // Restart from Pause
    const restartBtnPause = document.getElementById('restartBtnPause');
    if (restartBtnPause) {
        restartBtnPause.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            fullResetGame();
        });
    }
    
    // Main Menu Button (Start Screen) - Add confirmation if game running
    const mainMenuBtn = document.getElementById('mainMenuBtn');
    if (mainMenuBtn) {
        mainMenuBtn.addEventListener('click', function(e) {
            if (gameState.running && !gameState.gameOver) {
                if (!confirm('Are you sure you want to leave? Your progress will be lost!')) {
                    e.preventDefault();
                }
            }
        });
    }
    
    // Main Menu Button (Game Over Screen)
    const mainMenuBtnGameOver = document.getElementById('mainMenuBtnGameOver');
    if (mainMenuBtnGameOver) {
        // Just a link, no special handler needed
    }
    
    // Window Events
    window.addEventListener('resize', resize);
    
    // Initialize Background Particles
    function initBackgroundParticles() {
        const container = document.getElementById('bgParticles');
        const ringsContainer = document.getElementById('bgRings');
        
        if (container) {
            for (let i = 0; i < 20; i++) {
                const particle = document.createElement('div');
                particle.className = 'bg-particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.animationDelay = Math.random() * 15 + 's';
                particle.style.animationDuration = (12 + Math.random() * 15) + 's';
                
                const colors = ['var(--primary)', 'var(--secondary)', 'var(--accent)', 'var(--success)'];
                particle.style.background = colors[Math.floor(Math.random() * colors.length)];
                
                container.appendChild(particle);
            }
        }
        
        if (ringsContainer) {
            for (let i = 0; i < 3; i++) {
                const ring = document.createElement('div');
                ring.className = 'bg-ring';
                ring.style.width = (300 + i * 200) + 'px';
                ring.style.height = ring.style.width;
                ring.style.animationDelay = (i * 1.5) + 's';
                ring.style.animationDuration = (4 + i) + 's';
                ringsContainer.appendChild(ring);
            }
        }
    }
    
    // CSS Animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10% { transform: translateX(-10px); }
            20% { transform: translateX(10px); }
            30% { transform: translateX(-10px); }
            40% { transform: translateX(10px); }
            50% { transform: translateX(-5px); }
            60% { transform: translateX(5px); }
            70% { transform: translateX(-5px); }
            80% { transform: translateX(5px); }
            90% { transform: translateX(0); }
        }
        
        .screen-shake {
            animation: shake 0.5s ease-in-out;
        }
        
        .play-again-btn {
            background: linear-gradient(135deg, #00ff88 0%, #00cc6a 50%, #00ff88 100%) !important;
            background-size: 200% 200% !important;
            animation: gradientMove 3s ease infinite, btnPulse 2s ease-in-out infinite !important;
            box-shadow: 0 20px 60px rgba(0, 255, 136, 0.5), 0 0 0 0 rgba(0, 255, 136, 0.7) !important;
        }
        
        .play-again-btn:hover {
            box-shadow: 0 30px 80px rgba(0, 255, 136, 0.7), 0 0 40px rgba(0, 255, 136, 0.5) !important;
        }
        
        @keyframes gradientMove {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
        }
        
        .main-menu-btn {
            border-color: var(--secondary) !important;
            color: var(--secondary) !important;
        }
        
        .main-menu-btn:hover {
            background: var(--secondary) !important;
            color: #fff !important;
            box-shadow: 0 0 50px rgba(255, 0, 228, 0.5) !important;
        }
    `;
    document.head.appendChild(style);
    
    // Initialize
    resize();
    updateUI();
    updateLives();
    initBackgroundParticles();
    
    // Start game loop
    gameState.lastTime = performance.now();
    requestAnimationFrame(gameLoop);
    
    console.log('Fruit Slice Pro loaded successfully! Press START SLICING or SPACE to begin.');
    
});