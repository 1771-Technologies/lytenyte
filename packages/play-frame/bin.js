import express from "express";
import react from "@vitejs/plugin-react";
import { createServer as createViteServer } from "vite";
import { HTML_TEMPLATE } from "./constants.js";

async function createServer() {
  const app = express();

  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "custom",
    resolve: {},
    plugins: [
      {
        name: "playframe",
        enforce: "pre",
        resolveId: (id) => {
          if (id === "/@play-entry" || id === "@play-entry") {
            return "@play-entry";
          }
          if (id === "playframe") return "playframe";
        },
        load: (id) => {
          if (id === "playframe") {
            return `
              const files = import.meta.glob("/src/**/*.*play.tsx");

              export default files
            `;
          }

          if (id === "@play-entry") {
            return `import "@1771technologies/play-frame/entry"`;
          }
        },
      },

      react(),
    ],
  });

  app.use(vite.middlewares);

  app.use("*", async (req, res) => {
    const url = req.originalUrl;

    const template = await vite.transformIndexHtml(url, HTML_TEMPLATE);

    res.status(200).set({ "Content-Type": "text/html" }).end(template);
  });

  app.listen(4000, () => {
    console.log("Server running on http://localhost:4000");
  });
}

createServer();
