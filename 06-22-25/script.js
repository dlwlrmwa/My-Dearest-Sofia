function showLetterWithHearts() {
  createHearts(100);
  document.getElementById("heart-container").classList.remove("hidden");

  setTimeout(() => {
    document.getElementById("landing").classList.add("hidden");
    document.getElementById("letterPage").classList.remove("hidden");
    document.getElementById("heart-container").classList.add("hidden");
    document.getElementById("heart-container").innerHTML = "";
  }, 900);
}

function goBack() {
  document.getElementById("letterPage").classList.add("hidden");
  document.getElementById("landing").classList.remove("hidden");
  document.getElementById("spotify-embed").classList.add("hidden");
}

function createHearts(count) {
  const container = document.getElementById("heart-container");
  for (let i = 0; i < count; i++) {
    const heart = document.createElement("div");
    heart.classList.add("heart");
    heart.textContent = "💗";
    heart.style.left = Math.random() * 100 + "vw";
    heart.style.top = Math.random() * 100 + "vh";
    container.appendChild(heart);
  }
}

function showSpotify() {
  const embed = document.getElementById("spotify-embed");
  embed.classList.remove("hidden");

  embed.scrollIntoView({ behavior: "smooth" });
}
