/* ============================================
   NEONPLAY - JavaScript Main File
   Particle System, Animations, & Games
   ============================================ */

// ============================================
// GITHUB PAGES COMPATIBILITY
// ============================================

window.NeonplayCompat = {
    isGitHubPages: function() {
        return window.location.hostname.includes('github.io');
    },
    
    isDev: function() {
        return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    },
    
    log: function(message) {
        if (this.isDev()) {
            console.log('[NEONPLAY] ' + message);
        }
    }
};

// ============================================
// PARTICLE SYSTEM
// ============================================

class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.resize();
        this.init();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        // Create initial particles
        for (let i = 0; i < 50; i++) {
            this.particles.push(new Particle(
                Math.random() * this.canvas.width,
                Math.random() * this.canvas.height,
                this.canvas
            ));
        }
        this.animate();
    }

    addParticles(x, y, count = 5) {
        for (let i = 0; i < count; i++) {
            this.particles.push(new Particle(x, y, this.canvas, true));
        }
    }

    update() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            this.particles[i].update(this.mouse);
            if (this.particles[i].life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw background gradient
        const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
        gradient.addColorStop(0, 'rgba(10, 10, 10, 0)');
        gradient.addColorStop(0.5, 'rgba(0, 240, 255, 0.02)');
        gradient.addColorStop(1, 'rgba(255, 0, 110, 0.02)');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        for (let particle of this.particles) {
            particle.draw(this.ctx);
        }
    }

    animate() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

class Particle {
    constructor(x, y, canvas, burst = false) {
        this.x = x;
        this.y = y;
        this.canvas = canvas;
        
        if (burst) {
            this.vx = (Math.random() - 0.5) * 8;
            this.vy = (Math.random() - 0.5) * 8 - 2;
            this.life = 1;
            this.maxLife = 1;
            this.size = Math.random() * 3 + 2;
            this.color = ['#00f0ff', '#ff006e', '#0aff00'][Math.floor(Math.random() * 3)];
        } else {
            this.vx = (Math.random() - 0.5) * 2;
            this.vy = (Math.random() - 0.5) * 2;
            this.life = 1;
            this.maxLife = Math.random() * 200 + 100;
            this.size = Math.random() * 2 + 1;
            this.color = '#00f0ff';
        }
    }

    update(mouse) {
        // Attraction to mouse
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 100;

        if (distance < maxDistance) {
            const angle = Math.atan2(dy, dx);
            this.vx += Math.cos(angle) * 0.5;
            this.vy += Math.sin(angle) * 0.5;
        }

        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.1; // Gravity
        this.vx *= 0.98; // Friction

        // Bounce off edges
        if (this.x < 0 || this.x > this.canvas.width) {
            this.vx *= -0.9;
            this.x = Math.max(0, Math.min(this.canvas.width, this.x));
        }
        if (this.y < 0 || this.y > this.canvas.height) {
            this.vy *= -0.9;
            this.y = Math.max(0, Math.min(this.canvas.height, this.y));
        }

        this.life -= Math.random();
    }

    draw(ctx) {
        const opacity = Math.max(0, this.life / this.maxLife);
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;
        ctx.globalAlpha = opacity * 0.6;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
    }
}

// ============================================
// MAIN APPLICATION
// ============================================

class NeonplayApp {
    constructor() {
        this.currentGame = null;
        this.soundEnabled = true;
        this.particles = null;
        this.init();
    }

    init() {
        // Initialize particle system
        const canvas = document.getElementById('particleCanvas');
        this.particles = new ParticleSystem(canvas);

        // Setup mouse tracking
        document.addEventListener('mousemove', (e) => {
            this.particles.mouse = { x: e.clientX, y: e.clientY };
        });

        // Setup event listeners
        this.setupEventListeners();
        this.setupScrollAnimations();
        
        // Load games
        this.setupGames();

        // Setup sound
        this.setupSound();

        // Remove loading screen
        setTimeout(() => {
            const loadingScreen = document.getElementById('loadingScreen');
            loadingScreen.style.opacity = '0';
        }, 1500);

        // Handle resize
        window.addEventListener('resize', () => {
            this.particles.resize();
        });
    }

