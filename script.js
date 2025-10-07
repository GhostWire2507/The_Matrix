document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("matrixCanvas");
  const ctx = canvas.getContext("2d");
  const affirmation = document.getElementById("affirmation");
  const mainContainer = document.getElementById("mainContainer");
  const moodContainer = document.getElementById("moodContainer");
  const refreshBtn = document.getElementById("refreshBtn");
  const bgMusic = document.getElementById("bgMusic");
  const backBtn = document.getElementById("backBtn"); // 👈 Added

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
      "Sometimes we cry and think that makes us weak, take it from me, not crying is the real weakness",
      "I know it sucks right now. I know it's a bit of a mess but you're doing great okay, so get up",
    ],
    overwhelmed: [
      "Breathe. You are doing enough. You *are* enough. 🌪️",
      "Take one step. That’s all progress needs right now.",
      "You’re not behind — you’re just taking a detour to peace 🌸",
      "Pause, sip some water, stretch — small calm moments matter 💧",
      "Life is boring, do the thing, have fun, be excited. You'll explain later",
    ],
    confidence: [
      "Look at you — existing beautifully and trying again 💖",
      "You're not less. You're the blueprint ✨",
      "Your energy? Unmatchable. Your worth? Non-negotiable 🔥",
      "Don’t shrink. The world needs the version of you that glows 🌟",
      "You're beautiful, smokin' hot, fyn shyt and you have a nice butt, look in the mirror, twice in fact and you'll see",
      "The worst decision you can make is not being you. You're too pretty and too amazing to hide her, everything else can be explained",
    ]
  };

  let currentMood = null;
  let currentPalette = null;
  let messagePool = [];
  let musicPlayed = false;

  // 🍥 Matrix animation
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

  // 🔀 Shuffle utility
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

  // 🎭 Mood selection
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

  // 🔄 Refresh button
  refreshBtn.addEventListener("click", () => {
    affirmation.classList.add("fade-out");

    setTimeout(() => {
      affirmation.innerText = getNextMessage();
      document.body.style.backgroundColor = currentPalette.bg;
      affirmation.classList.remove("fade-out");

      if (!musicPlayed) {
        bgMusic.currentTime = 38;
        bgMusic.volume = 0.2;
        bgMusic.play();
        musicPlayed = true;
      }
    }, 1000);
  });

  // ⬅️ Back to moods button
  backBtn.addEventListener("click", () => {
    mainContainer.classList.add("hidden");
    moodContainer.classList.remove("hidden");
    currentMood = null;
    currentPalette = null;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  });

  window.addEventListener("resize", () => {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
  });
});
