/**
 * ===================================================================
 * BHUVI MEHANDI — UNIFIED MULTI-DEVICE PERSISTENCE ENGINE (db-sync.js)
 * 4-Tier Zero-Data-Loss Architecture:
 *   Tier 1: Node.js Server API & Disk Store (data_store.json)
 *   Tier 2: Google Firebase Firestore (Cloud Multi-Device Sync)
 *   Tier 3: Local IndexedDB (High-Capacity Local Disk)
 *   Tier 4: LocalStorage & Memory Cache (Instant UI Fast-Path)
 * ===================================================================
 */

(function () {
    "use strict";

    const DB_NAME = "BhuviMehandiDB";
    const DB_STORE = "studio_store";
    const DB_VERSION = 3; // Upgraded version to resolve previous version mismatch
    const LOCAL_DATA_KEY = "bhuvi_mehndi_data";
    const LOCAL_INQUIRIES_KEY = "bhuvi_inquiries";
    const CONFIG_KEY = "bhuvi_firebase_config";
    const SUPABASE_CONFIG_KEY = "bhuvi_supabase_config";
    const BACKUP_HISTORY_KEY = "bhuvi_backup_history";

    let dbInstance = null; // Firestore reference
    let isCloudReady = false;
    let supabaseClient = null; // Supabase client instance
    let isSupabaseReady = false;
    let isServerReady = false;
    let serverBaseUrl = "";
    let unsubscribeInquiries = null;
    let unsubscribeContent = null;
    let serverPollingInterval = null;

    /* -------------------------------------------------------------
       1. SERVER API DISCOVERY & CLIENT HELPERS
       ------------------------------------------------------------- */
    const KNOWN_LAN_IP = "192.168.59.239";
    let cachedServerUrl = null;

    function getServerCandidateUrls() {
        const list = [];
        const isHttps = typeof window !== "undefined" && window.location && window.location.protocol === "https:";

        // 1. User/admin configured custom server URL override
        try {
            const customUrl = localStorage.getItem("bhuvi_custom_server_url");
            if (customUrl) list.push(customUrl.replace(/\/+$/, ""));
        } catch (e) {}

        // 2. When hosted on HTTPS (Vercel, custom domain, production), prioritize same-origin API first
        if (isHttps || (window.location.protocol !== "file:" && window.location.port !== "5500" && window.location.port !== "3000")) {
            list.push("");
            list.push(window.location.origin);
        }

        // 3. If opened directly on port 5502 (local Node server)
        if (window.location.port === "5502") {
            list.push("");
            list.push(window.location.origin);
        }

        // 4. Local development / LAN fallbacks (Only if NOT on HTTPS, preventing browser Mixed Content blocking)
        if (!isHttps) {
            if (window.location.hostname && window.location.hostname !== "") {
                list.push(`http://${window.location.hostname}:5502`);
            }
            list.push("http://localhost:5502");
            list.push("http://127.0.0.1:5502");
            list.push(`http://${KNOWN_LAN_IP}:5502`);
        }

        // 5. Same-origin fallback
        if (window.location.protocol !== "file:") {
            list.push("");
        }

        return [...new Set(list.filter(item => typeof item === "string"))];
    }

    async function getActiveServerBaseUrl() {
        if (cachedServerUrl !== null) return cachedServerUrl;

        const candidates = getServerCandidateUrls();
        for (const candidate of candidates) {
            try {
                const controller = new AbortController();
                const tid = setTimeout(() => controller.abort(), 1500);
                const res = await fetch(`${candidate}/api/last-updated`, {
                    method: "GET",
                    headers: { "Accept": "application/json" },
                    signal: controller.signal
                });
                clearTimeout(tid);
                if (res.ok) {
                    const json = await res.json();
                    if (json && json.success) {
                        cachedServerUrl = candidate;
                        serverBaseUrl = candidate;
                        isServerReady = true;
                        console.log(`🟢 BhuviDB: Connected to live multi-device server at "${candidate || window.location.origin}"`);
                        return candidate;
                    }
                }
            } catch (e) {}
        }

        // Safe fallback default
        cachedServerUrl = (window.location.port === "5502") ? "" : "http://localhost:5502";
        serverBaseUrl = cachedServerUrl;
        return cachedServerUrl;
    }

    async function checkServerAvailability() {
        const url = await getActiveServerBaseUrl();
        try {
            const res = await fetch(`${url}/api/last-updated`, { cache: "no-cache" });
            if (res.ok) {
                isServerReady = true;
                return true;
            }
        } catch (e) {}
        isServerReady = false;
        return false;
    }

    async function serverFetchData() {
        try {
            const baseUrl = await getActiveServerBaseUrl();
            const res = await fetch(`${baseUrl}/api/data`, { cache: "no-cache" });
            if (res.ok) {
                const json = await res.json();
                if (json.success && json.data && typeof json.data === "object" && Object.keys(json.data).length > 0) {
                    isServerReady = true;
                    return json.data;
                }
            }
        } catch (e) {
            console.warn("serverFetchData:", e.message);
        }
        return null;
    }

    async function serverSaveData(data) {
        try {
            const baseUrl = await getActiveServerBaseUrl();
            const res = await fetch(`${baseUrl}/api/data`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
            if (res.ok) {
                const json = await res.json();
                isServerReady = true;
                return json.success;
            }
        } catch (e) {
            console.warn("serverSaveData:", e.message);
        }
        return false;
    }

    async function serverFetchInquiries() {
        try {
            const baseUrl = await getActiveServerBaseUrl();
            const res = await fetch(`${baseUrl}/api/inquiries`, { cache: "no-cache" });
            if (res.ok) {
                const json = await res.json();
                if (json.success && Array.isArray(json.inquiries)) {
                    isServerReady = true;
                    return json.inquiries;
                }
            }
        } catch (e) {}
        return null;
    }

    async function serverSaveInquiry(inquiry) {
        try {
            const baseUrl = await getActiveServerBaseUrl();
            const res = await fetch(`${baseUrl}/api/inquiries`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(inquiry)
            });
            if (res.ok) {
                const json = await res.json();
                isServerReady = true;
                return json.success;
            }
        } catch (e) {}
        return false;
    }

    async function serverUpdateInquiryStatus(id, status) {
        try {
            const baseUrl = await getActiveServerBaseUrl();
            const res = await fetch(`${baseUrl}/api/inquiries/status`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, status })
            });
            return res.ok;
        } catch (e) {
            return false;
        }
    }

    async function serverDeleteInquiry(id) {
        try {
            const baseUrl = await getActiveServerBaseUrl();
            const res = await fetch(`${baseUrl}/api/inquiries/delete`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id })
            });
            return res.ok;
        } catch (e) {
            return false;
        }
    }

    async function serverFetchConfig() {
        try {
            const baseUrl = await getActiveServerBaseUrl();
            const res = await fetch(`${baseUrl}/api/config`, { cache: "no-cache" });
            if (res.ok) {
                const json = await res.json();
                if (json.success && json.config && json.config.apiKey) {
                    return json.config;
                }
            }
        } catch (e) {}
        return null;
    }

    async function serverSaveConfig(cfg) {
        try {
            const baseUrl = await getActiveServerBaseUrl();
            await fetch(`${baseUrl}/api/config`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(cfg || {})
            });
        } catch (e) {}
    }

    /* -------------------------------------------------------------
       2. INDEXEDDB PERSISTENCE LAYER (Unified Version 3)
       ------------------------------------------------------------- */
    function openIDB() {
        return new Promise((resolve) => {
            if (typeof indexedDB === "undefined") {
                resolve(null);
                return;
            }
            try {
                const req = indexedDB.open(DB_NAME, DB_VERSION);
                req.onupgradeneeded = (e) => {
                    const db = e.target.result;
                    if (!db.objectStoreNames.contains(DB_STORE)) {
                        db.createObjectStore(DB_STORE);
                    }
                };
                req.onsuccess = (e) => resolve(e.target.result);
                req.onerror = (e) => {
                    console.warn("IndexedDB open error:", req.error);
                    resolve(null);
                };
                req.onblocked = () => {
                    console.warn("IndexedDB upgrade blocked, please close other tabs of this website.");
                    resolve(null);
                };
            } catch (err) {
                console.warn("IndexedDB exception:", err);
                resolve(null);
            }
        });
    }

    async function idbGet(key) {
        const db = await openIDB();
        if (!db) return null;
        return new Promise((resolve) => {
            try {
                const tx = db.transaction(DB_STORE, "readonly");
                const store = tx.objectStore(DB_STORE);
                const req = store.get(key);
                req.onsuccess = () => resolve(req.result || null);
                req.onerror = () => resolve(null);
            } catch (err) {
                resolve(null);
            }
        });
    }

    async function idbSet(key, value) {
        const db = await openIDB();
        if (!db) return false;
        return new Promise((resolve) => {
            try {
                const tx = db.transaction(DB_STORE, "readwrite");
                const store = tx.objectStore(DB_STORE);
                const req = store.put(value, key);
                req.onsuccess = () => resolve(true);
                req.onerror = () => resolve(false);
            } catch (err) {
                resolve(false);
            }
        });
    }

    /* -------------------------------------------------------------
       3. FIREBASE CLOUD INITIALIZATION
       ------------------------------------------------------------- */
    function getStoredFirebaseConfig() {
        try {
            const raw = localStorage.getItem(CONFIG_KEY);
            if (raw) return JSON.parse(raw);
        } catch (e) {}

        if (window.BHUVI_FIREBASE_CONFIG && window.BHUVI_FIREBASE_CONFIG.apiKey) {
            return window.BHUVI_FIREBASE_CONFIG;
        }
        return null;
    }

    function saveFirebaseConfig(config) {
        if (!config) {
            localStorage.removeItem(CONFIG_KEY);
            serverSaveConfig({});
            return;
        }
        localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
        serverSaveConfig(config);
    }

    function initFirebase(config) {
        if (!config || !config.apiKey || !config.projectId) {
            isCloudReady = false;
            return false;
        }

        if (typeof firebase === "undefined") {
            console.warn("⚠️ BhuviDB: Firebase SDK script tags not found on page.");
            isCloudReady = false;
            return false;
        }

        try {
            let app;
            if (!firebase.apps.length) {
                app = firebase.initializeApp(config);
            } else {
                app = firebase.app();
            }

            dbInstance = firebase.firestore();

            try {
                dbInstance.enablePersistence({ synchronizeTabs: true }).catch(() => {});
            } catch (e) {}

            isCloudReady = true;
            console.log("🟢 BhuviDB: Cloud Database Connected successfully (" + config.projectId + ")");
            return true;
        } catch (err) {
            console.error("❌ BhuviDB: Firebase initialization error:", err);
            isCloudReady = false;
            return false;
        }
    }

    /* -------------------------------------------------------------
       3B. SUPABASE CLOUD (POSTGRESQL) INITIALIZATION & METHODS
       ------------------------------------------------------------- */
    function getStoredSupabaseConfig() {
        try {
            const raw = localStorage.getItem(SUPABASE_CONFIG_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed && parsed.url && parsed.anonKey) return parsed;
            }
        } catch (e) {}

        if (window.BHUVI_SUPABASE_CONFIG && window.BHUVI_SUPABASE_CONFIG.url && window.BHUVI_SUPABASE_CONFIG.anonKey) {
            return window.BHUVI_SUPABASE_CONFIG;
        }
        return null;
    }

    function saveSupabaseConfig(config) {
        if (!config || !config.url || !config.anonKey) {
            localStorage.removeItem(SUPABASE_CONFIG_KEY);
            supabaseClient = null;
            isSupabaseReady = false;
            return;
        }
        localStorage.setItem(SUPABASE_CONFIG_KEY, JSON.stringify(config));
        initSupabase(config);
    }

    function initSupabase(config) {
        if (!config || !config.url || !config.anonKey) {
            isSupabaseReady = false;
            supabaseClient = null;
            return false;
        }

        if (typeof window.supabase === "undefined" || typeof window.supabase.createClient !== "function") {
            console.warn("⚠️ BhuviDB: Supabase SDK library not loaded on page.");
            isSupabaseReady = false;
            return false;
        }

        try {
            supabaseClient = window.supabase.createClient(config.url, config.anonKey);
            isSupabaseReady = true;
            console.log("⚡ BhuviDB: Supabase Cloud Database Connected successfully (" + config.url + ")");
            return true;
        } catch (err) {
            console.error("❌ BhuviDB: Supabase initialization error:", err);
            isSupabaseReady = false;
            supabaseClient = null;
            return false;
        }
    }

    async function supabaseGetSiteContent() {
        if (!isSupabaseReady || !supabaseClient) {
            const cfg = getStoredSupabaseConfig();
            if (cfg) initSupabase(cfg);
        }
        if (!isSupabaseReady || !supabaseClient) return null;

        let content = null;

        // 1. Try reading from 'site_content' table (JSON document)
        try {
            const { data, error } = await supabaseClient
                .from("site_content")
                .select("data")
                .eq("id", "live")
                .maybeSingle();

            if (error) {
                console.warn("Supabase site_content query notice:", error.message);
                window._lastSupabaseError = error.message;
            } else if (data && data.data) {
                let contentData = data.data;
                if (typeof contentData === "string") {
                    try { contentData = JSON.parse(contentData); } catch (pe) {}
                }
                if (contentData && typeof contentData === "object") {
                    content = contentData;
                }
            }
        } catch (e) {
            console.warn("Supabase site_content query notice:", e.message);
            window._lastSupabaseError = e.message;
        }

        if (!content) {
            content = {};
        }

        // 2. Fetch and merge from relational 'gallery' table
        try {
            const { data: galleryRows, error: gErr } = await supabaseClient
                .from("gallery")
                .select("*")
                .order("display_order", { ascending: true });

            if (!gErr && Array.isArray(galleryRows)) {
                if (galleryRows.length > 0) {
                    content.gallery = galleryRows.map(r => ({
                        id: String(r.id || ("gal-" + Math.random().toString(36).substr(2, 6))),
                        title: r.title || "Mehndi Design",
                        category: (r.category || "bridal").toLowerCase(),
                        categoryLabel: r.category_label || (r.category ? r.category.toUpperCase() : "MEHNDI"),
                        subtitle: r.subtitle || r.title || "Royal Henna",
                        src: r.image_url || r.src || "",
                        alt: r.alt_text || r.title || "Mehndi Design",
                        isLarge: !!r.is_large
                    }));
                } else if (!Array.isArray(content.gallery)) {
                    content.gallery = [];
                }
            }
        } catch (ge) {}

        // 3. Fetch and merge from relational 'hero_banners' table
        try {
            const { data: bannerRows, error: bErr } = await supabaseClient
                .from("hero_banners")
                .select("*")
                .order("display_order", { ascending: true });

            if (!bErr && Array.isArray(bannerRows)) {
                const activeBanners = bannerRows.filter(b => b.is_active !== false);
                if (activeBanners.length > 0) {
                    content.heroBanners = activeBanners.map((b, idx) => ({
                        id: String(b.id || ("banner-" + (idx + 1))),
                        title: b.title || "Bhuvi Mehandi Luxury Henna Art",
                        image: b.image_url || b.image || "hero-banner.png"
                    }));
                } else if (!Array.isArray(content.heroBanners)) {
                    content.heroBanners = [];
                }
            }
        } catch (be) {}

        // 4. Fetch and merge from relational 'reviews' table
        try {
            const { data: reviewRows, error: rErr } = await supabaseClient
                .from("reviews")
                .select("*")
                .order("created_at", { ascending: false });

            if (!rErr && Array.isArray(reviewRows)) {
                if (reviewRows.length > 0) {
                    content.reviews = reviewRows.map((r, idx) => ({
                        id: String(r.id || ("rev-" + (idx + 1))),
                        name: r.name || "Happy Bride",
                        role: r.role || "Bride • Udaipur",
                        stars: parseInt(r.stars, 10) || 5,
                        text: r.review_text || r.text || ""
                    }));
                } else if (!Array.isArray(content.reviews)) {
                    content.reviews = [];
                }
            }
        } catch (re) {}

        // Return content if any catalog data is present
        if (content && typeof content === "object" && (
            Array.isArray(content.gallery) ||
            Array.isArray(content.heroBanners) ||
            Array.isArray(content.reviews) ||
            content.about ||
            content.hero ||
            content.settings
        )) {
            return content;
        }
        return null;
    }

    async function supabaseSaveSiteContent(content) {
        if (!isSupabaseReady || !supabaseClient) {
            const cfg = getStoredSupabaseConfig();
            if (cfg) initSupabase(cfg);
        }
        if (!isSupabaseReady || !supabaseClient || !content) return false;
        let success = false;

        // 1. Upsert into site_content JSON document table
        try {
            const { error } = await supabaseClient
                .from("site_content")
                .upsert({
                    id: "live",
                    data: content,
                    updated_at: new Date().toISOString()
                });
            if (!error) {
                success = true;
            } else {
                console.warn("Supabase site_content save warning:", error.message);
                window._lastSupabaseError = error.message;
            }
        } catch (e) {
            console.warn("Supabase site_content save error:", e.message);
            window._lastSupabaseError = e.message;
        }

        // 2. Keep relational 'gallery' table in sync (including deleting removed items)
        if (Array.isArray(content.gallery)) {
            try {
                if (content.gallery.length > 0) {
                    const gRows = content.gallery.map((g, idx) => ({
                        id: String(g.id || "gal-" + (idx + 1)),
                        title: g.title || "Mehndi Design",
                        category: (g.category || "bridal").toLowerCase(),
                        category_label: g.categoryLabel || g.category || "Bridal",
                        subtitle: g.subtitle || g.title || "Royal Henna",
                        image_url: g.src || g.image_url || "",
                        alt_text: g.alt || g.title || "Mehndi Design",
                        is_large: !!g.isLarge,
                        display_order: idx + 1
                    }));
                    await supabaseClient.from("gallery").upsert(gRows);

                    // Delete items removed from gallery
                    const activeIds = gRows.map(r => r.id);
                    const { data: existingRows } = await supabaseClient.from("gallery").select("id");
                    if (Array.isArray(existingRows) && existingRows.length > 0) {
                        const toDelete = existingRows
                            .map(r => String(r.id))
                            .filter(id => !activeIds.includes(id));
                        if (toDelete.length > 0) {
                            const { error: deleteError } = await supabaseClient.from("gallery").delete().in("id", toDelete);
                            if (deleteError) throw deleteError;
                        }
                    }
                } else {
                    // All gallery items removed
                    const { data: existingRows } = await supabaseClient.from("gallery").select("id");
                    if (Array.isArray(existingRows) && existingRows.length > 0) {
                        const toDelete = existingRows.map(r => String(r.id));
                        const { error: deleteError } = await supabaseClient.from("gallery").delete().in("id", toDelete);
                        if (deleteError) throw deleteError;
                    }
                }
            } catch (ge) {
                console.warn("Notice syncing gallery table:", ge.message);
                window._lastSupabaseError = ge.message;
                success = false;
            }
        }

        // 3. Keep relational 'hero_banners' table in sync (including deleting removed items)
        if (Array.isArray(content.heroBanners)) {
            try {
                if (content.heroBanners.length > 0) {
                    const bRows = content.heroBanners.map((b, idx) => ({
                        id: String(b.id || "banner-" + (idx + 1)),
                        title: b.title || "Hero Banner " + (idx + 1),
                        image_url: b.image || b.image_url || "hero-banner.png",
                        display_order: idx + 1,
                        is_active: true
                    }));
                    await supabaseClient.from("hero_banners").upsert(bRows);

                    // Delete banners removed
                    const activeIds = bRows.map(r => r.id);
                    const { data: existingBanners } = await supabaseClient.from("hero_banners").select("id");
                    if (Array.isArray(existingBanners) && existingBanners.length > 0) {
                        const toDelete = existingBanners
                            .map(r => String(r.id))
                            .filter(id => !activeIds.includes(id));
                        if (toDelete.length > 0) {
                            await supabaseClient.from("hero_banners").delete().in("id", toDelete);
                        }
                    }
                } else {
                    const { data: existingBanners } = await supabaseClient.from("hero_banners").select("id");
                    if (Array.isArray(existingBanners) && existingBanners.length > 0) {
                        const toDelete = existingBanners.map(r => String(r.id));
                        await supabaseClient.from("hero_banners").delete().in("id", toDelete);
                    }
                }
            } catch (be) {
                console.warn("Notice syncing hero_banners table:", be.message);
            }
        }

        // 4. Keep relational 'reviews' table in sync (including deleting removed items)
        if (Array.isArray(content.reviews)) {
            try {
                if (content.reviews.length > 0) {
                    const rRows = content.reviews.map((r, idx) => ({
                        id: String(r.id || "rev-" + (idx + 1)),
                        name: r.name || "Bride",
                        role: r.role || "Bride • Udaipur",
                        stars: parseInt(r.stars, 10) || 5,
                        review_text: r.text || r.review_text || ""
                    }));
                    await supabaseClient.from("reviews").upsert(rRows);

                    // Delete reviews removed
                    const activeIds = rRows.map(r => r.id);
                    const { data: existingReviews } = await supabaseClient.from("reviews").select("id");
                    if (Array.isArray(existingReviews) && existingReviews.length > 0) {
                        const toDelete = existingReviews
                            .map(r => String(r.id))
                            .filter(id => !activeIds.includes(id));
                        if (toDelete.length > 0) {
                            const { error: deleteError } = await supabaseClient.from("reviews").delete().in("id", toDelete);
                            if (deleteError) throw deleteError;
                        }
                    }
                } else {
                    const { data: existingReviews } = await supabaseClient.from("reviews").select("id");
                    if (Array.isArray(existingReviews) && existingReviews.length > 0) {
                        const toDelete = existingReviews.map(r => String(r.id));
                        const { error: deleteError } = await supabaseClient.from("reviews").delete().in("id", toDelete);
                        if (deleteError) throw deleteError;
                    }
                }
            } catch (re) {
                console.warn("Notice syncing reviews table:", re.message);
                window._lastSupabaseError = re.message;
                success = false;
            }
        }

        return success;
    }

    /**
     * Submit a single client review directly to the 'reviews' Supabase table.
     * SAFE: Only inserts the new row — never touches other reviews or saveSiteContent.
     * Works identically on both desktop and mobile because it does NOT rely on localStorage.
     */
    async function submitReview(reviewData) {
        if (!reviewData || !reviewData.id) return { success: false, error: "Missing review data" };

        const row = {
            id: String(reviewData.id),
            name: reviewData.name || "Happy Bride",
            role: reviewData.role || "Bride • Udaipur",
            stars: parseInt(reviewData.stars, 10) || 5,
            review_text: reviewData.text || reviewData.review_text || ""
        };

        // 1. Try Supabase first (always available on both desktop and mobile)
        if (!isSupabaseReady || !supabaseClient) {
            const sbCfg = getStoredSupabaseConfig();
            if (sbCfg) initSupabase(sbCfg);
        }
        if (isSupabaseReady && supabaseClient) {
            try {
                const { error } = await supabaseClient.from("reviews").upsert(row);
                if (!error) {
                    console.log("⚡ BhuviDB: Review saved to Supabase reviews table:", row.id);
                    // Broadcast so all open tabs re-render reviews
                    try {
                        if (typeof BroadcastChannel !== "undefined") {
                            const bc = new BroadcastChannel("bhuvi_studio_channel");
                            bc.postMessage({ type: "DATA_UPDATED", timestamp: Date.now() });
                            bc.close();
                        }
                    } catch (e) {}
                    return { success: true, supabase: true };
                } else {
                    console.warn("⚠️ BhuviDB: Supabase review insert notice:", error.message);
                }
            } catch (e) {
                console.warn("⚠️ BhuviDB: Supabase review insert error:", e.message);
            }
        }

        // 2. Fallback: save to Cloud Firestore
        if (isCloudReady && dbInstance) {
            try {
                await dbInstance.collection("reviews").doc(row.id).set(row);
                console.log("☁️ BhuviDB: Review saved to Cloud Firestore:", row.id);
                return { success: true, cloud: true };
            } catch (e) {
                console.warn("⚠️ BhuviDB: Firestore review save error:", e.message);
            }
        }

        // 3. Fallback: persist the review in the local Node server catalog
        try {
            const serverData = await serverFetchData();
            if (serverData && typeof serverData === "object") {
                if (!Array.isArray(serverData.reviews)) serverData.reviews = [];
                serverData.reviews = serverData.reviews.filter(r => String(r.id) !== String(row.id));
                serverData.reviews.unshift({
                    id: row.id,
                    name: row.name,
                    role: row.role,
                    stars: row.stars,
                    text: row.review_text
                });
                if (await serverSaveData(serverData)) {
                    console.log("💾 BhuviDB: Review saved to server data_store.json:", row.id);
                    return { success: true, server: true };
                }
            }
        } catch (e) {
            console.warn("BhuviDB: Server review save error:", e);
        }

        // 4. Fallback: save to local IndexedDB + localStorage so it shows immediately
        try {
            const cached = await idbGet(LOCAL_DATA_KEY) || {};
            if (!Array.isArray(cached.reviews)) cached.reviews = [];
            // Remove duplicate if re-submitting same id
            cached.reviews = cached.reviews.filter(r => String(r.id) !== String(row.id));
            cached.reviews.unshift({
                id: row.id,
                name: row.name,
                role: row.role,
                stars: row.stars,
                text: row.review_text
            });
            await idbSet(LOCAL_DATA_KEY, cached);
            try {
                localStorage.setItem(LOCAL_DATA_KEY, JSON.stringify(cached));
            } catch (e) {}
            return { success: true, local: true };
        } catch (e) {
            console.warn("BhuviDB: Review local fallback error:", e);
        }

        return { success: false, error: "All storage backends failed" };
    }

    async function supabaseGetInquiries() {
        if (!isSupabaseReady || !supabaseClient) return null;
        try {
            const { data, error } = await supabaseClient
                .from("inquiries")
                .select("*")
                .order("created_at", { ascending: false });

            if (!error && Array.isArray(data)) {
                return data.map(item => ({
                    id: item.id,
                    name: item.name,
                    phone: item.phone,
                    occasion: item.occasion,
                    eventType: item.occasion,
                    eventDate: item.event_date,
                    eventDateFormatted: item.event_date,
                    timeSlot: item.time_slot,
                    venue: item.city,
                    city: item.city,
                    guestCount: item.guests,
                    guests: item.guests,
                    packageId: item.package_id,
                    budget: item.budget,
                    notes: item.notes,
                    status: item.status || "New",
                    createdAt: item.created_at,
                    formattedDateSubmitted: item.created_at ? new Date(item.created_at).toLocaleDateString("en-IN") : ""
                }));
            }
        } catch (e) {
            console.warn("Supabase inquiries fetch error:", e.message);
        }
        return null;
    }

    async function supabaseSaveInquiry(inquiry) {
        if (!isSupabaseReady || !supabaseClient || !inquiry) return false;
        try {
            const row = {
                id: String(inquiry.id || "inq-" + Date.now()),
                name: inquiry.name || "Unknown",
                phone: inquiry.phone || "",
                occasion: inquiry.occasion || inquiry.eventType || "",
                event_date: inquiry.eventDate || inquiry.eventDateFormatted || "",
                time_slot: inquiry.timeSlot || "",
                city: inquiry.city || inquiry.venue || "",
                guests: String(inquiry.guests || inquiry.guestCount || "1"),
                package_id: inquiry.packageId || "",
                budget: inquiry.budget || "",
                notes: inquiry.notes || "",
                status: inquiry.status || "New",
                created_at: inquiry.createdAt ? new Date(inquiry.createdAt).toISOString() : new Date().toISOString()
            };

            const { error } = await supabaseClient
                .from("inquiries")
                .upsert(row);
            return !error;
        } catch (e) {
            console.warn("Supabase save inquiry error:", e.message);
        }
        return false;
    }

    async function supabaseUpdateInquiryStatus(id, status) {
        if (!isSupabaseReady || !supabaseClient) return false;
        try {
            const { error } = await supabaseClient
                .from("inquiries")
                .update({
                    status: status,
                    status_updated_at: new Date().toISOString()
                })
                .eq("id", id);
            return !error;
        } catch (e) {
            return false;
        }
    }

    async function supabaseDeleteInquiry(id) {
        if (!isSupabaseReady || !supabaseClient) return false;
        try {
            const { error } = await supabaseClient
                .from("inquiries")
                .delete()
                .eq("id", id);
            return !error;
        } catch (e) {
            return false;
        }
    }

    async function testSupabaseConnection(config) {
        if (!config || !config.url || !config.anonKey) {
            return { success: false, message: "Missing Supabase URL or Anon Key." };
        }
        if (typeof window.supabase === "undefined" || typeof window.supabase.createClient !== "function") {
            return { success: false, message: "Supabase SDK library not loaded on page." };
        }
        try {
            const client = window.supabase.createClient(config.url, config.anonKey);
            const tables = ["site_content", "inquiries", "gallery", "hero_banners", "reviews"];
            const missing = [];
            let siteContentOk = false;

            for (const tbl of tables) {
                try {
                    const { error } = await client.from(tbl).select("id").limit(1);
                    if (error) {
                        missing.push(tbl);
                    } else if (tbl === "site_content") {
                        siteContentOk = true;
                    }
                } catch (e) {
                    missing.push(tbl);
                }
            }

            if (missing.length === 0) {
                return { success: true, message: "Connection successful! All 5 tables (site_content, inquiries, gallery, hero_banners, reviews) are online and verified." };
            } else if (siteContentOk) {
                return { 
                    success: true, 
                    message: `Connected to Supabase! Note: ${missing.length} relational table(s) (${missing.join(", ")}) not created yet. Copy and run the SQL schema script below for full table support.` 
                };
            } else {
                return {
                    success: false,
                    message: `Connected to Supabase project, but tables are missing (${missing.join(", ")}). Please copy and run the SQL schema script in Supabase SQL Editor.`
                };
            }
        } catch (err) {
            return { success: false, message: err.message || "Failed to reach Supabase project." };
        }
    }

    async function syncLocalToSupabase(localAppData, localInquiries) {
        if (!isSupabaseReady || !supabaseClient) {
            throw new Error("Supabase is not connected. Please enter your Supabase Project URL and Anon Key.");
        }
        let contentOk = false;
        let inquiriesCount = 0;

        if (localAppData) {
            contentOk = await supabaseSaveSiteContent(localAppData);
            if (!contentOk) {
                const detail = window._lastSupabaseError || "Table 'site_content' does not exist yet.";
                throw new Error(detail);
            }
        }
        if (Array.isArray(localInquiries) && localInquiries.length > 0) {
            for (const inq of localInquiries) {
                const ok = await supabaseSaveInquiry(inq);
                if (ok) inquiriesCount++;
            }
        }
        return { 
            success: contentOk,
            content: contentOk, 
            contentUploaded: contentOk, 
            inquiriesUploaded: inquiriesCount 
        };
    }

    async function pullSupabaseToLocal() {
        if (!isSupabaseReady || !supabaseClient) {
            const stored = getStoredSupabaseConfig();
            if (stored && stored.url && stored.anonKey) {
                initSupabase(stored);
            }
        }
        if (!isSupabaseReady || !supabaseClient) {
            throw new Error("Supabase is not connected. Enter your Supabase Project URL and Anon Key, then click 'Save & Connect Supabase'.");
        }
        const content = await supabaseGetSiteContent();
        if (content && typeof content === "object") {
            try {
                localStorage.setItem(LOCAL_DATA_KEY, JSON.stringify(content));
                localStorage.setItem("bhuvi_last_sync", String(Date.now()));
            } catch (e) {}
            await idbSet(LOCAL_DATA_KEY, content);
            if (isServerReady) serverSaveData(content);

            // Broadcast to all open tabs so website re-renders instantly
            try {
                if (typeof BroadcastChannel !== "undefined") {
                    const bc = new BroadcastChannel("bhuvi_studio_channel");
                    bc.postMessage({ type: "DATA_UPDATED", timestamp: Date.now() });
                    bc.close();
                }
            } catch (e) {}
        }
        const inqs = await supabaseGetInquiries();
        if (Array.isArray(inqs) && inqs.length > 0) {
            try {
                localStorage.setItem(LOCAL_INQUIRIES_KEY, JSON.stringify(inqs));
            } catch (e) {}
            await idbSet(LOCAL_INQUIRIES_KEY, inqs);
            if (isServerReady) {
                for (const inq of inqs) {
                    await serverSaveInquiry(inq);
                }
            }
        }
        return { content, inquiries: inqs };
    }

    // Synchronously initialize Supabase immediately on script load
    const initialSbConfig = getStoredSupabaseConfig();
    if (initialSbConfig) {
        initSupabase(initialSbConfig);
    }

    // Initialize Server & Firebase without blocking Supabase
    (async function initAllStorageEngines() {
        // Run server check asynchronously in background
        checkServerAvailability().then(async () => {
            let config = getStoredFirebaseConfig();
            if (!config && isServerReady) {
                const serverConfig = await serverFetchConfig();
                if (serverConfig && serverConfig.apiKey) {
                    config = serverConfig;
                    try {
                        localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
                    } catch (e) {}
                }
            }
            if (config) {
                initFirebase(config);
            }
        }).catch(() => {});
    })();

    /* -------------------------------------------------------------
       4. SITE CONTENT (CMS) METHODS
       ------------------------------------------------------------- */

    /**
     * Load Site Content
     * Priority: Supabase (PostgreSQL) -> Server API (/api/data) -> Cloud Firestore -> Local IndexedDB -> LocalStorage
     * Authoritative remote/server data is always mirrored to local storage.
     */
    async function getSiteContent() {
        let content = null;

        // Ensure Supabase is initialized before checking
        if (!isSupabaseReady || !supabaseClient) {
            const sbConfig = getStoredSupabaseConfig();
            if (sbConfig) initSupabase(sbConfig);
        }

        // 1. Check Supabase (Authoritative PostgreSQL Cloud Database)
        if (isSupabaseReady && supabaseClient) {
            try {
                const sbData = await supabaseGetSiteContent();
                if (sbData && typeof sbData === "object") {
                    content = sbData;
                    try {
                        localStorage.setItem(LOCAL_DATA_KEY, JSON.stringify(content));
                        localStorage.setItem("bhuvi_last_sync", String(Date.now()));
                    } catch (e) {}
                    await idbSet(LOCAL_DATA_KEY, content);
                    if (isServerReady) serverSaveData(content);
                    console.log("⚡ BhuviDB: Loaded live site content from Supabase.");
                    return content;
                }
            } catch (err) {
                console.warn("⚠️ BhuviDB: Supabase content fetch notice:", err);
            }
        }

        // 2. Check Server API (Authoritative for all connected devices on network/VPS)
        try {
            const sData = await serverFetchData();
            if (sData && typeof sData === "object" && Array.isArray(sData.gallery)) {
                content = sData;
                try {
                    localStorage.setItem(LOCAL_DATA_KEY, JSON.stringify(content));
                } catch (e) {}
                await idbSet(LOCAL_DATA_KEY, content);
                return content;
            }
        } catch (e) {}

        // 3. Check Cloud Firestore if connected
        if (isCloudReady && dbInstance) {
            try {
                const docRef = dbInstance.collection("site_content").doc("live");
                const docSnap = await docRef.get();
                if (docSnap.exists) {
                    const cloudData = docSnap.data();
                    if (cloudData && typeof cloudData === "object" && Array.isArray(cloudData.gallery)) {
                        content = cloudData;
                        try {
                            localStorage.setItem(LOCAL_DATA_KEY, JSON.stringify(content));
                        } catch (e) {}
                        await idbSet(LOCAL_DATA_KEY, content);
                        serverSaveData(content);
                        return content;
                    }
                }
            } catch (err) {
                console.warn("⚠️ BhuviDB: Cloud fetch error, checking local caches:", err);
            }
        }

        // 4. Check Local IndexedDB (High-capacity disk storage)
        const idbData = await idbGet(LOCAL_DATA_KEY);
        if (idbData && typeof idbData === "object" && Array.isArray(idbData.gallery)) {
            serverSaveData(idbData);
            return idbData;
        }

        // 5. Check LocalStorage (Fast-path memory fallback)
        try {
            const raw = localStorage.getItem(LOCAL_DATA_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed && typeof parsed === "object" && Array.isArray(parsed.gallery)) {
                    await idbSet(LOCAL_DATA_KEY, parsed);
                    serverSaveData(parsed);
                    return parsed;
                }
            }
        } catch (e) {}

        return null;
    }

    /**
     * Save Site Content (Photos, text, rates, settings)
     * Writes to: IndexedDB (disk) + LocalStorage + Supabase + Server API (/api/data) + Cloud Firestore
     */
    async function saveSiteContent(data) {
        if (!data || typeof data !== "object") return false;

        let localSuccess = false;
        let serverSuccess = false;
        let cloudSuccess = false;
        let supabaseSuccess = false;

        // 1. Always save to IndexedDB first (Virtually unlimited quota for large photos)
        localSuccess = await idbSet(LOCAL_DATA_KEY, data);

        // 2. Save to LocalStorage with quota protection
        try {
            localStorage.setItem(LOCAL_DATA_KEY, JSON.stringify(data));
            localStorage.setItem("bhuvi_last_sync", String(Date.now()));
        } catch (e) {
            console.warn("⚠️ LocalStorage quota exceeded, safely stored in IndexedDB & Server/Cloud.");
        }

        // 3. Create Emergency Snapshot in local history
        createEmergencySnapshot(data);

        // 4. Save to Supabase Cloud Database (PostgreSQL)
        if (!isSupabaseReady || !supabaseClient) {
            const sbCfg = getStoredSupabaseConfig();
            if (sbCfg) initSupabase(sbCfg);
        }
        if (isSupabaseReady && supabaseClient) {
            try {
                supabaseSuccess = await supabaseSaveSiteContent(data);
                if (supabaseSuccess) {
                    console.log("⚡ BhuviDB: Live site data saved to Supabase.");
                }
            } catch (sbErr) {
                console.warn("⚠️ Supabase save notice:", sbErr);
            }
        }

        // 5. Save to Server API (Permanent server disk file data_store.json)
        try {
            serverSuccess = await serverSaveData(data);
            if (serverSuccess) {
                console.log("💾 BhuviDB: Live site data saved permanently to Server data_store.json.");
            }
        } catch (e) {
            console.warn("Server save notice:", e);
        }

        // 6. Save to Cloud Firestore
        if (isCloudReady && dbInstance) {
            try {
                const payload = {
                    ...data,
                    lastUpdated: firebase.firestore.FieldValue.serverTimestamp(),
                    updatedAtISO: new Date().toISOString()
                };
                await dbInstance.collection("site_content").doc("live").set(payload, { merge: true });
                cloudSuccess = true;
                console.log("☁️ BhuviDB: Live site content saved to Cloud Firestore.");
            } catch (err) {
                console.error("❌ BhuviDB: Cloud save error:", err);
            }
        }

        // 7. Broadcast to open tabs
        try {
            if (typeof BroadcastChannel !== "undefined") {
                const bc = new BroadcastChannel("bhuvi_studio_channel");
                bc.postMessage({ type: "DATA_UPDATED", timestamp: Date.now() });
                bc.close();
            }
        } catch (e) {}

        return { local: localSuccess, server: serverSuccess, cloud: cloudSuccess, supabase: supabaseSuccess };
    }

    /**
     * Real-time Site Content Listener
     * Combines Supabase Realtime + Firebase Cloud Firestore real-time listener AND Server polling
     * This guarantees any phone or other device updates immediately when admin saves on laptop!
     */
    function listenToSiteContent(callback) {
        if (typeof callback !== "function") return null;

        let unsubCloud = null;
        let supabaseChannel = null;

        // 1. Supabase Realtime Listener (PostgreSQL)
        if (!isSupabaseReady || !supabaseClient) {
            const sbCfg = getStoredSupabaseConfig();
            if (sbCfg) initSupabase(sbCfg);
        }
        if (isSupabaseReady && supabaseClient) {
            try {
                supabaseChannel = supabaseClient
                    .channel("public:all_content_changes")
                    .on(
                        "postgres_changes",
                        { event: "*", schema: "public" },
                        async () => {
                            console.log("⚡ Supabase Realtime: Live update received from Supabase!");
                            const fresh = await supabaseGetSiteContent();
                            if (fresh && typeof fresh === "object") {
                                try {
                                    localStorage.setItem(LOCAL_DATA_KEY, JSON.stringify(fresh));
                                    localStorage.setItem("bhuvi_last_sync", String(Date.now()));
                                } catch (e) {}
                                await idbSet(LOCAL_DATA_KEY, fresh);
                                callback(fresh);
                            }
                        }
                    )
                    .subscribe();
            } catch (sbSubErr) {
                console.warn("Supabase Realtime subscription notice:", sbSubErr);
            }
        }

        // 2. Cloud Firestore Real-time listener
        if (isCloudReady && dbInstance) {
            try {
                if (unsubscribeContent) unsubscribeContent();
                unsubscribeContent = dbInstance.collection("site_content").doc("live").onSnapshot((doc) => {
                    if (doc.exists) {
                        const data = doc.data();
                        if (callback) callback(data);
                    }
                }, (err) => {
                    console.warn("⚠️ BhuviDB: Content listener notice:", err);
                });
                unsubCloud = unsubscribeContent;
            } catch (e) {}
        }

        // 3. Multi-Device Server Live Polling (every 2 seconds)
        let lastTimestamp = 0;
        let isPolling = false;

        const livePollTimer = setInterval(async () => {
            if (isPolling) return;
            isPolling = true;
            try {
                const baseUrl = await getActiveServerBaseUrl();
                const res = await fetch(`${baseUrl}/api/last-updated`, { cache: "no-cache" });
                if (res.ok) {
                    const json = await res.json();
                    if (json && json.success && json.timestamp) {
                        if (lastTimestamp === 0) {
                            lastTimestamp = json.timestamp;
                        } else if (json.timestamp > lastTimestamp) {
                            console.log("⚡ BhuviDB: Live update detected from Server! Updating website...");
                            lastTimestamp = json.timestamp;
                            const fresh = await serverFetchData();
                            if (fresh && typeof fresh === "object") {
                                try {
                                    localStorage.setItem(LOCAL_DATA_KEY, JSON.stringify(fresh));
                                    localStorage.setItem("bhuvi_last_sync", String(Date.now()));
                                } catch (e) {}
                                idbSet(LOCAL_DATA_KEY, fresh);
                                callback(fresh);
                            }
                        }
                    }
                }
            } catch (e) {}
            isPolling = false;
        }, 2000);

        return () => {
            if (supabaseChannel && supabaseClient) {
                try { supabaseClient.removeChannel(supabaseChannel); } catch (e) {}
            }
            if (unsubCloud) unsubCloud();
            if (livePollTimer) clearInterval(livePollTimer);
        };
    }

    /* -------------------------------------------------------------
       5. CLIENT BOOKING INQUIRIES METHODS
       ------------------------------------------------------------- */

    /**
     * Submit Booking Inquiry (Called from index.html booking form)
     * Writes to: Server API + Supabase + Cloud Firestore + Local IndexedDB + LocalStorage
     */
    async function submitInquiry(inquiryData) {
        const id = inquiryData.id || ("INQ-" + Date.now());
        const fullInquiry = {
            ...inquiryData,
            id: id,
            submittedAt: inquiryData.submittedAt || new Date().toISOString(),
            status: inquiryData.status || "New"
        };

        // 1. Save to local storage caches immediately
        try {
            const currentList = JSON.parse(localStorage.getItem(LOCAL_INQUIRIES_KEY) || "[]");
            const existingIdx = currentList.findIndex(x => x.id === id);
            if (existingIdx !== -1) {
                currentList[existingIdx] = fullInquiry;
            } else {
                currentList.unshift(fullInquiry);
            }
            localStorage.setItem(LOCAL_INQUIRIES_KEY, JSON.stringify(currentList));
            await idbSet(LOCAL_INQUIRIES_KEY, currentList);
        } catch (e) {}

        // 2. Save to Supabase (PostgreSQL Cloud Table)
        let supabaseSaved = false;
        if (!isSupabaseReady || !supabaseClient) {
            const sbCfg = getStoredSupabaseConfig();
            if (sbCfg) initSupabase(sbCfg);
        }
        if (isSupabaseReady && supabaseClient) {
            try {
                supabaseSaved = await supabaseSaveInquiry(fullInquiry);
                if (supabaseSaved) {
                    console.log("⚡ BhuviDB: Booking inquiry inserted into Supabase inquiries table: " + id);
                }
            } catch (sbErr) {
                console.warn("⚠️ Supabase inquiry save notice:", sbErr);
            }
        }

        // 3. Save directly to Server API (/api/inquiries)
        let serverSaved = false;
        try {
            serverSaved = await serverSaveInquiry(fullInquiry);
            if (serverSaved) {
                console.log("💾 BhuviDB: Booking inquiry saved to Server inquiries_store.json: " + id);
            }
        } catch (e) {}

        // 4. Save directly to Cloud Firestore
        let cloudSaved = false;
        if (isCloudReady && dbInstance) {
            try {
                await dbInstance.collection("inquiries").doc(id).set({
                    ...fullInquiry,
                    createdAtServer: firebase.firestore.FieldValue.serverTimestamp()
                });
                cloudSaved = true;
                console.log("☁️ BhuviDB: Booking inquiry stored in Cloud Firestore: " + id);
            } catch (err) {
                console.error("❌ BhuviDB: Cloud inquiry save failed:", err);
                queueInquiryForSync(fullInquiry);
            }
        } else {
            queueInquiryForSync(fullInquiry);
        }

        // 5. Broadcast to open admin tabs
        try {
            if (typeof BroadcastChannel !== "undefined") {
                const bc = new BroadcastChannel("bhuvi_studio_channel");
                bc.postMessage({ type: "NEW_INQUIRY", inquiry: fullInquiry });
                bc.close();
            }
        } catch (e) {}

        return { success: true, server: serverSaved, cloud: cloudSaved, supabase: supabaseSaved, id: id };
    }

    /**
     * Get All Inquiries
     * Priority: Supabase (PostgreSQL) -> Cloud Firestore -> Server API -> Local IndexedDB -> LocalStorage
     */
    async function getInquiries() {
        // 1. If Supabase is connected, fetch from Supabase inquiries table
        if (isSupabaseReady && supabaseClient) {
            try {
                const sbList = await supabaseGetInquiries();
                if (Array.isArray(sbList) && sbList.length > 0) {
                    try {
                        localStorage.setItem(LOCAL_INQUIRIES_KEY, JSON.stringify(sbList));
                    } catch (e) {}
                    await idbSet(LOCAL_INQUIRIES_KEY, sbList);
                    return sbList;
                }
            } catch (err) {
                console.warn("⚠️ BhuviDB: Supabase inquiries fetch notice:", err);
            }
        }

        // 2. If Cloud Firestore is connected, fetch from Firestore
        if (isCloudReady && dbInstance) {
            try {
                const snapshot = await dbInstance.collection("inquiries").orderBy("submittedAt", "desc").limit(200).get();
                const cloudList = [];
                snapshot.forEach((doc) => {
                    cloudList.push(doc.data());
                });

                if (cloudList.length > 0) {
                    try {
                        localStorage.setItem(LOCAL_INQUIRIES_KEY, JSON.stringify(cloudList));
                    } catch (e) {}
                    await idbSet(LOCAL_INQUIRIES_KEY, cloudList);
                    return cloudList;
                }
            } catch (err) {
                console.warn("⚠️ BhuviDB: Cloud inquiries fetch failed, checking server/local:", err);
            }
        }

        // 3. Check Server API (/api/inquiries)
        if (isServerReady) {
            const serverInqs = await serverFetchInquiries();
            if (Array.isArray(serverInqs) && serverInqs.length > 0) {
                try {
                    localStorage.setItem(LOCAL_INQUIRIES_KEY, JSON.stringify(serverInqs));
                } catch (e) {}
                await idbSet(LOCAL_INQUIRIES_KEY, serverInqs);
                return serverInqs;
            }
        }

        // 4. Local Caches
        let localList = [];
        try {
            const raw = localStorage.getItem(LOCAL_INQUIRIES_KEY);
            if (raw) localList = JSON.parse(raw);
        } catch (e) {}

        if (!localList.length) {
            const idbList = await idbGet(LOCAL_INQUIRIES_KEY);
            if (Array.isArray(idbList)) localList = idbList;
        }

        return localList;
    }

    /**
     * Real-time Inquiry Listener for Admin Dashboard
     */
    function listenToInquiries(callback) {
        // Option A: Cloud Firestore real-time listener
        if (isCloudReady && dbInstance) {
            try {
                if (unsubscribeInquiries) unsubscribeInquiries();
                unsubscribeInquiries = dbInstance.collection("inquiries")
                    .orderBy("submittedAt", "desc")
                    .limit(100)
                    .onSnapshot((snapshot) => {
                        const list = [];
                        snapshot.forEach((doc) => {
                            list.push(doc.data());
                        });
                        try {
                            localStorage.setItem(LOCAL_INQUIRIES_KEY, JSON.stringify(list));
                        } catch (e) {}
                        idbSet(LOCAL_INQUIRIES_KEY, list);
                        if (callback) callback(list);
                    }, (err) => {
                        console.warn("⚠️ BhuviDB: Inquiries listener error:", err);
                    });
                return unsubscribeInquiries;
            } catch (e) {}
        }

        // Option B: Server Polling (every 5 seconds) if server is available
        if (isServerReady && !serverPollingInterval) {
            serverPollingInterval = setInterval(async () => {
                const inqs = await serverFetchInquiries();
                if (Array.isArray(inqs) && callback) {
                    callback(inqs);
                }
            }, 5000);
        }

        return () => {
            if (serverPollingInterval) {
                clearInterval(serverPollingInterval);
                serverPollingInterval = null;
            }
        };
    }

    /**
     * Update Inquiry Status (e.g. "Confirmed", "Completed", "Archived")
     */
    async function updateInquiryStatus(id, newStatus) {
        // Local update
        try {
            const list = JSON.parse(localStorage.getItem(LOCAL_INQUIRIES_KEY) || "[]");
            const item = list.find(x => x.id === id);
            if (item) {
                item.status = newStatus;
                item.statusUpdatedAt = new Date().toISOString();
                localStorage.setItem(LOCAL_INQUIRIES_KEY, JSON.stringify(list));
                await idbSet(LOCAL_INQUIRIES_KEY, list);
            }
        } catch (e) {}

        // Supabase update
        if (isSupabaseReady && supabaseClient) {
            try {
                await supabaseUpdateInquiryStatus(id, newStatus);
            } catch (sbErr) {
                console.warn("Supabase status update notice:", sbErr);
            }
        }

        // Server update
        if (isServerReady) {
            serverUpdateInquiryStatus(id, newStatus);
        }

        // Cloud update
        if (isCloudReady && dbInstance) {
            try {
                await dbInstance.collection("inquiries").doc(id).update({
                    status: newStatus,
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                });
                return true;
            } catch (e) {
                console.error("Error updating inquiry in cloud:", e);
            }
        }
        return true;
    }

    /**
     * Delete Inquiry
     */
    async function deleteInquiry(id) {
        try {
            const list = JSON.parse(localStorage.getItem(LOCAL_INQUIRIES_KEY) || "[]");
            const filtered = list.filter(x => x.id !== id);
            localStorage.setItem(LOCAL_INQUIRIES_KEY, JSON.stringify(filtered));
            await idbSet(LOCAL_INQUIRIES_KEY, filtered);
        } catch (e) {}

        // Supabase delete
        if (isSupabaseReady && supabaseClient) {
            try {
                await supabaseDeleteInquiry(id);
            } catch (sbErr) {
                console.warn("Supabase delete notice:", sbErr);
            }
        }

        if (isServerReady) {
            serverDeleteInquiry(id);
        }

        if (isCloudReady && dbInstance) {
            try {
                await dbInstance.collection("inquiries").doc(id).delete();
            } catch (e) {}
        }
        return true;
    }

    /* -------------------------------------------------------------
       6. OFFLINE QUEUE & RESILIENT AUTO-SYNC
       ------------------------------------------------------------- */
    function queueInquiryForSync(inquiry) {
        try {
            const queue = JSON.parse(localStorage.getItem("bhuvi_inquiry_sync_queue") || "[]");
            if (!queue.some(q => q.id === inquiry.id)) {
                queue.push(inquiry);
                localStorage.setItem("bhuvi_inquiry_sync_queue", JSON.stringify(queue));
            }
        } catch (e) {}
    }

    async function flushOfflineQueue() {
        // Try flushing to server
        if (isServerReady) {
            try {
                const queue = JSON.parse(localStorage.getItem("bhuvi_inquiry_sync_queue") || "[]");
                for (const item of queue) {
                    await serverSaveInquiry(item);
                }
            } catch (e) {}
        }

        // Try flushing to cloud
        if (isCloudReady && dbInstance) {
            try {
                const queue = JSON.parse(localStorage.getItem("bhuvi_inquiry_sync_queue") || "[]");
                if (!queue.length) return;

                const remaining = [];
                for (const item of queue) {
                    try {
                        await dbInstance.collection("inquiries").doc(item.id).set({
                            ...item,
                            syncedFromOffline: true
                        }, { merge: true });
                    } catch (e) {
                        remaining.push(item);
                    }
                }
                localStorage.setItem("bhuvi_inquiry_sync_queue", JSON.stringify(remaining));
            } catch (e) {}
        }
    }

    window.addEventListener("online", () => {
        console.log("🌐 Network online detected, syncing pending data...");
        checkServerAvailability();
        flushOfflineQueue();
    });

    /* -------------------------------------------------------------
       7. BULK SYNC TOOLS & BACKUPS
       ------------------------------------------------------------- */
    async function syncLocalToCloud(localAppData, localInquiries) {
        if (!isCloudReady || !dbInstance) {
            throw new Error("Cloud Database is not connected. Please enter valid Firebase credentials.");
        }

        const stats = { content: false, inquiriesUploaded: 0 };

        if (localAppData) {
            await dbInstance.collection("site_content").doc("live").set({
                ...localAppData,
                lastSyncedAt: new Date().toISOString()
            });
            stats.content = true;
        }

        if (Array.isArray(localInquiries) && localInquiries.length > 0) {
            const batch = dbInstance.batch();
            let count = 0;
            for (const inq of localInquiries) {
                if (inq.id) {
                    const ref = dbInstance.collection("inquiries").doc(inq.id);
                    batch.set(ref, inq, { merge: true });
                    count++;
                }
            }
            await batch.commit();
            stats.inquiriesUploaded = count;
        }

        return stats;
    }

    async function pullCloudToLocal() {
        if (!isCloudReady || !dbInstance) {
            throw new Error("Cloud Database is not connected.");
        }

        const contentDoc = await dbInstance.collection("site_content").doc("live").get();
        let fetchedData = null;
        if (contentDoc.exists) {
            fetchedData = contentDoc.data();
            localStorage.setItem(LOCAL_DATA_KEY, JSON.stringify(fetchedData));
            await idbSet(LOCAL_DATA_KEY, fetchedData);
            if (isServerReady) serverSaveData(fetchedData);
        }

        const snap = await dbInstance.collection("inquiries").orderBy("submittedAt", "desc").get();
        const fetchedInquiries = [];
        snap.forEach(d => fetchedInquiries.push(d.data()));
        if (fetchedInquiries.length) {
            localStorage.setItem(LOCAL_INQUIRIES_KEY, JSON.stringify(fetchedInquiries));
            await idbSet(LOCAL_INQUIRIES_KEY, fetchedInquiries);
            if (isServerReady) {
                for (const inq of fetchedInquiries) {
                    await serverSaveInquiry(inq);
                }
            }
        }

        return { content: fetchedData, inquiries: fetchedInquiries };
    }

    function createEmergencySnapshot(data) {
        try {
            const snapshot = {
                timestamp: Date.now(),
                date: new Date().toLocaleString(),
                data: data
            };
            let list = JSON.parse(localStorage.getItem(BACKUP_HISTORY_KEY) || "[]");
            list.unshift(snapshot);
            if (list.length > 3) list = list.slice(0, 3);
            localStorage.setItem(BACKUP_HISTORY_KEY, JSON.stringify(list));
        } catch (e) {}
    }

    async function testCloudConnection(config) {
        if (!config || !config.apiKey || !config.projectId) {
            return { success: false, message: "Missing API Key or Project ID." };
        }
        if (typeof firebase === "undefined") {
            return { success: false, message: "Firebase SDK not loaded on this page." };
        }

        try {
            const appName = "test_" + Date.now();
            const testApp = firebase.initializeApp(config, appName);
            const testDb = testApp.firestore();

            const testRef = testDb.collection("_connection_test").doc("ping");
            await testRef.set({
                ping: "ok",
                testedAt: new Date().toISOString()
            });

            await testRef.delete().catch(() => {});
            await testApp.delete().catch(() => {});

            return { success: true, message: "Connection successful! Cloud database is online and writable." };
        } catch (err) {
            return { success: false, message: err.message || "Failed to connect to Firebase Firestore." };
        }
    }

    /* -------------------------------------------------------------
       8. PUBLIC EXPOSURE VIA GLOBAL NAMESPACE
       ------------------------------------------------------------- */
    window.BhuviDB = {
        // Client Review
        submitReview: submitReview,
        // Supabase Cloud Exports
        initSupabase: initSupabase,
        isSupabaseReady: () => isSupabaseReady,
        getSupabaseConfig: getStoredSupabaseConfig,
        saveSupabaseConfig: saveSupabaseConfig,
        testSupabaseConnection: testSupabaseConnection,
        syncLocalToSupabase: syncLocalToSupabase,
        pullSupabaseToLocal: pullSupabaseToLocal,
        getSupabaseClient: () => supabaseClient,

        // Firebase Cloud Exports
        init: initFirebase,
        isCloudReady: () => isCloudReady,
        isServerReady: () => isServerReady,
        checkServerAvailability: checkServerAvailability,
        getConfig: getStoredFirebaseConfig,
        saveConfig: saveFirebaseConfig,
        testConnection: testCloudConnection,
        getSiteContent: getSiteContent,
        saveSiteContent: saveSiteContent,
        listenToSiteContent: listenToSiteContent,
        submitInquiry: submitInquiry,
        getInquiries: getInquiries,
        listenToInquiries: listenToInquiries,
        updateInquiryStatus: updateInquiryStatus,
        deleteInquiry: deleteInquiry,
        syncLocalToCloud: syncLocalToCloud,
        pullCloudToLocal: pullCloudToLocal,
        flushOfflineQueue: flushOfflineQueue,
        idbGet: idbGet,
        idbSet: idbSet,
        getServerBaseUrl: () => serverBaseUrl
    };

    console.log("⚡ BhuviDB (Multi-Device Permanent Storage Engine) initialized.");
})();
