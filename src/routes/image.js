const express = require("express");
const imageRouter = express.Router();
const https = require("https");
const http = require("http");

// Image proxy endpoint - fetches external images server-side to bypass CORS/hotlinking
imageRouter.get("/image-proxy", async (req, res) => {
    try {
        const imageUrl = req.query.url;

        if (!imageUrl) {
            console.log("Image Proxy: Missing URL");
            return res.status(400).send("Missing url parameter");
        }

        const decodedUrl = decodeURIComponent(imageUrl);
        console.log("Image Proxy: Fetching", decodedUrl);

        // Validate platform-specific URLs if needed
        // Instagram/Facebook CDN URLs often start with scontent or external domains

        const client = decodedUrl.startsWith("https") ? https : http;

        const options = {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.9",
                "Cache-Control": "no-cache",
                "Pragma": "no-cache"
            }
        };

        const proxyReq = client.get(decodedUrl, options, (imageRes) => {
            console.log(`Image Proxy: Status ${imageRes.statusCode} for URL: ${decodedUrl.substring(0, 50)}...`);

            if (imageRes.statusCode >= 400) {
                console.error(`Image Proxy: Request failed with status ${imageRes.statusCode}`);
                // If it's a 4xx/5xx from the source, we might want to still try to serve it or fail
                return res.status(imageRes.statusCode).send("Failed to fetch image from source");
            }

            // Copy over important headers
            const contentType = imageRes.headers["content-type"];
            if (contentType) res.setHeader("Content-Type", contentType);

            // Cache for 1 day
            res.setHeader("Cache-Control", "public, max-age=86400");

            imageRes.pipe(res);
        });

        proxyReq.on("error", (err) => {
            console.error("Image Proxy: Connection error:", err.message);
            if (!res.headersSent) {
                res.status(500).send("Proxy error: " + err.message);
            }
        });

        proxyReq.setTimeout(15000, () => {
            console.error("Image Proxy: Request timed out");
            proxyReq.destroy();
            if (!res.headersSent) {
                res.status(504).send("Image fetch timed out");
            }
        });

    } catch (err) {
        console.error("Image Proxy: Server error", err.message);
        if (!res.headersSent) {
            res.status(500).send("ERROR: " + err.message);
        }
    }
});

module.exports = imageRouter;
