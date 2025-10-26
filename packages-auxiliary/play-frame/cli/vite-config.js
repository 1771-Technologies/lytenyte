import path from "path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export const viteConfig = {
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "../src"),
    },
  },

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
              const files = import.meta.glob("/**/*.*play.tsx", { eager: true });

              export default files
            `;
        }

        if (id === "@play-entry") {
          return `import "@1771technologies/play-frame/entry"`;
        }
      },
    },

    tsconfigPaths(),
    tailwindcss(),
    react(),
  ],
};
