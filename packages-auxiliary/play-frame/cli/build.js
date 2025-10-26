import { build } from "vite";
import fs from "fs/promises";
import { viteConfig } from "./vite-config.js";
import { HTML_TEMPLATE } from "./constants.js";

export async function buildPlay() {
  try {
    await fs.writeFile("./index.html", HTML_TEMPLATE);

    await build(viteConfig);
  } catch (e) {
    console.error(e);
  } finally {
    try {
      await fs.rm("index.html");
    } catch (e) {
      console.error(e);
    }
  }
}
