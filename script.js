/* =========================================================
   BHUVI MEHANDI — LUXURY BRIDAL & DESIGNER MEHNDI STUDIO
   Core JavaScript Engine • Interactive Features & UX
   ========================================================= */

function initBhuviStudio() {

    /* ================= DYNAMIC DATA HYDRATION (FROM ADMIN PANEL) ================= */
    function escapeHtml(str) {
        if (!str) return "";
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function renderDynamicGallery(galleryList) {
        const galleryGrid = document.getElementById("galleryGrid");
        const filtersContainer = document.getElementById("galleryFilters");
        if (!galleryGrid || !filtersContainer || !galleryList || !galleryList.length) return;

        // Calculate counts
        const categoryCounts = { all: galleryList.length };
        galleryList.forEach(item => {
            const cat = (item.category || "other").toLowerCase();
            categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
        });

        // Known category labels
        const categoryLabels = {
            all: "All Designs",
            bridal: "Bridal",
            arabic: "Arabic",
            rajasthani: "Rajasthani",
            engagement: "Engagement",
            festival: "Festival",
            minimalist: "Minimalist",
            contemporary: "Contemporary"
        };

        // Render filter buttons
        let filtersHtml = `<button class="filter-btn active" onclick="filterGallery('all', this)">All Designs (${categoryCounts.all})</button>`;
        Object.keys(categoryCounts).forEach(cat => {
            if (cat === "all") return;
            const label = categoryLabels[cat] || (cat.charAt(0).toUpperCase() + cat.slice(1));
            filtersHtml += `<button class="filter-btn" onclick="filterGallery('${cat}', this)">${label} (${categoryCounts[cat]})</button>`;
        });
        filtersContainer.innerHTML = filtersHtml;

        // Render gallery items
        galleryGrid.innerHTML = galleryList.map(item => {
            const largeClass = item.isLarge ? " large" : "";
            const catClass = (item.category || "all").toLowerCase();
            const catBadge = item.categoryLabel || (item.category ? item.category.toUpperCase() : "MEHNDI");
            const sub = item.subtitle || item.title || "Royal Henna";
            const title = item.title || "Mehndi Design";
            return `
                <div class="gallery-item${largeClass}"
                     data-category="${catClass}"
                     data-title="${escapeHtml(title)}"
                     onclick="openLightbox(this)">
                    <img
                        src="${escapeHtml(item.src)}"
                        alt="${escapeHtml(item.alt || title)}"
                        loading="lazy"
                    >
                    <div class="gallery-overlay">
                        <div>
                            <small>${escapeHtml(catBadge)}</small>
                            <span>${escapeHtml(sub)}</span>
                        </div>
                        <span class="zoom-btn">🔍 View</span>
                    </div>
                </div>
            `;
        }).join("");
    }

    /* ================= HERO BRAND CAROUSEL ENGINE (5s Slide Animation) ================= */
    const HERO_AUTOPLAY_INTERVAL = 5000; // 5 seconds per slide
    let heroCarouselTimer = null;
    let heroCurrentIndex = 0;
    let heroSlideCount = 3;
    let heroCarouselEventsBound = false;

    function renderHeroCarousel(banners) {
        const track = document.getElementById("heroCarouselTrack");
        const dotsContainer = document.getElementById("heroCarouselDots");
        const prevBtn = document.getElementById("heroPrevBtn");
        const nextBtn = document.getElementById("heroNextBtn");
        if (!track || !banners || !banners.length) return;

        heroSlideCount = banners.length;
        heroCurrentIndex = 0;
        track.style.transform = "translateX(0%)";

        // Render Slides
        track.innerHTML = banners.map((b, idx) => `
            <div class="hero-slide ${idx === 0 ? 'active' : ''}" data-index="${idx}">
                <img src="${escapeHtml(b.image || 'hero-banner.png')}" alt="${escapeHtml(b.title || b.alt || 'Bhuvi Mehandi Luxury Banner')}" loading="${idx === 0 ? 'eager' : 'lazy'}">
            </div>
        `).join("");

        // Render Dots & Toggle Arrow Controls
        if (dotsContainer) {
            if (banners.length > 1) {
                dotsContainer.style.display = "flex";
                dotsContainer.innerHTML = banners.map((_, idx) => `
                    <button class="hero-dot ${idx === 0 ? 'active' : ''}" data-index="${idx}" aria-label="Slide ${idx + 1}"></button>
                `).join("");
            } else {
                dotsContainer.style.display = "none";
            }
        }

        if (prevBtn && nextBtn) {
            const showArrows = banners.length > 1 ? "flex" : "none";
            prevBtn.style.display = showArrows;
            nextBtn.style.display = showArrows;
        }

        initHeroCarouselEvents();
        startHeroAutoplay();
    }

    function goToHeroSlide(index) {
        const slides = document.querySelectorAll(".hero-slide");
        const dots = document.querySelectorAll(".hero-dot");
        const track = document.getElementById("heroCarouselTrack");
        if (!slides.length || !track) return;

        heroCurrentIndex = (index + slides.length) % slides.length;
        track.style.transform = `translateX(-${heroCurrentIndex * 100}%)`;

        slides.forEach((s, idx) => {
            s.classList.toggle("active", idx === heroCurrentIndex);
        });

        dots.forEach((d, idx) => {
            d.classList.toggle("active", idx === heroCurrentIndex);
        });
    }

    function nextHeroSlide() {
        goToHeroSlide(heroCurrentIndex + 1);
    }

    function prevHeroSlide() {
        goToHeroSlide(heroCurrentIndex - 1);
    }

    function startHeroAutoplay() {
        if (heroCarouselTimer) {
            clearInterval(heroCarouselTimer);
            heroCarouselTimer = null;
        }
        // Count actual slides present in DOM if available
        const currentSlides = document.querySelectorAll(".hero-slide");
        const count = currentSlides.length > 0 ? currentSlides.length : heroSlideCount;
        if (count > 1) {
            heroCarouselTimer = setInterval(() => {
                nextHeroSlide();
            }, HERO_AUTOPLAY_INTERVAL);
        }
    }

    function stopHeroAutoplay() {
        if (heroCarouselTimer) {
            clearInterval(heroCarouselTimer);
            heroCarouselTimer = null;
        }
    }

    function initHeroCarouselEvents() {
        if (heroCarouselEventsBound) return;
        heroCarouselEventsBound = true;

        const carousel = document.getElementById("heroCarousel");
        const prevBtn = document.getElementById("heroPrevBtn");
        const nextBtn = document.getElementById("heroNextBtn");
        const dotsContainer = document.getElementById("heroCarouselDots");

        if (prevBtn) {
            prevBtn.addEventListener("click", () => {
                prevHeroSlide();
                startHeroAutoplay();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener("click", () => {
                nextHeroSlide();
                startHeroAutoplay();
            });
        }

        if (dotsContainer) {
            dotsContainer.addEventListener("click", (e) => {
                const dot = e.target.closest(".hero-dot");
                if (dot && dot.dataset.index !== undefined) {
                    goToHeroSlide(parseInt(dot.dataset.index, 10));
                    startHeroAutoplay();
                }
            });
        }

        if (carousel) {
            // Touch Swipe support for mobile devices
            let touchStartX = 0;
            let touchStartY = 0;
            let touchEndX = 0;
            let touchEndY = 0;
            carousel.addEventListener("touchstart", (e) => {
                if (e.changedTouches && e.changedTouches[0]) {
                    touchStartX = e.changedTouches[0].screenX;
                    touchStartY = e.changedTouches[0].screenY;
                }
            }, { passive: true });

            carousel.addEventListener("touchend", (e) => {
                if (e.changedTouches && e.changedTouches[0]) {
                    touchEndX = e.changedTouches[0].screenX;
                    touchEndY = e.changedTouches[0].screenY;
                    const diffX = touchStartX - touchEndX;
                    const diffY = touchStartY - touchEndY;
                    // Only trigger if horizontal swipe is dominant and exceeds 35px threshold
                    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 35) {
                        if (diffX > 0) {
                            nextHeroSlide();
                        } else {
                            prevHeroSlide();
                        }
                        startHeroAutoplay();
                    }
                }
            }, { passive: true });
        }

        // Restart autoplay when tab becomes visible again
        document.addEventListener("visibilitychange", () => {
            if (document.visibilityState === "visible") {
                startHeroAutoplay();
            }
        });
    }

    // Immediately kick off carousel on existing static HTML slides
    initHeroCarouselEvents();
    startHeroAutoplay();

    /* ================= PERSISTENCE (BhuviDB + IndexedDB + LocalStorage Sync) ================= */
    const DATA_KEY = "bhuvi_mehndi_data";

    async function idbGet(key) {
        if (window.BhuviDB && typeof window.BhuviDB.idbGet === "function") {
            return await window.BhuviDB.idbGet(key);
        }
        return null;
    }

    async function idbSet(key, value) {
        if (window.BhuviDB && typeof window.BhuviDB.idbSet === "function") {
            return await window.BhuviDB.idbSet(key, value);
        }
        return false;
    }

    const defaultHeroBanners = [
        {
            id: "banner-1",
            image: "hero-banner.png",
            title: "Bhuvi Mehandi Luxury Henna Art & Bridal Studio"
        },
        {
            id: "banner-2",
            image: "https://images.unsplash.com/photo-1599833975787-5f6b0e8d1b55?auto=format&fit=crop&w=2000&q=85",
            title: "Royal Rajasthani Bridal Mehndi - Udaipur Heritage"
        },
        {
            id: "banner-3",
            image: "https://images.unsplash.com/photo-1610992015732-2449b76344bc?auto=format&fit=crop&w=2000&q=85",
            title: "Exquisite Fine-Line Floral & Arabic Bridal Henna"
        }
    ];

    function applyDataToWebsite(data) {
        if (!data || typeof data !== "object") return;

        // 1. Hero Brand Carousel
        let bannersToUse = [];
        if (Array.isArray(data.heroBanners) && data.heroBanners.length > 0) {
            bannersToUse = [...data.heroBanners];
        } else if (data.hero && data.hero.bannerImage) {
            bannersToUse = [{
                id: "banner-1",
                image: data.hero.bannerImage,
                title: "Bhuvi Mehandi - Professional Bridal Mehndi Artist Udaipur"
            }];
        }

        // If only 1 banner is configured, supplement with default luxury banners so 5-second slide animation always works
        if (bannersToUse.length === 1) {
            bannersToUse = [
                bannersToUse[0],
                defaultHeroBanners[1],
                defaultHeroBanners[2]
            ];
        } else if (bannersToUse.length === 0) {
            bannersToUse = defaultHeroBanners;
        }

        renderHeroCarousel(bannersToUse);

        // 2. About Section
        if (data.about) {
            const aboutImg = document.getElementById("aboutImage");
            if (aboutImg && data.about.image) aboutImg.src = data.about.image;

            const aboutExpYears = document.getElementById("aboutExpYears");
            if (aboutExpYears && data.about.expYears) aboutExpYears.textContent = data.about.expYears;

            const aboutExpLabel = document.getElementById("aboutExpLabel");
            if (aboutExpLabel && data.about.expLabel) aboutExpLabel.textContent = data.about.expLabel;

            const aboutHeading = document.getElementById("aboutHeading");
            if (aboutHeading && data.about.heading) aboutHeading.textContent = data.about.heading;

            const aboutBio1 = document.getElementById("aboutBio1");
            if (aboutBio1 && data.about.bio1) aboutBio1.innerHTML = data.about.bio1;

            const aboutBio2 = document.getElementById("aboutBio2");
            if (aboutBio2 && data.about.bio2) aboutBio2.textContent = data.about.bio2;
        }

        // 3. Settings & Contact Info
        if (data.settings) {
            const s = data.settings;
            if (s.whatsapp) {
                const cleanWa = s.whatsapp.replace(/\D/g, "");
                const waUrl = `https://wa.me/${cleanWa}?text=${encodeURIComponent("Hello Bhuvi Mehandi, I would like to inquire about booking an appointment")}`;
                document.querySelectorAll('a[href*="wa.me"]').forEach(a => a.href = waUrl);
            }
            if (s.phone) {
                const cleanPhone = s.phone.replace(/[^\d+]/g, "");
                document.querySelectorAll('a[href^="tel:"]').forEach(a => {
                    a.href = `tel:${cleanPhone}`;
                    const strong = a.querySelector("strong");
                    if (strong) strong.textContent = s.phone;
                });
            }
            if (s.email) {
                document.querySelectorAll('a[href^="mailto:"]').forEach(a => {
                    a.href = `mailto:${s.email}`;
                });
            }
            if (s.instagram) {
                const cleanInsta = s.instagram.replace("@", "");
                document.querySelectorAll('a[href*="instagram.com"]').forEach(a => {
                    a.href = `https://instagram.com/${cleanInsta}`;
                    a.title = `Follow on Instagram @${cleanInsta}`;
                });
                document.querySelectorAll('.mobile-insta-item small').forEach(sm => {
                    sm.textContent = `@${cleanInsta} ↗`;
                });
            }
        }

        // 4. Custom Gallery
        if (Array.isArray(data.gallery) && data.gallery.length > 0) {
            renderDynamicGallery(data.gallery);
        }

        // 5. Custom Reviews
        if (Array.isArray(data.reviews) && data.reviews.length > 0) {
            renderDynamicReviews(data.reviews);
        }
    }

    async function loadCustomizedData() {
        let data = null;

        // 1. Read from localStorage immediately (synchronous fast path)
        try {
            const raw = localStorage.getItem(DATA_KEY);
            if (raw) data = JSON.parse(raw);
        } catch (e) {}

        if (data && data.gallery && data.gallery.length) {
            applyDataToWebsite(data);
        } else {
            renderHeroCarousel(defaultHeroBanners);
        }

        // 2. Read from BhuviDB Unified Storage (Server API -> Cloud Firestore -> IndexedDB)
        if (window.BhuviDB && typeof window.BhuviDB.getSiteContent === "function") {
            try {
                const cloudOrServerData = await window.BhuviDB.getSiteContent();
                if (cloudOrServerData && typeof cloudOrServerData === "object" && cloudOrServerData.gallery && cloudOrServerData.gallery.length) {
                    applyDataToWebsite(cloudOrServerData);
                }
            } catch (err) {
                console.warn("BhuviDB load notice:", err);
            }
        } else {
            // Fallback: Read from IndexedDB directly
            idbGet(DATA_KEY).then((idbData) => {
                if (idbData && typeof idbData === "object" && idbData.gallery && idbData.gallery.length) {
                    applyDataToWebsite(idbData);
                }
            });
        }
    }

    // Real-time synchronization across open tabs, window focus, and Cloud Firestore
    window.addEventListener("storage", (e) => {
        if (e.key === DATA_KEY || e.key === "bhuvi_last_sync") {
            loadCustomizedData();
        }
    });

    window.addEventListener("focus", () => {
        loadCustomizedData();
    });

    try {
        if (typeof BroadcastChannel !== "undefined") {
            const channel = new BroadcastChannel("bhuvi_studio_channel");
            channel.onmessage = (e) => {
                if (e.data && e.data.type === "DATA_UPDATED") {
                    loadCustomizedData();
                }
            };
        }
    } catch (e) {}

    // Real-time Cloud/Server Multi-Device Content Updates
    if (window.BhuviDB && typeof window.BhuviDB.listenToSiteContent === "function") {
        window.BhuviDB.listenToSiteContent((freshContent) => {
            if (freshContent && typeof freshContent === "object") {
                console.log("⚡ Real-time website content update received from Server/Cloud.");
                try {
                    localStorage.setItem(DATA_KEY, JSON.stringify(freshContent));
                    localStorage.setItem("bhuvi_last_sync", String(Date.now()));
                } catch (e) {}
                applyDataToWebsite(freshContent);
            }
        });
    }

function renderDynamicReviews(reviewsList) {
    const grid = document.getElementById("reviewsGrid");
    if (!grid || !reviewsList || !reviewsList.length) return;

    grid.innerHTML = reviewsList.map(r => {
        const starsCount = Math.max(1, Math.min(5, parseInt(r.stars, 10) || 5));
        const starsStr = "★".repeat(starsCount);
        return `
            <div class="testimonial-card reveal show">
                <div class="stars">${starsStr}</div>
                <p>"${escapeHtml(r.text)}"</p>
                <div class="review-author">
                    <strong>${escapeHtml(r.name)}</strong>
                    <span>${escapeHtml(r.role || "Bride • Udaipur")}</span>
                </div>
            </div>
        `;
    }).join("");
}

/* ================= CLIENT REVIEW MODAL ================= */
window.openReviewModal = function () {
    const modal = document.getElementById("clientReviewModal");
    if (modal) {
        modal.classList.add("active");
        document.body.style.overflow = "hidden";
    }
};

window.closeClientReviewModal = function (event) {
    if (event) {
        const target = event.target;
        if (target.id !== "clientReviewModal" && !target.classList.contains("close-lightbox")) {
            return;
        }
    }
    const modal = document.getElementById("clientReviewModal");
    if (modal) {
        modal.classList.remove("active");
    }
    document.body.style.overflow = "";
};

window.submitClientReview = function (event) {
    event.preventDefault();
    const nameInput = document.getElementById("clientRevName");
    const roleInput = document.getElementById("clientRevRole");
    const starsInput = document.getElementById("clientRevStars");
    const textInput = document.getElementById("clientRevText");

    if (!nameInput || !textInput) return;

    const name = nameInput.value.trim();
    const role = roleInput ? roleInput.value.trim() : "Bride • Udaipur";
    const stars = parseInt(starsInput ? starsInput.value : 5, 10) || 5;
    const text = textInput.value.trim();

    if (!name || !text) {
        alert("Please fill in your name and review.");
        return;
    }

    const newReview = {
        id: "rev-" + Date.now(),
        name,
        role,
        stars,
        text,
        date: new Date().toISOString()
    };

    try {
        let data = JSON.parse(localStorage.getItem("bhuvi_mehndi_data") || "{}");
        if (!data.reviews || !Array.isArray(data.reviews)) {
            data.reviews = [
                {
                    id: "rev-1",
                    name: "Pooja Rathore",
                    role: "Destination Bride • Jagmandir Palace, Udaipur",
                    stars: 5,
                    text: "Bhuvi is an absolute magician! She drew our destination wedding story and hidden portraits so exquisitely on my hands. The stain on my wedding day was pitch dark and lasted for over 3 weeks. Highly recommend her to every Udaipur bride!"
                },
                {
                    id: "rev-2",
                    name: "Ananya Singhal",
                    role: "Royal Wedding • The Oberoi Udaivilas, Udaipur",
                    stars: 5,
                    text: "The patience and precision Bhuvi has is unmatched. She arrived on time at our resort, brought natural organic henna that smelled heavenly, and created the cleanest fine lines I've ever seen. Every single wedding guest was mesmerized!"
                },
                {
                    id: "rev-3",
                    name: "Sneha Sharma",
                    role: "Sangeet & Bridal • Aurika, Udaipur",
                    stars: 5,
                    text: "Booked Bhuvi for my engagement and then again for my sister's wedding group. Her designs are super modern, chic, and the color payoff is extraordinary. She is polite, gentle, and a true artist!"
                }
            ];
        }

        data.reviews.unshift(newReview);
        localStorage.setItem("bhuvi_mehndi_data", JSON.stringify(data));
        renderDynamicReviews(data.reviews);

        window.closeClientReviewModal();
        nameInput.value = "";
        if (roleInput) roleInput.value = "";
        textInput.value = "";
        alert("✦ Thank you so much for sharing your review! It has been published on the website.");
    } catch (err) {
        console.error("Could not save review:", err);
        alert("Thank you! Your review has been received.");
        window.closeClientReviewModal();
    }
};

// Load customized data from Admin Panel immediately
loadCustomizedData();


    /* ================= DYNAMIC YEAR ================= */
    const yearEl = document.getElementById("year");
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }


    /* ================= HEADER SCROLL & SCROLL-SPY ================= */
    const header = document.getElementById("header");
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-link");

    window.addEventListener("scroll", () => {
        const scrollY = window.pageYOffset;

        // Shrink header on scroll
        if (header) {
            if (scrollY > 40) {
                header.classList.add("scrolled");
            } else {
                header.classList.remove("scrolled");
            }
        }

        // Scroll spy to highlight active nav link
        let currentSectionId = "";
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute("id");
            }
        });

        if (currentSectionId) {
            navLinks.forEach(link => {
                link.classList.remove("active");
                if (link.getAttribute("href") === `#${currentSectionId}`) {
                    link.classList.add("active");
                }
            });
        }
    }, { passive: true });


    /* ================= MOBILE MENU DRAWER ================= */
    const nav = document.querySelector(".nav-links");
    const menuBtn = document.querySelector(".menu-btn");

    window.toggleMenu = function () {
        if (!nav) return;
        nav.classList.toggle("active");
        const isOpen = nav.classList.contains("active");
        if (menuBtn) {
            menuBtn.textContent = isOpen ? "✕" : "☰";
            menuBtn.setAttribute("aria-expanded", isOpen);
        }
    };

    // Close menu when clicking nav links
    document.querySelectorAll(".nav-links a").forEach(link => {
        link.addEventListener("click", () => {
            if (nav) nav.classList.remove("active");
            if (menuBtn) {
                menuBtn.textContent = "☰";
                menuBtn.setAttribute("aria-expanded", "false");
            }
        });
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
        if (nav && nav.classList.contains("active") && !nav.contains(e.target) && !menuBtn.contains(e.target)) {
            nav.classList.remove("active");
            if (menuBtn) {
                menuBtn.textContent = "☰";
                menuBtn.setAttribute("aria-expanded", "false");
            }
        }
    });

    // Close menu when pressing Escape key
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && nav && nav.classList.contains("active")) {
            nav.classList.remove("active");
            if (menuBtn) {
                menuBtn.textContent = "☰";
                menuBtn.setAttribute("aria-expanded", "false");
                menuBtn.focus();
            }
        }
    });


    /* ================= GALLERY FILTER ================= */
    window.filterGallery = function (category, button) {
        const items = document.querySelectorAll(".gallery-item");
        const buttons = document.querySelectorAll(".filter-btn");

        buttons.forEach(btn => btn.classList.remove("active"));
        if (button) button.classList.add("active");

        items.forEach(item => {
            if (category === "all" || item.dataset.category === category) {
                item.style.display = "block";
            } else {
                item.style.display = "none";
            }
        });
    };


    /* ================= ENHANCED LIGHTBOX ================= */
    let currentLightboxIndex = 0;

    function getGalleryItems() {
        return Array.from(document.querySelectorAll(".gallery-item"));
    }

    window.openLightbox = function (item) {
        const items = getGalleryItems();
        const index = items.indexOf(item);
        if (index !== -1) {
            currentLightboxIndex = index;
        }

        const image = item.querySelector("img");
        const title = item.dataset.title || item.querySelector(".gallery-overlay span")?.textContent || "Royal Mehndi Art";

        const lightbox = document.getElementById("lightbox");
        const lightboxImg = document.getElementById("lightboxImage");
        const caption = document.getElementById("lightboxCaption");

        if (lightboxImg && image) {
            lightboxImg.src = image.src;
            lightboxImg.alt = image.alt || title;
        }

        if (caption) {
            caption.textContent = title;
        }

        if (lightbox) {
            lightbox.classList.add("active");
        }

        document.body.style.overflow = "hidden";
    };

    window.closeLightbox = function (event) {
        if (event) {
            const target = event.target;
            if (target.id !== "lightbox" && !target.classList.contains("close-lightbox")) {
                return;
            }
        }

        const lightbox = document.getElementById("lightbox");
        if (lightbox) {
            lightbox.classList.remove("active");
        }
        document.body.style.overflow = "";
    };

    window.nextLightbox = function (event) {
        if (event) event.stopPropagation();
        const items = getGalleryItems();
        if (items.length === 0) return;
        currentLightboxIndex = (currentLightboxIndex + 1) % items.length;
        window.openLightbox(items[currentLightboxIndex]);
    };

    window.prevLightbox = function (event) {
        if (event) event.stopPropagation();
        const items = getGalleryItems();
        if (items.length === 0) return;
        currentLightboxIndex = (currentLightboxIndex - 1 + items.length) % items.length;
        window.openLightbox(items[currentLightboxIndex]);
    };

    window.bookCurrentDesign = function () {
        const caption = document.getElementById("lightboxCaption")?.textContent || "Bridal Mehndi";
        window.closeLightbox();
        selectDesign("Bridal");
        const notes = document.getElementById("notes");
        if (notes) {
            notes.value = `I am interested in booking the "${caption}" design from your gallery.`;
        }
    };

    // Keyboard navigation for Lightbox
    document.addEventListener("keydown", (event) => {
        const lightbox = document.getElementById("lightbox");
        if (!lightbox || !lightbox.classList.contains("active")) return;

        if (event.key === "Escape") {
            window.closeLightbox();
        } else if (event.key === "ArrowRight") {
            window.nextLightbox();
        } else if (event.key === "ArrowLeft") {
            window.prevLightbox();
        }
    });

    // Touch swipe navigation for Lightbox on mobile devices
    const lightboxEl = document.getElementById("lightbox");
    if (lightboxEl) {
        let lbTouchStartX = 0;
        let lbTouchEndX = 0;
        let lbTouchStartY = 0;
        let lbTouchEndY = 0;

        lightboxEl.addEventListener("touchstart", (e) => {
            if (e.touches && e.touches[0]) {
                lbTouchStartX = e.touches[0].clientX;
                lbTouchStartY = e.touches[0].clientY;
            }
        }, { passive: true });

        lightboxEl.addEventListener("touchend", (e) => {
            if (e.changedTouches && e.changedTouches[0]) {
                lbTouchEndX = e.changedTouches[0].clientX;
                lbTouchEndY = e.changedTouches[0].clientY;
                const diffX = lbTouchStartX - lbTouchEndX;
                const diffY = Math.abs(lbTouchStartY - lbTouchEndY);

                // Ensure it was predominantly a horizontal swipe
                if (Math.abs(diffX) > 40 && Math.abs(diffX) > diffY) {
                    if (diffX > 0) {
                        window.nextLightbox();
                    } else {
                        window.prevLightbox();
                    }
                }
            }
        }, { passive: true });
    }


    /* ================= FAQ ACCORDION ================= */
    window.toggleFaq = function (button) {
        const currentFaq = button.parentElement;
        const allFaqs = document.querySelectorAll(".faq");

        allFaqs.forEach(faq => {
            if (faq !== currentFaq) {
                faq.classList.remove("open");
            }
        });

        currentFaq.classList.toggle("open");
    };


    /* ================= FORM PRE-FILL HELPERS ================= */
    window.selectDesign = function (designName) {
        const designSelect = document.getElementById("design");
        if (designSelect) {
            for (let i = 0; i < designSelect.options.length; i++) {
                if (designSelect.options[i].value === designName || designSelect.options[i].text.includes(designName)) {
                    designSelect.selectedIndex = i;
                    break;
                }
            }
        }
        const bookingSection = document.getElementById("booking");
        if (bookingSection) {
            bookingSection.scrollIntoView({ behavior: "smooth" });
        }
    };

    window.selectEvent = function (eventName) {
        const eventSelect = document.getElementById("event");
        if (eventSelect) {
            for (let i = 0; i < eventSelect.options.length; i++) {
                if (eventSelect.options[i].value === eventName || eventSelect.options[i].text.includes(eventName)) {
                    eventSelect.selectedIndex = i;
                    break;
                }
            }
        }
        const bookingSection = document.getElementById("booking");
        if (bookingSection) {
            bookingSection.scrollIntoView({ behavior: "smooth" });
        }
    };


    /* ================= 10-DIGIT PHONE INPUT RESTRICTION ================= */
    const phoneInput = document.getElementById("phone");
    const phoneHint = document.getElementById("phoneHint");

    if (phoneInput) {
        phoneInput.addEventListener("input", function () {
            // Remove all non-digits and cap at 10 digits
            this.value = this.value.replace(/\D/g, "").slice(0, 10);

            if (phoneHint) {
                if (this.value.length === 10) {
                    phoneHint.textContent = "✓ 10 digits entered";
                    phoneHint.style.color = "#1b6330";
                } else if (this.value.length > 0) {
                    phoneHint.textContent = `${10 - this.value.length} digits left`;
                    phoneHint.style.color = "var(--muted)";
                } else {
                    phoneHint.textContent = "";
                }
            }
        });
    }


    /* ================= MINIMUM DATE CONSTRAINT ================= */
    const dateInput = document.getElementById("date");
    if (dateInput) {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, "0");
        const dd = String(today.getDate()).padStart(2, "0");
        dateInput.min = `${yyyy}-${mm}-${dd}`;
    }


    /* ================= BOOKING SUBMISSION & WHATSAPP GENERATION ================= */
    window.submitBooking = function (event) {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const email = document.getElementById("email").value.trim();
        const eventType = document.getElementById("event").value;
        const date = document.getElementById("date").value;
        const time = document.getElementById("time").value;
        const venue = document.getElementById("venue").value.trim();
        const people = document.getElementById("people").value;
        const design = document.getElementById("design").value;
        const notes = document.getElementById("notes").value.trim();

        if (!name || !phone || !eventType || !date || !venue) {
            alert("Please fill in all required fields (Name, Phone, Event, Date, and Venue).");
            return;
        }

        const cleanPhone = phone.replace(/\D/g, "");
        if (cleanPhone.length !== 10) {
            alert("Please enter a valid 10-digit mobile number.");
            document.getElementById("phone").focus();
            return;
        }

        const formattedDate = new Date(date + "T00:00:00").toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "long",
            year: "numeric"
        });

        // Luxury formatted WhatsApp message
        const message = 
