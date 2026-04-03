# ✨ NEONPLAY Features & Controls Guide

Complete documentation of all features, games, and controls in NEONPLAY.

## 🎮 Main Controls

### Navigation
- **Scroll** - Smooth navigation between sections
- **Click on nav links** - Jump to Home, Games, or About sections
- **Click logo** - Hover effect (feedback only)

### Audio
- **🔊 Button (top-right)** - Toggle background music on/off
- Sound requires user interaction (browser autoplay policy)

---

## 🌌 Home Section

### Hero Section Features

1. **Dynamic Background**
   - Real-time particle system
   - Particles react to mouse movement
   - Auto-spawning ambient particles
   - Physics-based movement and gravity

2. **Animated Title**
   - Staggered letter entrance animation
   - Glowing neon text effect
   - Color alternation (cyan/pink)
   - Smooth rotation and fade-in

3. **Interactive Buttons**
   - Glow effect on hover
   - Scale animation
   - Shimmer transition
   - Click to scroll to sections

4. **Scroll Indicator**
   - Bouncing animation
   - Guides user to scroll down
   - Disappears when scrolling

### Visual Effects

- ✨ Particle trails following mouse
- 🌈 Gradient background with neon colors
- 📉 Grid pattern background
- 🎯 Glowing text with shadow effects

---

## 🎪 Games Section

### Game Card Features

Each game card includes:

1. **Visual Design**
   - Glowing neon border
   - Semi-transparent background gradient
   - 3D perspective on hover (tilts)
   - Shadow depth effect

2. **Hover Effects**
   - Card tilts in 3D space
   - Border color change
   - Increased glow intensity
   - Play button slides up from bottom

3. **Entrance Animation**
   - Staggered slide-in from bottom
   - Fade and scale effects
   - Smooth easing function

### Opening Games

**Click "PLAY" button to:**
1. Open full-screen modal
2. Initialize game
3. Display game UI with stats
4. Start game (when ready)

**Close modal:**
- Click X button (top-right)
- Click outside modal area
- Or upon game over

---

## 🚀 Game 1: Space Dodge

### Objective
Dodge incoming asteroids for as long as possible without losing all 3 lives.

### Controls

**Mouse:**
- Move horizontally to dodge asteroids
- Position yourself safely

**Keyboard:**
- `A` / `D` - Move left/right (if implemented)
- `SPACE` - Hold for pause/unpause

**Buttons:**
- **START GAME** - Begin new game
- **PAUSE** - Pause/resume gameplay
- **RESTART** - Reset and start over

### Gameplay Features

1. **Progressive Difficulty**
   - Level increases as score grows
   - Asteroid speed increases
   - Spawn rate increases
   - Time between waves decreases

2. **Scoring System**
   - +10 points per dodged asteroid
   - -1 life per collision
   - Game over when lives reach 0

3. **UI Elements**
   - Real-time score display
   - Lives counter (starts at 3)
   - Current level indicator
   - Game state (running/paused/over)

4. **Visual Design**
   - Player: Cyan glowing square
   - Asteroids: Pink glowing circles
   - Grid background for depth
   - Smooth canvas rendering

### Tips

- Stay centered for maximum reaction time
- Watch for patterns in asteroid spawning
- Plan movements ahead
- Higher levels require patience and precision

---

## ⚡ Game 2: Energy Clicker

### Objective
Click the energy orb to generate energy, then use it to purchase upgrades that increase your power.

### Controls

**Mouse:**
- **Click on energy orb** - Gain 1 energy per click
- **Click upgrade button** - Purchase if you have enough energy

**Buttons:**
- **RESET GAME** - Clear all progress and start fresh

### Gameplay Features

1. **Energy System**
   - Click to accumulate energy
   - Display shows current energy total
   - Energy required for each upgrade

2. **Upgrades Available**
   - **Double Click (Cost: 10)** - Multiply per-click by 2x
   - **Triple Click (Cost: 50)** - Multiply per-click by 3x
   - **Power Surge (Cost: 200)** - Multiply per-click by 5x

3. **Progression**
   - Upgrades stack multiplicatively
   - Example: With all upgrades: 1 × 2 × 3 × 5 = 30 per click
   - Unlocked upgrades appear grayed out
   - Disabled upgrades cannot be purchased twice

4. **Visual Design**
   - Cyan glowing circular click box
   - Dynamic text updates
   - Upgrade buttons with glow effect
   - Particle burst on each click

### Tips

- Plan upgrade order to minimize cost
- Later upgrades multiply earlier gains
- Reach 10 energy first for Double Click
- Then aim for 50 for Triple Click

---

## ⚙️ Game 3: Reaction Rush

### Objective
Click as many targets as possible within 30 seconds to rack up a high score.

### Controls

**Mouse:**
- **Click on targets** - Score 1 point per click
- Targets appear at random positions

**Buttons:**
- **START GAME** - Begin the 30-second challenge
- **RESTART** - Reset for another attempt

### Gameplay Features

1. **Timed Challenge**
   - 30-second countdown
   - Real-time timer display
   - Game ends when time expires

2. **Scoring**
   - 1 point per target clicked
   - Best score tracked with localStorage
   - Persists between browser sessions

3. **Targets**
   - Appear at random positions
   - Glow with green neon effect
   - Disappear after 1.5 seconds (hit or miss)
   - Spawn every ~300ms

4. **Visual Design**
   - Bright green circular targets
   - Smooth appearance animation
   - Hover scale effect
   - Game area with grid background

### Tips

- Focus on speed over accuracy
- Predict target positions
- Keep mouse ready
- Performance improves with practice

---

