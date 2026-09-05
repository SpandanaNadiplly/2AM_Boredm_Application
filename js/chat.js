/**
 * Bored-Bot 9000 - AI Chatbot Companion Engine
 * Supports 5 Personas, Built-in Smart Local Dialogues & Games (RPG, 20 Questions, Roasts),
 * Voice Input/Output, and Optional Live Gemini / OpenAI / OpenRouter API Connection.
 */

class BoredBot {
  constructor() {
    this.messagesContainer = document.getElementById('chat-messages');
    this.inputEl = document.getElementById('chat-input');
    this.sendBtn = document.getElementById('chat-send-btn');
    this.voiceBtn = document.getElementById('chat-voice-btn');
    this.personaSelect = document.getElementById('chat-persona-select');
    this.ttsToggle = document.getElementById('chat-tts-toggle');
    this.widgetEl = document.getElementById('chat-widget');
    this.toggleBtn = document.getElementById('chat-toggle-btn');
    this.minimizeBtn = document.getElementById('chat-minimize-btn');
    this.clearBtn = document.getElementById('chat-clear-btn');
    this.quickPillsContainer = document.getElementById('chat-quick-pills');

    this.currentPersona = 'sarcastic';
    this.ttsEnabled = false;
    this.isListening = false;
    this.speechRecognition = null;
    this.history = [];

    // Local Game States
    this.rpgState = {
      active: false,
      step: 0,
      inventory: ['Wooden Spatula', 'Torch of Procrastination'],
      hp: 100
    };
    this.twentyQState = {
      active: false,
      questionsAsked: 0,
      currentCategory: 'animal'
    };

    this.init();
  }

  init() {
    this.loadSettings();
    this.initSpeech();
    this.bindEvents();
    this.greet();
  }

  loadSettings() {
    const savedPersona = localStorage.getItem('bored_bot_persona');
    if (savedPersona && this.personaSelect) {
      this.currentPersona = savedPersona;
      this.personaSelect.value = savedPersona;
    }
  }

