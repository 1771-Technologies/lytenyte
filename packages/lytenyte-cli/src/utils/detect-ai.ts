import { existsSync } from "node:fs";
import { join } from "node:path";
import { AI_CONFIGS, type AIType } from "../types/index.js";

export function detectAITypes(cwd: string): Exclude<AIType, "all">[] {
  const detected: Exclude<AIType, "all">[] = [];

  for (const [key, config] of Object.entries(AI_CONFIGS) as [
    Exclude<AIType, "all">,
    (typeof AI_CONFIGS)[keyof typeof AI_CONFIGS],
  ][]) {
    if (config.detectPaths.some((p) => existsSync(join(cwd, p)))) {
      detected.push(key);
    }
  }

  return detected;
}
