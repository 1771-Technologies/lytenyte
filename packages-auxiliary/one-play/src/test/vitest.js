import { findRootSync } from "@manypkg/find-root";
import { Command } from "commander";
import { $ } from "execa";
import { findNearestPackageJson } from "../get-nearest-package-json.js";
import { relative } from "path";

export const test = new Command("test")
  .description("Run a vitest cli command, e.g. vitest run")
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

    try {
      await $({ cwd: process.cwd(), stdio: "inherit" })`vitest ${args}`;
    } catch {
      process.exitCode = 1;
    }
  });
