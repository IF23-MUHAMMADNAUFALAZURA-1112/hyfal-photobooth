const formatCards = document.querySelectorAll("#formatOptions .option-card");
const countCards = document.querySelectorAll("#photoCountOptions .option-card");
const continueBtn = document.getElementById("continueBtn");

let selectedFormat = "trio";
let selectedCount = 3;

formatCards.forEach(card => {
  card.addEventListener("click", () => {
    formatCards.forEach(c => c.classList.remove("active"));
    card.classList.add("active");
    selectedFormat = card.dataset.format;
  });
});

countCards.forEach(card => {
  card.addEventListener("click", () => {
    countCards.forEach(c => c.classList.remove("active"));
    card.classList.add("active");
    selectedCount = card.dataset.count;
  });
});

continueBtn.addEventListener("click", () => {
  // simpan setup (sementara pakai query string)
  window.location.href =
    `capture.html?format=${selectedFormat}&count=${selectedCount}`;
});
