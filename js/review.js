const photoGrid = document.getElementById("photoGrid");
const backBtn = document.getElementById("backBtn");
const nextBtn = document.getElementById("nextBtn");

let photos = JSON.parse(sessionStorage.getItem("photos")) || [];

/* RENDER FOTO */
function renderPhotos() {
  photoGrid.innerHTML = "";

  photos.forEach((src, index) => {
    const card = document.createElement("div");
    card.className = "photo-card";

    card.innerHTML = `
      <img src="${src}" alt="Foto ${index + 1}">
      <div class="photo-info">
        <span>Foto ${index + 1}</span>
        <button class="retake-btn" data-index="${index}">
          <i class="bi bi-arrow-repeat"></i>
        </button>
      </div>
    `;

    photoGrid.appendChild(card);
  });

  bindRetake();
}

/* RETAKE */
function bindRetake() {
  document.querySelectorAll(".retake-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const index = btn.dataset.index;
      sessionStorage.setItem("retakeIndex", index);
      window.location.href = "retake.html";
    });
  });
}

/* NAVIGATION */
backBtn.addEventListener("click", () => {
  sessionStorage.removeItem("photos");
  window.location.href = "capture.html";
});

nextBtn.addEventListener("click", () => {
  window.location.href = "template.html";
});

/* INIT */
renderPhotos();
