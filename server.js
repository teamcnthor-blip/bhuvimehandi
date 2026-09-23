/**
 * ===================================================================
 * BHUVI MEHANDI — LOCAL & VPS MULTI-DEVICE API SERVER (server.js)
 * Standalone zero-dependency Node.js HTTP & Real-Time Database Server
 * Runs with: `node server.js` or `npm start`
 * ===================================================================
 */

const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");
const os = require("os");

const PORT = process.env.PORT || 5502;
const DATA_FILE = path.join(__dirname, "data_store.json");
const INQUIRIES_FILE = path.join(__dirname, "inquiries_store.json");
const CONFIG_FILE = path.join(__dirname, "config_store.json");

// Helper: Read JSON safely
function readJSON(filePath, fallback = {}) {
    try {
        if (!fs.existsSync(filePath)) return fallback;
        const raw = fs.readFileSync(filePath, "utf8");
        if (!raw || !raw.trim()) return fallback;
        return JSON.parse(raw);
    } catch (e) {
        console.warn("⚠️ Warning: Error reading JSON file:", filePath, e.message);
        return fallback;
    }
}

// Helper: Write JSON safely with atomic rename if possible
function writeJSON(filePath, data) {
    try {
        const tempPath = `${filePath}.tmp_${Date.now()}`;
        fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), "utf8");
        fs.renameSync(tempPath, filePath);
        return true;
    } catch (e) {
        try {
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
            return true;
        } catch (err2) {
            console.error("❌ Error writing JSON file:", filePath, err2);
            return false;
        }
    }
}

// Initialize storage files if they do not exist or are empty
if (!fs.existsSync(DATA_FILE) || fs.statSync(DATA_FILE).size <= 2) {
    // Look for default data or seed file
    console.log("📦 Initializing data_store.json with default studio catalog...");
}
if (!fs.existsSync(INQUIRIES_FILE)) {
    writeJSON(INQUIRIES_FILE, []);
}
if (!fs.existsSync(CONFIG_FILE)) {
    writeJSON(CONFIG_FILE, {});
}

const MIME_TYPES = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
    ".ttf": "font/ttf"
};

// Helper to collect request body safely with large limit
function collectBody(req, limitBytes = 100 * 1024 * 1024) {
    return new Promise((resolve, reject) => {
        let body = "";
        let bytesReceived = 0;

        req.on("data", chunk => {
            bytesReceived += chunk.length;
            if (bytesReceived > limitBytes) {
                req.destroy();
                reject(new Error("Payload too large"));
                return;
            }
            body += chunk;
        });

        req.on("end", () => {
            resolve(body);
        });

        req.on("error", err => {
            reject(err);
        });
    });
}

let lastUpdatedTimestamp = Date.now();
let lastMobileActivity = null;

