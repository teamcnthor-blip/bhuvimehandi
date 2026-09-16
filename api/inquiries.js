const fs = require("fs");
const path = require("path");

let inMemoryInquiries = [];

function getStorePath() {
    return path.join(process.cwd(), "inquiries_store.json");
}

function getTmpPath() {
    return path.join("/tmp", "inquiries_store.json");
}

function readInquiries() {
    if (inMemoryInquiries && inMemoryInquiries.length > 0) return inMemoryInquiries;

    try {
        const tmp = getTmpPath();
        if (fs.existsSync(tmp)) {
            const raw = fs.readFileSync(tmp, "utf8");
            if (raw && raw.trim()) {
                inMemoryInquiries = JSON.parse(raw);
                return inMemoryInquiries;
            }
        }
    } catch (e) {}

    try {
        const primary = getStorePath();
        if (fs.existsSync(primary)) {
            const raw = fs.readFileSync(primary, "utf8");
            if (raw && raw.trim()) {
                inMemoryInquiries = JSON.parse(raw);
                return inMemoryInquiries;
            }
        }
    } catch (e) {}

    return inMemoryInquiries || [];
}

function saveInquiries(inquiries) {
    inMemoryInquiries = inquiries;

    try {
        const tmp = getTmpPath();
        fs.writeFileSync(tmp, JSON.stringify(inquiries, null, 2), "utf8");
    } catch (e) {}

    try {
        const primary = getStorePath();
        fs.writeFileSync(primary, JSON.stringify(inquiries, null, 2), "utf8");
    } catch (e) {}
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
        const list = readInquiries();
        res.setHeader("Content-Type", "application/json; charset=utf-8");
        res.statusCode = 200;
        res.end(JSON.stringify({
            success: true,
            inquiries: list
        }));
        return;
    }

    if (req.method === "POST") {
        try {
            const newInq = await parseBody(req);
            if (!newInq || typeof newInq !== "object") {
                res.setHeader("Content-Type", "application/json");
                res.statusCode = 400;
                res.end(JSON.stringify({ success: false, error: "Invalid inquiry format" }));
                return;
            }

            const current = readInquiries();
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

            saveInquiries(current);

            res.setHeader("Content-Type", "application/json");
            res.statusCode = 200;
            res.end(JSON.stringify({
                success: true,
                id: newInq.id,
                message: "Inquiry saved successfully.",
                inquiries: current
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