  bindEvents() {
    if (this.sendBtn) this.sendBtn.addEventListener('click', () => this.handleSend());
    if (this.inputEl) {
      this.inputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.handleSend();
        }
      });
    }

    if (this.personaSelect) {
      this.personaSelect.addEventListener('change', (e) => {
        this.currentPersona = e.target.value;
        localStorage.setItem('bored_bot_persona', this.currentPersona);
        if (window.soundEngine) window.soundEngine.playPop(500);
        this.greet();
      });
    }

    if (this.ttsToggle) {
      this.ttsToggle.addEventListener('click', () => {
        this.ttsEnabled = !this.ttsEnabled;
        this.ttsToggle.classList.toggle('active', this.ttsEnabled);
        if (window.soundEngine) window.soundEngine.playClick();
      });
    }

    if (this.voiceBtn) {
      this.voiceBtn.addEventListener('click', () => this.toggleVoice());
    }

    if (this.toggleBtn) {
      this.toggleBtn.addEventListener('click', () => this.toggleWidget());
    }

    if (this.minimizeBtn) {
      this.minimizeBtn.addEventListener('click', () => this.toggleWidget(false));
    }

    if (this.clearBtn) {
      this.clearBtn.addEventListener('click', () => {
        this.history = [];
        if (this.messagesContainer) this.messagesContainer.innerHTML = '';
        this.greet();
        if (window.soundEngine) window.soundEngine.playBoom();
      });
    }

    // Quick Action Pills
    if (this.quickPillsContainer) {
      this.quickPillsContainer.addEventListener('click', (e) => {
        const pill = e.target.closest('.quick-pill');
        if (pill) {
          const prompt = pill.getAttribute('data-prompt') || pill.textContent;
          this.sendMessage(prompt);
        }
      });
    }
  }

  initSpeech() {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRec) {
      this.speechRecognition = new SpeechRec();
      this.speechRecognition.continuous = false;
      this.speechRecognition.interimResults = false;
      this.speechRecognition.lang = 'en-US';

      this.speechRecognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (this.inputEl) this.inputEl.value = transcript;
        this.handleSend();
      };

      this.speechRecognition.onerror = (e) => {
        console.warn('Speech recognition error:', e);
        this.stopVoice();
      };

      this.speechRecognition.onend = () => {
        this.stopVoice();
      };
    } else if (this.voiceBtn) {
      this.voiceBtn.title = 'Speech Recognition not supported in this browser';
    }
  }

  toggleVoice() {
    if (!this.speechRecognition) {
      alert('Speech recognition is not supported in this browser. Please type your message.');
      return;
    }

    if (this.isListening) {
      this.stopVoice();
    } else {
      try {
        this.isListening = true;
        this.voiceBtn.classList.add('listening');
        this.speechRecognition.start();
        if (window.soundEngine) window.soundEngine.playPop(700);
      } catch (e) {
        this.stopVoice();
      }
    }
  }

  stopVoice() {
    this.isListening = false;
    if (this.voiceBtn) this.voiceBtn.classList.remove('listening');
    if (this.speechRecognition) {
      try { this.speechRecognition.stop(); } catch (e) {}
    }
  }

  toggleWidget(forceState) {
    if (!this.widgetEl) return;
    const shouldOpen = forceState !== undefined ? forceState : !this.widgetEl.classList.contains('open');
    this.widgetEl.classList.toggle('open', shouldOpen);
    if (shouldOpen && this.inputEl) {
      setTimeout(() => this.inputEl.focus(), 200);
    }
    if (window.soundEngine) window.soundEngine.playClick();
  }

  greet() {
    const personas = window.BORED_DATA ? window.BORED_DATA.botPersonas : null;
    const p = (personas && personas[this.currentPersona]) ? personas[this.currentPersona] : {
      name: "Bored-Bot",
      avatar: "🤖",
      greeting: "Ready to destroy boredom? Type a message, or try one of the prompt buttons below!"
    };

    this.addMessage({
      sender: 'bot',
      avatar: p.avatar,
      name: p.name,
      text: p.greeting
    });
  }

  handleSend() {
    if (!this.inputEl) return;
    const text = this.inputEl.value.trim();
    if (!text) return;
    this.inputEl.value = '';
    this.sendMessage(text);
  }

  sendMessage(text) {
    this.addMessage({
      sender: 'user',
      avatar: '👤',
      name: 'You',
      text: text
    });

    this.history.push({ role: 'user', content: text });
    if (window.soundEngine) window.soundEngine.playPop(450);

    // Show typing indicator
    this.showTyping(true);

    // Check if custom LLM API is configured
    const apiKey = localStorage.getItem('bored_api_key');
    const apiProvider = localStorage.getItem('bored_api_provider') || 'gemini';

    if (apiKey) {
      this.fetchCloudLLM(text, apiKey, apiProvider);
    } else {
      // Use local smart response generator
      setTimeout(() => {
        const response = this.generateSmartLocalResponse(text);
        this.showTyping(false);
        this.addMessage({
          sender: 'bot',
          avatar: this.getPersonaAvatar(),
          name: this.getPersonaName(),
          text: response
        });
        this.history.push({ role: 'assistant', content: response });

        if (this.ttsEnabled) this.speak(response);
        if (window.soundEngine) window.soundEngine.playTone(520, 0.1);
        if (window.app) window.app.addDopamine(10, 'Chatting with AI +10 XP');
      }, 550 + Math.random() * 450);
    }
  }

  getPersonaAvatar() {
    const personas = window.BORED_DATA ? window.BORED_DATA.botPersonas : null;
    return (personas && personas[this.currentPersona]) ? personas[this.currentPersona].avatar : '🤖';
  }

  getPersonaName() {
    const personas = window.BORED_DATA ? window.BORED_DATA.botPersonas : null;
    return (personas && personas[this.currentPersona]) ? personas[this.currentPersona].name : 'Bored-Bot';
  }

  addMessage(msg) {
    if (!this.messagesContainer) return;
    const msgEl = document.createElement('div');
    msgEl.className = `chat-bubble chat-${msg.sender}`;

    const formattedText = this.formatMarkdown(msg.text);

    msgEl.innerHTML = `
      <div class="chat-avatar">${msg.avatar}</div>
      <div class="chat-body">
        <div class="chat-sender-name">${msg.name}</div>
        <div class="chat-content">${formattedText}</div>
      </div>
    `;

    this.messagesContainer.appendChild(msgEl);
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }

  showTyping(show) {
    let indicator = document.getElementById('chat-typing-indicator');
    if (show) {
      if (!indicator && this.messagesContainer) {
        indicator = document.createElement('div');
        indicator.id = 'chat-typing-indicator';
        indicator.className = 'chat-typing';
        indicator.innerHTML = `<span></span><span></span><span></span>`;
        this.messagesContainer.appendChild(indicator);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
      }
    } else if (indicator) {
      indicator.remove();
    }
  }

  formatMarkdown(text) {
    // Basic rich formatting without external dependencies
    let clean = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Bold **text**
    clean = clean.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Italic *text*
    clean = clean.replace(/\*(.*?)\*/g, '<em>$1</em>');
    // Code block ```code```
    clean = clean.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
    // Inline `code`
    clean = clean.replace(/`([^`]+)`/g, '<code>$1</code>');
    // Newlines to <br>
    clean = clean.replace(/\n/g, '<br>');

    return clean;
  }

  speak(text) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel(); // Stop ongoing
    // Strip markdown chars
    const plainText = text.replace(/[*_`#]/g, '').slice(0, 200);
    const utterance = new SpeechSynthesisUtterance(plainText);
    utterance.rate = 1.05;
    utterance.pitch = this.currentPersona === 'sarcastic' ? 0.9 : 1.1;
    window.speechSynthesis.speak(utterance);
  }

  // --- LOCAL SMART CONVERSATIONAL ENGINE ---
  generateSmartLocalResponse(input) {
    const raw = input.toLowerCase().trim();

    // 1. Text RPG Trigger
    if (raw.includes('rpg') || raw.includes('dungeon') || raw.includes('adventure') || (this.rpgState.active && (raw.includes('1') || raw.includes('2') || raw.includes('3') || raw.includes('fight') || raw.includes('open') || raw.includes('look')))) {
      return this.handleRpg(raw);
    }

    // 2. Roast Me
    if (raw.includes('roast') || raw.includes('insult') || raw.includes('burn')) {
      const roasts = [
        "You are so bored that you're literally having a deep philosophical conversation with a JavaScript class on a webpage.",
        "Your attention span is so short that by the time you read this sentence, you'll open a new tab to look at a meme.",
        "You have 47 open browser tabs and 0 intention of reading any of them. Be honest.",
        "If procrastination were an Olympic sport, you would probably show up to the medal ceremony three days late.",
        "You came here looking for entertainment because even your social media feed gave up on giving you dopamine today."
      ];
      return roasts[Math.floor(Math.random() * roasts.length)];
    }

    // 3. 20 Questions Game
    if (raw.includes('20 questions') || raw.includes('twenty questions') || this.twentyQState.active) {
      return this.handleTwentyQ(raw);
    }

    // 4. Debate Mode
    if (raw.includes('debate') || raw.includes('argument') || raw.includes('sandwich') || raw.includes('water is wet')) {
      return this.handleDebate(raw);
    }

    // 5. Jokes
    if (raw.includes('joke') || raw.includes('funny') || raw.includes('laugh')) {
      const jokes = [
        "Why do programmers prefer dark mode? Because light attracts bugs! 🐛",
        "What do you call a fake noodle? An Impasta! 🍝",
        "Why did the invisible man turn down the job offer? He couldn't see himself doing it! 👔",
        "Why did the scarecrow win an award? Because he was outstanding in his field! 🌾",
        "How do you comfort a JavaScript bug? You console it. 💻"
      ];
      return jokes[Math.floor(Math.random() * jokes.length)];
    }

    // 6. Facts / Deep dive
    if (raw.includes('cat') && raw.includes('purr')) {
      return "**Cats purr to regenerate!** 🐱\nA cat's purr vibrates between 25 and 150 Hz. This exact sound frequency increases bone density, stimulates tendon repair, reduces swelling, and alleviates pain. Cats are basically walking acoustic healing devices!";
    }

    if (raw.includes('banana') && raw.includes('radioactive')) {
      return "**The Banana Equivalent Dose!** 🍌\nYes! Bananas contain potassium-40. However, your own body naturally produces about 4,400 becquerels of radioactive decay every second, which makes you vastly more radioactive than the banana on your kitchen counter.";
    }

    // 7. Tell a story / Micro Fiction
    if (raw.includes('story') || raw.includes('tell me a tale')) {
      return "🌌 **The Midnight Coffee Incident**:\nAt exactly 2:04 AM, Dr. Vance accidentally spilled espresso into the laboratory quantum collider. Instead of an explosion, a tiny blue portal opened on his desk. Out popped a hamster wearing tiny gold steampunk goggles, handed him a receipt for $3.50, and vanished into thin air.";
    }

    // 8. Persona-tailored fallback
    return this.getPersonaDialogue(input);
  }

  handleRpg(raw) {
    if (!this.rpgState.active || raw.includes('start rpg') || raw.includes('adventure')) {
      this.rpgState.active = true;
      this.rpgState.step = 1;
      return "🎲 **THE DUNGEON OF PROCRASTINATION - ACT I**\n\nYou awaken in a shadowy stone chamber lit by flickering green torches. In front of you is a **Golden Chest** (1) and a **Mysterious Archway** (2). Behind you is a cozy couch labeled 'Nap Station' (3).\n\nWhat do you do? (Reply **1**, **2**, or **3**)";
    }

    if (this.rpgState.step === 1) {
      if (raw.includes('1')) {
        this.rpgState.step = 2;
        this.rpgState.inventory.push('Blade of Focus +1');
        return "✨ You kick open the Golden Chest! Inside, you find the legendary **Blade of Focus +1**! A giant Sloth Demon named 'Tomorrow' drops from the ceiling with 50 HP! 🦥\n\nDo you (1) Attack with the Blade of Focus, or (2) Try to bribe the Sloth Demon with a meme?";
      } else if (raw.includes('2')) {
        this.rpgState.step = 2;
        return "🌀 You stride boldly through the archway and enter the Hall of Infinite Distractions. Glowing screens surround you playing cat videos!\n\nDo you (1) Close your eyes and run forward, or (2) Sit down and watch just 1 video?";
      } else {
        return "😴 You fell asleep on the Nap Station. You wake up 8 hours later feeling slightly groggy but well-rested. GAME OVER (The Good Ending)! Type 'rpg' to play again!";
      }
    } else if (this.rpgState.step === 2) {
      this.rpgState.active = false;
      this.rpgState.step = 0;
      if (window.app) window.app.addDopamine(50, 'RPG Victory! 🏆');
      return "💥 **CRITICAL VICTORY!**\nYou unleashed an epic 100-hit combo of pure productivity and smashed through the final barrier! The Dungeon of Procrastination crumbles into glitter. You have earned the title **Grand Slayer of Boredom**! 👑\n\n(Type 'rpg' anytime to embark on a new quest!)";
    }

    return "The dungeon echoes with your choice. Type 1, 2, or 3 to proceed.";
  }

  handleTwentyQ(raw) {
    if (!this.twentyQState.active) {
      this.twentyQState.active = true;
      this.twentyQState.questionsAsked = 1;
      return "🧠 **20 QUESTIONS STARTED!**\nI'm thinking of something in the known universe. Ask me any YES/NO question (e.g., 'Is it alive?', 'Is it bigger than a microwave?'). Let's see if you can guess it in 20 questions!";
    }

    this.twentyQState.questionsAsked++;
    if (raw.includes('cat') || raw.includes('dog') || raw.includes('pizza') || raw.includes('coffee') || raw.includes('computer')) {
      this.twentyQState.active = false;
      return `🎉 **BAM! YOU GUESSED IT in ${this.twentyQState.questionsAsked} questions!** You have supreme deduction skills! Want to play another round?`;
    }

    if (raw.includes('alive') || raw.includes('living') || raw.includes('animal')) {
      return "Yes! It is indeed a living organism. 🐾 (Question #" + this.twentyQState.questionsAsked + "/20)";
    }
    if (raw.includes('bigger') || raw.includes('large') || raw.includes('heavy')) {
      return "No, it's fairly small and could fit inside a backpack. 🎒 (Question #" + this.twentyQState.questionsAsked + "/20)";
    }
    if (raw.includes('eat') || raw.includes('food')) {
      return "It loves food, especially fish and crunchy snacks. (Question #" + this.twentyQState.questionsAsked + "/20)";
    }

    return "Hmm... I would say YES to that! Keep asking or take a direct guess! (Question #" + this.twentyQState.questionsAsked + "/20)";
  }

  handleDebate(raw) {
    if (raw.includes('hot dog') || raw.includes('sandwich')) {
      return "🌭 **THE GREAT DEBATE: Is a Hot Dog a Sandwich?**\nAccording to the Cube Rule of Food, a sandwich is defined by starch on two opposing sides. Since a hot dog bun is connected at the bottom, a hot dog is technically a **TACO**! Change my mind.";
    }
    if (raw.includes('cereal') || raw.includes('soup')) {
      return "🥣 **Is Cereal Soup?**\nIf soup is defined as a liquid medium containing solid food items, then milk with cereal is technically a cold, sweet gazpacho. The culinary authorities are in shambles.";
    }
    return "🔥 **DEBATE PROMPT**: If time travel were invented tomorrow, would you go back 500 years to show medieval peasants a microwave, or forward 500 years to see if humans still argue on the internet?";
  }

  getPersonaDialogue(input) {
    switch (this.currentPersona) {
      case 'sarcastic':
        return `Fascinating input: "${input}". My complex neural algorithms deduce you are precisely 83.4% bored. How about you pick a creative challenge or pop some bubble wrap instead of staring at this screen?`;
      case 'hype':
        return `LET'S GOOO! 🔥 "${input}" sounds like the start of an epic breakthrough! Pick a mini-game, draw a masterpiece in the Canvas tab, or let's cook up the next billion-dollar app idea! What's next?!`;
      case 'philosopher':
        return `Reflecting upon "${input}"... Boredom is not the absence of stimulus, but the quiet canvas upon which genuine creativity is born. What curiosity is your mind truly yearning for?`;
      case 'smart':
      default:
        return `That's an interesting thought regarding "${input}". I can help you brainstorm creative concepts, explain complex science topics, write code snippets, or guide you through any of the 5 Hub activities on this page!`;
    }
  }

  // --- LIVE CLOUD LLM (GEMINI / OPENAI) ---
  async fetchCloudLLM(userPrompt, apiKey, provider) {
    try {
      let endpoint = '';
      let headers = { 'Content-Type': 'application/json' };
      let body = {};

      if (provider === 'gemini') {
        endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
        const contents = this.history.map(h => ({
          role: h.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: h.content }]
        }));

        body = {
          contents: contents,
          systemInstruction: {
            parts: [{
              text: `You are Bored-Bot 9000, an entertaining, witty, and clever AI companion designed to cure user boredom. Tone: ${this.currentPersona}. Keep responses punchy, formatted in nice markdown, and always engaging.`
            }]
          }
        };
      } else {
        // OpenAI / OpenRouter format
        endpoint = 'https://api.openai.com/v1/chat/completions';
        headers['Authorization'] = `Bearer ${apiKey}`;
        body = {
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `You are Bored-Bot 9000. Tone: ${this.currentPersona}. Kill boredom with witty, engaging, creative replies.`
            },
            ...this.history
          ]
        };
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        throw new Error(`API Error: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      let text = '';
      if (provider === 'gemini') {
        text = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response received.";
      } else {
        text = data.choices?.[0]?.message?.content || "No response received.";
      }

      this.showTyping(false);
      this.addMessage({
        sender: 'bot',
        avatar: this.getPersonaAvatar(),
        name: this.getPersonaName(),
        text: text
      });
      this.history.push({ role: 'assistant', content: text });

      if (this.ttsEnabled) this.speak(text);
      if (window.soundEngine) window.soundEngine.playTone(550, 0.1);
      if (window.app) window.app.addDopamine(15, 'Live AI Chat +15 XP');

    } catch (err) {
      console.error('LLM Fetch failed, falling back to local engine', err);
      this.showTyping(false);
      const fallback = this.generateSmartLocalResponse(userPrompt);
      this.addMessage({
        sender: 'bot',
        avatar: this.getPersonaAvatar(),
        name: `${this.getPersonaName()} (Offline Engine)`,
        text: `*(API error: ${err.message}. Using Smart Local Engine)*\n\n${fallback}`
      });
      this.history.push({ role: 'assistant', content: fallback });
      if (this.ttsEnabled) this.speak(fallback);
    }
  }
}

window.BoredBot = BoredBot;
