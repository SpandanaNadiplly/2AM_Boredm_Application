/**
 * Games Engine - Mini-games, time-wasters, and interactive puzzles.
 */

// --- 1. EMOJI RIDDLE GAME ---
class EmojiGame {
  constructor() {
    this.riddles = window.BORED_DATA ? window.BORED_DATA.emojiRiddles : [];
    this.currentIndex = 0;
    this.streak = 0;
    this.revealed = false;

    this.emojisEl = document.getElementById('emoji-display');
    this.categoryEl = document.getElementById('emoji-category');
    this.hintEl = document.getElementById('emoji-hint');
    this.answerEl = document.getElementById('emoji-answer');
    this.inputEl = document.getElementById('emoji-input');
    this.streakEl = document.getElementById('emoji-streak');
    this.btnReveal = document.getElementById('btn-emoji-reveal');
    this.btnHint = document.getElementById('btn-emoji-hint');
    this.btnNext = document.getElementById('btn-emoji-next');
    this.btnSubmit = document.getElementById('btn-emoji-submit');

    this.init();
  }

  init() {
    this.loadRiddle(0);
    if (this.btnReveal) this.btnReveal.addEventListener('click', () => this.revealAnswer());
    if (this.btnHint) this.btnHint.addEventListener('click', () => this.showHint());
    if (this.btnNext) this.btnNext.addEventListener('click', () => this.nextRiddle());
    if (this.btnSubmit) this.btnSubmit.addEventListener('click', () => this.checkAnswer());
    if (this.inputEl) {
      this.inputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') this.checkAnswer();
      });
    }
  }

  loadRiddle(index) {
    if (!this.riddles.length) return;
    this.currentIndex = (index + this.riddles.length) % this.riddles.length;
    const item = this.riddles[this.currentIndex];

    this.revealed = false;
    if (this.emojisEl) this.emojisEl.textContent = item.emojis;
    if (this.categoryEl) this.categoryEl.textContent = `Category: ${item.category}`;
    if (this.hintEl) {
      this.hintEl.textContent = '';
      this.hintEl.classList.add('hidden');
    }
    if (this.answerEl) {
      this.answerEl.textContent = '';
      this.answerEl.classList.add('hidden');
    }
    if (this.inputEl) {
      this.inputEl.value = '';
      this.inputEl.classList.remove('input-success', 'input-error');
    }
  }

  showHint() {
    const item = this.riddles[this.currentIndex];
    if (this.hintEl) {
      this.hintEl.textContent = `💡 Hint: ${item.hint}`;
      this.hintEl.classList.remove('hidden');
      if (window.soundEngine) window.soundEngine.playPop(520);
    }
  }

  revealAnswer() {
    const item = this.riddles[this.currentIndex];
    this.revealed = true;
    if (this.answerEl) {
      this.answerEl.textContent = `🎬 Answer: ${item.answer}`;
      this.answerEl.classList.remove('hidden');
      if (window.soundEngine) window.soundEngine.playTone(400, 0.15);
    }
  }

  checkAnswer() {
    if (!this.inputEl) return;
    const userGuess = this.inputEl.value.trim().toLowerCase();
    const item = this.riddles[this.currentIndex];
    const correct = item.answer.toLowerCase();

    // Check similarity or match
    if (userGuess && (userGuess === correct || correct.includes(userGuess) && userGuess.length > 3)) {
      this.streak++;
      if (this.streakEl) this.streakEl.textContent = this.streak;
      if (this.answerEl) {
        this.answerEl.textContent = `🎉 Correct! It's "${item.answer}"!`;
        this.answerEl.classList.remove('hidden');
      }
      this.inputEl.classList.add('input-success');
      if (window.soundEngine) window.soundEngine.playSuccess();
      if (window.app) window.app.addDopamine(25, `Solved Emoji Riddle: +25 XP`);

      setTimeout(() => this.nextRiddle(), 1400);
    } else {
      this.streak = 0;
      if (this.streakEl) this.streakEl.textContent = this.streak;
      this.inputEl.classList.add('input-error');
      if (window.soundEngine) window.soundEngine.playError();
      setTimeout(() => {
        if (this.inputEl) this.inputEl.classList.remove('input-error');
      }, 800);
    }
  }

  nextRiddle() {
    this.loadRiddle(this.currentIndex + 1);
    if (window.soundEngine) window.soundEngine.playClick();
  }
}

