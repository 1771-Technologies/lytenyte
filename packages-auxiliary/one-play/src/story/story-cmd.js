import { findRootSync } from "@manypkg/find-root";
import { Command } from "commander";
import { $ } from "execa";
import { findNearestPackageJson } from "../get-nearest-package-json.js";
import { relative } from "path";

export const story = new Command("story")
  .description("Run a storybook cli command, for example storybook dev")
  .allowExcessArguments(true)
  .allowUnknownOption(true)
  .helpOption(false)
  .action(async () => {
    const args = process.argv.slice(3);

    const rootDir = findRootSync(process.cwd()).rootDir;
    const closest = findNearestPackageJson(process.cwd()).replace("/package.json", "");

    if (rootDir !== closest) {
      const storyPaths = `../${relative(rootDir, closest)}/src/**/*.stories.@(js|jsx|mjs|ts|tsx),../${relative(rootDir, closest)}/src/**/*.stories.mdx`;
      process.env.STORY_PATH = storyPaths;
    }

    if (args[0] === "dev" && !args.includes("-p")) args.push("-p", "6006");

    try {
      await $({ cwd: rootDir, stdio: "inherit" })`storybook ${args}`;
    } catch {
      process.exitCode = 1;
    }
  });
