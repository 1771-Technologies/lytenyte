import { Command } from "commander";
import { $ } from "execa";
import { rootCheck } from "../root-check.js";
import { findNearestPackageJson } from "../get-nearest-package-json.js";

export const lintCmd = new Command("lint")
  .description("Lint the package using eslint")
  .allowExcessArguments(true)
  .allowUnknownOption(true)
  .helpOption(false)
  .action(async () => {
    rootCheck();

    const pkgPath = findNearestPackageJson(process.cwd());

    const args = process.argv.slice(3);

    try {
      await $({
        cwd: pkgPath.replace("package.json", ""),
        stdio: "inherit",
      })`eslint ${args} .`;
    } catch {
      process.exitCode = 1;
    }
  });
