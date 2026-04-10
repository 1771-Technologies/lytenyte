#!/usr/bin/env node
import process from "node:process";
import { Command } from "commander";
import chalk from "chalk";
import prompts from "prompts";
import { install } from "./commands/install/install.js";
import { versions } from "./commands/versions/versions.js";
import { update } from "./commands/update/update.js";
import { uninstall } from "./commands/uninstall/uninstall.js";
import { help } from "./commands/help/help.js";
import { banner } from "./utils/ui.js";

const program = new Command();

program.name("skills").description("CLI to install skills for AI coding assistants").version("1.0.0");

program.addCommand(install);
program.addCommand(versions);
program.addCommand(update);
program.addCommand(uninstall);
program.addCommand(help);

async function main() {
  if (process.argv.length <= 2) {
    banner();
    console.log("");

    const { command } = await prompts(
      {
        type: "select",
        name: "command",
        message: chalk.bold("What would you like to do?"),
        choices: program.commands.map((cmd) => ({
          title: cmd.name().charAt(0).toUpperCase() + cmd.name().slice(1),
          description: cmd.description(),
        })),
      },
      {
        onCancel: () => {
          console.log(chalk.dim("\n  Goodbye!\n"));
          process.exit(0);
        },
      },
    );

    if (command === undefined) {
      process.exit(0);
    }

    const selected = program.commands[command];
    await selected.parseAsync([], { from: "user" });
  } else {
    await program.parseAsync();
  }
}

main();
