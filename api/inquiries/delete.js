const fs = require("fs");
const path = require("path");

function getStorePath() {
    return path.join(process.cwd(), "inquiries_store.json");
}

function getTmpPath() {
    return path.join("/tmp", "inquiries_store.json");
}

function readInquiries() {
    try {
        const tmp = getTmpPath();
        if (fs.existsSync(tmp)) {
            const raw = fs.readFileSync(tmp, "utf8");
            if (raw && raw.trim()) return JSON.parse(raw);
        }
    } catch (e) {}

    try {
        const primary = getStorePath();
        if (fs.existsSync(primary)) {
            const raw = fs.readFileSync(primary, "utf8");
            if (raw && raw.trim()) return JSON.parse(raw);
        }
    } catch (e) {}

    return [];
}

function saveInquiries(inquiries) {
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
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (req.method === "OPTIONS") {
        res.statusCode = 204;
        res.end();
        return;
    }

    if (req.method === "POST") {
        try {
            const { id } = await parseBody(req) || {};
            let current = readInquiries();
            const beforeCount = current.length;
            current = current.filter(x => x.id !== id);

            if (current.length < beforeCount) {
                saveInquiries(current);
                res.setHeader("Content-Type", "application/json");
                res.statusCode = 200;
                res.end(JSON.stringify({ success: true, message: "Inquiry deleted", inquiries: current }));
            } else {
                res.setHeader("Content-Type", "application/json");
                res.statusCode = 404;
                res.end(JSON.stringify({ success: false, error: "Inquiry not found" }));
            }
        } catch (err) {
            res.setHeader("Content-Type", "application/json");
            res.statusCode = 400;
            res.end(JSON.stringify({ success: false, error: err.message }));
        }
        return;
    }

    res.statusCode = 405;
    res.end("Method Not Allowed");
};
