document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("matrixCanvas");
  const ctx = canvas.getContext("2d");
  const affirmation = document.getElementById("affirmation");
  const mainContainer = document.getElementById("mainContainer");
  const moodContainer = document.getElementById("moodContainer");
  const refreshBtn = document.getElementById("refreshBtn");
  const bgMusic = document.getElementById("bgMusic");

  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;

  // 🧁 Cupcake matrix
  const letters = "♡🍦❀✿❣☁︎❃❦🧁".split("");
  const fontSize = 16;
  const columns = canvas.width / fontSize;
  const drops = Array.from({ length: columns }).map(() => 1);

  const palettes = {
    sad: { bg: "#fff0f5", colors: ["#ffb6c1", "#ffc0cb", "#ffd6e7", "#ffe4ec"] },
    overwhelmed: { bg: "#fde4ec", colors: ["#f8bbd0", "#f48fb1", "#f06292", "#ec407a"] },
    confidence: { bg: "#fff5f7", colors: ["#ffe0f0", "#ffccdd", "#ffb3c6", "#ff99bb"] },
  };

  // 🩷 Mood-based affirmations
  const moodMessages = {
    sad: [
      "It's okay to cry, it's how your soul breathes 🌧️",
      "You don’t have to fix everything right now. Just rest.",
      "Sometimes, soft moments heal the loudest hurts 🍦",
      "Even storms end. You’ll see the sun again soon 🌤️",
    ],
    overwhelmed: [
      "Breathe. You are doing enough. You *are* enough. 🌪️",
      "Take one step. That’s all progress needs right now.",
      "You’re not behind — you’re just taking a detour to peace 🌸",
      "Pause, sip some water, stretch — small calm moments matter 💧",
    ],
    confidence: [
      "Look at you — existing beautifully and trying again 💖",
      "You're not less. You're the blueprint ✨",
      "Your energy? Unmatchable. Your worth? Non-negotiable 🔥",
      "Don’t shrink. The world needs the version of you that glows 🌟",
    ]
  };

  let currentMood = null;
  let currentPalette = null;
  let messagePool = [];

  // 🎵 Play song once at first refresh
  let musicPlayed = false;

  // Matrix animation
  function draw() {
    if (!currentPalette) return;
    ctx.fillStyle = "rgba(255, 240, 245, 0.2)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const colors = currentPalette.colors;
    ctx.font = fontSize + "px monospace";

    for (let i = 0; i < drops.length; i++) {
      const text = letters[Math.floor(Math.random() * letters.length)];
      ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);

      if (drops[i] * fontSize > canvas.height && Math.random() > 0.985) {
        drops[i] = 0;
      }
      drops[i] += 0.5;
    }
  }
  setInterval(draw, 70);

  // Utility
  function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function getNextMessage() {
    if (messagePool.length === 0) messagePool = shuffleArray([...moodMessages[currentMood]]);
    return messagePool.pop();
  }

  // 🎭 Mood Selection Buttons
  document.querySelectorAll(".mood-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      currentMood = btn.dataset.mood;
      currentPalette = palettes[currentMood];
      messagePool = shuffleArray([...moodMessages[currentMood]]);
      document.body.style.backgroundColor = currentPalette.bg;

      // Hide mood menu & show main content
      moodContainer.classList.add("hidden");
      mainContainer.classList.remove("hidden");

      // Show first affirmation
      affirmation.innerText = getNextMessage();
    });
  });

  // 🔄 Refresh button functionality
  refreshBtn.addEventListener("click", () => {
    affirmation.classList.add("fade-out");

    setTimeout(() => {
      affirmation.innerText = getNextMessage();
      document.body.style.backgroundColor = currentPalette.bg;
      affirmation.classList.remove("fade-out");

      // Play background song only on first refresh
      if (!musicPlayed) {
        bgMusic.currentTime = 37;
        bgMusic.play();
        musicPlayed = true;
      }
    }, 1000);
  });

  window.addEventListener("resize", () => {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
  });
});  ],
  confidence: [
    "Look at you — existing beautifully and trying again 💖",
    "You're not less. You're the blueprint ✨",
    "Your energy? Unmatchable. Your worth? Non-negotiable 🔥",
    "Don’t shrink. The world needs the version of you that glows 🌟",
  ]
};

let currentMood = null;
let currentPalette = null;
let messagePool = [];

// 🎵 Play song once at first refresh
let musicPlayed = false;

// Matrix animation
function draw() {
  if (!currentPalette) return;
  ctx.fillStyle = "rgba(255, 240, 245, 0.2)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const colors = currentPalette.colors;
  ctx.font = fontSize + "px monospace";

  for (let i = 0; i < drops.length; i++) {
    const text = letters[Math.floor(Math.random() * letters.length)];
    ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
    ctx.fillText(text, i * fontSize, drops[i] * fontSize);

    if (drops[i] * fontSize > canvas.height && Math.random() > 0.985) {
      drops[i] = 0;
    }
    drops[i] += 0.5;
  }
}
setInterval(draw, 70);

