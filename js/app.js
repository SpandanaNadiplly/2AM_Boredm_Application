/**
 * App Coordinator - Manages state, Hub tab navigation, XP points, and event dispatching.
 */

class App {
  constructor() {
    this.dopamine = parseInt(localStorage.getItem('bored_dopamine') || '120', 10);
    this.currentChallengeIndex = 0;
    this.currentFactIndex = 0;
    this.currentMicroTaskIndex = 0;

    this.init();
  }

  init() {
    this.updateDopamineDisplay();
    this.initSoundToggle();
    this.initHubTabs();
    this.initSettingsModal();

    // Initialize Subsystems
    this.initBackgroundParticles();
    this.initCreateHub();
    this.initLearnHub();
    this.initPlayHub();
    this.initWasteHub();
    this.initProductiveHub();
    this.initChatCompanion();
  }

  // --- DOPAMINE XP SYSTEM ---
  addDopamine(amount, reason = '') {
    this.dopamine += amount;
    localStorage.setItem('bored_dopamine', this.dopamine);
    this.updateDopamineDisplay();
    if (reason) {
      this.showToast(`⚡ +${amount} XP: ${reason}`);
    }
  }

  updateDopamineDisplay() {
    const el = document.getElementById('dopamine-val');
    if (el) {
      el.textContent = `${this.dopamine} XP`;
    }
  }

  showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // --- NAVIGATION & TABS ---
  initHubTabs() {
    const cards = document.querySelectorAll('.hub-card');
    const views = document.querySelectorAll('.view-section');

    cards.forEach(card => {
      card.addEventListener('click', () => {
        const targetTab = card.getAttribute('data-tab');

        cards.forEach(c => c.classList.remove('active'));
        views.forEach(v => v.classList.remove('active-view'));

        card.classList.add('active');
        const activeView = document.getElementById(`view-${targetTab}`);
        if (activeView) {
          activeView.classList.add('active-view');
        }

        if (window.soundEngine) window.soundEngine.playPop(520);
      });
    });
  }

  initSoundToggle() {
    const btn = document.getElementById('sound-toggle-btn');
    if (!btn) return;

    btn.addEventListener('click', () => {
      if (window.soundEngine) {
        const isMuted = window.soundEngine.toggleMute();
        btn.textContent = isMuted ? '🔇' : '🔊';
        btn.title = isMuted ? 'Unmute Sounds' : 'Mute Sounds';
      }
    });
  }

  initSettingsModal() {
    const modal = document.getElementById('settings-modal');
    const openBtn = document.getElementById('settings-btn');
    const closeBtn = document.getElementById('settings-close-btn');
    const saveBtn = document.getElementById('settings-save-btn');
    const apiKeyInput = document.getElementById('api-key-input');
    const providerSelect = document.getElementById('api-provider-select');

    if (openBtn && modal) {
      openBtn.addEventListener('click', () => {
        if (apiKeyInput) apiKeyInput.value = localStorage.getItem('bored_api_key') || '';
        if (providerSelect) providerSelect.value = localStorage.getItem('bored_api_provider') || 'gemini';
        modal.classList.add('open');
        if (window.soundEngine) window.soundEngine.playClick();
      });
    }

    if (closeBtn && modal) {
      closeBtn.addEventListener('click', () => {
        modal.classList.remove('open');
      });
    }

    if (saveBtn && modal) {
      saveBtn.addEventListener('click', () => {
        const key = apiKeyInput ? apiKeyInput.value.trim() : '';
        const provider = providerSelect ? providerSelect.value : 'gemini';
        localStorage.setItem('bored_api_key', key);
        localStorage.setItem('bored_api_provider', provider);
        modal.classList.remove('open');
        this.showToast('✅ AI Settings Saved Successfully!');
        if (window.soundEngine) window.soundEngine.playSuccess();
      });
    }
  }

  // --- BACKGROUND PARTICLES ---
  initBackgroundParticles() {
    if (window.BackgroundParticles) {
      this.bg = new window.BackgroundParticles('bg-canvas');
    }
  }

