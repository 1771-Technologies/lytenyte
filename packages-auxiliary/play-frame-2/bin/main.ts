import { dev } from "astro";
import path from "node:path";

const devServer = await dev({
  root: path.resolve(import.meta.dirname, ".."),
  logLevel: "error",
});

console.log("I ran");

// await devServer.stop();
// process.argv.push("dev");
// process.argv.push(`--silent`);
// process.argv.push(`--root`);
// process.argv.push(path.resolve(import.meta.dirname, ".."));
// process.argv.push(`--config ${path.resolve(import.meta.dirname, "../astro.config.ts")}`);

// await import(astroBin);
