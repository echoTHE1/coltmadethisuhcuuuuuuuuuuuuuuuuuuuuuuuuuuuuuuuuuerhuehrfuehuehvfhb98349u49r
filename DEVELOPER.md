# 👨‍💻 NEONPLAY Developer Guide

Advanced customization and extension guide for developers.

## 📑 Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Customizing Colors](#customizing-colors)
3. [Adding New Games](#adding-new-games)
4. [Extending Animations](#extending-animations)
5. [Performance Tuning](#performance-tuning)
6. [Code Structure](#code-structure)

---

## Architecture Overview

### Project Structure

```
neonplay/
├── index.html       # UI structure, semantic HTML
├── styles.css       # All styling, animations, responsive design
├── script.js        # Game logic, particle system, interactions
├── README.md        # Project overview
├── FEATURES.md      # User guide
├── DEPLOYMENT.md    # Deployment instructions
└── DEVELOPER.md     # This file
```

### Design Patterns Used

1. **Object-Oriented JavaScript**
   - `ParticleSystem` class - Manages particles
   - `NeonplayApp` class - Main application controller
   - Game classes: `SpaceDodgeGame`, `ClickerGame`, `ReactionGame`, `MemoryGame`

2. **Event-Driven Architecture**
   - DOM events for user interactions
   - Canvas events for game input
   - Custom game events

3. **CSS-in-JS** (through CSS variables)
   - Root variables for colors, transitions
   - Keyframe animations for effects
   - Responsive design with media queries

---

## Customizing Colors

### Change Neon Theme

Edit CSS variables at top of `styles.css`:

```css
:root {
    /* Primary color - main accent (cyan) */
    --primary-neon: #00f0ff;
    
    /* Secondary color - secondary accent (magenta) */
    --secondary-neon: #ff006e;
    
    /* Tertiary color - alternative accent (green) */
    --tertiary-neon: #0aff00;
    
    /* Accent color - highlights (yellow) */
    --accent-neon: #ffbe0b;
    
    /* Backgrounds */
    --dark-bg: #0a0a0a;
    --darker-bg: #050505;
    
    /* Text colors */
    --text-light: #ffffff;
    --text-dim: #aaaaaa;
    
    /* Effects strength */
    --glow-strength: 0.8;
    --transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
```

### Popular Color Schemes

**Purple & Blue Cyberpunk**
```css
--primary-neon: #0099ff;
--secondary-neon: #9900ff;
--tertiary-neon: #00ffff;
--accent-neon: #ff00ff;
```

**Green Matrix**
```css
--primary-neon: #00ff00;
--secondary-neon: #00cc00;
--tertiary-neon: #00ff33;
--accent-neon: #ffff00;
```

**Red & Orange Fire**
```css
--primary-neon: #ff0000;
--secondary-neon: #ff6600;
--tertiary-neon: #ffcc00;
--accent-neon: #ff00cc;
```

### Update Text Shadows

When changing colors, update glow effects:

```css
.logo-text {
    text-shadow: 0 0 10px var(--primary-neon), 
                 0 0 20px var(--primary-neon);
}

.btn-primary:hover {
    box-shadow: 0 0 20px var(--primary-neon), 
                inset 0 0 20px rgba(0, 240, 255, 0.2);
}
```

---

## Adding New Games

### Step 1: Create Game Card in HTML

Add to `index.html` in `.games-grid`:

```html
<div class="game-card" data-game="my-game">
    <div class="game-card-inner">
        <div class="game-card-front">
            <div class="game-icon">🎮</div>
            <h3 class="game-title">My New Game</h3>
            <p class="game-description">Game description here</p>
            <div class="card-glow"></div>
        </div>
    </div>
    <button class="play-btn">PLAY</button>
</div>
```

### Step 2: Create Game HTML Template

Add method to `NeonplayApp` class in `script.js`:

```javascript
createMyNewGame() {
    return `
        <div class="game-wrapper my-game-wrapper">
            <div class="game-header">
                <h2>MY NEW GAME</h2>
                <div class="game-stats">
                    <div class="stat">Score: <span id="myScore">0</span></div>
                </div>
            </div>
            <!-- Game content here -->
            <div class="game-controls">
                <button id="myGameStart" class="game-btn">START</button>
                <button id="myGameReset" class="game-btn">RESET</button>
            </div>
        </div>
    `;
}
```

### Step 3: Create Game Class

Add a new game class in `script.js`:

```javascript
class MyNewGame {
    constructor(container) {
        this.container = container;
        this.score = 0;
        this.gameRunning = false;
        this.init();
    }

    init() {
        // Setup event listeners
        this.container.querySelector('#myGameStart')
            .addEventListener('click', () => this.start());
        this.container.querySelector('#myGameReset')
            .addEventListener('click', () => this.reset());
        
        this.updateDisplay();
    }

    start() {
        if (!this.gameRunning) {
            this.gameRunning = true;
            this.animate();
        }
    }

    animate() {
        // Update game state
        this.update();
        
        // Render game
        this.draw();
        
        // Continue animation
        if (this.gameRunning) {
            requestAnimationFrame(() => this.animate());
        }
    }

    update() {
        // Game logic here
    }

    draw() {
        // Render game state here
    }

    updateDisplay() {
        document.getElementById('myScore').textContent = this.score;
    }

    reset() {
        this.gameRunning = false;
        this.score = 0;
        this.updateDisplay();
    }
}
```

### Step 4: Register Game in Switch Statement

Update `initializeGame()` method:

```javascript
initializeGame(gameName, container) {
    switch(gameName) {
        // ... existing cases ...
        case 'my-game':
            this.currentGame = new MyNewGame(container);
            break;
    }
}
```

### Step 5: Add CSS Styling

Add to `styles.css`:

```css
.my-game-wrapper {
    /* Custom styling for your game */
    align-items: center;
    justify-content: center;
}

#myGameCanvas {
    width: 100%;
    height: 400px;
    background: linear-gradient(135deg, rgba(10, 10, 10, 1) 0%, rgba(40, 10, 40, 0.5) 100%);
    border: 2px solid var(--primary-neon);
    border-radius: 8px;
    margin-bottom: 20px;
}
```

### Example: Simple Tap Game

```javascript
class TapGame {
    constructor(container) {
        this.container = container;
        this.taps = 0;
        this.targetsClicked = 0;
        this.gameRunning = false;
        this.maxTime = 20; // seconds
        this.timeLeft = 0;
        this.init();
    }

    init() {
        this.container.querySelector('#tapStart').addEventListener('click', () => {
            if (!this.gameRunning) this.start();
        });
        this.updateDisplay();
    }

    start() {
        this.gameRunning = true;
        this.taps = 0;
        this.timeLeft = this.maxTime;
        this.spawnTarget();
        this.startTimer();
    }

    spawnTarget() {
        if (!this.gameRunning) return;
        
        const target = document.createElement('div');
        target.className = 'tap-target';
        target.textContent = this.taps + 1;
        
        target.addEventListener('click', () => {
            this.taps++;
            this.updateDisplay();
            target.remove();
            this.spawnTarget();
        });

        this.container.querySelector('.tap-area').appendChild(target);
    }

    startTimer() {
        const timer = setInterval(() => {
            this.timeLeft--;
            
            if (this.timeLeft <= 0) {
                clearInterval(timer);
                this.gameRunning = false;
            }
        }, 1000);
    }

    updateDisplay() {
        document.getElementById('tapCount').textContent = this.taps;
    }
}
```

---

## Extending Animations

### Add New Keyframe Animation

```css
@keyframes myCustomAnimation {
    0% {
        opacity: 0;
        transform: translateY(-50px) rotateX(90deg);
    }
    50% {
        opacity: 0.5;
        transform: translateY(-25px) rotateX(45deg);
    }
    100% {
        opacity: 1;
        transform: translateY(0) rotateX(0deg);
    }
}

/* Apply to element */
.my-element {
    animation: myCustomAnimation 0.6s ease-out;
}
```

### Stagger Animation (Multiple Elements)

```css
.items {
    display: flex;
    gap: 1rem;
}

.item {
    animation: slideIn 0.5s ease-out backwards;
}

.item:nth-child(1) { animation-delay: 0s; }
.item:nth-child(2) { animation-delay: 0.1s; }
.item:nth-child(3) { animation-delay: 0.2s; }
.item:nth-child(4) { animation-delay: 0.3s; }
```

### Modify Particle System

In `script.js`, customize `Particle` class:

```javascript
class Particle {
    constructor(x, y, canvas, burst = false) {
        this.x = x;
        this.y = y;
        this.canvas = canvas;
        
        if (burst) {
            // Customize burst particles
            this.vx = (Math.random() - 0.5) * 10; // Faster
            this.vy = (Math.random() - 0.5) * 10 - 2;
            this.size = Math.random() * 5 + 3; // Bigger
        } else {
            // Customize ambient particles
            this.vx = (Math.random() - 0.5) * 3; // Slower
            this.vy = (Math.random() - 0.5) * 3;
        }
        
        this.life = 1;
        this.maxLife = Math.random() * 300 + 200; // Longer life
    }
    
    // Rest of class...
}
```

---

## Performance Tuning

### Reduce Particle Count

In `script.js`, edit `ParticleSystem.init()`:

```javascript
init() {
    // Change from 50 to 25 particles
    for (let i = 0; i < 25; i++) {
        this.particles.push(new Particle(
            Math.random() * this.canvas.width,
            Math.random() * this.canvas.height,
            this.canvas
        ));
    }
    this.animate();
}
```

### Disable Certain Effects

Disable particle burst on click:
```javascript
// In ClickerGame click() method
click() {
    this.energy += this.perClick;
    
    // Comment out this line to disable particle burst
    // app.particles.addParticles(event.clientX, event.clientY, 10);
    
    this.updateDisplay();
}
```

### Optimize Canvas Rendering

```javascript
draw() {
    // Use lower refresh rate for animations
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw only visible elements
    // Implement viewport culling for large particle counts
}

animate() {
    // Limit to 30fps instead of 60fps on low-end devices
    this.frameCount = (this.frameCount || 0) + 1;
    if (this.frameCount % 2 === 0) return; // Skip every other frame
    
    this.update();
    this.draw();
    requestAnimationFrame(() => this.animate());
}
```

### Minify CSS and JavaScript

For production, minify files:

```bash
# Using online tools or build tools
npm install -g cssnano-cli terser

cssnano styles.css -o styles.min.css
terser script.js -o script.min.js
```

Then update HTML:
```html
<link rel="stylesheet" href="styles.min.css">
<script src="script.min.js"></script>
```

---

## Code Structure

### Main Application Flow

```
index.html (loads)
    ↓
script.js loads
    ↓
DOMContentLoaded event
    ↓
new NeonplayApp() → app initialization
    ↓
ParticleSystem setup
    ↓
Event listeners attached
    ↓
User interaction
    ↓
Game opens/starts
    ↓
Game class controls logic
    ↓
render/update cycle
```

### File Dependencies

```
index.html
├── styles.css (loaded via <link>)
└── script.js (loaded via <script>)

script.js
├── ParticleSystem class
├── Particle class
├── NeonplayApp class
└── Game classes:
    ├── SpaceDodgeGame
    ├── ClickerGame
    ├── ReactionGame
    └── MemoryGame
```

### Key Methods in NeonplayApp

```javascript
class NeonplayApp {
    init()                  // Initialize everything
    setupEventListeners()   // Attach event handlers
    setupScrollAnimations() // Setup IntersectionObserver
    setupSound()           // Audio setup
    openGame(gameName)     // Open game modal
    closeGame()            // Close modal
    initializeGame()       // Create game instance
}
```

---

## Debugging Tips

### Browser DevTools

```javascript
// Log particle system state
console.log(app.particles.particles.length);

// Check game status
console.log(app.currentGame);

// Monitor performance
console.time('gameLoop');
// ... code to test ...
console.timeEnd('gameLoop');
```

### Check Canvas State

```javascript
// Verify canvas context
console.log(this.ctx.canvas.width, this.ctx.canvas.height);

// Verify drawing operations
this.ctx.fillStyle = 'red';
this.ctx.fillRect(0, 0, 100, 100); // Should see red square
```

### Network Debugging

```
F12 → Network tab
- Check all files load correctly
- Verify response times
- Watch for 404 errors
```

---

## Common Customizations

### Change Game Modal Size

In `styles.css`:
```css
.modal-content {
    width: 85%;        /* Changed from 90% */
    max-width: 1000px; /* Changed from 900px */
    height: 85vh;      /* Changed from 90vh */
}
```

### Modify Button Styling

```css
.btn-primary {
    border-color: #0099ff;      /* New color */
    color: #0099ff;
    padding: 20px 50px;         /* Larger padding */
    border-radius: 15px;        /* More rounded */
    font-size: 1.1rem;          /* Bigger text */
}
```

### Adjust Hero Title Size

```css
.hero-title {
    font-size: 6rem;        /* Increased from 5rem */
    letter-spacing: 12px;   /* Increased from 8px */
}
```

---

## Browser Compatibility

### Tested On

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Required APIs

- CSS Transforms
- CSS Animations
- Canvas 2D Context
- LocalStorage
- IntersectionObserver
- EventListener
- RequestAnimationFrame

### For Older Browsers

Use polyfills or graceful degradation:
```javascript
// Check Canvas support
if (!HTMLCanvasElement) {
    console.warn('Canvas not supported');
    // Show fallback UI
}
```

---

## Resources & References

- [MDN CSS Animations](https://developer.mozilla.org/en-US/docs/Web/CSS/animation)
- [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [Web Performance](https://developer.mozilla.org/en-US/docs/Web/Performance)
- [CSS Transforms](https://developer.mozilla.org/en-US/docs/Web/CSS/transform)

---

**Happy coding! 🚀**
