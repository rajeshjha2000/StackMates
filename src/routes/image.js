const express = require("express");
const imageRouter = express.Router();
const https = require("https");
const http = require("http");

// Image proxy endpoint - fetches external images server-side to bypass CORS/hotlinking
imageRouter.get("/image-proxy", async (req, res) => {
    try {
        const imageUrl = req.query.url;

        if (!imageUrl) {
            return res.status(400).send("Missing url parameter");
        }

        // Decode the URL if it's encoded
        const decodedUrl = decodeURIComponent(imageUrl);

        // Choose http or https based on the URL
        const client = decodedUrl.startsWith("https") ? https : http;

        // Fetch the image
        client.get(decodedUrl, {
            headers: {
                // Mimic a browser request
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Accept": "image/webp,image/apng,image/*,*/*;q=0.8",
                "Referer": new URL(decodedUrl).origin,
            }
        }, (imageRes) => {
            // Check if it's a valid image response
            const contentType = imageRes.headers["content-type"];

            if (imageRes.statusCode !== 200) {
                return res.status(imageRes.statusCode).send("Failed to fetch image");
            }

            // Set appropriate headers
            res.setHeader("Content-Type", contentType || "image/jpeg");
            res.setHeader("Cache-Control", "public, max-age=86400"); // Cache for 1 day

            // Pipe the image data to the response
            imageRes.pipe(res);
        }).on("error", (err) => {
            console.error("Image proxy error:", err.message);
            res.status(500).send("Failed to fetch image");
        });

    } catch (err) {
        console.error("Image proxy error:", err.message);
        res.status(500).send("ERROR: " + err.message);
    }
});

module.exports = imageRouter;
