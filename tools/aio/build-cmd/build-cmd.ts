import { Command } from "commander";
import { argv } from "bun";
import path from "path";

const dirname = import.meta.dir;
const viteConfigPath = path.join(dirname, "vite.config.ts");

export const buildCmd = new Command("build")
  .description("Builds a library package. This will ensure it can be released")
  .action(async () => {
    const testIndex = argv.indexOf("build");
    if (testIndex === -1) {
      console.error("Expected a test command to be present");
      process.exit(1);
    }

    const proc = Bun.spawn(["vite", "build", "-c", viteConfigPath, ...argv.slice(testIndex + 1)], {
      stdio: ["inherit", "inherit", "inherit"],
    });

    await proc.exited;

    process.exitCode = proc.exitCode ?? 0;
  });
