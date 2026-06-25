import { build } from "vite";
import tailwind from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import fs from "fs/promises";
import { resolve as resolvePath } from "path";
import process from "node:process";
import { resolvePlayConfig } from "./config/index.js";

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

const cwd = process.cwd();

try {
  await fs.writeFile("./index.html", HTML_TEMPLATE);

  const { _setupDir, ...playConfig } = await resolvePlayConfig();

  await build({
    plugins: [
      tailwind(),
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
              const files = import.meta.glob("/src/**/*.play.tsx");

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
} catch (e) {
  console.error(e);
} finally {
  try {
    await fs.rm("index.html");
  } catch {
    //
  }
}
