/**
 * Boredom Buster Database - Curated challenges, riddles, facts, mini-games, and AI dialogues.
 */
const BORED_DATA = {
  // 🎨 CREATIVE CHALLENGES
  challenges: [
    {
      id: 'c1',
      category: 'Design',
      title: 'Coffee Brand Identity',
      prompt: 'Design a logo & slogan for an imaginary futuristic coffee shop called "Moon Bean".',
      timeMinutes: 15,
      tip: 'Think about celestial coffee cups, lunar textures, or glowing neon neon-purple beans.'
    },
    {
      id: 'c2',
      category: 'Writing',
      title: 'Micro Horror Story',
      prompt: 'Write a 4-sentence story where the villain is an everyday household object with an attitude.',
      timeMinutes: 10,
      tip: 'Make the toaster or the ceiling fan sound genuinely menacing.'
    },
    {
      id: 'c3',
      category: 'Invention',
      title: 'Useless Genius Product',
      prompt: 'Invent a gadget that solves a problem that no human has ever had, complete with a $999 infomercial pitch.',
      timeMinutes: 10,
      tip: 'Example: An automatic cloud-straightener or a sock-warmer for lizards.'
    },
    {
      id: 'c4',
      category: 'Drawing',
      title: 'Cyberpunk Creature',
      prompt: 'Draw a neon cyborg animal (like a robotic chameleon or a mechanical owl) with at least 3 high-tech upgrades.',
      timeMinutes: 15,
      tip: 'Use electric cyan, hot magenta, and jet black outlines.'
    },
    {
      id: 'c5',
      category: 'Writing',
      title: 'Villain Monologue',
      prompt: 'Write a dramatic supervillain monologue explaining why they decided to steal all the left shoes in the world.',
      timeMinutes: 10,
      tip: 'Give them tragic backstory or an absurd sense of moral superiority.'
    },
    {
      id: 'c6',
      category: 'Design',
      title: 'Retro Arcade Game Cover',
      prompt: 'Create the title screen or box art for an imaginary 1980s 8-bit arcade game called "Pizza Ninja 3000".',
      timeMinutes: 15,
      tip: 'Bold blocky letters, flying pepperoni shurikens, and retro neon vibes.'
    },
    {
      id: 'c7',
      category: 'Writing',
      title: 'Haiku Battle',
      prompt: 'Write 3 haikus describing your exact current level of boredom and what your refrigerator is thinking right now.',
      timeMinutes: 5,
      tip: '5-7-5 syllables: "Cold light shines inside / Lonely pickle in a jar / Waiting for midnight".'
    },
    {
      id: 'c8',
      category: 'Invention',
      title: 'Secret Agent Code Name & Dossier',
      prompt: 'Create an undercover spy persona for yourself. Name, specialty weapon (must be food-based), and secret hideout.',
      timeMinutes: 10,
      tip: 'Agent Bagel-Zero, armed with high-velocity wasabi projectiles.'
    },
    {
      id: 'c9',
      category: 'Design',
      title: 'Album Cover Art',
      prompt: 'Design the minimalist cover for a synthwave music album titled "Midnight Wi-Fi Signals".',
      timeMinutes: 15,
      tip: 'Gradients, wireframe grids, and glowing retro wireframe suns.'
    },
    {
      id: 'c10',
      category: 'Writing',
      title: 'Alien Review of Earth',
      prompt: 'Write a 1-star Yelp review of Planet Earth written by an extraterrestrial tourist who visited for 2 hours.',
      timeMinutes: 10,
      tip: 'Complain about gravity, traffic, and why humans put pineapple on pizza.'
    }
  ],

  // 🎮 EMOJI RIDDLES
  emojiRiddles: [
    {
      id: 'er1',
      category: 'Movie',
      emojis: '🧊 🚢 💔',
      answer: 'Titanic',
      hint: 'Never let go, Jack! (1997 James Cameron blockbuster)'
    },
    {
      id: 'er2',
      category: 'Movie',
      emojis: '🎈 🤡 🌧️',
      answer: 'It',
      hint: 'Stephen King classic with Derry sewers and Pennywise.'
    },
    {
      id: 'er3',
      category: 'Movie',
      emojis: '🦁 👑 🌅',
      answer: 'The Lion King',
      hint: 'Hakuna Matata and the Pride Lands.'
    },
    {
      id: 'er4',
      category: 'Movie',
      emojis: '🧙‍♂️ 💍 🌋 👁️',
      answer: 'The Lord of the Rings',
      hint: 'One does not simply walk into Mordor.'
    },
    {
      id: 'er5',
      category: 'Movie',
      emojis: '🦖 🚙 🏝️ 🧬',
      answer: 'Jurassic Park',
      hint: 'Life, uh, finds a way.'
    },
    {
      id: 'er6',
      category: 'Video Game',
      emojis: '🍄 👨🏻 🏰 🐢  princess',
      answer: 'Super Mario',
      hint: 'Your princess is in another castle!'
    },
    {
      id: 'er7',
      category: 'Movie',
      emojis: '🕶️ 💊 🟢 🐇',
      answer: 'The Matrix',
      hint: 'Take the red pill or the blue pill.'
    },
    {
      id: 'er8',
      category: 'Movie',
      emojis: '👻 🚫 ⚡ 🔫 🏢',
      answer: 'Ghostbusters',
      hint: 'Who you gonna call?'
    },
    {
      id: 'er9',
      category: 'Song / Band',
      emojis: ' Queen 👑 ⚡ 🎸  Bohemian',
      answer: 'Bohemian Rhapsody',
      hint: 'Is this the real life? Is this just fantasy?'
    },
    {
      id: 'er10',
      category: 'Movie',
      emojis: '🕷️ 🕸️ 👦 🏙️ 🔴 🔵',
      answer: 'Spider-Man',
      hint: 'With great power comes great responsibility.'
    },
    {
      id: 'er11',
      category: 'Movie',
      emojis: '🌌 🚀 ⏳ 🕳️ 👨‍👧 🌽',
      answer: 'Interstellar',
      hint: 'Those aren’t mountains… they’re waves! (Directed by Christopher Nolan)'
    },
    {
      id: 'er12',
      category: 'Movie',
      emojis: '🐀 👨‍🍳 🍲 🇫🇷 🍷',
      answer: 'Ratatouille',
      hint: 'Anyone can cook! (Pixar culinary masterpiece)'
    },
    {
      id: 'er13',
      category: 'Video Game',
      emojis: '⛏️ 🧱 🧟 🟩 💎',
      answer: 'Minecraft',
      hint: 'Punch trees, craft diamond pickaxes, beware of creepers.'
    },
    {
      id: 'er14',
      category: 'Movie',
      emojis: '🍫 🏭 🎫 🎩 🍬',
      answer: 'Charlie and the Chocolate Factory',
      hint: 'Golden ticket and Oompa Loompas.'
    },
    {
      id: 'er15',
      category: 'Song',
      emojis: '👀 🐅 🔥 🥊 🏆',
      answer: 'Eye of the Tiger',
      hint: 'Survivor’s Rocky training anthem.'
    }
  ],

  // 🧠 FASCINATING FACTS & RABBIT HOLES
  facts: [
    {
      id: 'f1',
      title: 'Why do cats purr?',
      category: 'Nature & Animals',
      summary: 'Cats purr not just when they are happy, but also to heal themselves!',
      details: 'A cat’s purr vibrates at a frequency between 25 and 150 Hertz. In human medicine, sound frequencies in this exact range have been shown to improve bone density, repair tendons, ease breathing, and reduce pain. Cats basically have a built-in cellular regeneration engine.',
      deepQuestion: 'If purring heals bones, could human sound therapy borrow cat frequencies for sports medicine?'
    },
    {
      id: 'f2',
      title: 'Bananas are radioactive (and so are you)',
      category: 'Science & Physics',
      summary: 'Bananas contain potassium-40, a naturally occurring radioactive isotope.',
      details: 'Eating a banana exposes you to about 0.1 microsieverts of radiation (called a "Banana Equivalent Dose"). But don’t worry: you would need to eat 10 million bananas at once to die of radiation poisoning (though you would burst long before that). Your own human body is naturally far more radioactive than a banana!',
      deepQuestion: 'What other everyday foods secretly contain trace cosmic or radioactive elements?'
    },
    {
      id: 'f3',
      title: 'Trees talk to each other via a "Wood Wide Web"',
      category: 'Nature & Biology',
      summary: 'Underground mycorrhizal fungal networks allow trees to share nutrients, warn neighbors of pests, and care for sick saplings.',
      details: 'Deep beneath the forest floor lies a dense web of fungal threads connecting tree roots. Older "mother trees" use this network to pump sugar and water to shaded younger seedlings. If one tree is attacked by beetles, it sends chemical warning signals through the fungus so neighboring trees can produce defensive tannins.',
      deepQuestion: 'Does a forest function as one singular giant conscious super-organism?'
    },
    {
      id: 'f4',
      title: 'Cleopatra lived closer to the iPhone than to the Pyramids',
      category: 'History',
      summary: 'The Great Pyramid of Giza was built around 2560 BC. Cleopatra VII ruled Egypt around 30 BC.',
      details: 'That means Cleopatra lived roughly 2,500 years AFTER the pyramids were constructed, but only about 2,040 years BEFORE the launch of the original Apple iPhone in 2007. Ancient Egyptian history is so unimaginably long that the pyramids were already ancient tourist ruins to Cleopatra.',
      deepQuestion: 'How does compressing historical timeframes reshape our view of human civilization?'
    },
    {
      id: 'f5',
      title: 'Water has over 300 weird anomalies',
      category: 'Science & Chemistry',
      summary: 'Almost every liquid gets denser when it freezes, but water expands. Without this flaw, life on Earth wouldn’t exist.',
      details: 'Because ice expands and becomes less dense than liquid water, it floats on top of lakes and oceans. If ice sank, oceans and lakes would freeze from the bottom up, killing all marine life and turning Earth into an unlivable giant ice cube. Water also possesses insane surface tension, bizarre hot-water freezing quirks (Mpemba effect), and 19 different crystalline ice phases.',
      deepQuestion: 'Is water’s uniqueness the reason Earth-like biology is so rare in the cosmos?'
    },
    {
      id: 'f6',
      title: 'Octopuses have 3 hearts, 9 brains, and blue copper blood',
      category: 'Nature & Marine Biology',
      summary: 'Two hearts pump blood to the gills while a third pumps blood to the rest of the body.',
      details: 'Octopus blood is blue because it uses copper-rich hemocyanin rather than iron-based hemoglobin. Two-thirds of an octopus’s neurons are distributed throughout its arms, meaning each arm can literally taste, feel, and make autonomous decisions without consulting the central brain!',
      deepQuestion: 'Are cephalopods the closest thing to extraterrestrial intelligence on Earth?'
    },
    {
      id: 'f7',
      title: 'Space is completely silent, but planets make creepy radio songs',
      category: 'Space & Astronomy',
      summary: 'While sound waves cannot travel through a vacuum, NASA converted planetary electromagnetic waves into audible audio.',
      details: 'Jupiter emits booming plasma waves that sound like deep ocean whale songs or alien synthesizers. Saturn produces eerie wind-tunnel howls from its auroras. NASA’s Voyager and Juno probes captured these electromagnetic interactions between solar winds and planetary magnetospheres.',
      deepQuestion: 'What would human music sound like if composed purely from planetary electromagnetic frequencies?'
    },
    {
      id: 'f8',
      title: 'The "Doorway Effect" erases your memory',
      category: 'Brain & Psychology',
      summary: 'Have you ever walked into a room and instantly forgotten why you went in there?',
      details: 'Psychologists call this the "Event Horizon Effect" or Doorway Effect. The human brain treats physical boundaries (like passing through a door frame) as a cognitive "event boundary," wiping working memory buffers to prepare for whatever new context lies ahead in the next space.',
      deepQuestion: 'How can you trick your brain into bypassing the doorway memory wipe?'
    }
  ],

  // 🚀 MICRO PRODUCTIVITY CHALLENGES (5 MINS)
  microTasks: [
    {
      id: 'p1',
      title: 'The 5-Item Desk Wipeout',
      timeMinutes: 3,
      desc: 'Pick up and put away exactly 5 items currently cluttering your desk or immediate table right now.'
    },
    {
      id: 'p2',
      title: 'Hydration Shock & Reset',
      timeMinutes: 2,
      desc: 'Get up right now, pour a tall glass of cold water, drink the entire thing, and do 5 deep shoulder rolls.'
    },
    {
      id: 'p3',
      title: '15 Tab Massacre',
      timeMinutes: 3,
      desc: 'Open your browser tab bar. ruthlessly close at least 10 tabs you know in your heart you will never read.'
    },
    {
      id: 'p4',
      title: 'Micro Posture Alignment',
      timeMinutes: 4,
      desc: 'Stand up, interlock fingers behind your back, stretch your chest upwards for 30s, and do 10 slow bodyweight squats.'
    },
    {
      id: 'p5',
      title: 'Delete 20 Useless Photos',
      timeMinutes: 5,
      desc: 'Open your phone camera roll. Delete 20 blurry screenshots, duplicate photos, or old receipts.'
    },
    {
      id: 'p6',
      title: 'The 2-Minute Inbox Purge',
      timeMinutes: 4,
      desc: 'Search "Unsubscribe" in your email inbox and click unsubscribe on 3 annoying promotional newsletters.'
    }
  ],

  // 💀 EXISTENTIAL BUTTON QUOTES & REACTIONS (Escalating stages)
  buttonQuotes: [
    "Don't do it. Please.",
    "Hey! I specifically asked you not to click me.",
    "Okay, that was once. Everybody makes mistakes.",
    "Twice? Really? What are you trying to accomplish here?",
    "A button click won't solve your boredom, mortal.",
    "Warning: Clicking this button wastes 0.4 calories.",
    "Do you feel that? That was 1 second of your life you'll never get back.",
    "Stop tickling my electrons!",
    "Are you testing my patience or your mouse lifespan?",
    "🚨 ALERT: Unauthorized dopamine seeking detected! 🚨",
    "If you click me again, a pigeon will look at you judgingly tomorrow.",
    "You must really be bored as hell.",
    "Fine. I'm calling the Internet Police. 🚓",
    "SYSTEM ERROR 404: WILLPOWER NOT FOUND.",
    "Every time you click me, a developer somewhere drinks another espresso.",
    "Are we bonding right now? Is this what friendship feels like?",
    "Okay, here is a secret: Clicking 100 times does nothing special.",
    "Look at your index finger. It has so much untapped potential.",
    "Why are you still clicking? Go drink some water!",
    "You have unlocked: LEVEL 99 PROCRASTINATION MASTER 🏆",
    "I'm running out of witty insults for you.",
    "💥 CRITICAL OVERLOAD IMMINENT 💥",
    "Reality matrix shifting by 0.003%...",
    "Self-destruct sequence initiated in 3... 2... 1... Just kidding.",
    "You are remarkably persistent. I respect that, yet worry for you.",
    "🌌 CONGRATULATIONS: You have reached the end of the existential void."
  ],

  // 🪨 VIRTUAL PET ROCK THOUGHTS & MOODS
  petRockThoughts: [
    "Rock is contemplating the tectonic shifts of 50 million BC.",
    "Rock feels solid. As usual.",
    "Rock appreciates your existence at a geological timescale.",
    "Rock does not have bills to pay. Rock is at peace.",
    "Rock is listening to rock music in its imagination.",
    "Rock stares blankly into the cosmic ether.",
    "Rock is enjoying doing absolutely nothing.",
    "Rock thinks you are doing great today."
  ],

  // 💡 RAPID TRIVIA QUESTIONS
  triviaQuestions: [
    {
      q: "What was the first toy ever advertised on television?",
      options: ["Barbie", "Mr. Potato Head", "Lego", "Slinky"],
      answer: 1, // Mr. Potato Head (1952)
      funFact: "Originally, parents had to provide real potatoes for the parts to stick into!"
    },
    {
      q: "Which country has the most natural lakes in the world?",
      options: ["Russia", "Canada", "USA", "Finland"],
      answer: 1, // Canada
      funFact: "Canada contains over 60% of all the natural lakes on Earth!"
    },
    {
      q: "How many brains does a leech have?",
      options: ["1", "4", "32", "0"],
      answer: 2, // 32
      funFact: "A leech’s internal body structure is divided into 32 separate segments, each with its own brain!"
    },
    {
      q: "What color is a polar bear’s skin beneath its white fur?",
      options: ["White", "Pink", "Black", "Grey"],
      answer: 2, // Black
      funFact: "Black skin absorbs maximum heat from the sun, and their fur hairs are actually transparent and hollow!"
    },
    {
      q: "What is the collective noun for a group of flamingos?",
      options: ["A Flamboyance", "A Squadron", "A Prism", "A Carnival"],
      answer: 0, // A Flamboyance
      funFact: "A group of flamingos is officially called a 'Flamboyance'."
    }
  ],

  // 🤖 PRE-SCRIPTED BOT PERSONAS & FALLBACK RESPONSES
  botPersonas: {
    sarcastic: {
      name: "Savage Boredom Slayer",
      avatar: "😼",
      greeting: "Oh, look who decided to show up. Trapped in the endless abyss of free time, are we? What useless adventure do you want to embark on today?"
    },
    hype: {
      name: "Hype Beast 9000",
      avatar: "🚀",
      greeting: "YO YO YO! Boredom is just UNLEASHED POTENTIAL waiting to explode! Let's crush this free time! What are we doing right now?!"
    },
    philosopher: {
      name: "The Cosmic Thinker",
      avatar: "🧙‍♂️",
      greeting: "Greetings, traveler of consciousness. Is boredom merely your mind asking for a deeper mystery, or simply a need for a good distraction? Ask, and let us contemplate."
    },
    rpg: {
      name: "Dungeon Master Rex",
      avatar: "🎲",
      greeting: "You stand before the grand Obsidian Gates of the Boredom Citadel. A glowing chest sits in the center of the mossy cobblestone room. Do you (1) Open the chest, (2) Inspect the torch on the wall, or (3) Cast a spell?"
    },
    smart: {
      name: "Anti-Bore AI Assistant",
      avatar: "🤖",
      greeting: "Hello! I am your AI boredom companion. I can generate wild ideas, brainstorm projects, play text games, debate strange paradoxes, or help you learn anything."
    }
  }
};

window.BORED_DATA = BORED_DATA;
