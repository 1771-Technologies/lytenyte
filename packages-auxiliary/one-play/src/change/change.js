import { Command } from "commander";
import { $ } from "execa";
import { findRootSync } from "@manypkg/find-root";

export const changeCmd = new Command("change")
  .description("Changesets cli")
  .allowExcessArguments(true)
  .allowUnknownOption(true)
  .helpOption(false)
  .action(async () => {
    const root = findRootSync(process.cwd());

    const args = process.argv.slice(3);

    if (!root) {
      console.error("Should be in a oneplay project.");
      process.exitCode = 1;
      return;
    }

    try {
      await $({
        cwd: root.rootDir,
        stdio: "inherit",
      })`changeset ${args}`;
    } catch (e) {
      console.error(e.message);
      process.exitCode = 1;
    }
  });