    setupEventListeners() {
        // Hero buttons
        const startGamingBtn = document.getElementById('startGamingBtn');
        const learnMoreBtn = document.getElementById('learnMoreBtn');
        
        if (startGamingBtn) {
            startGamingBtn.addEventListener('click', () => {
                document.getElementById('games').scrollIntoView({ behavior: 'smooth' });
            });
        }
        
        if (learnMoreBtn) {
            learnMoreBtn.addEventListener('click', () => {
                document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
            });
        }

        // Setup game tabs first
        this.setupGameTabs();

        // Setup game cards after a small delay to ensure DOM is ready
        setTimeout(() => {
            this.setupGameCards();
        }, 100);

        // Modal close
        document.getElementById('modalClose').addEventListener('click', () => {
            this.closeGame();
        });

        document.getElementById('gameModal').addEventListener('click', (e) => {
            if (e.target.id === 'gameModal') {
                this.closeGame();
            }
        });

        // Sound toggle
        document.getElementById('soundToggle').addEventListener('click', () => {
            this.toggleSound();
        });

        // Nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                e.target.classList.add('active');
            });
        });
    }

    setupGameCards() {
        const cards = document.querySelectorAll('.game-card');
        NeonplayCompat.log(`Setting up ${cards.length} game cards`);
        
        cards.forEach(card => {
            const playBtn = card.querySelector('.play-btn');
            if (!playBtn) return;
            
            playBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                
                // Check if it's a local game or external game
                const isExternal = card.classList.contains('external-game');
                
                if (isExternal) {
                    const gameUrl = card.dataset.url;
                    const gameTitle = card.querySelector('.game-title').textContent;
                    this.launchExternalGame(gameUrl, gameTitle);
                } else {
                    const gameName = card.dataset.game;
                    this.openGame(gameName);
                }
            });
        });
    }

    setupGameTabs() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const tabName = btn.dataset.tab;
                this.filterGamesByTab(tabName);
            });
        });

        // Initialize to show all action games by default
        this.filterGamesByTab('action');
    }

    filterGamesByTab(tabName) {
        // Update active tab button
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Show/hide game cards based on tab
        const gameCards = document.querySelectorAll('.game-card');
        let visibleCount = 0;
        gameCards.forEach(card => {
            if (card.dataset.tab === tabName) {
                card.style.display = 'block';
                card.style.opacity = '1';
                card.style.pointerEvents = 'auto';
                visibleCount++;
            } else {
                card.style.display = 'none';
                card.style.opacity = '0';
                card.style.pointerEvents = 'none';
            }
        });
        NeonplayCompat.log(`Showing ${visibleCount} games in ${tabName} category`);
    }

    launchExternalGame(gameUrl, gameName) {
        try {
            NeonplayCompat.log(`Launching external game: ${gameName} from ${gameUrl}`);
            
            const container = document.getElementById('gameContainer');
            const modal = document.getElementById('gameModal');

            if (!container || !modal) {
                NeonplayCompat.log('ERROR: Modal or container not found!');
                return;
            }

            container.innerHTML = `
                <div class="external-game-wrapper">
                    <div class="game-header">
                        <h3>🎮 ${gameName}</h3>
                    </div>
                    <div class="external-game-frame">
                        <iframe 
                            src="${gameUrl}" 
                            allow="fullscreen; accelerometer; gyroscope; microphone; camera"
                            sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals allow-presentation">
                        </iframe>
                    </div>
                </div>
            `;
            
            // Clear any inline styles and remove class first
            modal.classList.remove('active');
            modal.style.display = '';
            modal.style.opacity = '';
            modal.style.pointerEvents = '';
            
            // Then add active class to trigger display
            setTimeout(() => {
                modal.classList.add('active');
            }, 10);
            
            // Add particle effects
            if (this.particles) {
                this.particles.addParticles(window.innerWidth / 2, window.innerHeight / 2, 10);
            }
            
            NeonplayCompat.log('Game modal activated successfully');
        } catch (error) {
            NeonplayCompat.log(`ERROR launching game: ${error.message}`);
        }
    }

    setupScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.game-card, .feature').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'all 0.6s ease-out';
            observer.observe(el);
        });
    }

    setupSound() {
        const bgMusic = document.getElementById('bgMusic');
        
        // Create simple procedural sound
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        document.getElementById('soundToggle').addEventListener('click', () => {
            if (this.soundEnabled && bgMusic.paused) {
                bgMusic.play().catch(() => {});
            } else if (!this.soundEnabled && !bgMusic.paused) {
                bgMusic.pause();
            }
        });
    }

    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        const toggle = document.getElementById('soundToggle');
        toggle.textContent = this.soundEnabled ? '🔊' : '🔇';
        toggle.style.boxShadow = this.soundEnabled ? 
            '0 0 15px var(--primary-neon), inset 0 0 15px rgba(0, 240, 255, 0.2)' :
            '0 0 10px var(--text-dim)';
    }

    setupGames() {
        // Games are loaded dynamically when opened
    }

    openGame(gameName) {
        try {
            NeonplayCompat.log(`Opening local game: ${gameName}`);
            
            const modal = document.getElementById('gameModal');
            const container = document.getElementById('gameContainer');
            
            if (!modal || !container) {
                NeonplayCompat.log('ERROR: Modal or container not found!');
                return;
            }
            
            // Create game instance based on name
            let gameContent = '';
            
            switch(gameName) {
                case 'space-dodge':
                    gameContent = this.createSpaceDodgeGame();
                    break;
                case 'clicker':
                    gameContent = this.createClickerGame();
                    break;
                case 'reaction':
                    gameContent = this.createReactionGame();
                    break;
                case 'memory':
                    gameContent = this.createMemoryGame();
                    break;
                default:
                    NeonplayCompat.log(`Unknown game: ${gameName}`);
                    return;
            }

            container.innerHTML = gameContent;
            
            // Clear any inline styles and remove class first
            modal.classList.remove('active');
            modal.style.display = '';
            modal.style.opacity = '';
            
            // Then add active class to trigger display via CSS
            setTimeout(() => {
                modal.classList.add('active');
            }, 10);
            
            // Initialize game
            this.initializeGame(gameName, container);
            
            // Add particle effects
            if (this.particles) {
                this.particles.addParticles(window.innerWidth / 2, window.innerHeight / 2, 10);
            }
            
            NeonplayCompat.log('Game opened successfully');
        } catch (error) {
            NeonplayCompat.log(`ERROR opening game: ${error.message}`);
        }
    }

    closeGame() {
        try {
            const modal = document.getElementById('gameModal');
            modal.classList.remove('active');
            setTimeout(() => {
                document.getElementById('gameContainer').innerHTML = '';
                this.currentGame = null;
            }, 300);
            NeonplayCompat.log('Game closed');
        } catch (error) {
            NeonplayCompat.log(`ERROR closing game: ${error.message}`);
        }
    }

    createSpaceDodgeGame() {
        return `
            <div class="game-wrapper space-dodge-wrapper">
                <div class="game-header">
                    <h2>SPACE DODGE</h2>
                    <div class="game-stats">
                        <div class="stat">Score: <span id="dodgeScore">0</span></div>
                        <div class="stat">Lives: <span id="dodgeLives">3</span></div>
                        <div class="stat">Level: <span id="dodgeLevel">1</span></div>
                    </div>
                </div>
                <canvas id="spaceDodgeCanvas"></canvas>
                <div class="game-controls">
                    <button id="spaceDodgeStart" class="game-btn">START GAME</button>
                    <button id="spaceDodgePause" class="game-btn">PAUSE</button>
                    <button id="spaceDodgeRestart" class="game-btn">RESTART</button>
                </div>
            </div>
        `;
    }

    createClickerGame() {
        return `
            <div class="game-wrapper clicker-wrapper">
                <div class="game-header">
                    <h2>ENERGY CLICKER</h2>
                    <div class="game-stats">
                        <div class="stat">Energy: <span id="energy">0</span></div>
                        <div class="stat">Per Click: <span id="perClick">1</span></div>
                    </div>
                </div>
                <div class="clicker-game">
                    <div class="click-box" id="clickBox">⚡</div>
                    <div class="clicker-info">
                        <p id="currentEnergy">Energy: 0</p>
                    </div>
                    <div class="upgrades">
                        <h3>UPGRADES</h3>
                        <div id="upgradesList"></div>
                    </div>
                    <button id="clickerReset" class="game-btn">RESET GAME</button>
                </div>
            </div>
        `;
    }

    createReactionGame() {
        return `
            <div class="game-wrapper reaction-wrapper">
                <div class="game-header">
                    <h2>REACTION RUSH</h2>
                    <div class="game-stats">
                        <div class="stat">Hits: <span id="reactionHits">0</span></div>
                        <div class="stat">Time: <span id="reactionTime">30</span>s</div>
                        <div class="stat">Best: <span id="reactionBest">0</span></div>
                    </div>
                </div>
                <div class="reaction-game">
                    <div id="reactionTargets" class="targets-container"></div>
                    <button id="reactionStart" class="game-btn">START GAME</button>
                    <button id="reactionRestart" class="game-btn">RESTART</button>
                </div>
            </div>
        `;
    }

    createMemoryGame() {
        return `
            <div class="game-wrapper memory-wrapper">
                <div class="game-header">
                    <h2>MEMORY MATRIX</h2>
                    <div class="game-stats">
                        <div class="stat">Level: <span id="memoryLevel">1</span></div>
                        <div class="stat">Sequence: <span id="sequenceLength">0</span></div>
                    </div>
                </div>
                <div class="memory-game">
                    <div class="memory-grid" id="memoryGrid"></div>
                    <div class="memory-controls">
                        <p id="memoryMessage">Watch the pattern...</p>
                        <button id="memoryStart" class="game-btn">START GAME</button>
                        <button id="memoryRestart" class="game-btn">RESTART</button>
                    </div>
                </div>
            </div>
        `;
    }

    initializeGame(gameName, container) {
        switch(gameName) {
            case 'space-dodge':
                this.currentGame = new SpaceDodgeGame(container);
                break;
            case 'clicker':
                this.currentGame = new ClickerGame(container);
                break;
            case 'reaction':
                this.currentGame = new ReactionGame(container);
                break;
            case 'memory':
                this.currentGame = new MemoryGame(container);
                break;
        }
    }
}

