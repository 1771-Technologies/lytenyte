import { Command } from "commander";
import path from "path";

const dirname = import.meta.dir;
const configFile = path.join(dirname, "playwright.config.ts");
const configFileNoStart = path.join(dirname, "playwright.config.no-start.ts");

export const playwrightCmd = new Command("playwright")
  .description("Run playwright")
  .allowExcessArguments()
  .allowUnknownOption()
  .helpOption(false)
  .action(async () => {
    let args = process.argv.slice(3);
    let config = configFile;

    if (args.includes("--nws")) {
      args = args.filter((c) => c !== "--nws");
      config = configFileNoStart;
    }

    const proc = Bun.spawn(["playwright", "test", "-c", config, ...args], {
      stdio: ["inherit", "inherit", "inherit"],
    });

    await proc.exited;
  });
