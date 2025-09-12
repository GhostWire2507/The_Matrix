const canvas = document.getElementById("matrixCanvas");
const ctx = canvas.getContext("2d");

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

// Falling characters
const letters = "♡🍦❀✿🍦❣☁︎❃❦🍦🍦".split("");
const fontSize = 16;
const columns = canvas.width / fontSize;
const drops = Array.from({ length: columns }).map(() => 1);

// Palettes of pink shades + matching background
const palettes = [
  {
    bg: "#fff0f5", // Lavender blush
    colors: ["#ffb6c1", "#ffc0cb", "#ffd6e7", "#ffe4ec"],
  },
  {
    bg: "#fde4ec", // Very light rose
    colors: ["#f8bbd0", "#f48fb1", "#f06292", "#ec407a"],
  },
  {
    bg: "#fff5f7", // Soft baby pink
    colors: ["#ffe0f0", "#ffccdd", "#ffb3c6", "#ff99bb"],
  },
  {
    bg: "#fef0f7", // Light blossom pink
    colors: ["#fddde6", "#fbcce7", "#f8b6dc", "#f699cd"],
  },
];

// Messages
const messages = [
  "it's going to be okay, it's just the weather, since you know...spring and allergies",
  "Just breathe okay — you’ve got this 🍦",
  "Sometimes it's cloudy and sometimes its windy, but other times....other time, other times it's the best day",
  "Rest, hydrate, and be gentle with yourself. It's just one of those days ✨",
  "it’s not you, it’s the weather — have something sweet and it'll be better",
  "Even when you feel alone you're not, hack you know my number by heart",
  "FIGHTIIING! 🫰🏼",
  "Smell the roses, I mean they worked so hard to smell like you, so take the time",
  " 1+1 isn't always two, sometimes it's a group of friends that make you laugh even when you're sad",
  "Correlation is when two things happens together, Causality is when one causes the other. Learn that, it's important",
  "Sometimes we cry and think that makes us weak, take it from me, not crying it the real weakness",
  "You're beautiful, smokin' hot, fyn shyt and you have a nice butt, look in the mirror, twice in fact and you'll see",
  "Life is boring, do the thing, have fun, be excited. You'll explain later",
  
];

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