// ============================================
// SPACE DODGE GAME
// ============================================

class SpaceDodgeGame {
    constructor(container) {
        this.container = container;
        this.canvas = container.querySelector('#spaceDodgeCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.setupCanvas();
        this.init();
    }

    setupCanvas() {
        this.canvas.width = this.container.offsetWidth - 40;
        this.canvas.height = 400;
    }

    init() {
        this.player = {
            x: this.canvas.width / 2,
            y: this.canvas.height - 50,
            width: 30,
            height: 30,
            speed: 5
        };

        this.asteroids = [];
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.gameRunning = false;
        this.gamePaused = false;
        this.asteroidSpeed = 2;

        this.keys = {};

        // Event listeners
        document.addEventListener('keydown', (e) => this.keys[e.key] = true);
        document.addEventListener('keyup', (e) => this.keys[e.key] = false);

        container = this.container;
        container.querySelector('#spaceDodgeStart').addEventListener('click', () => this.start());
        container.querySelector('#spaceDodgePause').addEventListener('click', () => this.togglePause());
        container.querySelector('#spaceDodgeRestart').addEventListener('click', () => this.restart());

        // Mouse control
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.player.x = e.clientX - rect.left - this.player.width / 2;
            this.player.x = Math.max(0, Math.min(this.canvas.width - this.player.width, this.player.x));
        });
    }

    start() {
        if (!this.gameRunning) {
            this.gameRunning = true;
            this.gamePaused = false;
            this.animate();
        }
    }

    togglePause() {
        if (this.gameRunning) {
            this.gamePaused = !this.gamePaused;
        }
    }

    restart() {
        this.init();
    }

    spawnAsteroid() {
        this.asteroids.push({
            x: Math.random() * (this.canvas.width - 20),
            y: -20,
            width: 20,
            height: 20,
            speed: this.asteroidSpeed
        });
    }

    update() {
        if (!this.gameRunning || this.gamePaused) return;

        // Spawn asteroids
        if (Math.random() < 0.02) {
            this.spawnAsteroid();
        }

        // Update asteroids
        for (let i = this.asteroids.length - 1; i >= 0; i--) {
            this.asteroids[i].y += this.asteroids[i].speed;

            // Collision detection
            if (this.checkCollision(this.player, this.asteroids[i])) {
                this.lives--;
                this.asteroids.splice(i, 1);
                this.updateStats();
                if (this.lives <= 0) {
                    this.gameOver();
                }
            } else if (this.asteroids[i].y > this.canvas.height) {
                this.asteroids.splice(i, 1);
                this.score += 10;
                this.updateStats();
            }
        }
    }

    checkCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }

    draw() {
        // Clear
        this.ctx.fillStyle = 'rgba(10, 10, 10, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw grid
        this.ctx.strokeStyle = 'rgba(0, 240, 255, 0.1)';
        this.ctx.lineWidth = 1;
        for (let i = 0; i < this.canvas.width; i += 50) {
            this.ctx.beginPath();
            this.ctx.moveTo(i, 0);
            this.ctx.lineTo(i, this.canvas.height);
            this.ctx.stroke();
        }

        // Draw player
        this.ctx.fillStyle = '#00f0ff';
        this.ctx.shadowColor = '#00f0ff';
        this.ctx.shadowBlur = 15;
        this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);
        this.ctx.shadowBlur = 0;

        // Draw asteroids
        this.ctx.fillStyle = '#ff006e';
        this.ctx.shadowColor = '#ff006e';
        this.ctx.shadowBlur = 10;
        for (let asteroid of this.asteroids) {
            this.ctx.beginPath();
            this.ctx.arc(asteroid.x + asteroid.width / 2, asteroid.y + asteroid.height / 2, asteroid.width / 2, 0, Math.PI * 2);
            this.ctx.fill();
        }
        this.ctx.shadowBlur = 0;
    }

    updateStats() {
        document.getElementById('dodgeScore').textContent = this.score;
        document.getElementById('dodgeLives').textContent = this.lives;
        document.getElementById('dodgeLevel').textContent = this.level;
    }

    gameOver() {
        this.gameRunning = false;
        this.ctx.fillStyle = 'rgba(255, 0, 110, 0.3)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = '#ff006e';
        this.ctx.font = '48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('GAME OVER', this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.font = '24px Arial';
        this.ctx.fillText('Score: ' + this.score, this.canvas.width / 2, this.canvas.height / 2 + 40);
    }

    animate() {
        this.update();
        this.draw();

        if (this.gameRunning) {
            requestAnimationFrame(() => this.animate());
        }
    }
}

