import { Command } from "commander";
import c from "chalk";
import fs from "fs-extra";
import { input, select } from "@inquirer/prompts";
import { getOpConfig } from "../get-op-config.js";
import { Apache, MIT } from "./licenses.js";
import { findRootSync } from "@manypkg/find-root";
import { pkg, sitePkg } from "./package.js";

const green = (...args) => console.log(c.green(...args));
const red = (...args) => console.log("\n", c.red(...args), "\n");

export const createCmd = new Command("create")
  .description("Create a new library or site package")
  .argument("[string]")
  .action(async (projectNameProvided) => {
    const config = getOpConfig();

    if (!config) {
      console.error("Expected a oneplay config to be present");
      process.exitCode = 1;
      return;
    }

    let cleanup;

    try {
      const type = await select({
        message: "What package type are you creating?",
        choices: [
          { name: "Package", value: "package", description: "For library packages" },
          { name: "Site", value: "site", description: "For astro websites" },
        ],
      });

      if (type === "site") {
        const name = await input({ message: "What should the package name be?" });
        const folderName = await input({ message: "What should the folder name be?" });

        const root = findRootSync(process.cwd());
        const packageDir = `${root.rootDir}/sites`;

        const finalFolder = `${packageDir}/${folderName}`;

        fs.cpSync(`${import.meta.dirname}/site-template`, finalFolder, {
          recursive: true,
        });
        cleanup = finalFolder;

        const finalPkgName = `${name}`;
        const packageContents = sitePkg.replace("[name]", finalPkgName);
        fs.writeFileSync(`${finalFolder}/package.json`, packageContents);
      }

      if (type === "package") {
        const license = await select({
          message: "What license should be used for the package?",
          choices: [
            { name: "Apache 2.0", value: Apache.replace("[name]", config.name) },
            { name: "MIT", value: MIT.replace("[name]", config.name) },
            ...(config.licenses ?? []).map((c) => {
              return { name: c.name, value: c.content };
            }),
          ],
        });

        const name = await input({ message: "What should the package name be?" });
        const folderName = await input({ message: "What should the folder name be?" });

        const root = findRootSync(process.cwd());
        const packageDir = `${root.rootDir}/packages`;

        const finalFolder = `${packageDir}/${folderName}`;

        fs.cpSync(`${import.meta.dirname}/template`, finalFolder, {
          recursive: true,
        });
        cleanup = finalFolder;

        const organization = config.organization;
        const finalPkgName = `${organization}/${name}`;
        const packageContents = pkg.replace("[name]", finalPkgName);
        fs.writeFileSync(`${finalFolder}/package.json`, packageContents);
        fs.writeFileSync(`${finalFolder}/LICENSE`, license);
      }
    } catch (e) {
      console.error(e);
      if (cleanup) fs.rmdir(cleanup);

      process.exitCode = 1;
    }
  });