`🌿 *NEW MEHNDI BOOKING INQUIRY*
━━━━━━━━━━━━━━━━━━━━
👤 *Bride / Client:* ${name}
📱 *Contact Number:* ${cleanPhone}
📧 *Email:* ${email || "Not specified"}
━━━━━━━━━━━━━━━━━━━━
💍 *Event Type:* ${eventType}
📅 *Event Date:* ${formattedDate}
⏰ *Time Slot:* ${time || "Flexible / Not specified"}
📍 *Venue & City:* ${venue}
👥 *Guest Count:* ${people ? `${people} People` : "1 (Bride Only)"}
🎨 *Preferred Design:* ${design || "Consultation needed"}
━━━━━━━━━━━━━━━━━━━━
📝 *Special Requests / Story Details:*
${notes || "None mentioned"}
━━━━━━━━━━━━━━━━━━━━
_Sent via Bhuvi Mehandi Luxury Concierge_`;

        // Save booking inquiry to Cloud Database & Admin Panel CRM
        const newInquiry = {
            id: "INQ-" + Date.now(),
            createdAt: new Date().toISOString(),
            formattedDateSubmitted: new Date().toLocaleString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }),
            name: name,
            phone: cleanPhone,
            email: email || "",
            eventType: eventType,
            eventDate: date,
            eventDateFormatted: formattedDate,
            timeSlot: time || "Flexible",
            venue: venue,
            guestCount: people ? `${people} People` : "1 (Bride Only)",
            designPreference: design || "Consultation needed",
            notes: notes || "",
            status: "New"
        };

        if (window.BhuviDB && typeof window.BhuviDB.submitInquiry === "function") {
            window.BhuviDB.submitInquiry(newInquiry);
        } else {
            try {
                const inquiries = JSON.parse(localStorage.getItem("bhuvi_inquiries") || "[]");
                inquiries.unshift(newInquiry);
                localStorage.setItem("bhuvi_inquiries", JSON.stringify(inquiries));
                idbSet("bhuvi_inquiries", inquiries);
            } catch (e) {
                console.warn("Could not save booking to admin inquiries:", e);
            }
        }

        // WhatsApp number (check if customized in admin settings)
        let whatsappNumber = "918320904682";
        try {
            const savedData = JSON.parse(localStorage.getItem("bhuvi_mehndi_data") || "{}");
            if (savedData?.settings?.whatsapp) {
                whatsappNumber = savedData.settings.whatsapp.replace(/\D/g, "");
            }
        } catch (e) {}

        const whatsappURL = "https://wa.me/" + whatsappNumber + "?text=" + encodeURIComponent(message);

        const formMessage = document.getElementById("formMessage");
        if (formMessage) {
            formMessage.style.display = "block";
            formMessage.textContent = "✦ Opening WhatsApp with your personalized booking details...";
        }

        window.open(whatsappURL, "_blank");
    };


    /* ================= SCROLL REVEAL ANIMATION ================= */
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
            }
        });
    }, {
        threshold: 0.12
    });

    document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

}

// Execute immediately upon visit, even if DOMContentLoaded already fired
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initBhuviStudio);
} else {
    initBhuviStudio();
}