// --- 2. SPEED TYPER / FALLING METEOR GAME ---
class SpeedTyperGame {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.wordsList = [
      'laser', 'cyber', 'matrix', 'boredom', 'rocket', 'galaxy', 'quantum', 'arcade',
      'plasma', 'neon', 'coffee', 'dopamine', 'energy', 'future', 'gravity', 'hyper',
      'shadow', 'portal', 'cosmic', 'super', 'stellar', 'velocity', 'synapse', 'ninja',
      'pixel', 'turbo', 'glitch', 'chrono', 'vortex', 'techno', 'dynamo', 'phoenix'
    ];
    this.activeWords = [];
    this.score = 0;
    this.lives = 3;
    this.isRunning = false;
    this.spawnTimer = null;
    this.inputEl = document.getElementById('typer-input');
    this.scoreEl = document.getElementById('typer-score');
    this.livesEl = document.getElementById('typer-lives');
    this.startBtn = document.getElementById('typer-start-btn');
    this.particles = [];

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
    if (this.startBtn) this.startBtn.addEventListener('click', () => this.start());
    if (this.inputEl) {
      this.inputEl.addEventListener('input', (e) => this.handleTyping(e));
    }
  }

  resize() {
    const parent = this.canvas.parentElement;
    if (parent) {
      this.canvas.width = parent.clientWidth || 550;
      this.canvas.height = 320;
    }
  }

  start() {
    this.score = 0;
    this.lives = 3;
    this.activeWords = [];
    this.particles = [];
    this.isRunning = true;
    if (this.scoreEl) this.scoreEl.textContent = this.score;
    if (this.livesEl) this.livesEl.textContent = '❤️'.repeat(this.lives);
    if (this.startBtn) this.startBtn.textContent = 'Restart Game';
    if (this.inputEl) {
      this.inputEl.value = '';
      this.inputEl.focus();
    }

    if (window.soundEngine) window.soundEngine.playTone(600, 0.2, 'sawtooth');
    this.spawnWord();
    this.gameLoop();
  }

  spawnWord() {
    if (!this.isRunning) return;
    const randomWord = this.wordsList[Math.floor(Math.random() * this.wordsList.length)];
    const x = Math.random() * (this.canvas.width - 120) + 60;
    const speed = 0.8 + Math.random() * 0.7 + (this.score * 0.05);

    this.activeWords.push({
      text: randomWord,
      x: x,
      y: 20,
      speed: speed,
      color: ['#06b6d4', '#a855f7', '#ec4899', '#10b981', '#f59e0b'][Math.floor(Math.random() * 5)]
    });

    const nextInterval = Math.max(900, 2400 - this.score * 40);
    this.spawnTimer = setTimeout(() => this.spawnWord(), nextInterval);
  }

  handleTyping(e) {
    if (!this.isRunning) return;
    const typed = this.inputEl.value.trim().toLowerCase();
    const matchIndex = this.activeWords.findIndex(w => w.text.toLowerCase() === typed);

    if (matchIndex !== -1) {
      const word = this.activeWords[matchIndex];
      this.createExplosion(word.x, word.y, word.color);
      this.activeWords.splice(matchIndex, 1);
      this.score += 10;
      if (this.scoreEl) this.scoreEl.textContent = this.score;
      this.inputEl.value = '';

      if (window.soundEngine) window.soundEngine.playArcadeLaser();
      if (window.app) window.app.addDopamine(5, '+5 Typer XP');
    }
  }

  createExplosion(x, y, color) {
    for (let i = 0; i < 16; i++) {
      this.particles.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 6,
        vy: (Math.random() - 0.5) * 6,
        life: 1,
        color: color
      });
    }
  }

  gameOver() {
    this.isRunning = false;
    clearTimeout(this.spawnTimer);
    if (window.soundEngine) window.soundEngine.playBoom();
    if (this.startBtn) this.startBtn.textContent = 'Play Again';
    if (window.app) window.app.addDopamine(this.score, `Game Over! Scored ${this.score} pts`);
  }

  gameLoop() {
    if (!this.isRunning && this.particles.length === 0) return;

    this.ctx.fillStyle = 'rgba(15, 23, 42, 0.4)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Update and draw words
    for (let i = this.activeWords.length - 1; i >= 0; i--) {
      const w = this.activeWords[i];
      w.y += w.speed;

      this.ctx.font = 'bold 16px "Space Grotesk", sans-serif';
      this.ctx.fillStyle = w.color;
      this.ctx.shadowBlur = 10;
      this.ctx.shadowColor = w.color;
      this.ctx.fillText(w.text, w.x - (this.ctx.measureText(w.text).width / 2), w.y);
      this.ctx.shadowBlur = 0;

      // Check bottom hit
      if (w.y > this.canvas.height - 10) {
        this.activeWords.splice(i, 1);
        this.lives--;
        if (this.livesEl) this.livesEl.textContent = '❤️'.repeat(Math.max(0, this.lives));
        if (window.soundEngine) window.soundEngine.playError();

        if (this.lives <= 0) {
          this.gameOver();
          break;
        }
      }
    }

    // Update particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.04;

      if (p.life <= 0) {
        this.particles.splice(i, 1);
      } else {
        this.ctx.fillStyle = p.color;
        this.ctx.globalAlpha = p.life;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.globalAlpha = 1;
      }
    }

    // Game over screen overlay
    if (!this.isRunning && this.lives <= 0) {
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.font = 'bold 24px "Space Grotesk", sans-serif';
      this.ctx.fillStyle = '#ec4899';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('GAME OVER', this.canvas.width / 2, this.canvas.height / 2 - 10);
      this.ctx.font = '16px monospace';
      this.ctx.fillStyle = '#f8fafc';
      this.ctx.fillText(`Final Score: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2 + 25);
      this.ctx.textAlign = 'start';
    }

    if (this.isRunning) {
      requestAnimationFrame(() => this.gameLoop());
    }
  }
}

// --- 3. CYBER REFLEX TESTER ---
class ReflexTester {
  constructor() {
    this.box = document.getElementById('reflex-box');
    this.textEl = document.getElementById('reflex-text');
    this.resultEl = document.getElementById('reflex-result');
    this.state = 'idle'; // 'idle', 'waiting', 'ready', 'clicked'
    this.startTime = 0;
    this.timeoutId = null;

    if (this.box) {
      this.box.addEventListener('click', () => this.handleClick());
    }
  }

  handleClick() {
    if (this.state === 'idle' || this.state === 'clicked') {
      // Start waiting
      this.state = 'waiting';
      this.box.className = 'reflex-box reflex-waiting';
      this.textEl.textContent = 'Wait for GREEN...';
      this.resultEl.textContent = '';
      if (window.soundEngine) window.soundEngine.playPop(300);

      const delay = Math.random() * 2500 + 1500; // 1.5s to 4s
      this.timeoutId = setTimeout(() => {
        this.state = 'ready';
        this.box.className = 'reflex-box reflex-ready';
        this.textEl.textContent = '⚡ CLICK NOW!';
        this.startTime = Date.now();
        if (window.soundEngine) window.soundEngine.playTone(880, 0.1, 'triangle');
      }, delay);
    } else if (this.state === 'waiting') {
      // Clicked too early
      clearTimeout(this.timeoutId);
      this.state = 'clicked';
      this.box.className = 'reflex-box reflex-early';
      this.textEl.textContent = 'Too early! 🚨';
      this.resultEl.textContent = 'Wait for green next time. Click to try again.';
      if (window.soundEngine) window.soundEngine.playError();
    } else if (this.state === 'ready') {
      // Success
      const diff = Date.now() - this.startTime;
      this.state = 'clicked';
      this.box.className = 'reflex-box reflex-success';
      this.textEl.textContent = `${diff} ms`;

      let rating = '⚡ Superhuman!';
      if (diff < 200) rating = '👑 Godlike Reflexes!';
      else if (diff < 280) rating = '⚡ Fast & Sharp!';
      else if (diff < 380) rating = '👍 Average Human';
      else rating = '🐢 Sluggish Snail';

      this.resultEl.textContent = `${rating} (Click to try again)`;
      if (window.soundEngine) window.soundEngine.playVictory();
      if (window.app) window.app.addDopamine(20, `Reflex Test: ${diff}ms`);
    }
  }
}

// --- 4. INFINITE BUBBLE WRAP ---
class BubbleWrap {
  constructor() {
    this.grid = document.getElementById('bubble-grid');
    this.counterEl = document.getElementById('bubble-count');
    this.btnPopAll = document.getElementById('btn-bubble-pop-all');
    this.btnReset = document.getElementById('btn-bubble-reset');
    this.poppedCount = 0;
    this.totalBubbles = 48;

    this.init();
  }

  init() {
    this.render();
    if (this.btnPopAll) this.btnPopAll.addEventListener('click', () => this.popAll());
    if (this.btnReset) this.btnReset.addEventListener('click', () => this.render());
  }

  render() {
    if (!this.grid) return;
    this.grid.innerHTML = '';
    for (let i = 0; i < this.totalBubbles; i++) {
      const bubble = document.createElement('div');
      bubble.className = 'bubble-wrap-item';
      bubble.addEventListener('click', (e) => this.popBubble(bubble, e));
      this.grid.appendChild(bubble);
    }
  }

  popBubble(el, e) {
    if (el.classList.contains('popped')) return;
    el.classList.add('popped');
    this.poppedCount++;
    if (this.counterEl) this.counterEl.textContent = this.poppedCount;

    if (window.soundEngine) window.soundEngine.playBubble();
    if (window.app && this.poppedCount % 10 === 0) {
      window.app.addDopamine(10, 'Popped 10 Bubbles! 🫧');
    }
  }

  popAll() {
    const bubbles = this.grid.querySelectorAll('.bubble-wrap-item:not(.popped)');
    bubbles.forEach((b, i) => {
      setTimeout(() => {
        b.classList.add('popped');
        if (window.soundEngine) window.soundEngine.playBubble();
        this.poppedCount++;
        if (this.counterEl) this.counterEl.textContent = this.poppedCount;
      }, i * 25);
    });
    if (window.soundEngine) {
      setTimeout(() => window.soundEngine.playBoom(), bubbles.length * 25);
    }
    if (window.app) window.app.addDopamine(30, 'SUPER BOMB POP! 💣');
  }
}

// --- 5. THE FORBIDDEN EXISTENTIAL BUTTON ---
class ExistentialButton {
  constructor() {
    this.btn = document.getElementById('existential-btn');
    this.quoteEl = document.getElementById('existential-quote');
    this.countEl = document.getElementById('existential-clicks');
    this.quotes = window.BORED_DATA ? window.BORED_DATA.buttonQuotes : [];
    this.clicks = 0;

    if (this.btn) {
      this.btn.addEventListener('click', () => this.handleClick());
    }
  }

  handleClick() {
    this.clicks++;
    if (this.countEl) this.countEl.textContent = this.clicks;

    const quoteIndex = (this.clicks - 1) % this.quotes.length;
    const currentQuote = this.quotes[quoteIndex];
    if (this.quoteEl) {
      this.quoteEl.textContent = `"${currentQuote}"`;
      this.quoteEl.classList.add('pulse-quote');
      setTimeout(() => this.quoteEl.classList.remove('pulse-quote'), 300);
    }

    // Sound and vibration effects
    if (window.soundEngine) {
      const pitch = 300 + (this.clicks * 20) % 800;
      window.soundEngine.playTone(pitch, 0.1, 'sawtooth');
    }

    // Screen shake on multiple clicks
    if (this.clicks % 5 === 0) {
      document.body.classList.add('screen-shake');
      setTimeout(() => document.body.classList.remove('screen-shake'), 400);
      if (window.soundEngine) window.soundEngine.playBoom();
    }

    if (window.app) {
      window.app.addDopamine(5, `Defied Button Warning (${this.clicks} clicks)`);
    }
  }
}

// --- 6. VIRTUAL PET ROCK ---
class PetRock {
  constructor() {
    this.rockEl = document.getElementById('pet-rock-avatar');
    this.thoughtEl = document.getElementById('pet-rock-thought');
    this.moodEl = document.getElementById('pet-rock-mood');
    this.btnFeed = document.getElementById('btn-rock-feed');
    this.btnPet = document.getElementById('btn-rock-pet');
    this.btnGlasses = document.getElementById('btn-rock-glasses');
    this.thoughts = window.BORED_DATA ? window.BORED_DATA.petRockThoughts : [];

    this.hasGlasses = false;
    this.init();
  }

  init() {
    if (this.btnFeed) this.btnFeed.addEventListener('click', () => this.feed());
    if (this.btnPet) this.btnPet.addEventListener('click', () => this.pet());
    if (this.btnGlasses) this.btnGlasses.addEventListener('click', () => this.toggleGlasses());
    if (this.rockEl) this.rockEl.addEventListener('click', () => this.pet());
  }

  randomThought() {
    const t = this.thoughts[Math.floor(Math.random() * this.thoughts.length)];
    if (this.thoughtEl) this.thoughtEl.textContent = `"${t}"`;
  }

  pet() {
    if (this.rockEl) {
      this.rockEl.classList.add('rock-wobble');
      setTimeout(() => this.rockEl.classList.remove('rock-wobble'), 500);
    }
    if (this.moodEl) this.moodEl.textContent = 'Mood: Feeling Loved ❤️';
    this.randomThought();
    if (window.soundEngine) window.soundEngine.playPop(620);
    if (window.app) window.app.addDopamine(5, 'Pet the rock');
  }

  feed() {
    if (this.thoughtEl) this.thoughtEl.textContent = '"Rock consumed virtual pizza. It does not possess a digestive tract, but is pleased."';
    if (this.moodEl) this.moodEl.textContent = 'Mood: Stuffed & Sedentary 🍕';
    if (window.soundEngine) window.soundEngine.playTone(450, 0.2);
    if (window.app) window.app.addDopamine(10, 'Fed the rock');
  }

  toggleGlasses() {
    this.hasGlasses = !this.hasGlasses;
    const glasses = document.getElementById('rock-sunglasses');
    if (glasses) {
      glasses.style.display = this.hasGlasses ? 'block' : 'none';
    }
    if (this.moodEl) this.moodEl.textContent = this.hasGlasses ? 'Mood: 200% Cool 😎' : 'Mood: Solid 🪨';
    if (window.soundEngine) window.soundEngine.playSuccess();
  }
}

// Global initialization helper
window.EmojiGame = EmojiGame;
window.SpeedTyperGame = SpeedTyperGame;
window.ReflexTester = ReflexTester;
window.BubbleWrap = BubbleWrap;
window.ExistentialButton = ExistentialButton;
window.PetRock = PetRock;