// ============================================
// CLICKER GAME
// ============================================

class ClickerGame {
    constructor(container) {
        this.container = container;
        this.energy = 0;
        this.perClick = 1;
        this.upgrades = [
            { name: 'Double Click', cost: 10, multiplier: 2, bought: false },
            { name: 'Triple Click', cost: 50, multiplier: 3, bought: false },
            { name: 'Power Surge', cost: 200, multiplier: 5, bought: false }
        ];
        this.init();
    }

    init() {
        const clickBox = this.container.querySelector('#clickBox');
        clickBox.addEventListener('click', () => this.click());

        const upgradesList = this.container.querySelector('#upgradesList');
        this.upgrades.forEach((upgrade, index) => {
            const btn = document.createElement('button');
            btn.className = 'upgrade-btn';
            btn.innerHTML = `${upgrade.name}<br>Cost: ${upgrade.cost}`;
            btn.addEventListener('click', () => this.buyUpgrade(index));
            upgradesList.appendChild(btn);
        });

        this.container.querySelector('#clickerReset').addEventListener('click', () => this.reset());
        this.updateDisplay();
    }

    click() {
        this.energy += this.perClick;
        this.updateDisplay();

        // Particle burst effect
        app.particles.addParticles(
            event.clientX,
            event.clientY,
            10
        );
    }