const server = http.createServer(async (req, res) => {
    // Enable Full CORS for seamless multi-device, local network, and cross-origin access
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, Access-Control-Request-Private-Network");
    res.setHeader("Access-Control-Allow-Private-Network", "true");

    if (req.method === "OPTIONS") {
        res.writeHead(204);
        res.end();
        return;
    }

    const parsedUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);
    const pathname = parsedUrl.pathname;

    let rawIp = req.socket.remoteAddress || "local";
    let clientIp = rawIp;
    if (rawIp === "::1" || rawIp === "127.0.0.1" || rawIp === "::ffff:127.0.0.1") {
        clientIp = "127.0.0.1";
    } else {
        clientIp = rawIp.replace(/^::ffff:/, "");
    }

    // Track external / mobile device activity
    if (clientIp !== "127.0.0.1" && clientIp !== "local") {
        lastMobileActivity = {
            ip: clientIp,
            timestamp: Date.now(),
            path: pathname,
            userAgent: req.headers["user-agent"] || "Mobile Browser"
        };
    }

    // Log API requests
    if (pathname.startsWith("/api/")) {
        console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${pathname} (from ${clientIp})`);
    }

    /* ---------------- 0. API: LIVE SYNC & NETWORK INFO ---------------- */
    if (pathname === "/api/last-updated" && req.method === "GET") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({
            success: true,
            timestamp: lastUpdatedTimestamp,
            lastMobileDevice: lastMobileActivity
        }));
        return;
    }

    if (pathname === "/api/network-info" && req.method === "GET") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({
            success: true,
            port: PORT,
            ips: getNetworkAddresses(),
            lastUpdated: lastUpdatedTimestamp,
            lastMobileDevice: lastMobileActivity
        }));
        return;
    }

    /* ---------------- 1. API: SITE CONTENT (DATA STORE) ---------------- */
    if (pathname === "/api/data" && req.method === "GET") {
        const data = readJSON(DATA_FILE, null);
        res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
        res.end(JSON.stringify({ success: true, data: data, timestamp: lastUpdatedTimestamp }));
        return;
    }

    if (pathname === "/api/data" && req.method === "POST") {
        try {
            const body = await collectBody(req);
            const parsed = JSON.parse(body);

            if (!parsed || typeof parsed !== "object") {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: false, error: "Invalid data format" }));
                return;
            }

            const ok = writeJSON(DATA_FILE, parsed);
            if (ok) {
                lastUpdatedTimestamp = Date.now();
                console.log(`[${new Date().toLocaleTimeString()}] ✅ Site data saved to ${DATA_FILE}`);
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({
                    success: true,
                    message: "Site data saved permanently to disk.",
                    timestamp: new Date().toISOString()
                }));
            } else {
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: false, error: "Failed to write data file" }));
            }
        } catch (err) {
            console.error("Error in POST /api/data:", err);
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, error: err.message || "Invalid JSON" }));
        }
        return;
    }

    /* ---------------- 2. API: BOOKING INQUIRIES ---------------- */
    if (pathname === "/api/inquiries" && req.method === "GET") {
        const inqs = readJSON(INQUIRIES_FILE, []);
        res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
        res.end(JSON.stringify({ success: true, inquiries: inqs }));
        return;
    }

    if (pathname === "/api/inquiries" && req.method === "POST") {
        try {
            const body = await collectBody(req);
            const newInq = JSON.parse(body);

            if (!newInq || typeof newInq !== "object") {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: false, error: "Invalid inquiry object" }));
                return;
            }

            const current = readJSON(INQUIRIES_FILE, []);
            // Upsert / merge by ID
            const existingIdx = current.findIndex(x => x.id === newInq.id);
            if (existingIdx !== -1) {
                current[existingIdx] = { ...current[existingIdx], ...newInq, updatedAt: new Date().toISOString() };
            } else {
                current.unshift({
                    ...newInq,
                    id: newInq.id || ("INQ-" + Date.now()),
                    receivedAtServer: new Date().toISOString()
                });
            }

            writeJSON(INQUIRIES_FILE, current);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({
                success: true,
                id: newInq.id,
                message: "Inquiry saved to server database.",
                inquiries: current
            }));
        } catch (err) {
            console.error("Error in POST /api/inquiries:", err);
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, error: err.message || "Invalid JSON" }));
        }
        return;
    }

    if (pathname === "/api/inquiries/status" && req.method === "POST") {
        try {
            const body = await collectBody(req);
            const { id, status } = JSON.parse(body);
            const current = readJSON(INQUIRIES_FILE, []);
            const target = current.find(x => x.id === id);

            if (target) {
                target.status = status;
                target.statusUpdatedAt = new Date().toISOString();
                writeJSON(INQUIRIES_FILE, current);
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: true, message: "Status updated", inquiries: current }));
            } else {
                res.writeHead(404, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: false, error: "Inquiry not found" }));
            }
        } catch (err) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, error: err.message }));
        }
        return;
    }

    if (pathname === "/api/inquiries/delete" && req.method === "POST") {
        try {
            const body = await collectBody(req);
            const { id } = JSON.parse(body);
            let current = readJSON(INQUIRIES_FILE, []);
            const beforeCount = current.length;
            current = current.filter(x => x.id !== id);

            if (current.length < beforeCount) {
                writeJSON(INQUIRIES_FILE, current);
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: true, message: "Inquiry deleted", inquiries: current }));
            } else {
                res.writeHead(404, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: false, error: "Inquiry not found" }));
            }
        } catch (err) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, error: err.message }));
        }
        return;
    }

    /* ---------------- 3. API: SHARED CONFIGURATION (FIREBASE ETC.) ---------------- */
    if (pathname === "/api/config" && req.method === "GET") {
        const config = readJSON(CONFIG_FILE, {});
        res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
        res.end(JSON.stringify({ success: true, config: config }));
        return;
    }

    if (pathname === "/api/config" && req.method === "POST") {
        try {
            const body = await collectBody(req);
            const newConfig = JSON.parse(body);
            writeJSON(CONFIG_FILE, newConfig || {});
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: true, message: "Configuration saved." }));
        } catch (err) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, error: err.message }));
        }
        return;
    }

    /* ---------------- 4. STATIC FILE SERVER ---------------- */
    let sanitizedPath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, "");
    if (sanitizedPath === "/" || sanitizedPath === "\\") {
        sanitizedPath = "index.html";
    }

    let filePath = path.join(__dirname, sanitizedPath);

    // Security check: ensure filePath is within __dirname
    if (!filePath.startsWith(__dirname)) {
        res.writeHead(403, { "Content-Type": "text/html" });
        res.end("<h1>403 Forbidden</h1>");
        return;
    }

    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            // Check if user requested directory or file without .html extension
            if (fs.existsSync(filePath + ".html")) {
                filePath = filePath + ".html";
            } else {
                res.writeHead(404, { "Content-Type": "text/html" });
                res.end("<h1>404 Not Found</h1><p>The requested URL was not found on this server.</p>");
                return;
            }
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || "application/octet-stream";

        fs.readFile(filePath, (readErr, content) => {
            if (readErr) {
                res.writeHead(500, { "Content-Type": "text/html" });
                res.end(`<h1>500 Server Error</h1><p>${readErr.code}</p>`);
            } else {
                res.writeHead(200, { "Content-Type": contentType });
                res.end(content);
            }
        });
    });
});

// Detect network IPs so user can open on mobile phone / another device on Wi-Fi
function getNetworkAddresses() {
    const interfaces = os.networkInterfaces();
    const addresses = [];
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === "IPv4" && !iface.internal) {
                addresses.push(iface.address);
            }
        }
    }
    return addresses;
}

server.listen(PORT, () => {
    const networkIps = getNetworkAddresses();

    console.log(`\n=======================================================`);
    console.log(`🌿 BHUVI MEHANDI LUXURY STUDIO SERVER IS RUNNING!`);
    console.log(`=======================================================`);
    console.log(`💻 Local Computer Access:`);
    console.log(`   - 🌐 Live Website: http://localhost:${PORT}`);
    console.log(`   - 👑 Admin Portal: http://localhost:${PORT}/admin.html`);
    
    if (networkIps.length > 0) {
        console.log(`\n📱 Open On Mobile / Other Devices (Same Wi-Fi Network):`);
        networkIps.forEach(ip => {
            console.log(`   - 🌐 Live Website: http://${ip}:${PORT}`);
            console.log(`   - 👑 Admin Portal: http://${ip}:${PORT}/admin.html`);
        });
    }

    console.log(`\n💾 Permanent Multi-Device Disk Stores:`);
    console.log(`   - Site Content Database: ${DATA_FILE}`);
    console.log(`   - Inquiries Database:    ${INQUIRIES_FILE}`);
    console.log(`   - Config Store:          ${CONFIG_FILE}`);
    console.log(`=======================================================\n`);
});