## 🧠 Game 4: Memory Matrix

### Objective
Watch and memorize sequences of colors, then reproduce them by clicking boxes in the correct order.

### Controls

**Mouse:**
- **Click on colored boxes** - Play the sequence back
- Watch colors light up
- Click in the same order

**Buttons:**
- **START GAME** - Begin with 1-color sequence
- **RESTART** - Reset and try again

### Gameplay Features

1. **Sequence Progression**
   - Starts with 1 color
   - Adds 1 new color each round
   - You must repeat the entire sequence
   - Each wrong click ends the game

2. **Four Colors**
   - **Top-Left (Cyan)** - #00f0ff
   - **Top-Right (Pink)** - #ff006e
   - **Bottom-Left (Green)** - #0aff00
   - **Bottom-Right (Yellow)** - #ffbe0b

3. **Difficulty Scaling**
   - Level 1: 1 color
   - Level 2: 2 colors
   - Level 3: 3 colors
   - And so on...

4. **Visual Design**
   - 2×2 grid of colored boxes
   - Boxes light up when played
   - Boxes highlight on hover
   - Semi-transparent active state

### Tips

- Repeat the pattern mentally
- Focus on rhythm and timing
- Don't rush when clicking back
- Higher levels require concentration

---

## 📊 About Section

### Features

1. **Project Description**
   - Overview of NEONPLAY
   - Technology stack highlights
   - Vision and mission

2. **Feature Cards**
   - **Stunning Visuals** - Neon graphics and animations
   - **Fast & Responsive** - Optimized performance
   - **Addictive Games** - Engaging gameplay

3. **Interactive Cards**
   - Hover animations
   - Border glow effects
   - Vertical translation on hover
   - Smooth transitions

---

## 🎨 Visual Effects & Animations

### Particle System

- **Count**: 50 ambient particles + burst effects
- **Physics**: Gravity, friction, velocity
- **Interaction**: Attracted to mouse within 100px radius
- **Colors**: Cyan, pink, green
- **Size**: 1-3px ambient, 2-5px burst

### CSS Animations

1. **Fade & Slide**
   - Elements slide in from bottom
   - Fade from transparent to opaque
   - Easing: `cubic-bezier(0.25, 0.46, 0.45, 0.94)`

2. **Glow Effects**
   - Text shadow for neon glow
   - Box shadow for border glow
   - Dynamic intensity on hover

3. **Scale Transforms**
   - Slight scale on hover (1.05-1.1x)
   - Bounce scale on click (0.95x)
   - Smooth transitions (0.3s)

4. **Color Transitions**
   - Smooth color changes
   - Gradient animations
   - Shadow color matching

### Loading Screen

- Animated spinner
- Pulsing text
- Auto-fades after 2 seconds
- Fade out animation

---

## 📱 Responsive Design

### Desktop (1024px+)
- Full-size layout
- All animations enabled
- Maximum particles
- Landscape orientation recommended

### Tablet (768px-1023px)
- Grid adapts to 2 columns
- Buttons resize appropriately
- Touch-friendly sizes
- Reduced particle count

### Mobile (< 768px)
- Single column layout
- Stacked navigation
- Full-screen modals
- Touch optimized buttons
- Reduced animations

---

## ⚙️ Performance Optimization

### Features

1. **Canvas Optimization**
   - RequestAnimationFrame for smooth 60fps
   - Particle pool system
   - Efficient collision detection

2. **CSS Optimization**
   - GPU-accelerated transforms
   - Will-change hints for animations
   - Optimized z-index stacking

3. **JavaScript Optimization**
   - Lazy game initialization
   - Event delegation
   - Efficient loops and conditions
   - localStorage for persistence

---

## 🔊 Audio System

### Background Music

- **Status**: Muted by default (browser autoplay policy)
- **Control**: Toggle button in top-right
- **Volume**: Set to 30% for comfort
- **Loop**: Continuous playback

### Sound Effects

- Click feedback (future enhancement)
- Game over sounds (future enhancement)
- Win celebration sounds (future enhancement)

---

## 💾 Data Persistence

### localStorage Keys

1. **Reaction Game Best Score**
   - Key: `reactionBest`
   - Stores highest score achieved
   - Survives browser restart

### Game Data

- Score data resets when page reloads
- Stats don't sync across devices
- Clear browser data to reset scores

---

## 🐛 Troubleshooting Features

### If Something Breaks

1. **Particles not showing**
   - Browser doesn't support Canvas
   - JavaScript disabled
   - Try different browser

2. **Games won't start**
   - Clear browser cache (Ctrl+Shift+Delete)
   - Hard refresh (Ctrl+Shift+R)
   - Check browser console (F12)

3. **Text looks wrong**
   - Font rendering issue
   - Browser compatibility
   - Try Chrome/Firefox

4. **Slow performance**
   - Reduce browser tabs
   - Close other applications
   - Update browser
   - Disable extensions

---

## 🎯 Quick Start Checklist

- [ ] View hero section animations
- [ ] Hover over game cards
- [ ] Open a game in modal
- [ ] Play Space Dodge (aim for 100+ points)
- [ ] Play Energy Clicker (unlock all upgrades)
- [ ] Play Reaction Rush (beat 20 clicks)
- [ ] Play Memory Matrix (reach level 5)
- [ ] Try on mobile (test responsiveness)
- [ ] Toggle sound on/off
- [ ] Check scroll animations

---

## 📞 Support

For issues or feature requests:
1. Check browser console (F12)
2. Try different browser
3. Read this guide thoroughly
4. Check GitHub Issues page

---

**Enjoy playing NEONPLAY! 🎮✨**
