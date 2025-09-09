// Grab canvas and set up
const canvas = document.getElementById("matrixCanvas");
const ctx = canvas.getContext("2d");

// Make canvas full screen
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

// Characters to fall down
const letters = "♡✿❀♥❣❤☀❃".split(""); 
const fontSize = 14;
const columns = canvas.width / fontSize;

// Store drops
const drops = [];
for (let x = 0; x < columns; x++) {
  drops[x] = 1;
}

// Draw function
function draw() {
  // Slight pink fade effect
  ctx.fillStyle = "rgba(255, 230, 242, 0.1)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#ff69b4"; // hot pink falling text
  ctx.font = fontSize + "px monospace";

  for (let i = 0; i < drops.length; i++) {
    const text = letters[Math.floor(Math.random() * letters.length)];
    ctx.fillText(text, i * fontSize, drops[i] * fontSize);

    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }

    drops[i]++;
  }
}

// Animate
setInterval(draw, 50);

// 💡 You can easily change the center message like this:
document.getElementById("affirmation").innerText =
  "it's going to be okay, it's just the weather, maybe even your luteal phase but that's not important, let's blame the weather okay?";
