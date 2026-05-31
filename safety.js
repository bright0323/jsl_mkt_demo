const tabs = document.querySelectorAll(".item-tab");
const panels = document.querySelectorAll(".smart-item");
const modal = document.querySelector(".video-modal");
const modalVideo = modal.querySelector("video");
const closeButton = document.querySelector(".modal-close");
const infoModal = document.querySelector(".info-modal");
const infoTitle = document.querySelector("#info-title");
const infoCopy = document.querySelector(".info-copy");
const infoCloseButton = document.querySelector(".info-close");

function selectItem(item) {
  tabs.forEach((button) => button.classList.toggle("is-active", button.dataset.item === item));
  panels.forEach((panel) => {
    panel.classList.toggle("is-active", panel.dataset.panel === item);
  });
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    selectItem(tab.dataset.item);
  });
});

document.querySelectorAll("[data-open-video]").forEach((button) => {
  button.addEventListener("click", () => {
    modalVideo.src = button.dataset.openVideo;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    modalVideo.play();
  });
});

function closeModal() {
  modalVideo.pause();
  modalVideo.removeAttribute("src");
  modalVideo.load();
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
}

closeButton.addEventListener("click", closeModal);

modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    closeModal();
  }
});

document.querySelectorAll("[data-info-copy]").forEach((button) => {
  button.addEventListener("click", () => {
    infoTitle.textContent = button.dataset.infoTitle;
    infoCopy.textContent = button.dataset.infoCopy;
    infoModal.classList.add("is-open");
    infoModal.setAttribute("aria-hidden", "false");
  });
});

function closeInfoModal() {
  infoModal.classList.remove("is-open");
  infoModal.setAttribute("aria-hidden", "true");
}

infoCloseButton.addEventListener("click", closeInfoModal);

infoModal.addEventListener("click", (event) => {
  if (event.target === infoModal) {
    closeInfoModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.classList.contains("is-open")) {
    closeModal();
  }

  if (event.key === "Escape" && infoModal.classList.contains("is-open")) {
    closeInfoModal();
  }
});
