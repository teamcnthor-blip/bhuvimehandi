/* =========================================================
   BHUVI MEHANDI — STUDIO ADMIN ENGINE
   CRM, Gallery & Hero CMS, LocalStorage Real-Time Sync
   ========================================================= */

(function () {
    "use strict";

    /* ================= DEFAULT FACTORY DATA ================= */
    const DEFAULT_DATA = {
        heroBanners: [
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
        ],
        hero: {
            bannerImage: "hero-banner.png",
            bannerEnabled: true,
            eyebrow: "✦ UDAIPUR'S PREMIER BRIDAL MEHNDI ARTIST",
            headingPrefix: "Exquisite Mehndi Art",
            headingHighlight: "for Your Royal Moments",
            description: "Experience the magic of authentic Rajasthani heritage and contemporary bridal artistry. Handcrafted with 100% natural organic henna for deep, dark stains and unforgettable wedding memories.",
            image: "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1000&q=85",
            badgeStars: "★★★★★",
            badgeCount: "500+ Happy Brides",
            badgeSub: "Udaipur Palace & Destination Weddings"
        },
        about: {
            image: "https://images.unsplash.com/photo-1582234372722-50d7ccc30ebd?auto=format&fit=crop&w=900&q=85",
            expYears: "8+",
            expLabel: "Years of Bridal Henna Artistry",
            heading: "Where Mewari Tradition Meets Fine Bridal Couture.",
            bio1: "Hello, I am <strong>Bhuvi Prajapat</strong>, the artist behind Bhuvi Mehandi in Udaipur. Rooted in the royal city of lakes and palaces, my passion is creating breathtaking henna that honors ancient Indian customs while complementing modern bridal elegance.",
            bio2: "Every bridal design is drawn with patience, pure concentration, and organic Sojat henna freshly infused with pure essential oils. Whether you dream of a traditional Marwari Doli-Baraat story or contemporary fine-line lace, I am dedicated to making your bridal experience unforgettable."
        },
        gallery: [
            {
                id: "gal-1",
                src: "https://images.unsplash.com/photo-1599833975787-5f6b0e8d1b55?auto=format&fit=crop&w=900&q=80",
                alt: "Intricate royal bridal mehndi design",
                title: "Royal Bridal Full-Arm Mehndi",
                category: "bridal",
                categoryLabel: "Bridal Collection",
                subtitle: "Royal Bridal Henna",
                isLarge: true
            },
            {
                id: "gal-2",
                src: "https://images.unsplash.com/photo-1610992015732-2449b76344bc?auto=format&fit=crop&w=700&q=80",
                alt: "Arabic floral mehndi design",
                title: "Modern Arabic Floral Trail",
                category: "arabic",
                categoryLabel: "Arabic Style",
                subtitle: "Floral Trail",
                isLarge: false
            },
            {
                id: "gal-3",
                src: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=700&q=80",
                alt: "Traditional Rajasthani Marwari wedding mehndi",
                title: "Heritage Marwari Bharwa Mehndi",
                category: "rajasthani",
                categoryLabel: "Rajasthani",
                subtitle: "Heritage Marwari",
                isLarge: false
            },
            {
                id: "gal-4",
                src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=700&q=80",
                alt: "Elegant engagement ring ceremony mehndi",
                title: "Delicate Ring Ceremony Mehndi",
                category: "engagement",
                categoryLabel: "Engagement",
                subtitle: "Delicate Mandala",
                isLarge: false
            },
            {
                id: "gal-5",
                src: "https://images.unsplash.com/photo-1609220136736-443140cffec6?auto=format&fit=crop&w=700&q=80",
                alt: "Festive Indian celebration mehndi",
                title: "Festive Teej & Karwa Chauth Henna",
                category: "festival",
                categoryLabel: "Festivals",
                subtitle: "Festive Grace",
                isLarge: false
            },
            {
                id: "gal-6",
                src: "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=700&q=80",
                alt: "Intricate bridal palm and wrist mehndi",
                title: "Intricate Bridal Palms & Cuffs",
                category: "bridal",
                categoryLabel: "Bridal Collection",
                subtitle: "Palms & Cuffs",
                isLarge: false
            },
            {
                id: "gal-7",
                src: "https://images.unsplash.com/photo-1544078751-58fee2d8a03b?auto=format&fit=crop&w=700&q=80",
                alt: "Contemporary designer Arabic mehndi",
                title: "Contemporary Negative-Space Arabic",
                category: "arabic",
                categoryLabel: "Arabic Designer",
                subtitle: "Negative Space",
                isLarge: false
            },
            {
                id: "gal-8",
                src: "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=700&q=80",
                alt: "Traditional Rajasthani peacock henna art",
                title: "Traditional Jharokha & Peacock Art",
                category: "rajasthani",
                categoryLabel: "Rajasthani Heritage",
                subtitle: "Jharokha & Peacock",
                isLarge: false
            }
        ],
        reviews: [
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
        ],
        settings: {
            whatsapp: "918094935632",
            phone: "+91 80949 35632",
            email: "prajapatbhavna2003@gmail.com",
            address: "Near Mohanlal Sukhadia University, Udaipur, Rajasthan 313001",
            instagram: "bhuvi_mehandi_24",
            adminUsername: "admin",
            adminPassword: "admin123",
            adminPin: "1234"
        }
    };

    /* ================= PERSISTENCE ENGINE (BhuviDB + IndexedDB + LocalStorage) ================= */
    const DATA_KEY = "bhuvi_mehndi_data";
    const INQUIRIES_KEY = "bhuvi_inquiries";

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

    /* ================= STATE ================= */
    let appData = null;
    let inquiries = [];

    function broadcastUpdate() {
        try {
            if (typeof BroadcastChannel !== "undefined") {
                const bc = new BroadcastChannel("bhuvi_studio_channel");
                bc.postMessage({ type: "DATA_UPDATED", timestamp: Date.now() });
                bc.close();
            }
        } catch (e) {}

        try {
            localStorage.setItem("bhuvi_last_sync", String(Date.now()));
        } catch (e) {}
    }

    // Load state safely: Server API -> Cloud Firestore -> IndexedDB -> LocalStorage
    // NEVER prematurely overwrites existing data with DEFAULT_DATA on startup!
    async function loadState() {
        let loaded = null;

        // 1. Fast initial synchronous read from localStorage for instant render
        try {
            const raw = localStorage.getItem(DATA_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed && typeof parsed === "object") {
                    loaded = parsed;
                }
            }
        } catch (e) {}

        if (loaded) {
            appData = loaded;
            renderAdminBanners();
            renderAdminGallery();
            renderAdminReviews();
            updateOverviewStats();
        }

        // 2. Authoritative Multi-Device Load via BhuviDB (Supabase / Server / Cloud)
        if (window.BhuviDB && typeof window.BhuviDB.getSiteContent === "function") {
            try {
                const authoritativeData = await window.BhuviDB.getSiteContent();
                if (authoritativeData && typeof authoritativeData === "object") {
                    appData = authoritativeData;
                    renderAdminBanners();
                    renderAdminGallery();
                    renderAdminReviews();
                    initAboutSection();
                    initSettingsSection();
                    updateOverviewStats();
                }
            } catch (err) {
                console.warn("BhuviDB load error:", err);
            }
        }

        // 3. Fallback to IndexedDB if appData is still missing
        if (!appData) {
            const idbData = await idbGet(DATA_KEY);
            if (idbData && typeof idbData === "object") {
                appData = idbData;
                renderAdminBanners();
                renderAdminGallery();
                renderAdminReviews();
                initAboutSection();
                initSettingsSection();
                updateOverviewStats();
            }
        }

        // 4. ONLY if appData is STILL null after ALL sources checked, initialize with in-memory DEFAULT_DATA
        // CRITICAL FIX: NEVER call saveSiteContent here! That was overwriting database content!
        if (!appData) {
            console.info("ℹ️ No existing data found in server/cloud/local DB. Initializing in-memory default catalog.");
            appData = JSON.parse(JSON.stringify(DEFAULT_DATA));
        }

        // Ensure collections are properly initialized arrays
        if (!Array.isArray(appData.gallery)) appData.gallery = [];
        if (!Array.isArray(appData.heroBanners)) appData.heroBanners = [];
        if (!Array.isArray(appData.reviews)) appData.reviews = [];
        if (!appData.about) appData.about = {};
        if (!appData.settings) appData.settings = {};

        // 5. Inquiries Loading
        if (window.BhuviDB && typeof window.BhuviDB.getInquiries === "function") {
            try {
                const fetchedInqs = await window.BhuviDB.getInquiries();
                if (Array.isArray(fetchedInqs)) {
                    inquiries = fetchedInqs;
                }
            } catch (e) {}
        } else {
            try {
                const rawInq = localStorage.getItem(INQUIRIES_KEY);
                inquiries = rawInq ? JSON.parse(rawInq) : [];
            } catch (e) {
                inquiries = [];
            }
        }

        // Render UI with full data
        renderAdminBanners();
        renderAdminGallery();
        renderAdminReviews();
        renderInquiriesTable();
        updateOverviewStats();

        // 6. Listen for Real-Time Client Inquiries from live website or other devices
        if (window.BhuviDB && typeof window.BhuviDB.listenToInquiries === "function") {
            window.BhuviDB.listenToInquiries((liveInqs) => {
                if (Array.isArray(liveInqs)) {
                    const previousCount = inquiries.length;
                    inquiries = liveInqs;
                    if (liveInqs.length > previousCount && previousCount > 0) {
                        const latest = liveInqs[0];
                        showToast(`🔔 New Booking Inquiry received from ${latest.name || "a bride"}!`, "success");
                    }
                    renderInquiriesTable();
                    updateOverviewStats();
                }
            });
        }
    }

    async function saveState() {
        // 1. Persistent IndexedDB backing (virtually unlimited quota)
        idbSet(DATA_KEY, appData);

        // 2. Fast synchronous localStorage (safe try/catch against quota limit)
        try {
            localStorage.setItem(DATA_KEY, JSON.stringify(appData));
        } catch (e) {
            console.warn("localStorage quota exceeded; safely preserved in IndexedDB, Server & Cloud.", e);
        }

        // 3. Save to Multi-Device Engine (Server disk data_store.json + Cloud Firestore)
        let saveResult = null;
        if (window.BhuviDB && typeof window.BhuviDB.saveSiteContent === "function") {
            try {
                saveResult = await window.BhuviDB.saveSiteContent(appData);
            } catch (err) {
                console.warn("BhuviDB.saveSiteContent error:", err);
            }
        }

        // 4. Real-time broadcast to open website tabs
        broadcastUpdate();

        if (saveResult && saveResult.supabase) {
            showToast("⚡ Changes saved to Supabase PostgreSQL & synced live!", "success");
        } else if (saveResult && saveResult.server) {
            showToast("✅ Changes saved to Disk (data_store.json) & synced to phone live!", "success");
        } else if (saveResult && saveResult.cloud) {
            showToast("☁️ Changes saved to Cloud Firestore & synced worldwide!", "success");
        } else {
            showToast("💾 Saved locally. Start server or connect Supabase for live sync.", "info");
        }
        updateOverviewStats();
    }

    function saveInquiries() {
        idbSet(INQUIRIES_KEY, inquiries);
        try {
            localStorage.setItem(INQUIRIES_KEY, JSON.stringify(inquiries));
        } catch (e) {
            console.warn("localStorage quota exceeded for inquiries:", e);
        }
        updateOverviewStats();
    }

    /* ================= TOAST NOTIFICATION ================= */
    function showToast(message, type = "success") {
        const container = document.getElementById("toastContainer");
        if (!container) return;

        const toast = document.createElement("div");
        toast.className = `toast ${type}`;
        const icon = type === "success" ? "✓" : "⚠";
        toast.innerHTML = `<strong>${icon}</strong> <span>${escapeHtml(message)}</span>`;
        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = "0";
            toast.style.transform = "translateX(40px)";
            toast.style.transition = "all 0.3s ease";
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    }

    function escapeHtml(str) {
        if (!str) return "";
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    /* ================= CLIENT-SIDE IMAGE COMPRESSION ================= */
    // Compresses uploaded photos so they save instantly and reliably
    function compressImageFile(file, callback, maxDimension = 1200, quality = 0.72) {
        if (!file.type.startsWith("image/")) {
            showToast("Please upload an image file (PNG, JPG, WebP)", "error");
            return;
        }

        const reader = new FileReader();
        reader.onload = function (e) {
            const img = new Image();
            img.onload = function () {
                const maxDim = maxDimension;
                let width = img.width;
                let height = img.height;

                if (width > maxDim || height > maxDim) {
                    if (width > height) {
                        height = Math.round((height * maxDim) / width);
                        width = maxDim;
                    } else {
                        width = Math.round((width * maxDim) / height);
                        height = maxDim;
                    }
                }

                const canvas = document.createElement("canvas");
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, width, height);

                const dataUrl = canvas.toDataURL("image/jpeg", quality);
                callback(dataUrl);
            };
            img.onerror = function () {
                showToast("Could not process image file", "error");
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    /* ================= AUTHENTICATION ================= */
    function initAuth() {
        const lockOverlay = document.getElementById("lockOverlay");
        const usernameInput = document.getElementById("adminUsernameInput");
        const passwordInput = document.getElementById("adminPasswordInput");
        const loginBtn = document.getElementById("loginBtn");
        const logoutBtn = document.getElementById("logoutBtn");

        const isAuth = sessionStorage.getItem("bhuvi_admin_auth") === "true";
        if (isAuth && lockOverlay) {
            lockOverlay.classList.add("hidden");
        }

        function handleLogin() {
            const user = (usernameInput ? usernameInput.value.trim() : "").toLowerCase();
            const pass = passwordInput ? passwordInput.value.trim() : "";

            const validUser = (appData.settings.adminUsername || "admin").toLowerCase();
            const validPass = appData.settings.adminPassword || appData.settings.adminPin || "admin123";

            // Allow flexible access:
            // 1. Correct configured username + password
            // 2. Default "admin" + "admin123"
            // 3. Fallback quick access PIN "1234"
            const isUserMatch = !user || user === validUser || user === "admin" || user === "bhuvi";
            const isPassMatch = pass === validPass || pass === "admin123" || pass === "1234";

            if (isUserMatch && isPassMatch && pass !== "") {
                sessionStorage.setItem("bhuvi_admin_auth", "true");
                if (lockOverlay) lockOverlay.classList.add("hidden");
                if (passwordInput) passwordInput.value = "";
                showToast("Welcome to Bhuvi Studio Admin!", "success");
            } else {
                if (passwordInput) passwordInput.style.borderColor = "var(--danger)";
                showToast("Incorrect Username or Password. Try admin / admin123", "error");
                setTimeout(() => {
                    if (passwordInput) passwordInput.style.borderColor = "";
                }, 1200);
            }
        }

        if (loginBtn) loginBtn.addEventListener("click", handleLogin);

        if (usernameInput) {
            usernameInput.addEventListener("keydown", (e) => {
                if (e.key === "Enter") {
                    if (passwordInput) passwordInput.focus();
                }
            });
        }

        if (passwordInput) {
            passwordInput.addEventListener("keydown", (e) => {
                if (e.key === "Enter") handleLogin();
            });
        }

        if (logoutBtn) {
            logoutBtn.addEventListener("click", () => {
                sessionStorage.removeItem("bhuvi_admin_auth");
                if (lockOverlay) {
                    lockOverlay.classList.remove("hidden");
                    if (passwordInput) passwordInput.focus();
                }
            });
        }
    }

    /* ================= NAVIGATION TABS ================= */
    function initTabs() {
        const navItems = document.querySelectorAll(".sidebar-nav .nav-item");
        const tabPanes = document.querySelectorAll(".tab-pane");
        const pageTitle = document.getElementById("pageTitle");
        const menuToggleBtn = document.getElementById("menuToggleBtn");
        const sidebar = document.querySelector(".admin-sidebar");
        const sidebarOverlay = document.getElementById("sidebarOverlay");

        navItems.forEach(item => {
            item.addEventListener("click", () => {
                const targetTab = item.dataset.tab;
                if (!targetTab) return;

                navItems.forEach(n => n.classList.remove("active"));
                item.classList.add("active");

                tabPanes.forEach(pane => {
                    if (pane.id === `tab-${targetTab}`) {
                        pane.classList.add("active");
                    } else {
                        pane.classList.remove("active");
                    }
                });

                if (pageTitle) {
                    pageTitle.textContent = item.querySelector("span:not(.nav-icon):not(.nav-badge)").textContent;
                }

                if (sidebar && window.innerWidth <= 992) {
                    sidebar.classList.remove("open");
                    if (sidebarOverlay) sidebarOverlay.classList.remove("active");
                }
            });
        });

        if (menuToggleBtn && sidebar) {
            menuToggleBtn.addEventListener("click", () => {
                const isOpen = sidebar.classList.toggle("open");
                if (sidebarOverlay) sidebarOverlay.classList.toggle("active", isOpen);
            });
        }

        if (sidebarOverlay && sidebar) {
            sidebarOverlay.addEventListener("click", () => {
                sidebar.classList.remove("open");
                sidebarOverlay.classList.remove("active");
            });
        }
    }

    /* ================= OVERVIEW STATS ================= */
    function updateOverviewStats() {
        const statGalleryCount = document.getElementById("statGalleryCount");
        const statInquiriesCount = document.getElementById("statInquiriesCount");
        const statCategoriesCount = document.getElementById("statCategoriesCount");
        const badgeInquiriesCount = document.getElementById("badgeInquiriesCount");

        if (statGalleryCount && appData.gallery) {
            statGalleryCount.textContent = appData.gallery.length;
        }

        if (statInquiriesCount) {
            statInquiriesCount.textContent = inquiries.length;
        }

        if (badgeInquiriesCount) {
            const newCount = inquiries.filter(i => i.status === "New").length;
            badgeInquiriesCount.textContent = newCount > 0 ? newCount : inquiries.length;
        }

        if (statCategoriesCount && appData.gallery) {
            const cats = new Set(appData.gallery.map(i => (i.category || "other").toLowerCase()));
            statCategoriesCount.textContent = cats.size;
        }
    }

    /* ================= HERO CAROUSEL BANNERS CMS ================= */
    let editingBannerId = null;

    function renderAdminBanners() {
        const grid = document.getElementById("adminBannersGrid");
        if (!grid) return;

        const list = appData.heroBanners || [];

        if (list.length === 0) {
            grid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 48px 20px; background: var(--bg-card); border-radius: var(--radius-md); border: 1px dashed var(--border-color);">
                    <div style="font-size: 36px; margin-bottom: 8px;">🖼️</div>
                    <p style="font-size: 15px; color: var(--text-secondary); margin-bottom: 12px;">No hero banner slides added yet.</p>
                    <button class="btn btn-primary btn-sm" onclick="window.adminOpenAddBannerModal()">✦ + Add First Banner Slide</button>
                </div>
            `;
            return;
        }

        grid.innerHTML = list.map((item, idx) => {
            const slideNum = idx + 1;
            const isFirst = idx === 0;
            const isLast = idx === list.length - 1;
            return `
                <div class="admin-banner-card" data-id="${item.id}">
                    <div class="admin-banner-thumb">
                        <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title || 'Hero Banner')}" loading="lazy">
                        <span class="admin-banner-badge">Slide ${slideNum}</span>
                    </div>
                    <div class="admin-banner-body">
                        <div>
                            <div class="admin-banner-title" title="${escapeHtml(item.title || '')}">${escapeHtml(item.title || `Hero Background ${slideNum}`)}</div>
                        </div>
                        <div class="admin-banner-actions">
                            <button class="btn btn-secondary btn-sm" style="padding: 6px 10px;" onclick="window.adminMoveBanner('${item.id}', -1)" title="Move slide earlier" ${isFirst ? 'disabled style="opacity:0.3;cursor:not-allowed;"' : ''}>◀</button>
                            <button class="btn btn-secondary btn-sm" style="padding: 6px 10px;" onclick="window.adminMoveBanner('${item.id}', 1)" title="Move slide later" ${isLast ? 'disabled style="opacity:0.3;cursor:not-allowed;"' : ''}>▶</button>
                            <button class="btn btn-secondary btn-sm" style="flex:1;" onclick="window.adminEditBanner('${item.id}')">✏️ Edit</button>
                            <button class="btn btn-danger btn-sm" style="padding: 6px 12px;" onclick="window.adminDeleteBanner('${item.id}')" title="Delete background slide">🗑️</button>
                        </div>
                    </div>
                </div>
            `;
        }).join("");
    }

    function initHeroSection() {
        renderAdminBanners();

        const modal = document.getElementById("bannerModal");
        const modalClose = document.getElementById("closeBannerModal");
        const cancelBtn = document.getElementById("cancelBannerModalBtn");
        const modalTitle = document.getElementById("bannerModalTitle");
        const addBtn = document.getElementById("openAddBannerModalBtn");
        const saveBtn = document.getElementById("saveBannerItemBtn");

        const batchFileInput = document.getElementById("batchBannerFileInput");
        const bannerEditId = document.getElementById("bannerEditId");
        const bannerTitleInput = document.getElementById("bannerTitleInput");
        const bannerFileInput = document.getElementById("bannerFileInput");
        const bannerUrlInput = document.getElementById("bannerUrlInput");
        const bannerPreview = document.getElementById("bannerPreview");

        function closeBannerModal() {
            if (modal) modal.classList.remove("active");
            editingBannerId = null;
            if (bannerEditId) bannerEditId.value = "";
            if (bannerTitleInput) bannerTitleInput.value = "";
            if (bannerUrlInput) bannerUrlInput.value = "";
            if (bannerFileInput) bannerFileInput.value = "";
            if (bannerPreview) bannerPreview.src = "";
        }

        window.adminOpenAddBannerModal = function () {
            editingBannerId = null;
            if (modalTitle) modalTitle.textContent = "✦ Add Hero Banner Slide";
            if (bannerEditId) bannerEditId.value = "";
            if (bannerTitleInput) bannerTitleInput.value = "";
            if (bannerUrlInput) bannerUrlInput.value = "";
            if (bannerFileInput) bannerFileInput.value = "";
            if (bannerPreview) bannerPreview.src = "hero-banner.png";
            if (modal) modal.classList.add("active");
        };

        window.adminEditBanner = function (id) {
            const item = (appData.heroBanners || []).find(b => b.id === id);
            if (!item) return;

            editingBannerId = id;
            if (modalTitle) modalTitle.textContent = "✦ Edit Hero Banner Slide";
            if (bannerEditId) bannerEditId.value = id;
            if (bannerTitleInput) bannerTitleInput.value = item.title || "";
            if (bannerUrlInput) bannerUrlInput.value = item.image || "";
            if (bannerFileInput) bannerFileInput.value = "";
            if (bannerPreview) bannerPreview.src = item.image || "hero-banner.png";
            if (modal) modal.classList.add("active");
        };

        window.adminMoveBanner = function (id, direction) {
            const list = appData.heroBanners || [];
            const index = list.findIndex(b => b.id === id);
            if (index === -1) return;

            const targetIndex = index + direction;
            if (targetIndex < 0 || targetIndex >= list.length) return;

            const temp = list[index];
            list[index] = list[targetIndex];
            list[targetIndex] = temp;

            saveState();
            renderAdminBanners();
            showToast("Background order updated", "info");
        };

        window.adminDeleteBanner = function (id) {
            const list = appData.heroBanners || [];
            const item = list.find(b => b.id === id);
            const title = item ? item.title : "this banner";
            if (confirm(`Are you sure you want to remove banner slide "${title}"?`)) {
                appData.heroBanners = list.filter(b => b.id !== id);
                showToast("Banner slide removed.", "success");
                saveState();
                renderAdminBanners();
            }
        };

        // Multiple background batch file uploader
        if (batchFileInput) {
            batchFileInput.addEventListener("change", (e) => {
                const files = Array.from(e.target.files || []);
                if (!files.length) return;

                showToast(`Compressing & adding ${files.length} background(s)...`, "info");
                let processed = 0;

                files.forEach((file, fIdx) => {
                    compressImageFile(file, (dataUrl) => {
                        if (!appData.heroBanners) appData.heroBanners = [];
                        const cleanName = file.name ? file.name.replace(/\.[^/.]+$/, "") : `Hero Background ${appData.heroBanners.length + 1}`;
                        appData.heroBanners.push({
                            id: "banner-" + Date.now() + "-" + fIdx,
                            image: dataUrl,
                            title: cleanName
                        });

                        processed++;
                        if (processed === files.length) {
                            saveState();
                            renderAdminBanners();
                            showToast(`✦ Successfully added ${files.length} new hero background(s)!`, "success");
                            batchFileInput.value = "";
                        }
                    }, 1280, 0.72);
                });
            });
        }

        if (addBtn) addBtn.addEventListener("click", window.adminOpenAddBannerModal);
        if (modalClose) modalClose.addEventListener("click", closeBannerModal);
        if (cancelBtn) cancelBtn.addEventListener("click", closeBannerModal);

        if (bannerUrlInput) {
            bannerUrlInput.addEventListener("input", () => {
                if (bannerPreview && bannerUrlInput.value) {
                    bannerPreview.src = bannerUrlInput.value;
                }
            });
        }

        if (bannerFileInput) {
            bannerFileInput.addEventListener("change", (e) => {
                const files = Array.from(e.target.files || []);
                if (!files.length) return;

                if (files.length > 1) {
                    showToast(`Adding ${files.length} hero backgrounds...`, "info");
                    let processed = 0;
                    files.forEach((file, fIdx) => {
                        compressImageFile(file, (dataUrl) => {
                            if (!appData.heroBanners) appData.heroBanners = [];
                            const cleanName = file.name ? file.name.replace(/\.[^/.]+$/, "") : `Hero Background ${appData.heroBanners.length + 1}`;
                            appData.heroBanners.push({
                                id: "banner-" + Date.now() + "-" + fIdx,
                                image: dataUrl,
                                title: cleanName
                            });
                            processed++;
                            if (processed === files.length) {
                                saveState();
                                renderAdminBanners();
                                closeBannerModal();
                                showToast(`✦ Added ${files.length} new hero backgrounds!`, "success");
                            }
                        }, 1280, 0.72);
                    });
                } else {
                    const file = files[0];
                    compressImageFile(file, (dataUrl) => {
                        if (bannerPreview) bannerPreview.src = dataUrl;
                        if (bannerUrlInput) bannerUrlInput.value = dataUrl;
                        showToast("Banner image compressed & loaded", "info");
                    }, 1280, 0.72);
                }
            });
        }

        if (saveBtn) {
            saveBtn.addEventListener("click", () => {
                const image = (bannerUrlInput ? bannerUrlInput.value : "").trim();
                const title = (bannerTitleInput ? bannerTitleInput.value : "").trim();

                if (!image) {
                    alert("Please provide a banner image URL or upload an image file.");
                    return;
                }

                if (!appData.heroBanners) appData.heroBanners = [];

                if (editingBannerId) {
                    const idx = appData.heroBanners.findIndex(b => b.id === editingBannerId);
                    if (idx !== -1) {
                        appData.heroBanners[idx] = {
                            ...appData.heroBanners[idx],
                            image,
                            title: title || `Banner Slide ${idx + 1}`
                        };
                        showToast("Banner slide updated successfully!", "success");
                    }
                } else {
                    const newBanner = {
                        id: "banner-" + Date.now(),
                        image,
                        title: title || `Banner Slide ${appData.heroBanners.length + 1}`
                    };
                    appData.heroBanners.push(newBanner);
                    showToast("✦ New banner slide added to hero carousel!", "success");
                }

                saveState();
                renderAdminBanners();
                closeBannerModal();
            });
        }
    }

    /* ================= GALLERY CMS ================= */
    let galleryFilterCurrent = "all";
    let editingGalleryId = null;

    function renderAdminGallery() {
        const grid = document.getElementById("adminGalleryGrid");
        if (!grid) return;

        const list = appData.gallery || [];
        const filtered = galleryFilterCurrent === "all"
            ? list
            : list.filter(item => (item.category || "").toLowerCase() === galleryFilterCurrent);

        if (filtered.length === 0) {
            grid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 48px 20px; background: var(--bg-card); border-radius: var(--radius-md); border: 1px dashed var(--border-color);">
                    <p style="font-size: 16px; color: var(--text-secondary); margin-bottom: 12px;">No mehndi designs in this category.</p>
                    <button class="btn btn-primary btn-sm" onclick="window.adminOpenAddGalleryModal()">+ Add Your First Design</button>
                </div>
            `;
            return;
        }

        grid.innerHTML = filtered.map(item => {
            const cat = item.category || "bridal";
            const badge = item.categoryLabel || cat.toUpperCase();
            return `
                <div class="admin-gallery-card" data-id="${item.id}">
                    <div class="admin-gallery-thumb">
                        <img src="${escapeHtml(item.src)}" alt="${escapeHtml(item.title || 'Mehndi')}" loading="lazy">
                        <span class="admin-gallery-badge">${escapeHtml(badge)}</span>
                    </div>
                    <div class="admin-gallery-body">
                        <div>
                            <div class="admin-gallery-title">${escapeHtml(item.title || 'Untitled Design')}</div>
                            <div class="admin-gallery-sub">${escapeHtml(item.subtitle || cat)}</div>
                        </div>
                        <div class="admin-gallery-actions">
                            <button class="btn btn-secondary btn-sm" style="flex:1" onclick="window.adminEditGallery('${item.id}')">✏️ Edit</button>
                            <button class="btn btn-danger btn-sm" onclick="window.adminDeleteGallery('${item.id}')">🗑️ Delete</button>
                        </div>
                    </div>
                </div>
            `;
        }).join("");
    }

    function initGallerySection() {
        renderAdminGallery();

        // Admin category filter tabs
        const filterBtns = document.querySelectorAll(".admin-gallery-filter");
        filterBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                filterBtns.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                galleryFilterCurrent = btn.dataset.category || "all";
                renderAdminGallery();
            });
        });

        // Modal Elements
        const modal = document.getElementById("galleryModal");
        const modalClose = document.getElementById("closeGalleryModal");
        const modalTitle = document.getElementById("galleryModalTitle");
        const addBtn = document.getElementById("openAddGalleryModalBtn");
        const saveBtn = document.getElementById("saveGalleryItemBtn");

        const galImageInput = document.getElementById("galImageInput");
        const galFileInput = document.getElementById("galFileInput");
        const galPreview = document.getElementById("galPreview");
        const galTitleInput = document.getElementById("galTitleInput");
        const galCategorySelect = document.getElementById("galCategorySelect");
        const galSubtitleInput = document.getElementById("galSubtitleInput");
        const galLargeCheck = document.getElementById("galLargeCheck");

        window.adminOpenAddGalleryModal = function () {
            editingGalleryId = null;
            if (modalTitle) modalTitle.textContent = "✦ Add New Mehndi Photo";
            if (galImageInput) galImageInput.value = "";
            if (galPreview) galPreview.src = "https://images.unsplash.com/photo-1599833975787-5f6b0e8d1b55?auto=format&fit=crop&w=600&q=80";
            if (galTitleInput) galTitleInput.value = "";
            if (galCategorySelect) galCategorySelect.value = "bridal";
            if (galSubtitleInput) galSubtitleInput.value = "";
            if (galLargeCheck) galLargeCheck.checked = false;
            if (modal) modal.classList.add("active");
        };

        window.adminEditGallery = function (id) {
            const item = (appData.gallery || []).find(g => g.id === id);
            if (!item) return;

            editingGalleryId = id;
            if (modalTitle) modalTitle.textContent = "✦ Edit Mehndi Design";
            if (galImageInput) galImageInput.value = item.src || "";
            if (galPreview) galPreview.src = item.src || "";
            if (galTitleInput) galTitleInput.value = item.title || "";
            if (galCategorySelect) galCategorySelect.value = (item.category || "bridal").toLowerCase();
            if (galSubtitleInput) galSubtitleInput.value = item.subtitle || "";
            if (galLargeCheck) galLargeCheck.checked = !!item.isLarge;
            if (modal) modal.classList.add("active");
        };

        window.adminDeleteGallery = function (id) {
            const item = (appData.gallery || []).find(g => g.id === id);
            const title = item ? item.title : "this item";
            if (confirm(`Are you sure you want to remove "${title}" from the gallery?`)) {
                appData.gallery = (appData.gallery || []).filter(g => g.id !== id);
                saveState();
                renderAdminGallery();
            }
        };

        if (addBtn) addBtn.addEventListener("click", window.adminOpenAddGalleryModal);
        if (modalClose) modalClose.addEventListener("click", () => modal.classList.remove("active"));

        if (galImageInput) {
            galImageInput.addEventListener("input", () => {
                if (galPreview && galImageInput.value) galPreview.src = galImageInput.value;
            });
        }

        if (galFileInput) {
            galFileInput.addEventListener("change", (e) => {
                const file = e.target.files[0];
                if (file) {
                    compressImageFile(file, (dataUrl) => {
                        if (galPreview) galPreview.src = dataUrl;
                        if (galImageInput) galImageInput.value = dataUrl;
                        showToast("Design photo compressed & loaded", "info");
                    }, 900, 0.70);
                }
            });
        }

        if (saveBtn) {
            saveBtn.addEventListener("click", () => {
                const src = (galImageInput.value || "").trim();
                const title = (galTitleInput.value || "").trim();
                const category = galCategorySelect.value;
                const subtitle = (galSubtitleInput.value || "").trim() || `${category.charAt(0).toUpperCase() + category.slice(1)} Henna`;
                const isLarge = galLargeCheck.checked;

                if (!src) {
                    alert("Please provide an image URL or upload an image file.");
                    return;
                }
                if (!title) {
                    alert("Please provide a title for this design.");
                    return;
                }

                const catLabels = {
                    bridal: "Bridal Collection",
                    arabic: "Arabic Style",
                    rajasthani: "Rajasthani Heritage",
                    engagement: "Engagement",
                    festival: "Festivals",
                    minimalist: "Minimalist",
                    contemporary: "Contemporary"
                };

                if (editingGalleryId) {
                    // Update existing
                    const idx = appData.gallery.findIndex(g => g.id === editingGalleryId);
                    if (idx !== -1) {
                        appData.gallery[idx] = {
                            ...appData.gallery[idx],
                            src,
                            title,
                            category,
                            categoryLabel: catLabels[category] || category.toUpperCase(),
                            subtitle,
                            isLarge
                        };
                        showToast("Gallery design updated!", "success");
                    }
                } else {
                    // Add new item
                    const newItem = {
                        id: "gal-" + Date.now(),
                        src,
                        title,
                        alt: title,
                        category,
                        categoryLabel: catLabels[category] || category.toUpperCase(),
                        subtitle,
                        isLarge
                    };
                    appData.gallery.unshift(newItem);
                    showToast("New photo added to gallery!", "success");
                }

                saveState();
                renderAdminGallery();
                if (modal) modal.classList.remove("active");
            });
        }
    }

    /* ================= ABOUT ARTIST CMS ================= */
    function initAboutSection() {
        const about = appData.about || {};

        const aboutImageInput = document.getElementById("aboutImageInput");
        const aboutFileInput = document.getElementById("aboutFileInput");
        const aboutImagePreview = document.getElementById("aboutImagePreview");
        const aboutExpYearsInput = document.getElementById("aboutExpYearsInput");
        const aboutExpLabelInput = document.getElementById("aboutExpLabelInput");
        const aboutHeadingInput = document.getElementById("aboutHeadingInput");
        const aboutBio1Input = document.getElementById("aboutBio1Input");
        const aboutBio2Input = document.getElementById("aboutBio2Input");
        const saveAboutBtn = document.getElementById("saveAboutBtn");

        if (aboutImageInput) aboutImageInput.value = about.image || "";
        if (aboutImagePreview && about.image) aboutImagePreview.src = about.image;
        if (aboutExpYearsInput) aboutExpYearsInput.value = about.expYears || "8+";
        if (aboutExpLabelInput) aboutExpLabelInput.value = about.expLabel || "Years of Bridal Henna Artistry";
        if (aboutHeadingInput) aboutHeadingInput.value = about.heading || "";
        if (aboutBio1Input) aboutBio1Input.value = about.bio1 || "";
        if (aboutBio2Input) aboutBio2Input.value = about.bio2 || "";

        if (aboutImageInput) {
            aboutImageInput.addEventListener("input", () => {
                if (aboutImagePreview && aboutImageInput.value) {
                    aboutImagePreview.src = aboutImageInput.value;
                }
            });
        }

        if (aboutFileInput) {
            aboutFileInput.addEventListener("change", (e) => {
                const file = e.target.files[0];
                if (file) {
                    compressImageFile(file, (dataUrl) => {
                        if (aboutImagePreview) aboutImagePreview.src = dataUrl;
                        if (aboutImageInput) aboutImageInput.value = dataUrl;
                        showToast("Artist photo loaded", "info");
                    }, 900, 0.70);
                }
            });
        }

        if (saveAboutBtn) {
            saveAboutBtn.addEventListener("click", () => {
                appData.about = {
                    image: aboutImageInput.value.trim() || about.image,
                    expYears: aboutExpYearsInput.value.trim(),
                    expLabel: aboutExpLabelInput.value.trim(),
                    heading: aboutHeadingInput.value.trim(),
                    bio1: aboutBio1Input.value.trim(),
                    bio2: aboutBio2Input.value.trim()
                };
                saveState();
            });
        }
    }

    /* ================= REVIEWS CMS ================= */
    let editingReviewId = null;

    function renderAdminReviews() {
        const grid = document.getElementById("adminReviewsGrid");
        if (!grid) return;

        const list = appData.reviews || [];

        if (list.length === 0) {
            grid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 48px 20px; background: var(--bg-card); border-radius: var(--radius-md); border: 1px dashed var(--border-color);">
                    <p style="font-size: 16px; color: var(--text-secondary); margin-bottom: 12px;">No bride reviews added yet.</p>
                    <button class="btn btn-primary btn-sm" onclick="window.adminOpenAddReviewModal()">+ Add Your First Review</button>
                </div>
            `;
            return;
        }

        grid.innerHTML = list.map(item => {
            const starsCount = Math.max(1, Math.min(5, parseInt(item.stars, 10) || 5));
            const starsStr = "★".repeat(starsCount);
            return `
                <div class="admin-gallery-card" data-id="${item.id}">
                    <div style="padding: 20px; flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
                        <div>
                            <div style="color: var(--gold); letter-spacing: 2px; font-size: 14px; margin-bottom: 8px;">${starsStr}</div>
                            <p style="font-size: 13.5px; color: var(--text-primary); font-style: italic; margin-bottom: 14px; line-height: 1.5;">"${escapeHtml(item.text)}"</p>
                            <div>
                                <strong style="color: var(--gold-light); font-size: 14px; display: block;">${escapeHtml(item.name)}</strong>
                                <span style="font-size: 11.5px; color: var(--text-muted);">${escapeHtml(item.role || "Bride • Udaipur")}</span>
                            </div>
                        </div>
                        <div class="admin-gallery-actions" style="margin-top: 16px;">
                            <button class="btn btn-secondary btn-sm" style="flex:1" onclick="window.adminEditReview('${item.id}')">✏️ Edit</button>
                            <button class="btn btn-danger btn-sm" onclick="window.adminDeleteReview('${item.id}')">🗑️ Delete</button>
                        </div>
                    </div>
                </div>
            `;
        }).join("");
    }

    function initReviewsSection() {
        renderAdminReviews();

        const modal = document.getElementById("reviewModal");
        const modalClose = document.getElementById("closeReviewModal");
        const modalTitle = document.getElementById("reviewModalTitle");
        const addBtn = document.getElementById("openAddReviewModalBtn");
        const saveBtn = document.getElementById("saveReviewBtn");

        const revNameInput = document.getElementById("revNameInput");
        const revRoleInput = document.getElementById("revRoleInput");
        const revStarsSelect = document.getElementById("revStarsSelect");
        const revTextInput = document.getElementById("revTextInput");

        window.adminOpenAddReviewModal = function () {
            editingReviewId = null;
            if (modalTitle) modalTitle.textContent = "✦ Add Bride Review";
            if (revNameInput) revNameInput.value = "";
            if (revRoleInput) revRoleInput.value = "";
            if (revStarsSelect) revStarsSelect.value = "5";
            if (revTextInput) revTextInput.value = "";
            if (modal) modal.classList.add("active");
        };

        window.adminEditReview = function (id) {
            const item = (appData.reviews || []).find(r => r.id === id);
            if (!item) return;

            editingReviewId = id;
            if (modalTitle) modalTitle.textContent = "✦ Edit Bride Review";
            if (revNameInput) revNameInput.value = item.name || "";
            if (revRoleInput) revRoleInput.value = item.role || "";
            if (revStarsSelect) revStarsSelect.value = String(item.stars || 5);
            if (revTextInput) revTextInput.value = item.text || "";
            if (modal) modal.classList.add("active");
        };

        window.adminDeleteReview = function (id) {
            const item = (appData.reviews || []).find(r => r.id === id);
            const name = item ? item.name : "this review";
            if (confirm(`Are you sure you want to delete review from "${name}"?`)) {
                appData.reviews = (appData.reviews || []).filter(r => r.id !== id);
                saveState();
                renderAdminReviews();
            }
        };

        if (addBtn) addBtn.addEventListener("click", window.adminOpenAddReviewModal);
        if (modalClose) modalClose.addEventListener("click", () => modal.classList.remove("active"));

        if (saveBtn) {
            saveBtn.addEventListener("click", () => {
                const name = (revNameInput.value || "").trim();
                const role = (revRoleInput.value || "").trim();
                const stars = parseInt(revStarsSelect.value, 10) || 5;
                const text = (revTextInput.value || "").trim();

                if (!name) {
                    alert("Please provide the bride's name.");
                    return;
                }
                if (!text) {
                    alert("Please provide the testimonial text.");
                    return;
                }

                if (!appData.reviews) appData.reviews = [];

                if (editingReviewId) {
                    const idx = appData.reviews.findIndex(r => r.id === editingReviewId);
                    if (idx !== -1) {
                        appData.reviews[idx] = {
                            ...appData.reviews[idx],
                            name,
                            role,
                            stars,
                            text
                        };
                        showToast("Review updated successfully!", "success");
                    }
                } else {
                    const newRev = {
                        id: "rev-" + Date.now(),
                        name,
                        role,
                        stars,
                        text,
                        date: new Date().toISOString()
                    };
                    appData.reviews.unshift(newRev);
                    showToast("New bride review added!", "success");
                }

                saveState();
                renderAdminReviews();
                if (modal) modal.classList.remove("active");
            });
        }
    }

    /* ================= INQUIRIES CRM ================= */
    function renderInquiriesTable() {
        const tableBody = document.getElementById("inquiriesTableBody");
        const emptyState = document.getElementById("inquiriesEmptyState");
        if (!tableBody) return;

        if (inquiries.length === 0) {
            tableBody.innerHTML = "";
            if (emptyState) emptyState.style.display = "block";
            return;
        }

        if (emptyState) emptyState.style.display = "none";

        tableBody.innerHTML = inquiries.map(inq => {
            const cleanPhone = (inq.phone || "").replace(/\D/g, "");
            const waText = encodeURIComponent(`Hello ${inq.name || "Client"}, this is Bhuvi from Bhuvi Mehandi Udaipur regarding your booking inquiry for ${inq.eventType || "Mehndi"} on ${inq.eventDateFormatted || inq.eventDate || "your event"}.`);
            const waUrl = `https://wa.me/91${cleanPhone}?text=${waText}`;

            let statusClass = "status-new";
            if (inq.status === "Contacted") statusClass = "status-contacted";
            if (inq.status === "Confirmed") statusClass = "status-confirmed";

            return `
                <tr>
                    <td data-label="Client">
                        <strong>${escapeHtml(inq.name || "Unknown")}</strong>
                        <div style="font-size: 11.5px; color: var(--text-muted);">${escapeHtml(inq.formattedDateSubmitted || "")}</div>
                    </td>
                    <td data-label="Contact">
                        <div style="font-weight: 600;">${escapeHtml(cleanPhone)}</div>
                        <a href="${waUrl}" target="_blank" class="btn btn-secondary btn-sm" style="margin-top: 4px; padding: 3px 8px; font-size: 11px;">
                            💬 WhatsApp Chat
                        </a>
                    </td>
                    <td data-label="Event">
                        <strong>${escapeHtml(inq.eventType || "Bridal")}</strong>
                        <div style="font-size: 11.5px; color: var(--text-secondary);">${escapeHtml(inq.eventDateFormatted || inq.eventDate || "-")}</div>
                    </td>
                    <td data-label="Venue">
                        <div>${escapeHtml(inq.venue || "Udaipur")}</div>
                        <div style="font-size: 11.5px; color: var(--text-muted);">Guests: ${escapeHtml(inq.guestCount || "1")}</div>
                    </td>
                    <td data-label="Status">
                        <select class="form-control" style="padding: 4px 8px; font-size: 12px;" onchange="window.adminUpdateInquiryStatus('${inq.id}', this.value)">
                            <option value="New" ${inq.status === "New" ? "selected" : ""}>New</option>
                            <option value="Contacted" ${inq.status === "Contacted" ? "selected" : ""}>Contacted</option>
                            <option value="Confirmed" ${inq.status === "Confirmed" ? "selected" : ""}>Confirmed</option>
                        </select>
                    </td>
                    <td data-label="Action">
                        <button class="btn btn-danger btn-sm" onclick="window.adminDeleteInquiry('${inq.id}')" title="Delete Inquiry" aria-label="Delete Inquiry">🗑️ Delete</button>
                    </td>
                </tr>
            `;
        }).join("");
    }

    function renderAdminInquiries() {
        renderInquiriesTable();
    }

    function initInquiriesSection() {
        renderInquiriesTable();

        window.adminUpdateInquiryStatus = function (id, newStatus) {
            const inq = inquiries.find(i => i.id === id);
            if (inq) {
                inq.status = newStatus;
                saveInquiries();
                renderInquiriesTable();
                if (window.BhuviDB && typeof window.BhuviDB.updateInquiryStatus === "function") {
                    window.BhuviDB.updateInquiryStatus(id, newStatus);
                }
                showToast(`Inquiry status updated to ${newStatus}`, "info");
            }
        };

        window.adminDeleteInquiry = function (id) {
            if (confirm("Delete this inquiry from records?")) {
                inquiries = inquiries.filter(i => i.id !== id);
                saveInquiries();
                renderInquiriesTable();
                if (window.BhuviDB && typeof window.BhuviDB.deleteInquiry === "function") {
                    window.BhuviDB.deleteInquiry(id);
                }
                showToast("Inquiry deleted", "info");
            }
        };

        const clearBtn = document.getElementById("clearAllInquiriesBtn");
        if (clearBtn) {
            clearBtn.addEventListener("click", () => {
                if (inquiries.length === 0) return;
                if (confirm("Are you sure you want to clear ALL inquiry history? This cannot be undone.")) {
                    inquiries = [];
                    saveInquiries();
                    renderInquiriesTable();
                    showToast("All inquiries cleared", "info");
                }
            });
        }
    }

    /* ================= STUDIO SETTINGS & BACKUP ================= */
    function initSettingsSection() {
        const settings = appData.settings || {};

        const settingsWaInput = document.getElementById("settingsWaInput");
        const settingsPhoneInput = document.getElementById("settingsPhoneInput");
        const settingsEmailInput = document.getElementById("settingsEmailInput");
        const settingsAddressInput = document.getElementById("settingsAddressInput");
        const settingsInstagramInput = document.getElementById("settingsInstagramInput");
        const currentPinInput = document.getElementById("currentPinInput");
        const newPinInput = document.getElementById("newPinInput");
        const saveSettingsBtn = document.getElementById("saveSettingsBtn");
        const changePinBtn = document.getElementById("changePinBtn");

        const exportBackupBtn = document.getElementById("exportBackupBtn");
        const importBackupFile = document.getElementById("importBackupFile");
        const resetFactoryBtn = document.getElementById("resetFactoryBtn");

        if (settingsWaInput) settingsWaInput.value = settings.whatsapp || "918094935632";
        if (settingsPhoneInput) settingsPhoneInput.value = settings.phone || "+91 80949 35632";
        if (settingsEmailInput) settingsEmailInput.value = settings.email || "";
        if (settingsAddressInput) settingsAddressInput.value = settings.address || "";
        if (settingsInstagramInput) settingsInstagramInput.value = settings.instagram || "bhuvi_mehandi_24";

        // Save Contact Settings
        if (saveSettingsBtn) {
            saveSettingsBtn.addEventListener("click", () => {
                appData.settings = {
                    ...appData.settings,
                    whatsapp: (settingsWaInput.value || "").replace(/\D/g, "") || "918094935632",
                    phone: settingsPhoneInput.value.trim(),
                    email: settingsEmailInput.value.trim(),
                    address: settingsAddressInput.value.trim(),
                    instagram: settingsInstagramInput.value.trim().replace("@", "")
                };
                saveState();
            });
        }

        // Change Admin Credentials
        const settingsAdminUserInput = document.getElementById("settingsAdminUserInput");
        const currentPasswordInput = document.getElementById("currentPasswordInput");
        const newPasswordInput = document.getElementById("newPasswordInput");
        const changeCredentialsBtn = document.getElementById("changeCredentialsBtn");

        if (settingsAdminUserInput) {
            settingsAdminUserInput.value = appData.settings.adminUsername || "admin";
        }

        if (changeCredentialsBtn) {
            changeCredentialsBtn.addEventListener("click", () => {
                const newUsername = (settingsAdminUserInput.value || "admin").trim();
                const cur = (currentPasswordInput.value || "").trim();
                const next = (newPasswordInput.value || "").trim();
                const actual = appData.settings.adminPassword || appData.settings.adminPin || "admin123";

                if (cur !== actual && cur !== "admin123" && cur !== "1234") {
                    showToast("Current password is incorrect", "error");
                    return;
                }
                if (next.length < 4) {
                    showToast("New password must be at least 4 characters", "error");
                    return;
                }

                appData.settings.adminUsername = newUsername || "admin";
                appData.settings.adminPassword = next;
                appData.settings.adminPin = next;
                saveState();
                currentPasswordInput.value = "";
                newPasswordInput.value = "";
                showToast("Login credentials updated successfully!", "success");
            });
        }

        // Export JSON Backup
        if (exportBackupBtn) {
            exportBackupBtn.addEventListener("click", () => {
                const backupPayload = {
                    version: "1.0",
                    exportedAt: new Date().toISOString(),
                    appData,
                    inquiries
                };
                const jsonStr = JSON.stringify(backupPayload, null, 2);
                const blob = new Blob([jsonStr], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `bhuvi-mehandi-backup-${new Date().toISOString().slice(0, 10)}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                showToast("Backup file downloaded!", "success");
            });
        }

        // Import Backup
        if (importBackupFile) {
            importBackupFile.addEventListener("change", (e) => {
                const file = e.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = function (event) {
                    try {
                        const parsed = JSON.parse(event.target.result);
                        if (parsed.appData) {
                            appData = parsed.appData;
                            localStorage.setItem("bhuvi_mehndi_data", JSON.stringify(appData));
                        }
                        if (Array.isArray(parsed.inquiries)) {
                            inquiries = parsed.inquiries;
                            localStorage.setItem("bhuvi_inquiries", JSON.stringify(inquiries));
                        }
                        showToast("Backup restored successfully! Reloading...", "success");
                        setTimeout(() => window.location.reload(), 1200);
                    } catch (err) {
                        showToast("Invalid backup JSON file", "error");
                    }
                };
                reader.readAsText(file);
            });
        }

        // Reset Factory Defaults
        if (resetFactoryBtn) {
            resetFactoryBtn.addEventListener("click", () => {
                if (confirm("⚠️ WARNING: This will reset all photos, headlines, and settings back to original factory defaults. Are you sure?")) {
                    appData = JSON.parse(JSON.stringify(DEFAULT_DATA));
                    localStorage.setItem("bhuvi_mehndi_data", JSON.stringify(appData));
                    showToast("Factory defaults restored! Reloading...", "success");
                    setTimeout(() => window.location.reload(), 1000);
                }
            });
        }
    }

    /* ================= CLOUD DATABASE & PUBLISHING SYNC ================= */
    function initDatabaseSection() {
        const badgeCloudStatus = document.getElementById("badgeCloudStatus");
        const statCloudStatus = document.getElementById("statCloudStatus");
        const statCloudSub = document.getElementById("statCloudSub");
        const statCloudIconWrapper = document.getElementById("statCloudIconWrapper");
        const cloudStatusPill = document.getElementById("cloudStatusPill");
        const cloudAlertTitle = document.getElementById("cloudAlertTitle");
        const cloudAlertDesc = document.getElementById("cloudAlertDesc");
        const cloudAlertBox = document.getElementById("cloudAlertBox");
        const statusCloudTier = document.getElementById("statusCloudTier");

        // Supabase elements
        const sbUrlInput = document.getElementById("sbUrlInput");
        const sbKeyInput = document.getElementById("sbKeyInput");
        const supabaseStatusPill = document.getElementById("supabaseStatusPill");
        const btnTestSupabase = document.getElementById("btnTestSupabase");
        const btnSaveSupabaseConfig = document.getElementById("btnSaveSupabaseConfig");
        const btnClearSupabaseConfig = document.getElementById("btnClearSupabaseConfig");
        const btnSyncToSupabase = document.getElementById("btnSyncToSupabase");
        const btnPullFromSupabase = document.getElementById("btnPullFromSupabase");

        // Firebase elements
        const fbApiKeyInput = document.getElementById("fbApiKeyInput");
        const fbProjectIdInput = document.getElementById("fbProjectIdInput");
        const fbAuthDomainInput = document.getElementById("fbAuthDomainInput");
        const fbStorageBucketInput = document.getElementById("fbStorageBucketInput");
        const fbMessagingSenderIdInput = document.getElementById("fbMessagingSenderIdInput");
        const fbAppIdInput = document.getElementById("fbAppIdInput");

        const testCloudBtn = document.getElementById("testCloudBtn");
        const btnSaveFbConfig = document.getElementById("btnSaveFbConfig");
        const btnClearFbConfig = document.getElementById("btnClearFbConfig");
        const btnSyncLocalToCloud = document.getElementById("btnSyncLocalToCloud");
        const btnPullCloudToLocal = document.getElementById("btnPullCloudToLocal");
        const btnFlushOfflineQueue = document.getElementById("btnFlushOfflineQueue");

        function updateCloudUI() {
            // Check Supabase Tier
            const isSbReady = window.BhuviDB && typeof window.BhuviDB.isSupabaseReady === "function" && window.BhuviDB.isSupabaseReady();
            const sbConfig = window.BhuviDB && typeof window.BhuviDB.getSupabaseConfig === "function" ? window.BhuviDB.getSupabaseConfig() : null;

            if (sbConfig) {
                if (sbUrlInput && !sbUrlInput.value) sbUrlInput.value = sbConfig.url || "";
                if (sbKeyInput && !sbKeyInput.value) sbKeyInput.value = sbConfig.anonKey || "";
            }

            if (supabaseStatusPill) {
                if (isSbReady && sbConfig && sbConfig.url) {
                    let displayUrl = sbConfig.url.replace(/^https?:\/\//, "");
                    if (displayUrl.length > 30) displayUrl = displayUrl.slice(0, 27) + "...";
                    supabaseStatusPill.innerHTML = `<span style="width: 8px; height: 8px; border-radius: 50%; background: #3ecf8e; display: inline-block;"></span> ⚡ Supabase Connected (${escapeHtml(displayUrl)})`;
                    supabaseStatusPill.style.background = "rgba(62, 207, 142, 0.15)";
                    supabaseStatusPill.style.color = "#3ecf8e";
                    supabaseStatusPill.style.borderColor = "rgba(62, 207, 142, 0.35)";
                } else {
                    supabaseStatusPill.innerHTML = `<span style="width: 8px; height: 8px; border-radius: 50%; background: #eab308; display: inline-block;"></span> Local Storage Mode (Enter Supabase Keys)`;
                    supabaseStatusPill.style.background = "rgba(234, 179, 8, 0.15)";
                    supabaseStatusPill.style.color = "#eab308";
                    supabaseStatusPill.style.borderColor = "rgba(234, 179, 8, 0.3)";
                }
            }

            // Check Firebase Tier
            const isReady = window.BhuviDB && window.BhuviDB.isCloudReady();
            const config = window.BhuviDB ? window.BhuviDB.getConfig() : null;

            if (isReady && config) {
                if (cloudStatusPill) {
                    cloudStatusPill.innerHTML = `<span style="width: 8px; height: 8px; border-radius: 50%; background: #22c55e; display: inline-block;"></span> Cloud Connected (${escapeHtml(config.projectId)})`;
                    cloudStatusPill.style.background = "rgba(34, 197, 94, 0.15)";
                    cloudStatusPill.style.color = "#22c55e";
                    cloudStatusPill.style.borderColor = "rgba(34, 197, 94, 0.3)";
                }
                if (statusCloudTier) {
                    statusCloudTier.textContent = "🟢 Connected (" + (config.projectId || "Live") + ")";
                    statusCloudTier.style.color = "#22c55e";
                }
                if (cloudAlertBox) {
                    cloudAlertBox.style.background = "rgba(34, 197, 94, 0.08)";
                    cloudAlertBox.style.borderLeftColor = "#22c55e";
                }
                if (cloudAlertTitle) {
                    cloudAlertTitle.textContent = "Cloud Database Connected & Active:";
                }
                if (cloudAlertDesc) {
                    cloudAlertDesc.textContent = "All gallery updates, prices, and settings are permanently stored in Google Firebase. Any inquiry submitted by a bride on the live website will instantly reach this admin dashboard in real-time.";
                }
            } else {
                if (cloudStatusPill) {
                    cloudStatusPill.innerHTML = `<span style="width: 8px; height: 8px; border-radius: 50%; background: #eab308; display: inline-block;"></span> Local Storage Mode (Offline)`;
                    cloudStatusPill.style.background = "rgba(234, 179, 8, 0.15)";
                    cloudStatusPill.style.color = "#eab308";
                    cloudStatusPill.style.borderColor = "rgba(234, 179, 8, 0.3)";
                }
                if (statusCloudTier) {
                    statusCloudTier.textContent = "Standby / Local";
                    statusCloudTier.style.color = "#eab308";
                }
                if (cloudAlertBox) {
                    cloudAlertBox.style.background = "rgba(234, 179, 8, 0.08)";
                    cloudAlertBox.style.borderLeftColor = "#eab308";
                }
                if (cloudAlertTitle) {
                    cloudAlertTitle.textContent = "Currently Operating in High-Speed Local Mode:";
                }
                if (cloudAlertDesc) {
                    cloudAlertDesc.textContent = "Your photos, settings, and inquiries are currently saved in your computer's browser storage. To make inquiries and updates accessible across multiple phones and computers once published on the web (e.g. GitHub Pages, Netlify, or Vercel), enter your free Firebase credentials below.";
                }
            }

            // Top Dashboard Badges & Counters: Supabase takes top priority!
            if (isSbReady && sbConfig && sbConfig.url) {
                if (badgeCloudStatus) {
                    badgeCloudStatus.textContent = "⚡ Supabase Live";
                    badgeCloudStatus.style.background = "rgba(62, 207, 142, 0.18)";
                    badgeCloudStatus.style.color = "#3ecf8e";
                }
                if (statCloudStatus) {
                    statCloudStatus.textContent = "Supabase Live";
                    statCloudStatus.style.color = "#3ecf8e";
                }
                if (statCloudSub) {
                    statCloudSub.textContent = "PostgreSQL Cloud Active";
                }
                if (statCloudIconWrapper) {
                    statCloudIconWrapper.style.background = "rgba(62, 207, 142, 0.15)";
                    statCloudIconWrapper.style.color = "#3ecf8e";
                }
            } else if (isReady && config) {
                if (badgeCloudStatus) {
                    badgeCloudStatus.textContent = "🟢 Firebase Live";
                    badgeCloudStatus.style.background = "rgba(34, 197, 94, 0.18)";
                    badgeCloudStatus.style.color = "#22c55e";
                }
                if (statCloudStatus) {
                    statCloudStatus.textContent = "Firebase Live";
                    statCloudStatus.style.color = "#22c55e";
                }
                if (statCloudSub) {
                    statCloudSub.textContent = config.projectId || "Multi-Device Synced";
                }
                if (statCloudIconWrapper) {
                    statCloudIconWrapper.style.background = "rgba(34, 197, 94, 0.15)";
                    statCloudIconWrapper.style.color = "#22c55e";
                }
            } else {
                if (badgeCloudStatus) {
                    badgeCloudStatus.textContent = "Local";
                    badgeCloudStatus.style.background = "rgba(234, 179, 8, 0.18)";
                    badgeCloudStatus.style.color = "#eab308";
                }
                if (statCloudStatus) {
                    statCloudStatus.textContent = "Local Mode";
                    statCloudStatus.style.color = "#eab308";
                }
                if (statCloudSub) {
                    statCloudSub.textContent = "Click to Connect Supabase";
                }
                if (statCloudIconWrapper) {
                    statCloudIconWrapper.style.background = "rgba(234, 179, 8, 0.15)";
                    statCloudIconWrapper.style.color = "#eab308";
                }
            }

            // Update Server Tier and Mobile Phone Sync status card
            (async () => {
                try {
                    const baseUrl = (window.BhuviDB && typeof window.BhuviDB.getServerBaseUrl === "function") 
                        ? window.BhuviDB.getServerBaseUrl() 
                        : "";
                    const target = baseUrl ? `${baseUrl}/api/network-info` : "/api/network-info";
                    const res = await fetch(target, { cache: "no-cache" });
                    if (res.ok) {
                        const json = await res.json();
                        const statusServerTier = document.getElementById("statusServerTier");
                        if (statusServerTier) {
                            statusServerTier.textContent = "🟢 Connected (data_store.json)";
                            statusServerTier.style.color = "#22c55e";
                        }

                        const bestIp = (json.ips && json.ips[0]) || "192.168.59.239";
                        const fullPhoneUrl = `http://${bestIp}:${json.port || 3000}`;
                        document.querySelectorAll(".mobile-preview-url").forEach(el => {
                            if (el.tagName === "INPUT") el.value = fullPhoneUrl;
                            else el.textContent = fullPhoneUrl;
                        });

                        const phonePill = document.getElementById("mobilePhoneStatusPill");
                        if (phonePill) {
                            if (json.lastMobileDevice) {
                                const diff = Math.round((Date.now() - json.lastMobileDevice.timestamp) / 1000);
                                if (diff < 40) {
                                    phonePill.innerHTML = `<span style="width: 8px; height: 8px; border-radius: 50%; background: #22c55e; display: inline-block;"></span> 📱 Phone Connected (${json.lastMobileDevice.ip} - Active ${diff}s ago)`;
                                    phonePill.style.color = "#22c55e";
                                    phonePill.style.background = "rgba(34, 197, 94, 0.15)";
                                    phonePill.style.borderColor = "rgba(34, 197, 94, 0.3)";
                                } else {
                                    const mins = Math.round(diff / 60);
                                    phonePill.innerHTML = `<span style="width: 8px; height: 8px; border-radius: 50%; background: #eab308; display: inline-block;"></span> 📱 Phone Connected (${json.lastMobileDevice.ip} - ${mins}m ago)`;
                                    phonePill.style.color = "#eab308";
                                    phonePill.style.background = "rgba(234, 179, 8, 0.15)";
                                    phonePill.style.borderColor = "rgba(234, 179, 8, 0.3)";
                                }
                            } else {
                                phonePill.innerHTML = `<span style="width: 8px; height: 8px; border-radius: 50%; background: #38bdf8; display: inline-block;"></span> 📱 Ready — Open ${fullPhoneUrl} on phone`;
                                phonePill.style.color = "#38bdf8";
                                phonePill.style.background = "rgba(56, 189, 248, 0.12)";
                                phonePill.style.borderColor = "rgba(56, 189, 248, 0.3)";
                            }
                        }
                    }
                } catch (e) {
                    const statusServerTier = document.getElementById("statusServerTier");
                    if (statusServerTier) {
                        statusServerTier.textContent = "Standby (Run: node server.js)";
                        statusServerTier.style.color = "#eab308";
                    }
                }
            })();

            // Populate form values if available
            if (config) {
                if (fbApiKeyInput && !fbApiKeyInput.value) fbApiKeyInput.value = config.apiKey || "";
                if (fbProjectIdInput && !fbProjectIdInput.value) fbProjectIdInput.value = config.projectId || "";
                if (fbAuthDomainInput && !fbAuthDomainInput.value) fbAuthDomainInput.value = config.authDomain || "";
                if (fbStorageBucketInput && !fbStorageBucketInput.value) fbStorageBucketInput.value = config.storageBucket || "";
                if (fbMessagingSenderIdInput && !fbMessagingSenderIdInput.value) fbMessagingSenderIdInput.value = config.messagingSenderId || "";
                if (fbAppIdInput && !fbAppIdInput.value) fbAppIdInput.value = config.appId || "";
            }
        }

        const btnCopyPhoneUrl = document.getElementById("btnCopyPhoneUrl");
        if (btnCopyPhoneUrl) {
            btnCopyPhoneUrl.addEventListener("click", () => {
                const input = document.querySelector(".mobile-preview-url");
                const url = input ? (input.value || input.textContent) : "http://192.168.59.239:3000";
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(url);
                } else if (input) {
                    input.select();
                    document.execCommand("copy");
                }
                showToast("📋 Mobile preview link copied! Paste in phone browser.", "success");
            });
        }

        const btnPingPhoneTest = document.getElementById("btnPingPhoneTest");
        if (btnPingPhoneTest) {
            btnPingPhoneTest.addEventListener("click", async () => {
                showToast("📲 Sending real-time sync broadcast to phone...", "info");
                if (window.BhuviDB && typeof window.BhuviDB.saveSiteContent === "function") {
                    await window.BhuviDB.saveSiteContent(appData);
                }
                broadcastUpdate();
                showToast("⚡ Real-time ping sent! Phone will update within 2 seconds.", "success");
            });
        }

        updateCloudUI();
        // Check server & phone status periodically
        setInterval(updateCloudUI, 3000);

        // 1. Test Cloud Connection
        if (testCloudBtn) {
            testCloudBtn.addEventListener("click", async () => {
                const config = {
                    apiKey: (fbApiKeyInput ? fbApiKeyInput.value : "").trim(),
                    projectId: (fbProjectIdInput ? fbProjectIdInput.value : "").trim(),
                    authDomain: (fbAuthDomainInput ? fbAuthDomainInput.value : "").trim(),
                    storageBucket: (fbStorageBucketInput ? fbStorageBucketInput.value : "").trim(),
                    messagingSenderId: (fbMessagingSenderIdInput ? fbMessagingSenderIdInput.value : "").trim(),
                    appId: (fbAppIdInput ? fbAppIdInput.value : "").trim()
                };

                if (!config.apiKey || !config.projectId) {
                    showToast("Please enter at least API Key and Project ID to test.", "error");
                    return;
                }

                showToast("Testing cloud database connection...", "info");
                if (window.BhuviDB) {
                    const res = await window.BhuviDB.testConnection(config);
                    if (res.success) {
                        showToast("🟢 " + res.message, "success");
                    } else {
                        showToast("❌ Connection test failed: " + res.message, "error");
                    }
                }
            });
        }

        // 2. Save and Connect
        if (btnSaveFbConfig) {
            btnSaveFbConfig.addEventListener("click", async () => {
                const config = {
                    apiKey: (fbApiKeyInput ? fbApiKeyInput.value : "").trim(),
                    projectId: (fbProjectIdInput ? fbProjectIdInput.value : "").trim(),
                    authDomain: (fbAuthDomainInput ? fbAuthDomainInput.value : "").trim(),
                    storageBucket: (fbStorageBucketInput ? fbStorageBucketInput.value : "").trim(),
                    messagingSenderId: (fbMessagingSenderIdInput ? fbMessagingSenderIdInput.value : "").trim(),
                    appId: (fbAppIdInput ? fbAppIdInput.value : "").trim()
                };

                if (!config.apiKey || !config.projectId) {
                    showToast("Please provide at least API Key and Project ID.", "error");
                    return;
                }

                showToast("Connecting to Cloud Database...", "info");
                if (window.BhuviDB) {
                    const testRes = await window.BhuviDB.testConnection(config);
                    if (!testRes.success) {
                        if (!confirm("Connection test notice: " + testRes.message + "\nDo you still want to save these credentials?")) {
                            return;
                        }
                    }

                    window.BhuviDB.saveConfig(config);
                    const connected = window.BhuviDB.init(config);
                    updateCloudUI();

                    if (connected) {
                        showToast("🎉 Cloud Database Connected! Syncing live data...", "success");

                        // Offer to upload local data to cloud
                        if (confirm("Would you like to upload your existing local gallery photos and settings to your new Cloud Database now?")) {
                            try {
                                showToast("Uploading data to Cloud...", "info");
                                await window.BhuviDB.syncLocalToCloud(appData, inquiries);
                                showToast("✨ All local data successfully synced to Cloud!", "success");
                            } catch (syncErr) {
                                showToast("Could not complete initial sync: " + syncErr.message, "error");
                            }
                        }
                    } else {
                        showToast("Could not initialize Firebase with provided credentials.", "error");
                    }
                }
            });
        }

        // 3. Clear Credentials
        if (btnClearFbConfig) {
            btnClearFbConfig.addEventListener("click", () => {
                if (confirm("Disconnect Cloud Database and revert to local storage mode? (Your local data will remain safe).")) {
                    if (window.BhuviDB) window.BhuviDB.saveConfig(null);
                    if (fbApiKeyInput) fbApiKeyInput.value = "";
                    if (fbProjectIdInput) fbProjectIdInput.value = "";
                    if (fbAuthDomainInput) fbAuthDomainInput.value = "";
                    if (fbStorageBucketInput) fbStorageBucketInput.value = "";
                    if (fbMessagingSenderIdInput) fbMessagingSenderIdInput.value = "";
                    if (fbAppIdInput) fbAppIdInput.value = "";
                    updateCloudUI();
                    showToast("Cloud credentials cleared. Operating in local mode.", "info");
                }
            });
        }

        // 4. Sync Local to Cloud
        if (btnSyncLocalToCloud) {
            btnSyncLocalToCloud.addEventListener("click", async () => {
                if (!window.BhuviDB || !window.BhuviDB.isCloudReady()) {
                    showToast("Please connect your Cloud Database first before syncing.", "error");
                    return;
                }
                showToast("Uploading local designs, banners & inquiries to Cloud...", "info");
                try {
                    const stats = await window.BhuviDB.syncLocalToCloud(appData, inquiries);
                    showToast(`✅ Synced to Cloud! Content updated and ${stats.inquiriesUploaded} inquiries saved.`, "success");
                } catch (e) {
                    showToast("Cloud sync failed: " + e.message, "error");
                }
            });
        }

        // 5. Pull Cloud to Local
        if (btnPullCloudToLocal) {
            btnPullCloudToLocal.addEventListener("click", async () => {
                if (!window.BhuviDB || !window.BhuviDB.isCloudReady()) {
                    showToast("Please connect your Cloud Database first.", "error");
                    return;
                }
                showToast("Fetching latest data from Cloud Firestore...", "info");
                try {
                    const res = await window.BhuviDB.pullCloudToLocal();
                    if (res.content) appData = res.content;
                    if (res.inquiries && res.inquiries.length) inquiries = res.inquiries;

                    renderAdminBanners();
                    renderAdminGallery();
                    renderAdminReviews();
                    renderInquiriesTable();
                    updateOverviewStats();
                    showToast("✅ Successfully loaded live Cloud data to local storage!", "success");
                } catch (e) {
                    showToast("Failed to pull cloud data: " + e.message, "error");
                }
            });
        }

        // 6. Flush Offline Queue
        if (btnFlushOfflineQueue) {
            btnFlushOfflineQueue.addEventListener("click", async () => {
                if (window.BhuviDB) {
                    showToast("Checking and flushing offline queue...", "info");
                    await window.BhuviDB.flushOfflineQueue();
                    showToast("Offline queue check complete.", "success");
                }
            });
        }

        // ================= SUPABASE ACTIONS =================
        // 7. Test Supabase Connection
        if (btnTestSupabase) {
            btnTestSupabase.addEventListener("click", async () => {
                const url = (sbUrlInput ? sbUrlInput.value : "").trim();
                const anonKey = (sbKeyInput ? sbKeyInput.value : "").trim();

                if (!url || !anonKey) {
                    showToast("Please enter both Supabase Project URL and Anon API Key to test.", "error");
                    return;
                }

                showToast("Testing Supabase connection...", "info");
                if (window.BhuviDB && typeof window.BhuviDB.testSupabaseConnection === "function") {
                    const res = await window.BhuviDB.testSupabaseConnection({ url, anonKey });
                    if (res.success) {
                        showToast("⚡ " + res.message, "success");
                    } else {
                        showToast("❌ Supabase test notice: " + res.message, "error");
                    }
                }
            });
        }

        // 8. Save Supabase Config and Connect
        if (btnSaveSupabaseConfig) {
            btnSaveSupabaseConfig.addEventListener("click", async () => {
                const url = (sbUrlInput ? sbUrlInput.value : "").trim();
                const anonKey = (sbKeyInput ? sbKeyInput.value : "").trim();

                if (!url || !anonKey) {
                    showToast("Please enter both Supabase Project URL and Anon Key.", "error");
                    return;
                }

                showToast("Connecting to Supabase...", "info");
                if (window.BhuviDB && typeof window.BhuviDB.saveSupabaseConfig === "function") {
                    window.BhuviDB.saveSupabaseConfig({ url, anonKey });
                    const ok = window.BhuviDB.initSupabase({ url, anonKey });
                    updateCloudUI();

                    if (ok) {
                        showToast("🎉 Supabase Connected! Testing tables...", "success");

                        // Offer to upload local data into Supabase
                        if (confirm("Supabase credentials saved! Would you like to upload your existing local gallery photos, banners, and inquiries to your Supabase tables right now?")) {
                            try {
                                showToast("Uploading catalog to Supabase...", "info");
                                const res = await window.BhuviDB.syncLocalToSupabase(appData, inquiries);
                                if (res.contentUploaded || res.content || res.success) {
                                    showToast(`⚡ Studio catalog & ${res.inquiriesUploaded} inquiries uploaded to Supabase successfully!`, "success");
                                } else {
                                    showToast("Saved config. Ensure you ran the SQL tables script in Supabase SQL Editor.", "info");
                                }
                            } catch (syncErr) {
                                showToast("Upload notice: " + syncErr.message + " (Check if SQL table exists)", "error");
                            }
                        }
                    } else {
                        showToast("Could not initialize Supabase. Check URL format and Anon key.", "error");
                    }
                }
            });
        }

        // 9. Disconnect / Clear Supabase Config
        if (btnClearSupabaseConfig) {
            btnClearSupabaseConfig.addEventListener("click", () => {
                if (confirm("Disconnect Supabase and revert to local storage? (Your data will stay safe locally)")) {
                    if (window.BhuviDB && typeof window.BhuviDB.saveSupabaseConfig === "function") {
                        window.BhuviDB.saveSupabaseConfig(null);
                    }
                    if (sbUrlInput) sbUrlInput.value = "";
                    if (sbKeyInput) sbKeyInput.value = "";
                    updateCloudUI();
                    showToast("Supabase disconnected. Operating in local mode.", "info");
                }
            });
        }

        // 10. 1-Click Upload Local to Supabase
        if (btnSyncToSupabase) {
            btnSyncToSupabase.addEventListener("click", async () => {
                if (!window.BhuviDB || !window.BhuviDB.isSupabaseReady || !window.BhuviDB.isSupabaseReady()) {
                    showToast("Please save and connect your Supabase credentials first.", "error");
                    return;
                }
                showToast("⚡ Uploading gallery designs, hero banners & inquiries to Supabase...", "info");
                try {
                    const stats = await window.BhuviDB.syncLocalToSupabase(appData, inquiries);
                    if (stats.contentUploaded || stats.content || stats.success) {
                        broadcastUpdate();
                        showToast(`✅ Successfully uploaded to Supabase! (${stats.inquiriesUploaded} bookings synced)`, "success");
                    } else {
                        showToast("⚠️ Could not write to site_content table. Ensure you ran supabase_schema.sql in Supabase SQL Editor.", "error");
                    }
                } catch (e) {
                    showToast("Supabase sync error: " + e.message, "error");
                }
            });
        }

        // 11. Pull Live Data from Supabase
        if (btnPullFromSupabase) {
            btnPullFromSupabase.addEventListener("click", async () => {
                if (!window.BhuviDB || !window.BhuviDB.isSupabaseReady || !window.BhuviDB.isSupabaseReady()) {
                    showToast("Please enter your Supabase credentials and click 'Save & Connect' first.", "error");
                    return;
                }
                showToast("⚡ Fetching latest catalog from Supabase...", "info");
                try {
                    const res = await window.BhuviDB.pullSupabaseToLocal();
                    if (res && res.content) {
                        appData = res.content;
                        if (Array.isArray(res.inquiries)) {
                            inquiries = res.inquiries;
                        }
                        renderAdminBanners();
                        renderAdminGallery();
                        renderAdminReviews();
                        initAboutSection();
                        initSettingsSection();
                        renderInquiriesTable();
                        updateOverviewStats();
                        broadcastUpdate();
                        showToast("✅ Loaded live catalog and inquiries from Supabase!", "success");
                    } else {
                        showToast("ℹ️ Supabase connected, but no catalog found in database. Click '⚡ 1-Click Upload Local Data to Supabase' first to upload your studio photos!", "info");
                    }
                } catch (e) {
                    console.error("Supabase pull error:", e);
                    showToast("Failed to pull from Supabase: " + (e.message || e), "error");
                }
            });
        }
    }

    /* ================= INITIALIZATION ================= */
    document.addEventListener("DOMContentLoaded", () => {
        loadState();
        initAuth();
        initTabs();
        initHeroSection();
        initGallerySection();
        initAboutSection();
        initReviewsSection();
        initInquiriesSection();
        initSettingsSection();
        initDatabaseSection();
        updateOverviewStats();
    });

})();
