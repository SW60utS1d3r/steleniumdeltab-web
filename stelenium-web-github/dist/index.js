// server/index.ts
import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import https from "https";
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
async function startServer() {
  const app = express();
  const server = createServer(app);
  app.use(express.json());
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    next();
  });
  app.get("/api/download/:appId", async (req, res) => {
    const { appId } = req.params;
    if (!/^\d+$/.test(appId)) {
      return res.status(400).json({ error: "Invalid App ID format" });
    }
    const githubUrl = `https://codeload.github.com/SteamAutoCracks/ManifestHub/zip/refs/heads/${appId}`;
    try {
      https.get(githubUrl, (githubRes) => {
        if (githubRes.statusCode === 404) {
          return res.status(404).json({ error: "App ID not found" });
        }
        if (githubRes.statusCode !== 200) {
          return res.status(githubRes.statusCode || 500).json({
            error: `GitHub returned status ${githubRes.statusCode}`
          });
        }
        res.setHeader("Content-Type", "application/zip");
        res.setHeader("Content-Disposition", `attachment; filename="${appId}.zip"`);
        githubRes.pipe(res);
      }).on("error", (error) => {
        console.error("Error downloading from GitHub:", error);
        res.status(500).json({ error: "Failed to download from GitHub" });
      });
    } catch (error) {
      console.error("Error in proxy endpoint:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  const staticPath = process.env.NODE_ENV === "production" ? path.resolve(__dirname, "public") : path.resolve(__dirname, "..", "dist", "public");
  app.use(express.static(staticPath));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });
  const port = process.env.PORT || 3e3;
  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}
startServer().catch(console.error);
