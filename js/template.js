/* =====================
    DATA & ELEMENT
===================== */
const photos = JSON.parse(sessionStorage.getItem("photos")) || [];
const framePhotos = document.getElementById("framePhotos");
const frame = document.getElementById("frame");

const titleInput = document.getElementById("titleInput");
const footerInput = document.getElementById("footerInput");
const frameTitle = document.getElementById("frameTitle");
const frameFooter = document.getElementById("frameFooter");

const templateButtons = document.querySelectorAll(".control-btn");

// Tangkap format dari URL
const params = new URLSearchParams(window.location.search);
let selectedFormat = params.get("format") || "trio"; 

/* =====================
    LOAD PHOTOS & LAYOUT
===================== */
function loadPhotos() {
  framePhotos.innerHTML = "";
  framePhotos.className = "frame-photos layout-" + selectedFormat;

  photos.forEach(src => {
    const slot = document.createElement("div");
    slot.className = "photo-slot";
    slot.innerHTML = `<img src="${src}" class="captured-img">`;
    framePhotos.appendChild(slot);
  });
}

/* =====================
    INITIALIZE VIEW
===================== */
function initView() {
  frame.className = "frame frame-" + selectedFormat;
  
  templateButtons.forEach(btn => {
    if (btn.dataset.template === selectedFormat) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  // Set warna default pada lingkaran preview
  if (colorCircle) colorCircle.style.backgroundColor = fontColor.value;
}

/* =====================
    TEMPLATE SWITCH
===================== */
templateButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    templateButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    selectedFormat = btn.dataset.template;
    frame.className = "frame frame-" + selectedFormat;
    framePhotos.className = "frame-photos layout-" + selectedFormat;
  });
});

/* =====================
    TEXT & STYLE CONTROLS (DIPERBARUI)
===================== */
const editTitleBtn = document.getElementById("editTitle");
const editFooterBtn = document.getElementById("editFooter");
const inputLabel = document.getElementById("inputLabel"); // Label di atas input teks
const styleLabel = document.getElementById("styleLabel"); // Label di atas toolbox style
const colorCircle = document.getElementById("colorCircle"); // Elemen lingkaran warna

let activeText = frameTitle;

// Fungsi Switch Tab
function switchTab(type) {
  if (type === "title") {
    activeText = frameTitle;
    titleInput.style.display = "block";
    footerInput.style.display = "none";
    if (inputLabel) inputLabel.innerText = "Isi Teks Judul";
    if (styleLabel) styleLabel.innerText = "Gaya Teks Judul";
    editTitleBtn.classList.add("active");
    editFooterBtn.classList.remove("active");
  } else {
    activeText = frameFooter;
    titleInput.style.display = "none";
    footerInput.style.display = "block";
    if (inputLabel) inputLabel.innerText = "Isi Teks Footer";
    if (styleLabel) styleLabel.innerText = "Gaya Teks Footer";
    editFooterBtn.classList.add("active");
    editTitleBtn.classList.remove("active");
  }
}

editTitleBtn.onclick = () => switchTab("title");
editFooterBtn.onclick = () => switchTab("footer");

// Input Teks
titleInput.addEventListener("input", e => {
  frameTitle.textContent = e.target.value || "Happy Moment";
});
footerInput.addEventListener("input", e => {
  frameFooter.textContent = e.target.value || "Photo Booth • 2026";
});

// Font Style & Color
const fontSize = document.getElementById("fontSize");
const fontColor = document.getElementById("fontColor");
const fontFamily = document.getElementById("fontFamily");

fontSize.oninput = () => { activeText.style.fontSize = fontSize.value + "px"; };

fontColor.oninput = () => { 
  const selectedColor = fontColor.value;
  activeText.style.color = selectedColor; 
  // Update lingkaran agar tidak terlihat seperti garis
  if (colorCircle) colorCircle.style.backgroundColor = selectedColor;
};

fontFamily.onchange = () => { activeText.style.fontFamily = fontFamily.value; };

document.getElementById("boldBtn").onclick = () => {
  activeText.style.fontWeight = activeText.style.fontWeight === "700" ? "400" : "700";
};

/* =====================
    NEXT
===================== */
document.getElementById("nextBtn").addEventListener("click", () => {
  sessionStorage.setItem("frameTitle", frameTitle.textContent);
  sessionStorage.setItem("frameFooter", frameFooter.textContent);
  sessionStorage.setItem("frameClass", frame.className);
  sessionStorage.setItem("selectedFormat", selectedFormat);
  sessionStorage.setItem("titleStyle", frameTitle.getAttribute("style"));
  sessionStorage.setItem("footerStyle", frameFooter.getAttribute("style"));

  window.location.href = `decorate.html?format=${selectedFormat}`;
});

/* INIT */
loadPhotos();
initView();