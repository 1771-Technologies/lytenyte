import { argv } from "bun";
import path from "path";
import { Command } from "commander";

const dirname = import.meta.dir;
const viteConfigPath = path.join(dirname, "vite.config.ts");

export const testCmd = new Command("test")
  .description("Testing powered by vitest")
  .helpOption(false)
  .allowExcessArguments(true)
  .allowUnknownOption(true)
  .action(async () => {
    const testIndex = argv.indexOf("test");
    if (testIndex === -1) {
      console.error("Expected a test command to be present");
      process.exit(1);
    }

    const proc = Bun.spawn(
      [
        "vitest",
        "-c",
        viteConfigPath,
        `--workspace=../../tools/aio/test/vite.workspace.ts`,
        ...argv.slice(testIndex + 1),
      ],
      {
        stdio: ["inherit", "inherit", "inherit"],
      },
    );

    await proc.exited;
  });
