import express from "express";
import react from "@vitejs/plugin-react";
import { createServer as createViteServer } from "vite";
import { createServer as createHttpServer } from "http";
import { WebSocketServer } from "ws";
import { join } from "path";
import os from "os";
import process from "node:process";
import { resolvePlayConfig } from "./config/index.js";
import { resolveTestFiles, runVitest, collectVitest, closeVitest } from "./test-runner/index.js";

const cwd = process.cwd();

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

  const playConfig = await resolvePlayConfig();

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
          if (id === "playframe-config") return "playframe-config";
        },
        load: (id) => {
          if (id === "playframe") {
            return `
              const files = import.meta.glob("/src/**/*.*play.tsx", { eager: true });

              export default files
            `;
          }

          if (id === "@play-entry") {
            return `import "@1771technologies/play-frame/entry"`;
          }

          if (id === "playframe-config") {
            return `export default ${JSON.stringify(playConfig)}`;
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

  // ---------------------------------------------------------------------------
  // HTTP + WebSocket server
  // ---------------------------------------------------------------------------

  const httpServer = createHttpServer(app);

  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });

  wss.on("connection", (ws) => {
    // Tracks the play file currently active for this connection.
    // Set synchronously on every discover so in-flight callbacks from a
    // superseded discover are silently dropped before they touch the client.
    let activeFilePath = null;

    ws.on("message", async (raw) => {
      let msg;
      try {
        msg = JSON.parse(raw.toString());
      } catch {
        return;
      }

      const send = (obj) => {
        if (ws.readyState === ws.OPEN) ws.send(JSON.stringify(obj));
      };

      if (msg.type === "discover") {
        const { filePath } = msg;
        activeFilePath = filePath; // update before any await

        const absPath = join(cwd, filePath);
        const testFiles = resolveTestFiles(absPath);
        send({ type: "discovered", testFiles, filePath });

        await collectVitest({
          cwd,
          testFiles,
          onModule: (mod) => {
            if (activeFilePath !== filePath) return;
            send({ type: "module", module: mod, filePath });
          },
          onError: (error) => {
            if (activeFilePath !== filePath) return;
            send({ type: "error", error, filePath });
          },
        });

        if (activeFilePath === filePath) {
          send({ type: "collected", filePath });
        }
        return;
      }

      if (msg.type === "run" || msg.type === "run-project" || msg.type === "run-test") {
        const { filePath } = msg;
        const testFiles = resolveTestFiles(join(cwd, filePath));

        await runVitest({
          cwd,
          testFiles,
          testNamePattern: msg.type === "run-test" ? msg.testName : undefined,
          projectName: msg.projectName ?? undefined,
          onTestCaseStart: (testCase) => {
            if (activeFilePath !== filePath) return;
            send({ type: "test-case-start", testCase, filePath });
          },
          onTestCase: (testCase) => {
            if (activeFilePath !== filePath) return;
            send({ type: "test-case", testCase, filePath });
          },
          onModule: (mod) => {
            if (activeFilePath !== filePath) return;
            send({ type: "module", module: mod, filePath });
          },
          onDone: (summary) => {
            if (activeFilePath !== filePath) return;
            send({ type: "done", summary, filePath });
          },
          onError: (error) => {
            if (activeFilePath !== filePath) return;
            send({ type: "error", error, filePath });
          },
        });
      }
    });
  });

  const PORT = 4000;
  httpServer.listen(PORT, () => {
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

  process.on("SIGTERM", closeVitest);
  process.on("SIGINT", closeVitest);
}

createServer();
