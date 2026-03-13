import { readFileSync, existsSync } from "fs";
import { join } from "path";

export function loadConfig(dir) {
  const configPath = join(dir, "play.config.json");
  if (!existsSync(configPath)) return null;
  try {
    return JSON.parse(readFileSync(configPath, "utf-8"));
  } catch {
    console.warn(`[play-frame] Failed to parse ${configPath}`);
    return null;
  }
}
