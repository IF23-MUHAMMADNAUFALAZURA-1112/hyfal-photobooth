const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const captureBtn = document.getElementById("captureBtn");
const downloadBtn = document.getElementById("downloadBtn");

const titleInput = document.getElementById("inputTitle");
const footerInput = document.getElementById("inputFooter");

const frame = document.getElementById("frame");
const title = document.getElementById("title");
const footer = document.getElementById("footer");

const templateButtons = document.querySelectorAll(".template-btn");
const images = [
  document.getElementById("img1"),
  document.getElementById("img2"),
  document.getElementById("img3")
];

let photoIndex = 0;

/* =====================
   CAMERA INIT
===================== */
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    video.srcObject = stream;
  });

/* =====================
   CAPTURE PHOTO
===================== */
captureBtn.addEventListener("click", () => {
  if (photoIndex >= images.length) return;

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0);

  images[photoIndex].src = canvas.toDataURL("image/png");
  photoIndex++;
});

/* =====================
   TEMPLATE SWITCH
===================== */
templateButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    templateButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    frame.className = "frame frame-" + btn.dataset.template;
  });
});

/* =====================
   TEXT UPDATE
===================== */
titleInput.addEventListener("input", e => {
  title.textContent = e.target.value || "Happy Moment";
});

footerInput.addEventListener("input", e => {
  footer.textContent = e.target.value || "Photo Booth • 2026";
});

/* =====================
   DOWNLOAD RESULT
===================== */
downloadBtn.addEventListener("click", () => {
  html2canvas(frame).then(canvas => {
    const link = document.createElement("a");
    link.download = "photo-booth.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
});
/* =====================
   FRAME COLOR SYSTEM
===================== */

const solidColors = [
  "#ffffff","#000000","#fda4af","#bfdbfe","#bbf7d0",
  "#fde68a","#fbcfe8","#ddd6fe","#99f6e4","#fecaca"
];

const gradients = [
  "linear-gradient(135deg,#ff9a9e,#fad0c4)",
  "linear-gradient(135deg,#a18cd1,#fbc2eb)",
  "linear-gradient(135deg,#84fab0,#8fd3f4)",
  "linear-gradient(135deg,#fbc8d4,#9795f0)"
];

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

const solidWrap = document.getElementById("solidColors");
const gradientWrap = document.getElementById("gradientColors");
const favWrap = document.getElementById("favoriteColors");

/* INIT */
if (solidWrap) {
  solidColors.forEach(c => createColor(c, solidWrap, false));
}

if (gradientWrap) {
  gradients.forEach(g => createColor(g, gradientWrap, true));
}

renderFavorites();

/* CREATE COLOR */
function createColor(value, container, isGradient) {
  const div = document.createElement("div");
  div.className = "color-item" + (isGradient ? " gradient" : "");
  div.style.background = value;

  div.onclick = () => applyFrameColor(value);

  container.appendChild(div);
}

/* APPLY COLOR */
function applyFrameColor(value) {
  frame.style.background = value;
}

/* CUSTOM COLOR */
function applyCustomColor() {
  const color = document.getElementById("customColor").value;
  const hex = document.getElementById("hexInput");
  frame.style.background = color;
  if (hex) hex.value = color;
}

/* SAVE FAVORITE */
function saveFavorite() {
  const bg = frame.style.background;
  if (!favorites.includes(bg)) {
    favorites.push(bg);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    renderFavorites();
  }
}

/* RENDER FAVORITE */
function renderFavorites() {
  if (!favWrap) return;
  favWrap.innerHTML = "";
  favorites.forEach(f => {
    const isGradient = f.includes("gradient");
    const div = document.createElement("div");
    div.className = "color-item favorite";
    div.style.background = f;
    div.onclick = () => applyFrameColor(f);
    favWrap.appendChild(div);
  });
}

/* PRESET EO */
function applyPreset(type) {
  const presets = {
    wedding: "linear-gradient(135deg,#fde2e4,#fadadd)",
    birthday: "linear-gradient(135deg,#fde68a,#fca5a5)",
    corporate: "linear-gradient(135deg,#c7d2fe,#bfdbfe)",
    school: "linear-gradient(135deg,#bbf7d0,#86efac)"
  };
  frame.style.background = presets[type];
}