    buyUpgrade(index) {
        const upgrade = this.upgrades[index];
        if (this.energy >= upgrade.cost && !upgrade.bought) {
            this.energy -= upgrade.cost;
            this.perClick *= upgrade.multiplier;
            upgrade.bought = true;
            this.updateDisplay();
        }
    }

    updateDisplay() {
        document.getElementById('energy').textContent = this.energy;
        document.getElementById('perClick').textContent = this.perClick;
        document.getElementById('currentEnergy').textContent = `Energy: ${this.energy}`;

        this.container.querySelectorAll('.upgrade-btn').forEach((btn, index) => {
            const upgrade = this.upgrades[index];
            btn.disabled = upgrade.bought || this.energy < upgrade.cost;
            if (upgrade.bought) {
                btn.style.opacity = '0.5';
                btn.textContent = upgrade.name + ' (OWNED)';
            }
        });
    }

    reset() {
        this.energy = 0;
        this.perClick = 1;
        this.upgrades.forEach(u => u.bought = false);
        this.init();
    }
}

// ============================================
// REACTION GAME
// ============================================

class ReactionGame {
    constructor(container) {
        this.container = container;
        this.hits = 0;
        this.timeLeft = 30;
        this.gameRunning = false;
        this.bestScore = localStorage.getItem('reactionBest') || 0;
        this.init();
    }