  // --- 🎨 1. CREATE HUB ---
  initCreateHub() {
    // Challenge Timer
    this.challengeTimer = new window.ChallengeTimer({
      duration: 15 * 60,
      displayEl: document.getElementById('challenge-timer-display'),
      progressRing: document.getElementById('challenge-progress-ring')
    });

    const startBtn = document.getElementById('btn-challenge-start');
    const resetBtn = document.getElementById('btn-challenge-reset');
    const newChallengeBtn = document.getElementById('btn-new-challenge');

    if (startBtn) {
      startBtn.addEventListener('click', () => {
        if (this.challengeTimer.isRunning) {
          this.challengeTimer.pause();
          startBtn.textContent = '▶ RESUME TIMER';
        } else {
          this.challengeTimer.start();
          startBtn.textContent = '⏸ PAUSE TIMER';
        }
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.challengeTimer.stop();
        if (startBtn) startBtn.textContent = '▶ START TIMER';
        if (window.soundEngine) window.soundEngine.playClick();
      });
    }

    if (newChallengeBtn) {
      newChallengeBtn.addEventListener('click', () => this.nextChallenge());
    }

    // Drawing Canvas
    if (window.DrawingCanvas) {
      this.drawingCanvas = new window.DrawingCanvas('sketch-canvas');

      // Palette clicks
      const dots = document.querySelectorAll('.palette .color-dot');
      dots.forEach(dot => {
        dot.addEventListener('click', () => {
          dots.forEach(d => d.classList.remove('active'));
          dot.classList.add('active');
          const color = dot.getAttribute('data-color');
          this.drawingCanvas.setColor(color);
          if (window.soundEngine) window.soundEngine.playPop(600);
        });
      });

      // Canvas actions
      const undoBtn = document.getElementById('btn-canvas-undo');
      const clearBtn = document.getElementById('btn-canvas-clear');
      const downloadBtn = document.getElementById('btn-canvas-download');

      if (undoBtn) undoBtn.addEventListener('click', () => this.drawingCanvas.undo());
      if (clearBtn) clearBtn.addEventListener('click', () => this.drawingCanvas.clear());
      if (downloadBtn) downloadBtn.addEventListener('click', () => {
        this.drawingCanvas.downloadArtwork();
        this.addDopamine(40, 'Created & Saved Artwork! 🎨');
      });
    }

    this.renderChallenge(0);
  }

  renderChallenge(index) {
    const list = window.BORED_DATA ? window.BORED_DATA.challenges : [];
    if (!list.length) return;
    this.currentChallengeIndex = (index + list.length) % list.length;
    const c = list[this.currentChallengeIndex];

    const catBadge = document.getElementById('create-category-badge');
    const catEl = document.getElementById('challenge-category');
    const promptEl = document.getElementById('challenge-prompt');
    const tipEl = document.getElementById('challenge-tip');

    if (catBadge) catBadge.textContent = c.category.toUpperCase();
    if (catEl) catEl.textContent = `${c.category.toUpperCase()} CHALLENGE`;
    if (promptEl) promptEl.textContent = c.prompt;
    if (tipEl) tipEl.textContent = `Tip: ${c.tip}`;

    if (this.challengeTimer) {
      this.challengeTimer.setDuration(c.timeMinutes || 15);
      const startBtn = document.getElementById('btn-challenge-start');
      if (startBtn) startBtn.textContent = '▶ START TIMER';
    }
  }

  nextChallenge() {
    this.renderChallenge(this.currentChallengeIndex + 1);
    if (window.soundEngine) window.soundEngine.playPop(580);
  }

  // --- 🧠 2. LEARN HUB ---
  initLearnHub() {
    const nextBtn = document.getElementById('btn-next-fact');
    const readBtn = document.getElementById('btn-read-fact');
    const chatBtn = document.getElementById('btn-discuss-fact');

    if (nextBtn) nextBtn.addEventListener('click', () => this.nextFact());
    if (readBtn) readBtn.addEventListener('click', () => this.readFactAloud());
    if (chatBtn) chatBtn.addEventListener('click', () => this.discussFactInChat());

    this.renderFact(0);
  }

  renderFact(index) {
    const list = window.BORED_DATA ? window.BORED_DATA.facts : [];
    if (!list.length) return;
    this.currentFactIndex = (index + list.length) % list.length;
    const f = list[this.currentFactIndex];

    const badge = document.getElementById('learn-category-badge');
    const catEl = document.getElementById('learn-category');
    const titleEl = document.getElementById('learn-title');
    const summaryEl = document.getElementById('learn-summary');
    const detailsEl = document.getElementById('learn-details');
    const questionEl = document.getElementById('learn-question');

    if (badge) badge.textContent = f.category.toUpperCase();
    if (catEl) catEl.textContent = f.category.toUpperCase();
    if (titleEl) titleEl.textContent = f.title;
    if (summaryEl) summaryEl.textContent = f.summary;
    if (detailsEl) detailsEl.textContent = f.details;
    if (questionEl) questionEl.textContent = `💭 ${f.deepQuestion}`;
  }

