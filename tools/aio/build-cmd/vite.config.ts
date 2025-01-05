import { defineConfig } from "vite";
import viteDTS from "vite-plugin-dts";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

export interface PackageJson {
  name: string;
  exports?: {
    [k: string]: {
      types?: string;
      import?: string;
      require?: string;
    };
  };
  dependencies?: {
    [k: string]: string;
  };
}

export function getViteConfig(pkgPath: string, packageJson: PackageJson) {
  const paths = Object.values(packageJson.exports ?? {})
    .map((c) => c.import!)
    .filter(Boolean);

  const entries = paths.map((p) =>
    resolve(pkgPath, p).replace("dist", "src").replace(/\.js$/, ".ts"),
  );

  return defineConfig({
    root: pkgPath,
    plugins: [
      react(),
      viteDTS({
        logLevel: "warn",
        exclude: ["pages", "src/*.stories*"],
        include: ["src"],
        outDir: "build",
      }),
    ],
    build: {
      minify: false,
      target: "ESNext",
      outDir: resolve(pkgPath, "dist"),
      emptyOutDir: true,
      lib: {
        entry: entries,
        name: packageJson.name.replace("@1771technologies/", ""),
        formats: ["es"],
      },
      rollupOptions: {
        external: [
          "react",
          "react-dom",
          "react/jsx-runtime",
          "react-dom/client",
          "@mdx-js/rollup",
          ...Object.keys(packageJson.dependencies ?? {}),
        ],
      },
    },
  });
}
