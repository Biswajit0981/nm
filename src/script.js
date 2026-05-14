const personName = document.querySelector("#personName");
const wishButton = document.querySelector("#wishButton");
const sparkButton = document.querySelector("#sparkButton");
const sparkField = document.querySelector("#sparkField");
const wishPanel = document.querySelector("#wishPanel");
const wishTitle = document.querySelector("#wishTitle");
const wishText = document.querySelector("#wishText");
const photoRail = document.querySelector("#photoRail");
const memoryCount = document.querySelector("#memoryCount");
const prevPhoto = document.querySelector("#prevPhoto");
const nextPhoto = document.querySelector("#nextPhoto");

const birthdayPhotos = [
  { src: "./public/namu.jpeg", label: "Namrata", quote: "Birthday queen detected. Everyone else may now clap politely." },
  { src: "./public/Gemini_Generated_Image_.png", label: "Birthday art", quote: "This picture said: make it magical, but keep the cake nearby." },
  { src: "./public/IMG-20251001-WA0097.jpg", label: "Sweet memory", quote: "Smiling like the camera promised extra dessert." },
  { src: "./public/IMG-20251001-WA0103.jpg", label: "Favorite smile", quote: "Warning: this smile may improve nearby moods." },
  { src: "./public/IMG-20251001-WA0104.jpg", label: "Happy moment", quote: "Proof that happiness has excellent lighting." },
  { src: "./public/IMG-20251001-WA0106.jpg", label: "Bright day", quote: "Main character energy, no permission required." },
  { src: "./public/IMG-20251001-WA0108.jpg", label: "Pure joy", quote: "Too cute to scroll past. The internet has rules." },
  { src: "./public/IMG-20251001-WA0110.jpg", label: "Special memory", quote: "A classic moment, now available in birthday edition." },
  { src: "./public/IMG-20260316-WA0011.jpg", label: "Birthday glow", quote: "Glow level: needs sunglasses and maybe a fan club." },
  { src: "./public/IMG-20260316-WA0013.jpg", label: "Beautiful moment", quote: "Casually looking like the best part of the day." },
  { src: "./public/IMG-20260316-WA0015.jpg", label: "Lovely day", quote: "This photo just asked for cake and compliments." },
  { src: "./public/IMG-20260316-WA0017.jpg", label: "Best memory", quote: "Memory saved. Smile backed up successfully." },
];

const messages = [
  {
    title: "Wishing you joy in every chapter",
    text: "May this birthday bring fresh energy, clear dreams, good people, and countless little wins. Keep glowing in your own way.",
  },
  {
    title: "May your new year feel lighter",
    text: "I hope the days ahead surprise you with peace, laughter, confidence, and everything you have quietly been hoping for.",
  },
  {
    title: "Another year, brighter than before",
    text: "May your heart stay curious, your plans turn real, and your life keep filling with moments worth remembering.",
  },
];

let messageIndex = 0;
let activePhotoIndex = 0;
let parallaxFrame = null;

