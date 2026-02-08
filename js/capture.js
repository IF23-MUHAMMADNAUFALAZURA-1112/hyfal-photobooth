const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const startBtn = document.getElementById("startCaptureBtn");
const countdownEl = document.getElementById("countdown");
const flashEl = document.getElementById("flash");
const progressText = document.getElementById("progressText");

// Ambil parameter setup
const params = new URLSearchParams(window.location.search);
const totalPhotos = parseInt(params.get("count")) || 3;

let currentPhoto = 0;
let photos = [];

/* CAMERA INIT */
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    video.srcObject = stream;
  });

/* START SESSION */
startBtn.addEventListener("click", async () => {
  startBtn.disabled = true;

  while (currentPhoto < totalPhotos) {
    progressText.textContent = `Foto ${currentPhoto + 1} dari ${totalPhotos}`;
    await countdown();
    takePhoto();
    currentPhoto++;
    await wait(600);
  }

  // Simpan ke sessionStorage
  sessionStorage.setItem("photos", JSON.stringify(photos));

  // Ke halaman review
  window.location.href = "review.html";
});

/* COUNTDOWN */
function countdown() {
  return new Promise(resolve => {
    let count = 3;
    countdownEl.textContent = count;
    countdownEl.classList.remove("hidden");

    const interval = setInterval(() => {
      count--;
      if (count === 0) {
        clearInterval(interval);
        countdownEl.classList.add("hidden");
        flash();
        resolve();
      } else {
        countdownEl.textContent = count;
      }
    }, 1000);
  });
}

/* FLASH */
function flash() {
  flashEl.style.opacity = 1;
  setTimeout(() => {
    flashEl.style.opacity = 0;
  }, 120);
}

/* TAKE PHOTO */
function takePhoto() {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0);
  photos.push(canvas.toDataURL("image/png"));
}

/* UTILS */
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
