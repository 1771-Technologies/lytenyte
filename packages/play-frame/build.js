import { build } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs/promises";
import { HTML_TEMPLATE } from "./constants.js";

try {
  await fs.writeFile("./index.html", HTML_TEMPLATE);

  await build({
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
              const files = import.meta.glob("/src/**/*.play.tsx");

              export default files
            `;
          }

          if (id === "@play-entry") {
            return `import "@playframe/line/entry"`;
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