function initLenis() {
  if (!window.Lenis || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const lenis = new window.Lenis({
    duration: 1.15,
    smoothWheel: true,
    wheelMultiplier: 0.9,
  });

  function raf(time) {
    lenis.raf(time);
    updatePhotoParallax();
    window.requestAnimationFrame(raf);
  }

  window.requestAnimationFrame(raf);

  document.querySelectorAll("[data-scroll-to]").forEach((link) => {
    link.addEventListener("click", (event) => {
      const target = document.querySelector(link.getAttribute("href"));

      if (target) {
        event.preventDefault();
        lenis.scrollTo(target, { offset: -16 });
      }
    });
  });
}

function renderPhotos() {
  if (!photoRail) return;

  if (!birthdayPhotos.length) {
    photoRail.innerHTML =
      '<div class="photo-empty">Add photo filenames to birthdayPhotos in src/script.js.</div>';
    return;
  }

  photoRail.innerHTML = birthdayPhotos
    .map(
      (photo, index) => `
        <figure class="photo-card" id="photo-${index + 1}" data-file="${photo.src.replace("./public/", "")}" tabindex="0">
          <img src="${photo.src}" alt="${photo.label}" loading="lazy" />
          <div class="quote-popup" role="note">${photo.quote}</div>
          <figcaption>
            <span>${String(index + 1).padStart(2, "0")}</span>
            <span>${photo.label}</span>
          </figcaption>
        </figure>
      `,
    )
    .join("");

  if (memoryCount) {
    memoryCount.textContent = String(birthdayPhotos.length).padStart(2, "0");
  }

  photoRail.querySelectorAll("img").forEach((image) => {
    image.addEventListener("error", () => {
      image.closest(".photo-card")?.classList.add("is-missing");
    });
  });

  updatePhotoParallax();
  window.setTimeout(updatePhotoParallax, 150);
}

function updatePhotoParallax() {
  if (!photoRail || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const viewportCenter = window.innerHeight / 2;

  photoRail.querySelectorAll(".photo-card").forEach((card) => {
    const rect = card.getBoundingClientRect();
    const cardCenter = rect.top + rect.height / 2;
    const distance = cardCenter - viewportCenter;
    const movement = Math.max(-32, Math.min(32, distance * -0.055));

    card.style.setProperty("--card-parallax", `${movement}px`);
  });
}

function requestPhotoParallax() {
  if (parallaxFrame) return;

  parallaxFrame = window.requestAnimationFrame(() => {
    updatePhotoParallax();
    parallaxFrame = null;
  });
}

function scrollToPhoto(index) {
  if (!birthdayPhotos.length) return;

  activePhotoIndex = (index + birthdayPhotos.length) % birthdayPhotos.length;
  const target = document.querySelector(`#photo-${activePhotoIndex + 1}`);

  if (target) {
    target.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

function createSpark() {
  if (!sparkField) return;

  const spark = document.createElement("span");
  const size = Math.random() * 8 + 5;
  const angle = Math.random() * Math.PI * 2;
  const distance = Math.random() * 170 + 70;
  const x = Math.cos(angle) * distance;
  const y = Math.sin(angle) * distance;
  const colors = ["#f45b87", "#ff7a59", "#30c9a8", "#4587ff", "#ffcf4a"];

  spark.className = "spark";
  spark.style.left = `${45 + Math.random() * 10}%`;
  spark.style.top = `${42 + Math.random() * 12}%`;
  spark.style.width = `${size}px`;
  spark.style.height = `${size}px`;
  spark.style.setProperty("--x", `${x}px`);
  spark.style.setProperty("--y", `${y}px`);
  spark.style.setProperty("--spark-color", colors[Math.floor(Math.random() * colors.length)]);

  sparkField.appendChild(spark);
  window.setTimeout(() => spark.remove(), 1000);
}

function launchSparks(count = 34) {
  for (let i = 0; i < count; i += 1) {
    window.setTimeout(createSpark, i * 18);
  }
}

wishButton?.addEventListener("click", () => {
  messageIndex = (messageIndex + 1) % messages.length;
  const message = messages[messageIndex];
  wishTitle.textContent = message.title;
  wishText.textContent = message.text;
  wishPanel.classList.add("show");
  launchSparks(46);
});

sparkButton?.addEventListener("click", () => {
  launchSparks(54);
});

prevPhoto?.addEventListener("click", () => {
  scrollToPhoto(activePhotoIndex - 1);
});

nextPhoto?.addEventListener("click", () => {
  scrollToPhoto(activePhotoIndex + 1);
});

window.addEventListener("load", () => {
  initLenis();
  renderPhotos();
  wishPanel.classList.add("show");
  window.setTimeout(() => launchSparks(26), 500);
});

window.addEventListener("scroll", requestPhotoParallax, { passive: true });
window.addEventListener("resize", requestPhotoParallax);
