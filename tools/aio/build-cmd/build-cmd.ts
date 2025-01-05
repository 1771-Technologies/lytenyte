import { Command } from "commander";
import { getClosestNpmPackage } from "../utils/get-closed-npm-package";
import { build } from "vite";
import { getViteConfig, type PackageJson } from "./vite.config";
import { readFileSync } from "fs";
import { resolve } from "path";

export const buildCmd = new Command("build")
  .description("Builds a library package. This will ensure it can be released")
  .action(async () => {
    const pkgPath = getClosestNpmPackage();
    if (!pkgPath) throw new Error("Failed to determine the package to build");

    const packageJson = getPackageJson(pkgPath);
    const path = pkgPath.replace("package.json", "");

    const viteConfig = getViteConfig(path, packageJson);
    await build(viteConfig);
  });

function getPackageJson(path: string) {
  return JSON.parse(readFileSync(resolve(path), "utf8")) as PackageJson;
}
