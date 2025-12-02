document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("matrixCanvas");
  const ctx = canvas.getContext("2d");
  const affirmation = document.getElementById("affirmation");
  const mainContainer = document.getElementById("mainContainer");
  const moodContainer = document.getElementById("moodContainer");
  const refreshBtn = document.getElementById("refreshBtn");
  const bgMusic = document.getElementById("bgMusic");
  const backBtn = document.getElementById("backBtn");
  const secretBtn = document.getElementById("secretBtn");
  const secretModal = document.getElementById("secretModal");
  const secretNote = document.getElementById("secretNote");
  const secretProgress = document.getElementById("secretProgress");
  const secretMusic = document.getElementById("secretMusic");
  const secretCloseBtn = document.querySelector(".secret-close-btn");
  const secretNextBtn = document.getElementById("secretNextBtn");
  const secretPrevBtn = document.getElementById("secretPrevBtn");

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
      "Breathe. You are doing enough. You ARE enough. 🌪️",
      "Take one step. That’s all progress needs right now.",
      "You’re not behind — you’re just taking a detour to peace 🌸",
      "Pause, sip some water, stretch — small calm moments matter 💧",
      "Life is boring, do the thing, have fun, be excited. You'll explain later",
      "You can't fix everything all at once all the time, breathe. Smell the flowers, they worked really hard to look like you",
    ],
    confidence: [
      "Look at you — existing beautifully and trying again 💖",
      "You're not less. You're the blueprint ✨",
      "Your energy? Unmatchable. Your worth? Non-negotiable 🔥",
      "Don’t shrink. The world needs the version of you that glows 🌟",
      "The best part about you is you. Remember that",
      "You're beautiful, smokin' hot, fyn shyt and you have a nice butt, look in the mirror, twice in fact and you'll see",
      "The worst decision you can make is not being you. You're too pretty and too amazing to hide her, everything else can be explained",
    ]
  };

  let currentMood = null;
  let currentPalette = null;
  let messagePool = [];
  let musicPlayed = false;
  let allNotes = [];
  let secretNoteSequence = [];
  let currentNoteIndex = 0;
  let seenNotes = new Set();
  let secretMusicPlayed = false;

  let earlyRandomPool = [];
  let lateRandomPool = [];
  let orderedLateNotes = [];

  async function loadNotes() {
    try {
      const response = await fetch("notes.json");
      const data = await response.json();
      allNotes = data.notes;
      initializeSecretSequence();
    } catch (error) {
      console.error("Error loading notes:", error);
    }
  }

  function initializeSecretSequence() {
    const firstNote = allNotes.find(n => n.group === "alwaysFirst");
    const earlyRandom = allNotes.filter(n => n.group === "earlyRandom");
    const orderedLate = allNotes.filter(n => n.group === "orderedLate");
    const lateRandom = allNotes.filter(n => n.group === "lateRandom");
    const lastNote = allNotes.find(n => n.group === "alwaysLast");

    earlyRandomPool = [...earlyRandom];
    lateRandomPool = [...lateRandom];
    orderedLateNotes = orderedLate;

    secretNoteSequence = [firstNote, ...shuffleArray(earlyRandomPool), ...buildLateSequence(), lastNote].filter(Boolean);
  }

  function buildLateSequence() {
    const shuffledLateRandom = shuffleArray([...lateRandomPool]);
    const result = [];

    for (let i = 0; i < Math.max(orderedLateNotes.length, shuffledLateRandom.length); i++) {
      if (i < orderedLateNotes.length) {
        result.push(orderedLateNotes[i]);
      }
      if (i < shuffledLateRandom.length) {
        result.push(shuffledLateRandom[i]);
      }
    }

    return result;
  }

  function openSecretModal() {
    if (secretNoteSequence.length === 0) return;
    currentNoteIndex = 0;
    displaySecretNote();
    secretModal.classList.remove("hidden");
    startSecretMusic();
  }

  function displaySecretNote() {
    if (currentNoteIndex >= secretNoteSequence.length) return;

    const note = secretNoteSequence[currentNoteIndex];
    secretNote.textContent = note.text;
    seenNotes.add(note.id);
    secretProgress.textContent = `${currentNoteIndex + 1} of ${secretNoteSequence.length}`;

    secretPrevBtn.disabled = currentNoteIndex === 0;
    secretNextBtn.disabled = currentNoteIndex === secretNoteSequence.length - 1;
  }

  function nextSecretNote() {
    if (currentNoteIndex < secretNoteSequence.length - 1) {
      currentNoteIndex++;
      displaySecretNote();
    }
  }

  function prevSecretNote() {
    if (currentNoteIndex > 0) {
      currentNoteIndex--;
      displaySecretNote();
    }
  }

  function closeSecretModal() {
    secretModal.classList.add("hidden");
    secretMusic.pause();
    secretMusicPlayed = false;
  }

  function startSecretMusic() {
    if (!secretMusicPlayed) {
      secretMusic.currentTime = 0;
      secretMusic.volume = 0.2;
      secretMusic.play();
      secretMusicPlayed = true;
    }
  }

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
    secretBtn.classList.remove("hidden");
    closeSecretModal();
  });

  secretBtn.addEventListener("click", openSecretModal);
  secretCloseBtn.addEventListener("click", closeSecretModal);
  secretNextBtn.addEventListener("click", nextSecretNote);
  secretPrevBtn.addEventListener("click", prevSecretNote);

  secretModal.addEventListener("click", (e) => {
    if (e.target === secretModal) {
      closeSecretModal();
    }
  });

  // 🎭 Mood selection - hide secret button when mood is selected
  document.querySelectorAll(".mood-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      currentMood = btn.dataset.mood;
      currentPalette = palettes[currentMood];
      messagePool = shuffleArray([...moodMessages[currentMood]]);
      document.body.style.backgroundColor = currentPalette.bg;

      moodContainer.classList.add("hidden");
      mainContainer.classList.remove("hidden");
      secretBtn.classList.add("hidden");

      affirmation.classList.remove("fade-out");
      affirmation.innerText = getNextMessage();

      if (!musicPlayed) {
        bgMusic.currentTime = 38;
        bgMusic.volume = 0.2;
        bgMusic.play();
        musicPlayed = true;
      }
    });
  });

  window.addEventListener("resize", () => {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
  });

  loadNotes();
});

