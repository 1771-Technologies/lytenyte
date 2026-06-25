import express from "express";
import react from "@vitejs/plugin-react";
import { createServer as createViteServer } from "vite";
import { resolve as resolvePath } from "path";
import os from "os";
import process from "node:process";
import { exec } from "node:child_process";
import { resolvePlayConfig } from "./config/index.js";

const c = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  cyan: "\x1b[36m",
  violet: "\x1b[35m",
};

const HTML_TEMPLATE = `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Playframe</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/@play-entry"></script>
  </body>
</html>
`;

async function createServer() {
  const app = express();

  const { _setupDir, ...playConfig } = await resolvePlayConfig();

  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "custom",
    resolve: {},
    plugins: [
      {
        name: "playframe",
        enforce: "pre",
        resolveId(id) {
          if (id === "/@play-entry" || id === "@play-entry") {
            return "@play-entry";
          }
          if (id === "playframe") return "playframe";
          if (id === "playframe-config") return "playframe-config";
          if (id === "playframe-setup") return "\0playframe-setup";
        },
        load(id) {
          if (id === "playframe") {
            return `
              const files = import.meta.glob("/src/**/*.*play.tsx");

              export default files
            `;
          }

          if (id === "@play-entry") {
            return `import "@1771technologies/play-frame/entry"`;
          }

          if (id === "playframe-config") {
            return `export default ${JSON.stringify(playConfig)}`;
          }

          if (id === "\0playframe-setup") {
            if (playConfig.setup) {
              const absPath = resolvePath(_setupDir, playConfig.setup);
              return `import ${JSON.stringify(absPath)}`;
            }
            return ``;
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

  const PORT = 4000;
  app.listen(PORT, () => {
    const interfaces = os.networkInterfaces();
    const addresses = [];

    for (const name of Object.keys(interfaces)) {
      for (const iface of interfaces[name]) {
        if (iface.family === "IPv4" && !iface.internal) {
          addresses.push(iface.address);
        }
      }
    }

    const arrow = `${c.violet}➜${c.reset}`;
    const label = (s) => `${c.dim}${s}${c.reset}`;
    const url = (s) => `${c.cyan}${c.bold}${s}${c.reset}`;

    console.log();
    console.log(`  ${c.violet}${c.bold}▶ play-frame${c.reset}`);
    const localUrl = `http://localhost:${PORT}/`;

    console.log();
    console.log(`  ${arrow}  ${label("Local:  ")}  ${url(localUrl)}`);
    addresses.forEach((addr) => {
      console.log(`  ${arrow}  ${label("Network:")}  ${url(`http://${addr}:${PORT}/`)}`);
    });
    console.log();
    console.log(`  ${c.dim}press ${c.reset}${c.bold}h${c.reset}${c.dim} to show commands${c.reset}`);
    console.log();

    if (!process.stdin.isTTY) return;

    const openBrowser = () => {
      const cmd =
        os.platform() === "darwin"
          ? `open "${localUrl}"`
          : os.platform() === "win32"
            ? `start "${localUrl}"`
            : `xdg-open "${localUrl}"`;
      exec(cmd);
    };

    const HELP_LINES = 5;

    const printHelp = () => {
      console.log(`  ${c.bold}${c.violet}Commands${c.reset}`);
      console.log();
      console.log(`  ${c.bold}h${c.reset}  ${c.dim}toggle commands${c.reset}`);
      console.log(`  ${c.bold}o${c.reset}  ${c.dim}open in browser${c.reset}`);
      console.log();
    };

    const clearHelp = () => {
      for (let i = 0; i < HELP_LINES; i++) {
        process.stdout.write("\x1b[1A\x1b[2K");
      }
    };

    let helpVisible = false;

    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding("utf8");

    process.stdin.on("data", (key) => {
      if (key === "\x03") {
        process.exit();
      }
      if (key === "h" || key === "H") {
        helpVisible = !helpVisible;
        if (helpVisible) printHelp();
        else clearHelp();
      }
      if (key === "o" || key === "O") {
        openBrowser();
      }
    });
  });
}

createServer();
