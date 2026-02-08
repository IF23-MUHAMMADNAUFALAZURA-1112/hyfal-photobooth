/* =========================
    1. INISIALISASI DATA
========================= */
const frame = document.getElementById("frame");
const photos = JSON.parse(sessionStorage.getItem("photos")) || [];
const frameClass = sessionStorage.getItem("frameClass") || "frame frame-trio";
const frameBackground = sessionStorage.getItem("frameBackground") || "#111";

// Terapkan Layout & Background
frame.className = frameClass;
frame.style.background = frameBackground;

const frameHeader = frame.querySelector(".frame-header");
const frameFooter = frame.querySelector(".frame-footer");
const frameWatermark = frame.querySelector(".watermark");

if (frameHeader) frameHeader.innerText = sessionStorage.getItem("frameTitle") || "Happy Moment";
if (frameFooter) frameFooter.innerText = sessionStorage.getItem("frameFooter") || "Photo Booth • 2026";
if (frameWatermark) frameWatermark.innerText = sessionStorage.getItem("watermark") || "";

// Load Foto
let photoWrap = frame.querySelector(".frame-photos");
if (!photoWrap) {
    photoWrap = document.createElement("div");
    photoWrap.className = "frame-photos";
    frameHeader.after(photoWrap);
}

photoWrap.innerHTML = "";
photos.forEach(src => {
    const div = document.createElement("div");
    div.className = "photo-slot";
    div.innerHTML = `<img src="${src}" style="width:100%; height:100%; object-fit:cover;">`;
    photoWrap.appendChild(div);
});

/* =========================
    2. KONTROL WARNA & THEME
========================= */
document.querySelectorAll(".theme-btn").forEach(btn => {
    btn.onclick = () => {
        const t = btn.dataset.theme;
        if (t === "cute") frame.style.background = "linear-gradient(135deg,#fbcfe8,#fde68a)";
        else if (t === "elegant") frame.style.background = "linear-gradient(135deg,#111827,#6b7280)";
        else if (t === "dark") frame.style.background = "#111";
        sessionStorage.setItem("frameBackground", frame.style.background);
    };
});

const c1 = document.getElementById("color1");
const c2 = document.getElementById("color2");

if (c1) {
    c1.oninput = () => {
        frame.style.background = c1.value;
        sessionStorage.setItem("frameBackground", frame.style.background);
    };
}

document.getElementById("applyGradient").onclick = () => {
    frame.style.background = `linear-gradient(135deg, ${c1.value}, ${c2.value})`;
    sessionStorage.setItem("frameBackground", frame.style.background);
};

document.querySelectorAll(".preset").forEach(p => {
    p.onclick = () => {
        frame.style.background = `linear-gradient(135deg,${p.dataset.c1},${p.dataset.c2})`;
        sessionStorage.setItem("frameBackground", frame.style.background);
    };
});

/* =========================
    3. LOGIKA STIKER (MULTI-STICKER)
========================= */
function addSticker(src) {
    const wrap = document.createElement("div");
    wrap.className = "sticker-wrap";
    
    // Posisi acak sedikit & z-index tinggi agar selalu di atas
    const offset = Math.floor(Math.random() * 50);
    wrap.style.cssText = `position:absolute; top:${50 + offset}px; left:${50 + offset}px; z-index:1000; cursor:move; user-select:none; touch-action:none;`;

    const img = document.createElement("img");
    img.src = src;
    img.className = "sticker";
    img.style.width = "100px";
    img.style.pointerEvents = "none"; // Penting: agar drag selalu kena container wrap

    const rm = document.createElement("div");
    rm.className = "remove-sticker";
    rm.innerHTML = "×";
    rm.style.cssText = "position:absolute; top:-12px; right:-12px; background:#ff4757; color:white; border-radius:50%; width:26px; height:26px; text-align:center; cursor:pointer; line-height:24px; font-weight:bold; border:2px solid white; z-index:1001;";
    
    rm.onclick = (e) => {
        e.stopPropagation();
        wrap.remove();
    };

    wrap.append(img, rm);
    frame.appendChild(wrap);
    
    makeDraggable(wrap);
    makeResizable(wrap, img); // Resize menggunakan scroll pada area stiker
}

function makeDraggable(el) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    
    el.onmousedown = (e) => {
        // Jangan drag jika yang diklik tombol hapus
        if (e.target.classList.contains('remove-sticker')) return;
        
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = () => {
            document.onmouseup = null;
            document.onmousemove = null;
        };
        document.onmousemove = (e) => {
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            el.style.top = (el.offsetTop - pos2) + "px";
            el.style.left = (el.offsetLeft - pos1) + "px";
        };
    };
}

function makeResizable(container, img) {
    container.onwheel = (e) => {
        e.preventDefault();
        let size = img.offsetWidth;
        // Scroll Up = Besar, Scroll Down = Kecil
        size = e.deltaY < 0 ? size + 10 : size - 10;
        img.style.width = Math.max(30, Math.min(400, size)) + "px";
    };
}

// Event klik stiker grid
document.querySelectorAll(".sticker-item img").forEach(i => {
    i.onclick = () => addSticker(i.src);
});

// Upload Stiker Custom
document.getElementById("uploadSticker").onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => addSticker(ev.target.result);
        reader.readAsDataURL(file);
    }
};

/* =========================
    4. MODAL & DOWNLOAD (PNG)
========================= */
const modal = document.getElementById("downloadModal");
const openModalBtn = document.getElementById("openModalBtn");
const closeModal = document.getElementById("closeModal");
const confirmBtn = document.getElementById("confirmDownload");
const fileNameInput = document.getElementById("fileNameInput");

openModalBtn.onclick = () => {
    modal.style.display = "flex";
    fileNameInput.value = "";
    fileNameInput.focus();
};

closeModal.onclick = () => { modal.style.display = "none"; };
window.onclick = (e) => { if (e.target == modal) modal.style.display = "none"; };

confirmBtn.onclick = () => {
    const name = fileNameInput.value.trim() || `PhotoBooth-${Date.now()}`;
    
    // Perbaikan Visual: Paksa teks tetap putih & background biru tua saat klik
    confirmBtn.disabled = true;
    confirmBtn.style.backgroundColor = "#1e40af"; 
    confirmBtn.style.color = "#ffffff"; 
    confirmBtn.innerHTML = 'Memproses...';

    const removers = document.querySelectorAll(".remove-sticker");
    removers.forEach(b => b.style.opacity = "0");

    html2canvas(frame, {
        useCORS: true,
        scale: 3,
        backgroundColor: null 
    }).then(canvas => {
        const a = document.createElement("a");
        a.download = name + ".png";
        a.href = canvas.toDataURL("image/png");
        a.click();

        // Kembalikan status tombol
        removers.forEach(b => b.style.opacity = "1");
        modal.style.display = "none";
        confirmBtn.disabled = false;
        confirmBtn.style.backgroundColor = ""; // Reset ke CSS
        confirmBtn.style.color = "#ffffff";
        confirmBtn.innerHTML = '<i class="bi bi-download"></i> Download Sekarang';
    }).catch(err => {
        console.error("Download Error:", err);
        confirmBtn.disabled = false;
        confirmBtn.innerHTML = 'Gagal, Coba Lagi';
    });
};