  nextFact() {
    this.renderFact(this.currentFactIndex + 1);
    this.addDopamine(15, 'Explored a New Fact! 🧠');
    if (window.soundEngine) window.soundEngine.playPop(620);
  }

  readFactAloud() {
    const list = window.BORED_DATA ? window.BORED_DATA.facts : [];
    const f = list[this.currentFactIndex];
    if (!f || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    const text = `${f.title}. ${f.summary}. ${f.details}`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    window.speechSynthesis.speak(utterance);
    if (window.soundEngine) window.soundEngine.playClick();
  }

  discussFactInChat() {
    const list = window.BORED_DATA ? window.BORED_DATA.facts : [];
    const f = list[this.currentFactIndex];
    if (!f || !this.bot) return;

    this.bot.toggleWidget(true);
    this.bot.sendMessage(`Tell me more about: "${f.title}"! ${f.deepQuestion}`);
  }

  // --- 🎮 3. PLAY HUB ---
  initPlayHub() {
    // Subtab switching
    const subtabs = document.querySelectorAll('.subtab-btn');
    const panels = document.querySelectorAll('.game-panel');

    subtabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const gameId = tab.getAttribute('data-game');
        subtabs.forEach(t => t.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active-game'));

        tab.classList.add('active');
        const activePanel = document.getElementById(`game-${gameId}`);
        if (activePanel) activePanel.classList.add('active-game');

        if (window.soundEngine) window.soundEngine.playClick();
      });
    });

    // Games
    if (window.EmojiGame) this.emojiGame = new window.EmojiGame();
    if (window.SpeedTyperGame) this.typerGame = new window.SpeedTyperGame('typer-canvas');
    if (window.ReflexTester) this.reflexTester = new window.ReflexTester();
  }

  // --- 💀 4. WASTE TIME HUB ---
  initWasteHub() {
    if (window.BubbleWrap) this.bubbleWrap = new window.BubbleWrap();
    if (window.ExistentialButton) this.existentialButton = new window.ExistentialButton();
    if (window.PetRock) this.petRock = new window.PetRock();
  }

  // --- 🚀 5. BE PRODUCTIVE HUB ---
  initProductiveHub() {
    this.focusTimer = new window.FocusTimer();

    const startBtn = document.getElementById('btn-focus-start');
    const pauseBtn = document.getElementById('btn-focus-pause');
    const resetBtn = document.getElementById('btn-focus-reset');
    const ambientSelect = document.getElementById('focus-ambient-select');

    if (startBtn) {
      startBtn.addEventListener('click', () => {
        const ambient = ambientSelect ? ambientSelect.value : 'rain';
        this.focusTimer.ambientType = ambient;
        this.focusTimer.start();
      });
    }

    if (pauseBtn) pauseBtn.addEventListener('click', () => this.focusTimer.pause());
    if (resetBtn) resetBtn.addEventListener('click', () => this.focusTimer.stop());

    // Micro-Task Roulette
    const completeBtn = document.getElementById('btn-micro-complete');
    const spinBtn = document.getElementById('btn-micro-spin');

    if (completeBtn) {
      completeBtn.addEventListener('click', () => {
        this.addDopamine(30, 'Completed Micro Task! 🚀');
        if (window.soundEngine) window.soundEngine.playVictory();
        this.spinMicroTask();
      });
    }

    if (spinBtn) {
      spinBtn.addEventListener('click', () => this.spinMicroTask());
    }

    this.renderMicroTask(0);
  }

  renderMicroTask(index) {
    const list = window.BORED_DATA ? window.BORED_DATA.microTasks : [];
    if (!list.length) return;
    this.currentMicroTaskIndex = (index + list.length) % list.length;
    const t = list[this.currentMicroTaskIndex];

    const titleEl = document.getElementById('micro-task-title');
    const descEl = document.getElementById('micro-task-desc');

    if (titleEl) titleEl.textContent = t.title;
    if (descEl) descEl.textContent = t.desc;
  }

  spinMicroTask() {
    this.renderMicroTask(this.currentMicroTaskIndex + 1);
    if (window.soundEngine) window.soundEngine.playPop(480);
  }

  // --- 🤖 AI CHAT COMPANION ---
  initChatCompanion() {
    if (window.BoredBot) {
      this.bot = new window.BoredBot();
    }
  }
}

// Instantiate on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
});
