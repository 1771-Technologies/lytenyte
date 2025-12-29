import { Command } from "commander";
import c from "chalk";
import fs from "fs-extra";
import { input } from "@inquirer/prompts";

const green = (...args) => console.log(c.green(...args));
const red = (...args) => console.log("\n", c.red(...args), "\n");

export const init = new Command("init")
  .description("Initialize a new monorepo")
  .action(async () => {
    /** @type {string} */
    const projectName = await input({ message: "Please provide a folder name for your project: " });
    const companyName = await input({ message: "Please provide company name for your project: " });

    const npmName = await input({
      message: "Please provide the npm organization name for library packages: ",
    });

    if (fs.pathExistsSync(`${projectName}`)) {
      red("Init command failed. Specified folder already exists.");
      process.exit(1);
    }

    try {
      fs.cpSync(`${import.meta.dirname}/template`, projectName, { recursive: true });
      fs.writeFileSync(
        `${projectName}/op.config.toml`,
        initialToml.replace("[companyName]", companyName).replace("[npmName]", npmName),
      );
    } catch (e) {
      red(e.message);
      fs.removeSync(projectName);
      process.exit(1);
    }

    green("Successfully created your base mono repo. Remember to run `pnpm install`.");
  });

const initialToml = `name = "[companyName]"
organization = "@[npmName]"`;