    init() {
        this.container.querySelector('#reactionStart').addEventListener('click', () => this.start());
        this.container.querySelector('#reactionRestart').addEventListener('click', () => this.restart());
        document.getElementById('reactionBest').textContent = this.bestScore;
    }

    start() {
        if (!this.gameRunning) {
            this.gameRunning = true;
            this.hits = 0;
            this.timeLeft = 30;
            this.startTimer();
            this.spawnTarget();
        }
    }

    startTimer() {
        const timer = setInterval(() => {
            if (this.gameRunning) {
                this.timeLeft--;
                document.getElementById('reactionTime').textContent = this.timeLeft;

                if (this.timeLeft <= 0) {
                    clearInterval(timer);
                    this.endGame();
                }
            } else {
                clearInterval(timer);
            }
        }, 1000);
    }

    spawnTarget() {
        if (!this.gameRunning) return;

        const container = this.container.querySelector('#reactionTargets');
        const target = document.createElement('div');
        target.className = 'reaction-target';
        target.style.left = Math.random() * 80 + '%';
        target.style.top = Math.random() * 80 + '%';
        target.textContent = '●';

        target.addEventListener('click', () => {
            this.hits++;
            document.getElementById('reactionHits').textContent = this.hits;
            target.remove();
            setTimeout(() => this.spawnTarget(), 300);
        });

        container.appendChild(target);
        setTimeout(() => {
            if (target.parentNode) target.remove();
            if (this.gameRunning) this.spawnTarget();
        }, 1500);
    }

