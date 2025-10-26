import express from "express";
import { viteConfig } from "./vite-config.js";
import { createServer as createViteServer } from "vite";
import { HTML_TEMPLATE } from "./constants.js";
import os from "os";

export async function runDevServer({ port } = {}) {
  const app = express();

  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "custom",
    resolve: {},
    ...viteConfig,
  });

  app.use(vite.middlewares);

  app.use("*", async (req, res) => {
    const url = req.originalUrl;

    const template = await vite.transformIndexHtml(url, HTML_TEMPLATE);
    res.status(200).set({ "Content-Type": "text/html" }).end(template);
  });

  const PORT = port ?? 4000;
  app.listen(PORT, () => {
    // Get network interfaces
    const interfaces = os.networkInterfaces();
    const addresses = [];

    for (const name of Object.keys(interfaces)) {
      for (const iface of interfaces[name]) {
        if (iface.family === "IPv4" && !iface.internal) {
          addresses.push(iface.address);
        }
      }
    }

    console.log(`Server is running:`);
    console.log(`- Local:   http://localhost:${PORT}`);
    addresses.forEach((addr) => {
      console.log(`- Network: http://${addr}:${PORT}`);
    });
  });
}
