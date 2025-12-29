import { Command } from "commander";
import { findNearestPackageJson } from "../get-nearest-package-json.js";
import { rimraf } from "rimraf";
import { dirname, join } from "path";
import { rootCheck } from "../root-check.js";
import { $ } from "execa";

export const compileCmd = new Command("compile")
  .description("Build a library project using tsc")
  .action(async () => {
    rootCheck();

    const pkgPath = findNearestPackageJson(process.cwd());

    const dir = join(dirname(pkgPath), "dist");
    rimraf(dir);

    try {
      await $({
        cwd: pkgPath.replace("package.json", ""),
        stdio: ["inherit", "inherit", "inherit"],
      })`tsc --outdir dist --noEmit false --declaration`;
    } catch {
      process.exitCode = 1;
    }
  });
