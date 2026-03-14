import express from "express";
import react from "@vitejs/plugin-react";
import { createServer as createViteServer } from "vite";
import { createServer as createHttpServer } from "http";
import { WebSocketServer } from "ws";
import { join } from "path";
import os from "os";
import process from "node:process";
import { exec } from "node:child_process";
import { resolvePlayConfig } from "./config/index.js";
import { resolveTestFiles, runVitest, collectVitest, closeVitest } from "./test-runner/index.js";

const cwd = process.cwd();

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
        const fileName = filePath.split("/").pop();

        console.log();
        console.log(`  ${c.violet}${c.bold}▶ ${fileName}${c.reset}`);

        const projectResults = new Map();

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
            const { projectName } = testCase;
            if (!projectResults.has(projectName)) projectResults.set(projectName, []);
            projectResults.get(projectName).push(testCase);
          },
          onModule: (mod) => {
            if (activeFilePath !== filePath) return;
            send({ type: "module", module: mod, filePath });
          },
          onDone: (summary) => {
            if (activeFilePath !== filePath) return;
            send({ type: "done", summary, filePath });
            for (const [projectName, tests] of projectResults) {
              console.log();
              console.log(`  ${c.bold}${projectName}${c.reset}`);
              console.log();
              for (const { state, fullName, duration, errors } of tests) {
                if (state === "passed") {
                  const dur = duration != null ? `${c.dim} (${Math.round(duration)}ms)${c.reset}` : "";
                  console.log(`    ${c.green}✓${c.reset}  ${fullName}${dur}`);
                } else if (state === "failed") {
                  console.log(`    ${c.red}✗${c.reset}  ${c.bold}${fullName}${c.reset}`);
                  for (const err of errors) {
                    console.log();
                    console.log(err.split("\n").map((l) => `      ${l}`).join("\n"));
                    console.log();
                  }
                }
              }
            }
            console.log();
            const parts = [];
            if (summary.numPassed > 0) parts.push(`${c.green}${summary.numPassed} passed${c.reset}`);
            if (summary.numFailed > 0) parts.push(`${c.red}${summary.numFailed} failed${c.reset}`);
            parts.push(`${c.dim}${summary.numTotal} total${c.reset}`);
            console.log(`  ${parts.join(`  ${c.dim}|${c.reset}  `)}`);
            console.log();
          },
          onError: (error) => {
            if (activeFilePath !== filePath) return;
            send({ type: "error", error, filePath });
            console.log();
            console.log(`  ${c.red}${c.bold}Error${c.reset}  ${error}`);
            console.log();
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
        process.stdout.write("\x1b[1A\x1b[2K"); // move up one line, erase it
      }
    };

    let helpVisible = false;

    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding("utf8");

    process.stdin.on("data", (key) => {
      if (key === "\x03") {
        process.exit();
      } // Ctrl+C
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

  process.on("SIGTERM", closeVitest);
  process.on("SIGINT", closeVitest);
}

createServer();
