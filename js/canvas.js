/**
 * Canvas Engine - Ambient background particle starfield & Interactive Creative Sketchpad
 */

// --- 1. AMBIENT BACKGROUND PARTICLES ---
class BackgroundParticles {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.numParticles = 55;
    this.mouse = { x: null, y: null, radius: 120 };

    this.resize();
    this.init();
    this.bindEvents();
    this.animate();
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  init() {
    this.particles = [];
    const colors = ['#a855f7', '#06b6d4', '#ec4899', '#3b82f6', '#10b981'];
    for (let i = 0; i < this.numParticles; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        radius: Math.random() * 2.2 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.5 + 0.2
      });
    }
  }

  bindEvents() {
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
    window.addEventListener('mouseleave', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      // Move
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = this.width;
      if (p.x > this.width) p.x = 0;
      if (p.y < 0) p.y = this.height;
      if (p.y > this.height) p.y = 0;

      // Mouse repulsion/interaction
      if (this.mouse.x !== null) {
        const dx = p.x - this.mouse.x;
        const dy = p.y - this.mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < this.mouse.radius) {
          const force = (this.mouse.radius - dist) / this.mouse.radius;
          p.x += (dx / dist) * force * 3;
          p.y += (dy / dist) * force * 3;
        }
      }

      // Draw particle
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = p.alpha;
      this.ctx.shadowBlur = 10;
      this.ctx.shadowColor = p.color;
      this.ctx.fill();

      // Connect near particles
      for (let j = i + 1; j < this.particles.length; j++) {
        const p2 = this.particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.strokeStyle = p.color;
          this.ctx.globalAlpha = (1 - dist / 100) * 0.18;
          this.ctx.lineWidth = 0.8;
          this.ctx.stroke();
        }
      }
    }

    this.ctx.globalAlpha = 1;
    this.ctx.shadowBlur = 0;
    requestAnimationFrame(() => this.animate());
  }
}

// --- 2. INTERACTIVE SKETCHPAD / LOGO DRAWING CANVAS ---
class DrawingCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.isDrawing = false;
    this.color = '#06b6d4';
    this.brushSize = 4;
    this.isEraser = false;
    this.isGlow = true;
    this.history = [];
    this.historyLimit = 20;

    this.initCanvas();
    this.bindDrawingEvents();
  }

  initCanvas() {
    const parent = this.canvas.parentElement;
    const rect = parent.getBoundingClientRect();
    this.canvas.width = rect.width || 600;
    this.canvas.height = 360;

    // Fill background dark slate
    this.ctx.fillStyle = '#0f172a';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.saveState();
  }

  saveState() {
    if (this.history.length >= this.historyLimit) {
      this.history.shift();
    }
    this.history.push(this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height));
  }

  undo() {
    if (this.history.length > 1) {
      this.history.pop();
      const previousState = this.history[this.history.length - 1];
      this.ctx.putImageData(previousState, 0, 0);
      if (window.soundEngine) window.soundEngine.playPop(350);
    }
  }

  clear() {
    this.ctx.fillStyle = '#0f172a';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.saveState();
    if (window.soundEngine) window.soundEngine.playBoom();
  }

  setColor(hex) {
    this.color = hex;
    this.isEraser = false;
  }

  setBrushSize(size) {
    this.brushSize = parseInt(size, 10) || 4;
  }

  toggleEraser(active) {
    this.isEraser = active;
  }

  toggleGlow(active) {
    this.isGlow = active;
  }

  getPos(e) {
    const rect = this.canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * (this.canvas.width / rect.width),
      y: (clientY - rect.top) * (this.canvas.height / rect.height)
    };
  }

  startDraw(e) {
    e.preventDefault();
    this.isDrawing = true;
    const pos = this.getPos(e);
    this.ctx.beginPath();
    this.ctx.moveTo(pos.x, pos.y);
  }

  draw(e) {
    if (!this.isDrawing) return;
    e.preventDefault();
    const pos = this.getPos(e);

    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.ctx.lineWidth = this.brushSize;

    if (this.isEraser) {
      this.ctx.strokeStyle = '#0f172a';
      this.ctx.shadowBlur = 0;
      this.ctx.lineWidth = this.brushSize * 2.5;
    } else {
      this.ctx.strokeStyle = this.color;
      if (this.isGlow) {
        this.ctx.shadowBlur = 12;
        this.ctx.shadowColor = this.color;
      } else {
        this.ctx.shadowBlur = 0;
      }
    }

    this.ctx.lineTo(pos.x, pos.y);
    this.ctx.stroke();
  }

  stopDraw() {
    if (this.isDrawing) {
      this.isDrawing = false;
      this.ctx.closePath();
      this.saveState();
    }
  }

  downloadArtwork() {
    const link = document.createElement('a');
    link.download = `boredom_creation_${Date.now()}.png`;
    link.href = this.canvas.toDataURL('image/png');
    link.click();
    if (window.soundEngine) window.soundEngine.playSuccess();
  }

  bindDrawingEvents() {
    // Mouse
    this.canvas.addEventListener('mousedown', (e) => this.startDraw(e));
    this.canvas.addEventListener('mousemove', (e) => this.draw(e));
    window.addEventListener('mouseup', () => this.stopDraw());

    // Touch
    this.canvas.addEventListener('touchstart', (e) => this.startDraw(e), { passive: false });
    this.canvas.addEventListener('touchmove', (e) => this.draw(e), { passive: false });
    window.addEventListener('touchend', () => this.stopDraw());
  }
}

window.BackgroundParticles = BackgroundParticles;
window.DrawingCanvas = DrawingCanvas;
