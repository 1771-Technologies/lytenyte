import { build } from "vite";
import tailwind from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import fs from "fs/promises";
import { HTML_TEMPLATE } from "./constants.js";
import { resolvePlayConfig } from "./config/index.js";

try {
  await fs.writeFile("./index.html", HTML_TEMPLATE);

  const playConfig = await resolvePlayConfig();

  await build({
    plugins: [
      tailwind(),
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
              const files = import.meta.glob("/src/**/*.play.tsx", { eager: true });

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
} catch (e) {
  console.error(e);
} finally {
  try {
    await fs.rm("index.html");
  } catch {
    //
  }
}