// Utility
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
function getNextMessage() {
  if (messagePool.length === 0) messagePool = shuffleArray([...moodMessages[currentMood]]);
  return messagePool.pop();
}

// Mood Selection
document.querySelectorAll(".mood-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    currentMood = btn.dataset.mood;
    currentPalette = palettes[currentMood];
    messagePool = shuffleArray([...moodMessages[currentMood]]);
    document.body.style.backgroundColor = currentPalette.bg;

    moodContainer.classList.add("hidden");
    mainContainer.classList.remove("hidden");

    affirmation.innerText = getNextMessage();
  });
});

// Refresh functionality
refreshBtn.addEventListener("click", () => {
  affirmation.classList.add("fade-out");

  setTimeout(() => {
    affirmation.innerText = getNextMessage();
    document.body.style.backgroundColor = currentPalette.bg;
    affirmation.classList.remove("fade-out");

    if (!musicPlayed) {
      bgMusic.currentTime = 37;
      bgMusic.play();
      musicPlayed = true;
    }
  }, 1000);
});

window.addEventListener("resize", () => {
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
});  "Sometimes it's cloudy and sometimes it's windy, but other times....other time, other times it's the best day",
  "Rest, hydrate, and be gentle with yourself. It's just one of those days ✨",
  "it’s not you, it’s the weather — have something sweet and it'll be better",
  "Even when you feel alone you're not, heck you know my number by heart",
  "FIGHTIIING! 🫰🏼",
  "Smell the roses, I mean they worked so hard to smell like you, to look like you, so take the time",
  "1+1 isn't always two, sometimes it's a group of friends that make you laugh even when you're sad",
  "Correlation is when two things happens together, Causality is when one causes the other. Learn that, it's important",
  "Sometimes we cry and think that makes us weak, take it from me, not crying is the real weakness",
  "You're beautiful, smokin' hot, fyn shyt and you have a nice butt, look in the mirror, twice in fact and you'll see",
  "Life is boring, do the thing, have fun, be excited. You'll explain later",
  "I know it sucks right now. I know it's a bit of a mess but you're doing great okay, so get up",
  "The worst decision you can make is not being you. You're to pretty and too amazing hide her, everything else can be explained",
  "I love the way you love. It's beautiful like you",
  "I miss you...",
]

  
let currentPalette = 0;

// 🔄 Message pool to avoid repeats
let messagePool = [...messages];

// Fisher-Yates shuffle
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Get next unique message
function getNextMessage() {
  if (messagePool.length === 0) {
    messagePool = shuffleArray([...messages]); // reshuffle once all used
  }
  return messagePool.pop();
}

// Draw function
function draw() {
  ctx.fillStyle = "rgba(255, 240, 245, 0.2)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const palette = palettes[currentPalette];
  const colors = palette.colors;
  ctx.font = fontSize + "px monospace";

  for (let i = 0; i < drops.length; i++) {
    const text = letters[Math.floor(Math.random() * letters.length)];
    const color = colors[Math.floor(Math.random() * colors.length)];
    ctx.fillStyle = color;

    ctx.fillText(text, i * fontSize, drops[i] * fontSize);

    if (drops[i] * fontSize > canvas.height && Math.random() > 0.985) {
      drops[i] = 0;
    }

    drops[i] += 0.5; // slower fall
  }
}

setInterval(draw, 70);

// 🎵 Background music setup
const bgMusic = document.getElementById("bgMusic");
let musicStarted = false; // prevent multiple restarts

// Button functionality
document.getElementById("refreshBtn").addEventListener("click", () => {
  const affirmation = document.getElementById("affirmation");

  // Fade out first
  affirmation.classList.add("fade-out");

  setTimeout(() => {
    // ✅ Use non-repeating message cycle
    const newMsg = getNextMessage();
    affirmation.innerText = newMsg;

    // Change color palette
    currentPalette = (currentPalette + 1) % palettes.length;
    document.body.style.backgroundColor = palettes[currentPalette].bg;

    // Fade back in
    affirmation.classList.remove("fade-out");

    // 🎵 Start music only on first refresh
    if (!musicStarted) {
      bgMusic.currentTime = 37; // start from 37s
      bgMusic.volume = 0.2;     // soft volume
      bgMusic.play().catch(err => {
        console.log("Music play blocked until user interacts:", err);
      });
      musicStarted = true;
    }
  }, 1000); // matches transition duration
});

// Set initial background + first message
document.body.style.backgroundColor = palettes[currentPalette].bg;
document.getElementById("affirmation").innerText = getNextMessage();

// Handle resizing
window.addEventListener("resize", () => {
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
});







