import { dev } from "astro";
import path from "node:path";

await dev({
  root: path.resolve(import.meta.dirname, ".."),
  logLevel: "error",
  devToolbar: { enabled: false },
});

// await import(astroBin);