    endGame() {
        this.gameRunning = false;
        if (this.hits > this.bestScore) {
            this.bestScore = this.hits;
            localStorage.setItem('reactionBest', this.bestScore);
            document.getElementById('reactionBest').textContent = this.bestScore;
        }
        document.getElementById('reactionMessage').textContent = `Game Over! Final Score: ${this.hits}`;
    }

    restart() {
        this.gameRunning = false;
        this.hits = 0;
        this.timeLeft = 30;
        this.container.querySelector('#reactionTargets').innerHTML = '';
        document.getElementById('reactionHits').textContent = '0';
        document.getElementById('reactionTime').textContent = '30';
    }
}

// ============================================
// MEMORY GAME
// ============================================

class MemoryGame {
    constructor(container) {
        this.container = container;
        this.sequence = [];
        this.playerSequence = [];
        this.level = 1;
        this.gameRunning = false;
        this.gameActive = false;
        this.init();
    }

    init() {
        this.createGrid();
        this.container.querySelector('#memoryStart').addEventListener('click', () => this.start());
        this.container.querySelector('#memoryRestart').addEventListener('click', () => this.restart());
    }

    createGrid() {
        const grid = this.container.querySelector('#memoryGrid');
        grid.innerHTML = '';
        
        const colors = ['#00f0ff', '#ff006e', '#0aff00', '#ffbe0b'];
        const positions = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];

        colors.forEach((color, index) => {
            const box = document.createElement('div');
            box.className = `memory-box ${positions[index]}`;
            box.style.backgroundColor = color;
            box.style.boxShadow = `0 0 20px ${color}`;
            box.addEventListener('click', () => this.handleBoxClick(index, box));
            grid.appendChild(box);
        });
    }

    start() {
        if (!this.gameRunning) {
            this.gameRunning = true;
            this.gameActive = false;
            this.sequence = [];
            this.playerSequence = [];
            this.level = 1;
            this.playNextRound();
        }
    }

    playNextRound() {
        this.playerSequence = [];
        this.addToSequence();
        this.playSequence();
    }

    addToSequence() {
        this.sequence.push(Math.floor(Math.random() * 4));
        document.getElementById('sequenceLength').textContent = this.sequence.length;
        document.getElementById('memoryLevel').textContent = this.level;
    }

    playSequence() {
        this.gameActive = false;
        let delay = 500;

        this.sequence.forEach((index, i) => {
            setTimeout(() => {
                this.lightUp(index);
            }, delay + i * 600);
        });

        setTimeout(() => {
            this.gameActive = true;
        }, delay + this.sequence.length * 600);
    }

    lightUp(index) {
        const boxes = this.container.querySelectorAll('.memory-box');
        boxes[index].style.opacity = '0.5';
        setTimeout(() => {
            boxes[index].style.opacity = '1';
        }, 300);
    }

    handleBoxClick(index, element) {
        if (!this.gameActive) return;

        this.lightUp(index);
        this.playerSequence.push(index);

        if (this.playerSequence[this.playerSequence.length - 1] !== this.sequence[this.playerSequence.length - 1]) {
            this.gameOver();
            return;
        }

        if (this.playerSequence.length === this.sequence.length) {
            this.level++;
            setTimeout(() => this.playNextRound(), 1000);
        }
    }

    gameOver() {
        this.gameRunning = false;
        this.gameActive = false;
        document.getElementById('memoryMessage').textContent = `Game Over! Level Reached: ${this.level}`;
    }

    restart() {
        this.sequence = [];
        this.playerSequence = [];
        this.level = 1;
        this.gameRunning = false;
        this.gameActive = false;
        document.getElementById('memoryLevel').textContent = '1';
        document.getElementById('sequenceLength').textContent = '0';
        document.getElementById('memoryMessage').textContent = 'Watch the pattern...';
    }
}

// ============================================
// INITIALIZATION
// ============================================

let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new NeonplayApp();
});
