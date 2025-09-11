const canvas = document.getElementById("matrixCanvas");
const ctx = canvas.getContext("2d");

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

// Falling characters
const letters = "♡❀✿❣☁︎❃❦".split("");
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
  "it's going to be okay, it's just the weather 🌸",
  "breathe in, breathe out — you’ve got this 💕",
  "sometimes clouds pass, but the sun always returns ☀️",
  "rest, hydrate, and be gentle with yourself ✨",
  "it’s not you, it’s the weather — promise 💖",
];

let currentPalette = 0;

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
    // Change message after fade-out
    const newMsg = messages[Math.floor(Math.random() * messages.length)];
    affirmation.innerText = newMsg;

    // Change color palette
    currentPalette = (currentPalette + 1) % palettes.length;
    document.body.style.backgroundColor = palettes[currentPalette].bg;

    // Fade back in
    affirmation.classList.remove("fade-out");
  }, 1000); // matches transition duration
});

// Set initial background
document.body.style.backgroundColor = palettes[currentPalette].bg;

// Handle resizing
window.addEventListener("resize", () => {
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
});
