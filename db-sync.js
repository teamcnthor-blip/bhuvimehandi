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
    const BACKUP_HISTORY_KEY = "bhuvi_backup_history";

    let dbInstance = null; // Firestore reference
    let isCloudReady = false;
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

        // 3. If opened directly on port 3000 (local Node server)
        if (window.location.port === "3000") {
            list.push("");
            list.push(window.location.origin);
        }

        // 4. Local development / LAN fallbacks (Only if NOT on HTTPS, preventing browser Mixed Content blocking)
        if (!isHttps) {
            if (window.location.hostname && window.location.hostname !== "") {
                list.push(`http://${window.location.hostname}:3000`);
            }
            list.push("http://localhost:3000");
            list.push("http://127.0.0.1:3000");
            list.push(`http://${KNOWN_LAN_IP}:3000`);
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
        cachedServerUrl = (window.location.port === "3000") ? "" : "http://localhost:3000";
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

    // Initialize Server & Cloud
    (async function initAllStorageEngines() {
        await checkServerAvailability();

        // Check if server has shared Firebase config for other devices
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
    })();

    /* -------------------------------------------------------------
       4. SITE CONTENT (CMS) METHODS
       ------------------------------------------------------------- */

    /**
     * Load Site Content
     * Priority: Server API (/api/data) -> Cloud Firestore -> Local IndexedDB -> LocalStorage
     * Authoritative remote/server data is always mirrored to local storage.
     */
    async function getSiteContent() {
        let content = null;

        // 1. Check Server API (Authoritative for all connected devices on network/VPS)
        try {
            const sData = await serverFetchData();
            if (sData && typeof sData === "object" && sData.gallery && sData.gallery.length > 0) {
                content = sData;
                try {
                    localStorage.setItem(LOCAL_DATA_KEY, JSON.stringify(content));
                } catch (e) {}
                await idbSet(LOCAL_DATA_KEY, content);
                return content;
            }
        } catch (e) {}

        // 2. Check Cloud Firestore if connected
        if (isCloudReady && dbInstance) {
            try {
                const docRef = dbInstance.collection("site_content").doc("live");
                const docSnap = await docRef.get();
                if (docSnap.exists) {
                    const cloudData = docSnap.data();
                    if (cloudData && typeof cloudData === "object" && cloudData.gallery && cloudData.gallery.length > 0) {
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

        // 3. Check Local IndexedDB (High-capacity disk storage)
        const idbData = await idbGet(LOCAL_DATA_KEY);
        if (idbData && typeof idbData === "object" && idbData.gallery && idbData.gallery.length > 0) {
            serverSaveData(idbData);
            return idbData;
        }

        // 4. Check LocalStorage (Fast-path memory fallback)
        try {
            const raw = localStorage.getItem(LOCAL_DATA_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed && typeof parsed === "object" && parsed.gallery && parsed.gallery.length > 0) {
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
     * Writes to: IndexedDB (disk) + LocalStorage + Server API (/api/data) + Cloud Firestore
     */
    async function saveSiteContent(data) {
        if (!data || typeof data !== "object") return false;

        let localSuccess = false;
        let serverSuccess = false;
        let cloudSuccess = false;

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

        // 4. Save to Server API (Permanent server disk file data_store.json)
        try {
            serverSuccess = await serverSaveData(data);
            if (serverSuccess) {
                console.log("💾 BhuviDB: Live site data saved permanently to Server data_store.json.");
            }
        } catch (e) {
            console.warn("Server save notice:", e);
        }

        // 5. Save to Cloud Firestore
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

        // 6. Broadcast to open tabs
        try {
            if (typeof BroadcastChannel !== "undefined") {
                const bc = new BroadcastChannel("bhuvi_studio_channel");
                bc.postMessage({ type: "DATA_UPDATED", timestamp: Date.now() });
                bc.close();
            }
        } catch (e) {}

        return { local: localSuccess, server: serverSuccess, cloud: cloudSuccess };
    }

    /**
     * Real-time Site Content Listener
     * Combines Firebase Cloud Firestore real-time listener AND Server /api/last-updated polling (every 2s)
     * This guarantees any phone or other device updates immediately when admin saves on laptop!
     */
    function listenToSiteContent(callback) {
        if (typeof callback !== "function") return null;

        let unsubCloud = null;

        // 1. Cloud Firestore Real-time listener
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

        // 2. Multi-Device Server Live Polling (every 2 seconds)
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
            if (unsubCloud) unsubCloud();
            if (livePollTimer) clearInterval(livePollTimer);
        };
    }

    /* -------------------------------------------------------------
       5. CLIENT BOOKING INQUIRIES METHODS
       ------------------------------------------------------------- */

    /**
     * Submit Booking Inquiry (Called from index.html booking form)
     * Writes to: Server API + Cloud Firestore + Local IndexedDB + LocalStorage
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

        // 2. Save directly to Server API (/api/inquiries)
        let serverSaved = false;
        try {
            serverSaved = await serverSaveInquiry(fullInquiry);
            if (serverSaved) {
                console.log("💾 BhuviDB: Booking inquiry saved to Server inquiries_store.json: " + id);
            }
        } catch (e) {}

        // 3. Save directly to Cloud Firestore
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

        // 4. Broadcast to open admin tabs
        try {
            if (typeof BroadcastChannel !== "undefined") {
                const bc = new BroadcastChannel("bhuvi_studio_channel");
                bc.postMessage({ type: "NEW_INQUIRY", inquiry: fullInquiry });
                bc.close();
            }
        } catch (e) {}

        return { success: true, server: serverSaved, cloud: cloudSaved, id: id };
    }

    /**
     * Get All Inquiries
     * Priority: Cloud Firestore -> Server API -> Local IndexedDB -> LocalStorage
     */
    async function getInquiries() {
        // 1. If Cloud is connected, fetch from Firestore
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

        // 2. Check Server API (/api/inquiries)
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

        // 3. Local Caches
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
