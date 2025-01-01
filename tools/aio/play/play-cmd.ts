import { argv } from "bun";
import { Command } from "commander";
import path from "path";

const dirname = import.meta.dir;
const viteConfigPath = path.join(dirname, "vite.config.ts");

export const playCmd = new Command("play")
  .allowUnknownOption()
  .allowExcessArguments()
  .description("Runs the play command")
  .action(async () => {
    const testIndex = argv.indexOf("play");
    if (testIndex === -1) {
      console.error("Expected a test command to be present");
      process.exit(1);
    }

    const proc = Bun.spawn(["vite", "-c", viteConfigPath, ...argv.slice(testIndex + 1)], {
      stdio: ["inherit", "inherit", "inherit"],
    });

    await proc.exited;
  });
