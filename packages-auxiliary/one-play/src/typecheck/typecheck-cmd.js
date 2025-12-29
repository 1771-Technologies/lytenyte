import { Command } from "commander";
import { findNearestPackageJson } from "../get-nearest-package-json.js";
import { rimraf } from "rimraf";
import { dirname, join } from "path";
import { rootCheck } from "../root-check.js";
import { $ } from "execa";

export const typecheck = new Command("typecheck")
  .description("Typecheck the package")
  .action(async () => {
    rootCheck();

    const pkgPath = findNearestPackageJson(process.cwd());

    const dir = join(dirname(pkgPath), "dist");
    rimraf(dir);

    try {
      await $({
        cwd: pkgPath.replace("package.json", ""),
        stdio: ["inherit", "inherit", "inherit"],
      })`tsc --noEmit true`;
    } catch {
      process.exitCode = 1;
    }
  });
