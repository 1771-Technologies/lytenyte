import { Command } from "commander";
import { $ } from "execa";
import { rootCheck } from "../root-check.js";
import { findNearestPackageJson } from "../get-nearest-package-json.js";

export const fmtCmd = new Command("fmt")
  .description("Format a package using prettier")
  .allowExcessArguments(true)
  .allowUnknownOption(true)
  .helpOption(false)
  .action(async () => {
    rootCheck();

    const pkgPath = findNearestPackageJson(process.cwd());

    const args = process.argv.slice(3);

    if (!args.includes("--check") && !args.includes("--write")) args.push("--check");

    try {
      await $({
        cwd: pkgPath.replace("package.json", ""),
        stdio: "inherit",
      })`prettier ${args} .`;
    } catch {
      process.exitCode = 1;
    }
  });
