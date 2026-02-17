(function() {
  const STORAGE_KEY = 'minecraft_assistant_v2';

  const elements = {
    chat: document.querySelector('.chat'),
    messageInput: document.getElementById('messageInput'),
    sendBtn: document.getElementById('sendBtn'),
    settingsBtn: document.getElementById('settingsBtn'),
    clearBtn: document.getElementById('clearBtn'),
    settingsModal: document.getElementById('settingsModal'),
    closeSettings: document.getElementById('closeSettings'),
    saveSettings: document.getElementById('saveSettings'),
    assistantName: document.getElementById('assistantName'),
    provider: document.getElementById('provider'),
    googleSettings: document.getElementById('googleSettings'),
    claudeSettings: document.getElementById('claudeSettings'),
    googleApiKey: document.getElementById('googleApiKey'),
    googleCx: document.getElementById('googleCx'),
    claudeKey: document.getElementById('claudeKey'),
    typingIndicator: document.getElementById('typingIndicator'),
    // side nav elements (may be null if markup not present)
    navToggleBtn: document.getElementById('navToggleBtn'),
    sideNav: document.getElementById('sideNav'),
    sideNavBackdrop: document.getElementById('sideNavBackdrop'),
    signUpBtn: document.getElementById('signUpBtn'),
    signInBtn: document.getElementById('signInBtn'),
    discordBtn: document.getElementById('discordBtn'),
    navBackBtn: document.getElementById('navBackBtn')
  };

  let state = {
    name: 'Minecraft Assistant v1.0',
    provider: 'claude',
    googleApiKey: '',
    googleCx: '',
    claudeKey: '',
    messages: []
  };

  const minecraftKnowledge = {
    items: {
      'golden apple': 'Golden Apples grant Absorption and Regeneration effects when consumed. Enchanted Golden Apples (Notch Apples) provide even stronger effects including Fire Resistance!',
      'diamond': 'Diamonds are found between Y levels -64 and 16, with the best levels being around Y -59. Use a Fortune III pickaxe for maximum yield!',
      'netherite': 'Netherite is crafted by combining 4 Netherite Scraps (from Ancient Debris) with 4 Gold Ingots. Ancient Debris is found around Y level 15 in the Nether.',
      'ender pearl': 'Ender Pearls are dropped by Endermen. When thrown, they teleport you but deal 2.5 hearts of damage. Essential for reaching The End!',
      'elytra': 'Elytra are found in End Cities inside item frames on End Ships. Combine with firework rockets for powered flight!',
      'totem of undying': 'Totems of Undying are dropped by Evokers in Woodland Mansions and Raids. Hold in your hand to survive fatal damage once!',
      'beacon': 'Beacons require a pyramid of iron, gold, diamond, emerald, or netherite blocks. Full pyramid (4 levels) gives the longest range of 50 blocks.',
      'trident': 'Tridents are dropped by Drowned (8.5% chance with looting). Can be enchanted with Riptide, Loyalty, or Channeling!'
    },
    mobs: {
      'creeper': 'Creepers explode when near players. They\'re scared of cats and ocelots! When struck by lightning, they become Charged Creepers.',
      'enderman': 'Endermen teleport and are damaged by water. They only attack if you look at their eyes. Wearing a carved pumpkin prevents aggro!',
      'wither': 'The Wither is spawned with 4 Soul Sand in a T-shape and 3 Wither Skeleton Skulls. It\'s the only source of Nether Stars for beacons.',
      'ender dragon': 'The Ender Dragon has 200 health and can be respawned by placing 4 End Crystals on the exit portal. Destroy the crystals first!',
      'warden': 'The Warden spawns in the Deep Dark when sculk shriekers activate 3 times. It has 500 health and deals 30 damage. Sneak to avoid detection!',
      'iron golem': 'Iron Golems can be built with 4 iron blocks in a T-shape and a carved pumpkin on top. They protect villagers and drop iron ingots.',
      'villager': 'Villagers can be traded with and have different professions based on their job site block. Curing zombie villagers gives permanent discounts!'
    },
    mechanics: {
      'minecart': 'Minecarts travel at 8 blocks per second on powered rails. They can carry players, mobs, chests, hoppers, TNT, and furnaces!',
      'redstone': 'Redstone signals travel up to 15 blocks. Use repeaters to extend range. Comparators can read container contents and more!',
      'enchanting': 'Enchanting tables need bookshelves (15 max) placed 1 block away with air between. Lapis Lazuli is required for enchanting.',
      'brewing': 'Brewing requires Blaze Powder as fuel. Nether Wart is the base for most potions. Gunpowder makes splash potions!',
      'farming': 'Crops need light level 9+ to grow. Water hydrates farmland up to 4 blocks away. Bone meal can speed up growth!',
      'portal': 'Nether Portals require a 4x5 obsidian frame (minimum). In the Nether, 1 block = 8 blocks in the Overworld!',
      'End Portal':'End Portals Are used to enter the end dimension, in which we can get enderpearls and Elytras!'
    },
    crafting: {
      'bed': 'Beds are crafted with 3 wool and 3 planks. They set your spawn point and skip nights. In the Nether/End, they explode!',
      'shield': 'Shields are crafted with 6 planks and 1 iron ingot. They block 100% of most attacks and can be decorated with banners!',
      'crossbow': 'Crossbows are crafted with sticks, iron ingot, string, and tripwire hook. They can be loaded and stored for instant shots!',
      'campfire': 'Campfires are crafted with sticks, coal/charcoal, and logs. They cook food, produce smoke signals, and don\'t burn items!'
    },
    enchantingbooks: {
      'sharpness': 'Sharpess goes from level 1 to 5, it can be used for increasing damage of a sword, spear and axe!',
      'efficiency': 'Efficiency goes from level 1 to 5,its used to make mining speed faster on a pickaxe, axe, or a shovel!',
      'unbreaking': 'Unbreaking goes from level 1 to 3, Its used to make Items last longer after Use',
      'mending': 'Mending is a special enchantment that uses XP to repair Items in its original state.',
      'fortune': 'It Increases the amount of items dropped when mining ores or harvesting Crops. it also goes from level 1 to 3',
      'power' : 'It increases the damage of a bow, it goes from level 1 to 5',
      'curse of Binding': 'Curse of binding is used for mostly making your armor permanantly stick to you unless you die. Its the most useless enchantment in the world of minecraft',
      'curse of vanishing':'Curse Of Vanishing is very useful unlike Curse of Binding, it can be useful when you are in pvp and dont want the other player to get your armor',
      'feather falling':'Feather Falling is used to make fall damage less when wearing boots, It goes from level 1 to 4',
      'lure':'Lure is used to make fish bite faster when fishing, it goes from level 1 to 3'
    },
    general : {
      'what is minecraft' : ' Minecraft is a popular game played by kids and adults. It is known for its really hard pvp methods and rumors to improve your brain',
      '?' : 'Hello, i am your AI Minecraft AI Assistant Named MineAI in short.',
      'how to build a house.' : 'To build a house in minecraft. you need to specify the elements and search it on google. but the classic wood house i can tell! First gather some wood. use those wood to make a 4 block tall box. it must be 3x3 alright?. put a furnace and crafting table. there ya go. a classic minecraft house!'
    },
    potions: {
      'swiftness': 'Increases movement speed and expands field of view by 20% (Level I) or 40% (Level II). Brewed with Sugar.',
      'strength': 'Increases melee damage by 3 points (1.5 hearts) at Level I, and 6 points (3 hearts) at Level II. Brewed with Blaze Powder.',
      'regeneration': 'Restores health over time: Level I heals 1 heart every 2.5 seconds; Level II heals 1 heart every 1.2 seconds. Brewed with Ghast Tear.',
      'healing': 'Instantly restores 4 points (2 hearts) at Level I, or 8 points (4 hearts) at Level II. Essential for kit PVP. Brewed with Glistering Melon Slice.',
      'fire resistance': 'Provides total immunity to fire, lava, and blaze fireballs. Essential for Nether exploration. Brewed with Magma Cream.',
      'water breathing': 'Prevents the oxygen bar from depleting and slightly improves underwater vision. Brewed with Pufferfish.',
      'night vision': 'Grants full brightness in dark areas and underwater. Used as a base for Invisibility. Brewed with Golden Carrot.',
      'invisibility': 'Makes the player model transparent. Armor and held items remain visible. Brewed by adding a Fermented Spider Eye to a Night Vision potion.',
      'leaping': 'Increases jump height and reduces fall damage. Level II allows you to jump over 2 blocks. Brewed with Rabbit\'s Foot.',
      'slow falling': 'Prevents fall damage and causes the player to fall at a much slower rate. Great for End cities. Brewed with Phantom Membrane.',
      'poison': 'Depletes health over time down to 1 point (half a heart). Does not kill. Brewed with Spider Eye.',
      'weakness': 'Reduces melee damage by 4 points (2 hearts). Required to cure Zombie Villagers. Brewed with Fermented Spider Eye.',
      'slowness': 'Decreases movement speed by 15%. Brewed by adding a Fermented Spider Eye to Swiftness or Leaping potions.',
      'harming': 'Instantly deals 6 points (3 hearts) of damage at Level I, or 12 points (6 hearts) at Level II. Heals Undead mobs. Brewed with Fermented Spider Eye + Healing/Poison.',
      'turtle master': 'Grants Resistance IV (reduces damage by 80%) but applies Slowness IV (reduces speed by 60%). Brewed with Turtle Shell.',
      'conduit': 'Restores oxygen, grants night vision, and increases mining speed while underwater near a Conduit. Not brewable as a splash potion.',
      'luck': 'Increases the "Luck" attribute, improving chances of better loot from fishing or chests. Only available via commands or Creative mode.',
      'decay': 'Inflicts the Wither effect, rotting health away even past the last half-heart. Primarily found in Bedrock Edition cauldrons/chests.'
    }
  };

  function loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) Object.assign(state, JSON.parse(saved));
    } catch (e) {
      console.warn('Failed to load state:', e);
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Failed to save state:', e);
    }
  }

  function formatTime(date) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function createMessageElement(role, text, link = null) {
    const message = document.createElement('div');
    message.className = `message ${role}`;

    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';

    if (role === 'assistant') {
      avatar.innerHTML = `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="10" fill="url(#assistant-grad-${Date.now()})"/>
        <rect x="8" y="10" width="9" height="9" rx="2" fill="#2D5016"/>
        <rect x="23" y="10" width="9" height="9" rx="2" fill="#2D5016"/>
        <rect x="11" y="13" width="4" height="4" rx="1" fill="#1a1a1a"/>
        <rect x="25" y="13" width="4" height="4" rx="1" fill="#1a1a1a"/>
        <rect x="12" y="14" width="2" height="2" fill="#fff"/>
        <rect x="26" y="14" width="2" height="2" fill="#fff"/>
        <rect x="14" y="27" width="12" height="4" rx="2" fill="#8B5A2B"/>
        <defs>
          <linearGradient id="assistant-grad-${Date.now()}" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop stop-color="#5DBE3D"/>
            <stop offset="1" stop-color="#3D8B2A"/>
          </linearGradient>
        </defs>
      </svg>`;
    } else {
      avatar.innerHTML = `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="10" fill="url(#user-grad-${Date.now()})"/>
        <circle cx="20" cy="14" r="6" fill="#fff" opacity="0.9"/>
        <path d="M10 34c0-5.523 4.477-10 10-10s10 4.477 10 10" fill="#fff" opacity="0.9"/>
        <defs>
          <linearGradient id="user-grad-${Date.now()}" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop stop-color="#6366f1"/>
            <stop offset="1" stop-color="#4f46e5"/>
          </linearGradient>
        </defs>
      </svg>`;
    }

    const content = document.createElement('div');
    content.className = 'message-content';

    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';
    bubble.textContent = text;

    const time = document.createElement('div');
    time.className = 'message-time';
    time.textContent = formatTime(new Date());

    content.appendChild(bubble);

    if (link) {
      const linkEl = document.createElement('a');
      linkEl.className = 'message-link';
      linkEl.href = link;
      linkEl.target = '_blank';
      linkEl.textContent = link;
      content.appendChild(linkEl);
    }

    content.appendChild(time);
    message.appendChild(avatar);
    message.appendChild(content);

    return message;
  }

  function addMessage(role, text, link = null, save = true) {
    const messageEl = createMessageElement(role, text, link);
    elements.chat.appendChild(messageEl);
    elements.chat.scrollTop = elements.chat.scrollHeight;

    if (save) {
      state.messages.push({ role, text, link, timestamp: Date.now() });
      if (state.messages.length > 100) state.messages.shift();
      saveState();
    }
  }

  function showTyping() {
    elements.typingIndicator.classList.add('active');
  }

  function hideTyping() {
    elements.typingIndicator.classList.remove('active');
  }

  function respond(text, link = null) {
    hideTyping();
    addMessage('assistant', text, link);
  }

  function findMinecraftAnswer(query) {
    const lower = query.toLowerCase();

    for (const category of Object.values(minecraftKnowledge)) {
      for (const [key, value] of Object.entries(category)) {
        if (lower.includes(key)) {
          return value;
        }
      }
    }
    return null;
  }
  function safeEvalMath(expr) {
    if (!/^[0-9+\-*/().\s%^]+$/.test(expr)) return null;
    const sanitized = expr.replace(/\^/g, '**');
    try {
      const fn = new Function('return (' + sanitized + ')');
      const result = fn();
      if (typeof result === 'number' && isFinite(result)) return result;
    } catch (e) {
      return null;
    }
    return null;
  }

  async function callGoogleCSE(query) {
    if (!state.googleApiKey || !state.googleCx) {
      throw new Error('Google API credentials not configured');
    }

    const url = `https://www.googleapis.com/customsearch/v1?key=${encodeURIComponent(state.googleApiKey)}&cx=${encodeURIComponent(state.googleCx)}&q=${encodeURIComponent(query)}&num=3`;
    const res = await fetch(url);

    if (!res.ok) throw new Error('Google search failed');

    const data = await res.json();
    if (data.items && data.items.length) {
      const top = data.items[0];
      return {
        text: (top.snippet || top.title || 'Result').replace(/\n+/g, ' ').trim(),
        link: top.link
      };
    }

    return {
      text: 'No results found. Try a different search:',
      link: `https://www.google.com/search?q=${encodeURIComponent(query)}`
    };
  }

  async function callClaude(prompt) {
    if (!state.claudeKey) {
      throw new Error('Bytez API key not configured');
    }

    try {
      const res = await fetch('https://api.bytez.com/model/anthropic/claude-haiku-4-5/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Key ${state.claudeKey}`
        },
        body: JSON.stringify([
          {
            role: 'system',
            content: 'You are a helpful Minecraft assistant. Provide accurate, concise information about Minecraft. Keep responses under 3 sentences.'
          },
          {
            role: 'user',
            content: prompt
          }
        ])
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error('Bytez API error:', errorData);
        throw new Error(errorData.error || `API error: ${res.status}`);
      }

      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const text = data.output?.trim();

      if (!text) {
        throw new Error('No response from Bytez API');
      }

      return text;
    } catch (err) {
      console.error('Bytez API call failed:', err);
      throw err;
    }
  }

  async function processMessage(text) {
    const trimmed = text.trim();
    if (!trimmed) return;

    const lower = trimmed.toLowerCase();

    if (/\b(?:fuck|shit|asshole|ass|sex|nude|dick|bitch|nigger|nigga|n!gga|nigg|nig)\b/i.test(trimmed)) {
      respond('Please keep the conversation friendly! Let\'s talk about Minecraft instead. 😊');
      return;
    }

    if (/^\s*(hi|hello|hey)(?:\s+assistant)?\s*$/i.test(trimmed)) {
      respond(`Greetings! I'm your dedicated Minecraft Assistant, here to provide expert guidance on all aspects of the game. Whether you need help with crafting recipes, mob strategies, redstone engineering, or exploration tips—I'm at your service. How may I assist you today?`);
      return;
    }

    if (/\b(what'?s? your name|who are you)\b/i.test(lower)) {
      respond(`I'm ${state.name}! I'm here to help you with all things Minecraft.`);
      return;
    }

    if (/\btime\b/.test(lower)) {
      respond(`The current time is ${new Date().toLocaleTimeString()}.`);
      return;
    }

    if (/\b(date|today)\b/.test(lower)) {
      respond(`Today is ${new Date().toLocaleDateString()}.`);
      return;
    }

    const mathMatch = lower.match(/(?:what is|calculate|solve)?\s*([0-9+\-*/().\s%^]+)$/);
    if (mathMatch) {
      const result = safeEvalMath(mathMatch[1]);
      if (result !== null) {
        respond(`The answer is ${result}.`);
        return;
      }
    }

    const minecraftAnswer = findMinecraftAnswer(lower);
    if (minecraftAnswer) {
      showTyping();
      await new Promise(r => setTimeout(r, 500 + Math.random() * 500));
      respond(minecraftAnswer);
      return;
    }

    if (/\b(search|google|look up)\b/.test(lower)) {
      const query = trimmed.replace(/\b(search for|google|search|look up)\b/gi, '').trim();
      const link = `https://www.google.com/search?q=${encodeURIComponent(query + ' minecraft')}`;
      respond(`Here's a search for that:`, link);
      return;
    }

    showTyping();

    try {
      if (state.provider === 'google' && state.googleApiKey && state.googleCx) {
        const result = await callGoogleCSE(trimmed + ' minecraft');
        respond(result.text, result.link);
        return;
      }

      if (state.provider === 'claude' && state.claudeKey) {
        const result = await callClaude(trimmed);
        respond(result);
        return;
      }
    } catch (err) {
      console.error('Provider error:', err);
      hideTyping();
      respond('Sorry, I had trouble connecting to the AI service. Try again or switch providers in settings.');
      return;
    }

    hideTyping();
    respond(`I don't have specific information about that. Try asking about Minecraft items, mobs, crafting, or game mechanics! Or enable Google/Claude in settings for more answers.`);
  }

  function sendMessage() {
    const text = elements.messageInput.value.trim();
    if (!text) return;

    addMessage('user', text);
    elements.messageInput.value = '';

    processMessage(text).catch(err => {
      console.error('Error processing message:', err);
      hideTyping();
      respond('Sorry, something went wrong. Please try again.');
    });
  }

  function updateProviderSettings() {
    const provider = elements.provider.value;
    if (elements.googleSettings) elements.googleSettings.classList.toggle('active', provider === 'google');
    if (elements.claudeSettings) elements.claudeSettings.classList.toggle('active', provider === 'claude');
  }

  function openSettings() {
    if (elements.assistantName) elements.assistantName.value = state.name;
    if (elements.provider) elements.provider.value = state.provider;
    if (elements.googleApiKey) elements.googleApiKey.value = state.googleApiKey;
    if (elements.googleCx) elements.googleCx.value = state.googleCx;
    if (elements.claudeKey) elements.claudeKey.value = state.claudeKey;
    updateProviderSettings();
    if (elements.settingsModal) elements.settingsModal.classList.add('active');
  }

  function closeSettingsModal() {
    if (elements.settingsModal) elements.settingsModal.classList.remove('active');
  }

  function saveSettingsData() {
    state.name = (elements.assistantName && elements.assistantName.value.trim()) || 'Minecraft Assistant';
    state.provider = (elements.provider && elements.provider.value) || state.provider;
    state.googleApiKey = (elements.googleApiKey && elements.googleApiKey.value.trim()) || '';
    state.googleCx = (elements.googleCx && elements.googleCx.value.trim()) || '';
    state.claudeKey = (elements.claudeKey && elements.claudeKey.value.trim()) || '';
    saveState();
    closeSettingsModal();
    respond(`Settings saved! I'm now called ${state.name}.`);
  }

  function clearChat() {
    if (confirm('Are you sure you want to clear the chat history?')) {
      state.messages = [];
      saveState();
      if (elements.chat) elements.chat.innerHTML = '';
      addMessage('assistant', `Chat cleared! I'm ${state.name}, your Minecraft assistant. How can I help you?`);
    }
  }

  function restoreMessages() {
    if (!elements.chat) return;
    elements.chat.innerHTML = '';
    if (state.messages.length === 0) {
      addMessage('assistant', `Hello! I'm ${state.name}, your Minecraft AI assistant. Ask me about items, mobs, crafting recipes, or game mechanics!`, null, false);
    } else {
      state.messages.forEach(m => {
        const messageEl = createMessageElement(m.role, m.text, m.link);
        elements.chat.appendChild(messageEl);
      });
      elements.chat.scrollTop = elements.chat.scrollHeight;
    }
  }

  /* Side-nav: open / close / bindings */
  function openSideNav() {
    if (!elements.sideNav) return;
    elements.sideNav.classList.add('open');
    elements.sideNav.setAttribute('aria-hidden', 'false');
    if (elements.navToggleBtn) elements.navToggleBtn.setAttribute('aria-expanded', 'true');
    // focus first actionable control if available
    if (elements.signUpBtn) elements.signUpBtn.focus();
    document.addEventListener('keydown', handleEscCloseNav);
  }

  function closeSideNav() {
    if (!elements.sideNav) return;
    elements.sideNav.classList.remove('open');
    elements.sideNav.setAttribute('aria-hidden', 'true');
    if (elements.navToggleBtn) elements.navToggleBtn.setAttribute('aria-expanded', 'false');
    if (elements.navToggleBtn) elements.navToggleBtn.focus();
    document.removeEventListener('keydown', handleEscCloseNav);
  }

  function handleEscCloseNav(e) {
    if (e.key === 'Escape') closeSideNav();
  }

  function bindNavEvents() {
    // nav toggle
    if (elements.navToggleBtn) {
      elements.navToggleBtn.addEventListener('click', () => {
        const isOpen = elements.sideNav && elements.sideNav.classList.contains('open');
        if (isOpen) closeSideNav(); else openSideNav();
      });
    }

    // backdrop click to close
    if (elements.sideNavBackdrop) {
      elements.sideNavBackdrop.addEventListener('click', closeSideNav);
    }

    // back button inside nav
    if (elements.navBackBtn) {
      elements.navBackBtn.addEventListener('click', closeSideNav);
    }

    // sign up/in/discord - placeholder behaviors
    if (elements.signUpBtn) {
      elements.signUpBtn.addEventListener('click', () => {
        closeSideNav();
        window.location.hash = '#signup';
        addMessage('assistant', 'Opening Sign Up flow... (placeholder)');
      });
    }

    if (elements.signInBtn) {
      elements.signInBtn.addEventListener('click', () => {
        closeSideNav();
        window.location.hash = '#signin';
        addMessage('assistant', 'Opening Sign In flow... (placeholder)');
      });
    }

    if (elements.discordBtn) {
      elements.discordBtn.addEventListener('click', () => {
        const discordUrl = 'https://discord.gg/';
        window.open(discordUrl, '_blank', 'noopener');
        closeSideNav();
      });
    }
  }

  function bindEvents() {
    if (elements.sendBtn) elements.sendBtn.addEventListener('click', sendMessage);

    if (elements.messageInput) {
      elements.messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          sendMessage();
        }
      });
    }

    if (elements.settingsBtn) elements.settingsBtn.addEventListener('click', openSettings);
    if (elements.closeSettings) elements.closeSettings.addEventListener('click', closeSettingsModal);
    if (elements.saveSettings) elements.saveSettings.addEventListener('click', saveSettingsData);
    if (elements.clearBtn) elements.clearBtn.addEventListener('click', clearChat);
    if (elements.provider) elements.provider.addEventListener('change', updateProviderSettings);

    if (elements.settingsModal) {
      elements.settingsModal.addEventListener('click', (e) => {
        if (e.target === elements.settingsModal) {
          closeSettingsModal();
        }
      });
    }

    // Nav bindings
    bindNavEvents();
  }

  function init() {
    loadState();
    bindEvents();
    restoreMessages();
    if (elements.messageInput) elements.messageInput.focus();
  }

  init();
})();
