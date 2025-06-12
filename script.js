const applyAOS = (root = document.body) => {
  root.querySelectorAll("*:not([data-aos])").forEach(el => {
    if (el instanceof Element && typeof el.setAttribute === "function") {
      el.setAttribute("data-aos", "fade-up");
    }
  });
};

const observer = new MutationObserver(mutations => {
  for (const mutation of mutations) {
    mutation.addedNodes.forEach(node => {
      if (node instanceof Element) {
        applyAOS(node);
        AOS.refresh();
      }
    });
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

window.onload = function () {
  const canvas = document.getElementById("rain-canvas");
  const ctx = canvas.getContext("2d");

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  class Raindrop {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * -height;
      this.length = 8 + Math.random() * 12;
      this.speed = 4 + Math.random() * 4;
      this.opacity = 0.2 + Math.random() * 0.3;
      this.width = 0.5 + Math.random() * 0.5;
      this.splashCreated = false;
    }
    update() {
      this.y += this.speed;
      if (this.y > height - 5 && !this.splashCreated) {
        createSplash(this.x, height - 5);
        this.splashCreated = true;
      }
      if (this.y > height) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.strokeStyle = `rgba(173, 216, 230, ${this.opacity})`;
      ctx.lineWidth = this.width;
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x, this.y + this.length);
      ctx.stroke();
    }
  }

  class Splash {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.radius = 0;
      this.maxRadius = 3 + Math.random() * 3;
      this.alpha = 0.4;
    }
    update() {
      this.radius += 0.3;
      this.alpha -= 0.015;
    }
    draw() {
      if (this.alpha <= 0) return;
      ctx.beginPath();
      ctx.strokeStyle = `rgba(173,216,230,${this.alpha})`;
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.stroke();
    }
    isFinished() {
      return this.alpha <= 0;
    }
  }

  const raindrops = [];
  const splashes = [];

  function createSplash(x, y) {
    splashes.push(new Splash(x, y));
  }

  function createRaindrops(count) {
    for (let i = 0; i < count; i++) {
      raindrops.push(new Raindrop());
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    raindrops.forEach(drop => {
      drop.update();
      drop.draw();
    });
    splashes.forEach((splash, index) => {
      splash.update();
      splash.draw();
      if (splash.isFinished()) {
        splashes.splice(index, 1);
      }
    });
    requestAnimationFrame(animate);
  }

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  createRaindrops(500);
  animate();
};

const textEl = document.getElementById("naigo-typing-text");
const shuriken = document.getElementById("naigo-loader-shuriken");
const mainContent = document.getElementById("naigo-main-content");

const text = "Naigo";
let index = 0;

function typeText() {
  if (index < text.length) {
    textEl.textContent += text.charAt(index);
    index++;
    setTimeout(typeText, 200);
  } else {
    showShuriken();
  }
}

function showShuriken() {
  shuriken.style.opacity = "1";
  shuriken.style.animation = "spin-naigo-loader 2s linear forwards";

  setTimeout(() => {
    document.getElementById("naigo-loader").style.display = "none";
    mainContent.classList.add("visible");

    // 🔄 اعمال AOS بعد از لودینگ
    applyAOS(mainContent);
    AOS.init({ duration: 1000, once: true });
    AOS.refresh();
  }, 2000);
}

typeText();