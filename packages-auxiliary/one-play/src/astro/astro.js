import { Command } from "commander";
import { $ } from "execa";

export const astro = new Command("astro")
  .description("Run an astro cli command, e.g. astro dev")
  .allowExcessArguments(true)
  .allowUnknownOption(true)
  .helpOption(false)
  .action(async () => {
    const args = process.argv.slice(3);

    try {
      await $({ cwd: process.cwd(), stdio: "inherit" })`astro ${args}`;
    } catch {
      process.exitCode = 1;
    }
  });
