/**
 * Timer Engine - Challenge Countdown, Pomodoro Sprints, and Progress Ring visualizer
 */

class ChallengeTimer {
  constructor(options = {}) {
    this.duration = options.duration || 15 * 60; // seconds
    this.remaining = this.duration;
    this.timerId = null;
    this.isRunning = false;
    this.displayEl = options.displayEl || document.getElementById('challenge-timer-display');
    this.progressRing = options.progressRing || document.getElementById('challenge-progress-ring');
    this.circumference = 2 * Math.PI * 45; // radius 45

    if (this.progressRing) {
      this.progressRing.style.strokeDasharray = `${this.circumference} ${this.circumference}`;
      this.progressRing.style.strokeDashoffset = '0';
    }

    this.onComplete = options.onComplete || null;
    this.updateDisplay();
  }

  setDuration(minutes) {
    this.stop();
    this.duration = minutes * 60;
    this.remaining = this.duration;
    this.updateDisplay();
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    if (window.soundEngine) window.soundEngine.playTone(550, 0.1);

    this.timerId = setInterval(() => {
      this.remaining--;
      this.updateDisplay();

      if (this.remaining <= 0) {
        this.stop();
        if (window.soundEngine) window.soundEngine.playVictory();
        if (this.onComplete) this.onComplete();
        if (window.app) window.app.addDopamine(50, 'Challenge Completed! 🎉');
      } else if (this.remaining <= 5 && this.remaining > 0) {
        if (window.soundEngine) window.soundEngine.playTone(700, 0.08);
      }
    }, 1000);
  }

  pause() {
    if (!this.isRunning) return;
    this.isRunning = false;
    clearInterval(this.timerId);
    this.timerId = null;
    if (window.soundEngine) window.soundEngine.playClick();
  }

  stop() {
    this.isRunning = false;
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    this.remaining = this.duration;
    this.updateDisplay();
  }

  toggle() {
    if (this.isRunning) {
      this.pause();
    } else {
      this.start();
    }
  }

  updateDisplay() {
    const mins = Math.floor(this.remaining / 60);
    const secs = this.remaining % 60;
    const formatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    if (this.displayEl) {
      this.displayEl.textContent = formatted;
    }

    if (this.progressRing) {
      const progress = (this.duration - this.remaining) / this.duration;
      const offset = this.circumference * progress;
      this.progressRing.style.strokeDashoffset = offset;
    }
  }
}

// Focus Pomodoro Timer
class FocusTimer {
  constructor() {
    this.duration = 25 * 60;
    this.remaining = this.duration;
    this.isRunning = false;
    this.timerId = null;
    this.displayEl = document.getElementById('focus-timer-display');
    this.ambientType = 'rain';
  }

  setMode(minutes, ambient = 'rain') {
    this.stop();
    this.duration = minutes * 60;
    this.remaining = this.duration;
    this.ambientType = ambient;
    this.updateDisplay();
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    if (window.soundEngine) {
      window.soundEngine.playTone(600, 0.15);
      if (this.ambientType !== 'none') {
        window.soundEngine.playAmbient(this.ambientType);
      }
    }

    this.timerId = setInterval(() => {
      this.remaining--;
      this.updateDisplay();

      if (this.remaining <= 0) {
        this.stop();
        if (window.soundEngine) {
          window.soundEngine.stopAmbient();
          window.soundEngine.playVictory();
        }
        if (window.app) window.app.addDopamine(100, 'Focus Sprint Completed! 🚀');
        alert('🎉 Focus Sprint Finished! Stand up, stretch, and take a 5-minute break.');
      }
    }, 1000);
  }

  pause() {
    if (!this.isRunning) return;
    this.isRunning = false;
    clearInterval(this.timerId);
    this.timerId = null;
    if (window.soundEngine) {
      window.soundEngine.stopAmbient();
      window.soundEngine.playClick();
    }
  }

  stop() {
    this.isRunning = false;
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    if (window.soundEngine) {
      window.soundEngine.stopAmbient();
    }
    this.remaining = this.duration;
    this.updateDisplay();
  }

  updateDisplay() {
    const mins = Math.floor(this.remaining / 60);
    const secs = this.remaining % 60;
    const formatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    if (this.displayEl) {
      this.displayEl.textContent = formatted;
    }
  }
}

window.ChallengeTimer = ChallengeTimer;
window.FocusTimer = FocusTimer;
