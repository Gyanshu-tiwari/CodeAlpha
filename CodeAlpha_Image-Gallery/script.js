document.addEventListener("DOMContentLoaded", () => {
  // --- DATA ---
  const images = [
    {
      src: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=2070&auto=format&fit=crop",
      category: "nature",
      caption: "Lush green valley under a cloudy sky",
    },
    {
      src: "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?q=80&w=1965&auto=format&fit=crop",
      category: "nature",
      caption: "Person standing on a rock looking at the mountains",
    },
    {
      src: "https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=1950&auto=format&fit=crop",
      category: "nature",
      caption: "Winding river through a vibrant green landscape",
    },
    {
      src: "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?q=80&w=2070&auto=format&fit=crop",
      category: "city",
      caption: "A stunning view of a city skyline at night",
    },
    {
      src: "https://images.unsplash.com/photo-1755877379664-2f809909cbec?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      category: "nature",
      caption: "Sunset over a tranquil lake with mountains",
    },
    {
      src: "https://images.unsplash.com/photo-1474511320723-9a56873867b5?q=80&w=2072&auto=format&fit=crop",
      category: "animals",
      caption: "A curious red fox in the snow",
    },
    {
      src: "https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=1935&auto=format&fit=crop",
      category: "animals",
      caption: "A happy dog with a playful expression",
    },
    {
      src: "https://images.unsplash.com/photo-1505765050516-f72dcac9c60e?q=80&w=2070&auto=format&fit=crop",
      category: "nature",
      caption: "A serene beach with turquoise water",
    },
    {
      src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=2074&auto=format&fit=crop",
      category: "nature",
      caption: "Dramatic mountain peaks touching the clouds",
    },
    {
      src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2070&auto=format&fit=crop",
      category: "nature",
      caption: "A tranquil lake reflecting the forest and sky",
    },
    // New added images
    {
      src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=2000&auto=format&fit=crop",
      category: "nature",
      caption: "Golden sunrise over misty hills",
    },
    {
      src: "https://images.unsplash.com/photo-1508057198894-247b23fe5ade?q=80&w=2000&auto=format&fit=crop",
      category: "city",
      caption: "Modern skyscrapers with dramatic sky",
    },
  ];

  // --- DOM ELEMENTS ---
  const galleryGrid = document.getElementById("gallery-grid");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxCaption = document.getElementById("lightbox-caption");
  const closeBtn = document.getElementById("close-btn");
  const filterContainer = document.getElementById("filter-container");
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("section");

  let currentIndex = 0;
  let currentImages = [];

  // --- MOBILE MENU ---
  mobileMenuBtn.addEventListener("click", () =>
    mobileMenu.classList.toggle("hidden")
  );
  mobileMenu.addEventListener("click", (e) => {
    if (e.target.tagName === "A") mobileMenu.classList.add("hidden");
  });

  // --- NAV HIGHLIGHT ---
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          navLinks.forEach((link) => {
            link.classList.remove("nav-link-active");
            if (link.getAttribute("href") === `#${id}`)
              link.classList.add("nav-link-active");
          });
        }
      });
    },
    { rootMargin: "-50% 0px -50% 0px" }
  );
  sections.forEach((section) => observer.observe(section));

  // --- SCROLL REVEAL OBSERVER ---
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.15 }
  );

  // --- GALLERY LOGIC ---
  function displayImages(imagesToDisplay) {
    galleryGrid.innerHTML = "";
    imagesToDisplay.forEach((image, index) => {
      const galleryItem = document.createElement("div");
      galleryItem.className =
        "gallery-item reveal cursor-pointer overflow-hidden rounded-lg bg-gray-800 border border-gray-700";
      galleryItem.dataset.category = image.category;
      galleryItem.dataset.index = index;
      const imgElement = document.createElement("img");
      imgElement.src = image.src;
      imgElement.alt = image.caption;
      imgElement.className = "w-full h-48 object-cover";
      imgElement.onerror = function () {
        this.onerror = null;
        this.src =
          "https://placehold.co/600x400/1f2937/4b5563?text=Image+Not+Found";
      };
      galleryItem.appendChild(imgElement);
      galleryGrid.appendChild(galleryItem);

      revealObserver.observe(galleryItem);

      galleryItem.addEventListener("click", () => {
        currentImages = getVisibleImages();
        currentIndex = currentImages.findIndex((img) => img.src === image.src);
        showLightbox(currentIndex);
      });
    });
  }

  function showLightbox(index) {
    if (index < 0 || index >= currentImages.length) return;
    const image = currentImages[index];
    lightboxImg.src = image.src;
    lightboxCaption.textContent = image.caption;
    lightbox.classList.remove("hidden");
    setTimeout(() => lightbox.classList.add("active"), 10);
  }

  function hideLightbox() {
    lightbox.classList.remove("active");
    setTimeout(() => lightbox.classList.add("hidden"), 300);
  }

  function showNextImage() {
    currentIndex = (currentIndex + 1) % currentImages.length;
    showLightbox(currentIndex);
  }
  function showPrevImage() {
    currentIndex =
      (currentIndex - 1 + currentImages.length) % currentImages.length;
    showLightbox(currentIndex);
  }

  function filterImages(filter) {
    galleryGrid.querySelectorAll(".gallery-item").forEach((item) => {
      item.classList.toggle(
        "hidden",
        filter !== "all" && item.dataset.category !== filter
      );
    });
  }
  function getVisibleImages() {
    return Array.from(
      galleryGrid.querySelectorAll(".gallery-item:not(.hidden)")
    ).map((item) => images[parseInt(item.dataset.index)]);
  }

  filterContainer.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
      filterContainer.querySelector(".active").classList.remove("active");
      e.target.classList.add("active");
      const chosen = e.target.dataset.filter;
      filterImages(chosen);

      // Re-observe visible items for reveal animation
      galleryGrid.querySelectorAll(".gallery-item").forEach((item) => {
        if (item.classList.contains("hidden")) {
          item.classList.remove("is-visible");
        } else if (!item.classList.contains("is-visible")) {
          revealObserver.observe(item);
        }
      });
    }
  });

  closeBtn.addEventListener("click", hideLightbox);
  document.addEventListener("keydown", (e) => {
    if (lightbox.classList.contains("hidden")) return;
    if (e.key === "ArrowRight") showNextImage();
    if (e.key === "ArrowLeft") showPrevImage();
    if (e.key === "Escape") hideLightbox();
  });

  // --- INIT ---
  displayImages(images);
});
