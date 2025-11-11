import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import https from "https";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Enable JSON parsing
  app.use(express.json());

  // CORS headers for API routes
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    next();
  });

  // Proxy endpoint for GitHub downloads
  app.get("/api/download/:appId", async (req, res) => {
    const { appId } = req.params;

    // Validate App ID
    if (!/^\d+$/.test(appId)) {
      return res.status(400).json({ error: "Invalid App ID format" });
    }

    const githubUrl = `https://codeload.github.com/SteamAutoCracks/ManifestHub/zip/refs/heads/${appId}`;

    try {
      // Make request to GitHub
      https.get(githubUrl, (githubRes) => {
        // Check if the branch exists
        if (githubRes.statusCode === 404) {
          return res.status(404).json({ error: "App ID not found" });
        }

        if (githubRes.statusCode !== 200) {
          return res.status(githubRes.statusCode || 500).json({ 
            error: `GitHub returned status ${githubRes.statusCode}` 
          });
        }

        // Set appropriate headers
        res.setHeader("Content-Type", "application/zip");
        res.setHeader("Content-Disposition", `attachment; filename="${appId}.zip"`);

        // Pipe the response directly to the client
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

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
