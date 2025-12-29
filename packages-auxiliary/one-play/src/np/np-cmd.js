import { Command } from "commander";
import { $ } from "execa";
import { findNearestPackageJson } from "../get-nearest-package-json.js";

export const npCmd = new Command("np")
  .description("Run pnpm commands")
  .allowExcessArguments(true)
  .allowUnknownOption(true)
  .helpOption(false)
  .action(async () => {
    const args = process.argv.slice(3);

    const pkgPath = findNearestPackageJson(process.cwd());
    if (pkgPath == null) {
      console.error("No package.json is present in the current folder.");
      process.exitCode = 1;
      return;
    }

    try {
      await $({
        cwd: pkgPath.replace("package.json", ""),
        stdio: "inherit",
      })`pnpm ${args}`;
    } catch (e) {
      console.error(e.message);
      process.exitCode = 1;
    }
  });
