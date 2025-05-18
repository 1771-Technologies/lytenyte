import { defineConfig } from "vite";
import { readFileSync } from "fs";
import viteDTS from "vite-plugin-dts";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { getClosestNpmPackage } from "../utils/get-closed-npm-package";
import wyw from "@wyw-in-js/vite";
import AutoImport from "unplugin-auto-import/vite";

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

function getViteConfig(pkgPath: string, packageJson: PackageJson) {
  const paths = Object.values(packageJson.exports ?? {})
    .map((c) => c.import!)
    .filter(Boolean);

  const entries = paths.map((p) => resolve(pkgPath, p).replace("dist", "src"));

  return defineConfig({
    root: pkgPath,
    plugins: [
      AutoImport({
        imports: {
          "@linaria/core": ["css"],
        },
        dts: false,
      }),
      wyw({
        include: ["**/*.{ts,tsx}"],
        babelOptions: {
          presets: ["@babel/preset-typescript", "@babel/preset-react"],
        },
      }),

      react(),
      viteDTS({
        logLevel: "warn",
        exclude: ["pages", "src/*.stories*"],
        include: ["src"],
        outDir: "dist/types",
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
          "react-dom/server",
          "react/jsx-runtime",
          "react-dom/client",
          "@mdx-js/rollup",
          ...Object.keys(packageJson.dependencies ?? {}),
        ],
      },
    },
  });
}

const pkgPath = getClosestNpmPackage();
if (!pkgPath) throw new Error("Failed to determine the package to build");

const packageJson = getPackageJson(pkgPath);
const path = pkgPath.replace("package.json", "");

export function getPackageJson(path: string) {
  return JSON.parse(readFileSync(resolve(path), "utf8")) as PackageJson;
}

export default getViteConfig(path, packageJson);
