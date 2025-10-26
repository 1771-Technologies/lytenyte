import { program } from "commander";
import { runDevServer } from "./dev-server.js";
import { buildPlay } from "./build.js";

program
  .name("Play Frame")
  .version("0.0.1")
  .description("A lightweight development tool for building component libraries and web UIs");

program
  .option("--build", "Build the files")
  .option("--port [number]")
  .action(async ({ build, port }) => {
    if (!build) {
      return await runDevServer({ port });
    } else {
      return await buildPlay();
    }
  });

program.parse();
