const fs = require("fs");
const path = require("path");

let inMemoryData = null;

function getStorePath() {
    return path.join(process.cwd(), "data_store.json");
}

function getTmpPath() {
    return path.join("/tmp", "data_store.json");
}

function readData() {
    if (inMemoryData) return inMemoryData;

    try {
        const tmp = getTmpPath();
        if (fs.existsSync(tmp)) {
            const raw = fs.readFileSync(tmp, "utf8");
            if (raw && raw.trim()) {
                inMemoryData = JSON.parse(raw);
                return inMemoryData;
            }
        }
    } catch (e) {}

    try {
        const primary = getStorePath();
        if (fs.existsSync(primary)) {
            const raw = fs.readFileSync(primary, "utf8");
            if (raw && raw.trim()) {
                inMemoryData = JSON.parse(raw);
                return inMemoryData;
            }
        }
    } catch (e) {
        console.warn("Error reading data_store.json:", e.message);
    }

    return null;
}

function saveData(data) {
    inMemoryData = data;
    let saved = false;

    try {
        const tmp = getTmpPath();
        fs.writeFileSync(tmp, JSON.stringify(data, null, 2), "utf8");
        saved = true;
    } catch (e) {}

    try {
        const primary = getStorePath();
        fs.writeFileSync(primary, JSON.stringify(data, null, 2), "utf8");
        saved = true;
    } catch (e) {}

    return saved || inMemoryData !== null;
}

function parseBody(req) {
    return new Promise((resolve) => {
        if (req.body) {
            if (typeof req.body === "string") {
                try {
                    return resolve(JSON.parse(req.body));
                } catch (e) {
                    return resolve(null);
                }
            }
            return resolve(req.body);
        }

        let body = "";
        req.on("data", chunk => {
            body += chunk;
        });
        req.on("end", () => {
            try {
                resolve(body ? JSON.parse(body) : {});
            } catch (e) {
                resolve(null);
            }
        });
        req.on("error", () => resolve(null));
    });
}

module.exports = async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (req.method === "OPTIONS") {
        res.statusCode = 204;
        res.end();
        return;
    }

    if (req.method === "GET") {
        const data = readData();
        res.setHeader("Content-Type", "application/json; charset=utf-8");
        res.statusCode = 200;
        res.end(JSON.stringify({
            success: true,
            data: data,
            timestamp: Date.now()
        }));
        return;
    }

    if (req.method === "POST") {
        try {
            const body = await parseBody(req);
            if (!body || typeof body !== "object") {
                res.setHeader("Content-Type", "application/json");
                res.statusCode = 400;
                res.end(JSON.stringify({ success: false, error: "Invalid JSON format" }));
                return;
            }

            saveData(body);
            res.setHeader("Content-Type", "application/json");
            res.statusCode = 200;
            res.end(JSON.stringify({
                success: true,
                message: "Site data received and saved.",
                timestamp: new Date().toISOString()
            }));
        } catch (err) {
            res.setHeader("Content-Type", "application/json");
            res.statusCode = 500;
            res.end(JSON.stringify({ success: false, error: err.message }));
        }
        return;
    }

    res.statusCode = 405;
    res.end("Method Not Allowed");
};
