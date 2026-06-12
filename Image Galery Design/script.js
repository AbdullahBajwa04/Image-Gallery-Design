/**
 * Image Gallery — JavaScript
 * Features: category filtering, lightbox with navigation,
 * keyboard support, and accessible interactions.
 */

(function () {
  "use strict";

  // --- DOM References ---
  const gallery = document.getElementById("gallery");
  const galleryItems = Array.from(gallery.querySelectorAll(".gallery__item"));
  const filterButtons = document.querySelectorAll(".filters__btn");

  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxCaption = document.getElementById("lightboxCaption");
  const lightboxClose = document.getElementById("lightboxClose");
  const lightboxPrev = document.getElementById("lightboxPrev");
  const lightboxNext = document.getElementById("lightboxNext");
  const lightboxBackdrop = document.getElementById("lightboxBackdrop");

  // Current filter category ("all" shows everything)
  let activeFilter = "all";

  // Images currently visible after filtering (used for lightbox navigation)
  let visibleItems = [];

  // Index of the image shown in the lightbox
  let currentIndex = 0;

  /**
   * Returns gallery items that match the active filter.
   */
  function getFilteredItems() {
    if (activeFilter === "all") {
      return galleryItems;
    }
    return galleryItems.filter(
      (item) => item.dataset.category === activeFilter
    );
  }

  /**
   * Updates which cards are shown/hidden based on the selected category.
   */
  function applyFilter(filter) {
    activeFilter = filter;

    galleryItems.forEach((item) => {
      const category = item.dataset.category;
      const shouldShow = filter === "all" || category === filter;

      if (shouldShow) {
        item.classList.remove("gallery__item--hidden");
      } else {
        item.classList.add("gallery__item--hidden");
      }
    });

    // Refresh list used by lightbox
    visibleItems = getFilteredItems();
  }

  /**
   * Sets the active style on the clicked filter button.
   */
  function setActiveFilterButton(clickedBtn) {
    filterButtons.forEach((btn) => {
      btn.classList.remove("filters__btn--active");
    });
    clickedBtn.classList.add("filters__btn--active");
  }

  /**
   * Opens the lightbox and displays the image at the given index.
   */
  function openLightbox(index) {
    visibleItems = getFilteredItems();

    if (visibleItems.length === 0) return;

    currentIndex = index;
    updateLightboxImage();

    lightbox.classList.add("lightbox--open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden"; // Prevent background scroll
  }

  /**
   * Closes the lightbox modal.
   */
  function closeLightbox() {
    lightbox.classList.remove("lightbox--open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    lightboxImg.src = "";
  }

  /**
   * Updates the lightbox image and caption from currentIndex.
   */
  function updateLightboxImage() {
    const item = visibleItems[currentIndex];
    const img = item.querySelector(".gallery__img");
    const caption = item.querySelector(".gallery__caption");

    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = caption ? caption.textContent : img.alt;
  }

  /**
   * Shows the previous image in the visible set (loops to end).
   */
  function showPrevious() {
    if (visibleItems.length === 0) return;
    currentIndex =
      (currentIndex - 1 + visibleItems.length) % visibleItems.length;
    updateLightboxImage();
  }

  /**
   * Shows the next image in the visible set (loops to start).
   */
  function showNext() {
    if (visibleItems.length === 0) return;
    currentIndex = (currentIndex + 1) % visibleItems.length;
    updateLightboxImage();
  }

  // --- Event: Category filter buttons ---
  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter;
      setActiveFilterButton(btn);
      applyFilter(filter);
    });
  });

  // --- Event: Open lightbox when a gallery image is clicked ---
  galleryItems.forEach((item) => {
    const trigger = item.querySelector(".gallery__trigger");

    trigger.addEventListener("click", () => {
      visibleItems = getFilteredItems();
      const index = visibleItems.indexOf(item);

      if (index !== -1) {
        openLightbox(index);
      }
    });
  });

  // --- Lightbox controls ---
  lightboxClose.addEventListener("click", closeLightbox);
  lightboxPrev.addEventListener("click", showPrevious);
  lightboxNext.addEventListener("click", showNext);

  // Close when clicking the dark backdrop (outside the image)
  lightboxBackdrop.addEventListener("click", closeLightbox);

  // --- Keyboard navigation ---
  document.addEventListener("keydown", (event) => {
    const isOpen = lightbox.classList.contains("lightbox--open");
    if (!isOpen) return;

    switch (event.key) {
      case "Escape":
        closeLightbox();
        break;
      case "ArrowLeft":
        event.preventDefault();
        showPrevious();
        break;
      case "ArrowRight":
        event.preventDefault();
        showNext();
        break;
      default:
        break;
    }
  });

  // --- Initialize: show all images ---
  applyFilter("all");
})();
