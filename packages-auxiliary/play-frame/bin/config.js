import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";

const DEFAULT_CONFIG = {
  themes: {
    attribute: "class",
    values: [
      { name: "Light", value: "light", colorScheme: "light" },
      { name: "Dark", value: "dark", colorScheme: "dark" },
    ],
  },
};

function findWorkspaceRoot(startDir) {
  let dir = startDir;
  while (true) {
    if (existsSync(join(dir, "pnpm-workspace.yaml")) || existsSync(join(dir, ".git"))) {
      return dir;
    }
    const pkgPath = join(dir, "package.json");
    if (existsSync(pkgPath)) {
      try {
        const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
        if (pkg.workspaces) return dir;
      } catch {
        // ignore malformed package.json
      }
    }
    const parent = dirname(dir);
    if (parent === dir) return dir; // filesystem root
    dir = parent;
  }
}

function loadConfig(dir) {
  const configPath = join(dir, "play.config.json");
  if (!existsSync(configPath)) return null;
  try {
    return JSON.parse(readFileSync(configPath, "utf-8"));
  } catch {
    console.warn(`[play-frame] Failed to parse ${configPath}`);
    return null;
  }
}

export function resolvePlayConfig() {
  // eslint-disable-next-line no-undef
  const cwd = process.cwd();
  const packageConfig = loadConfig(cwd);

  const workspaceRoot = findWorkspaceRoot(cwd);
  const rootConfig = workspaceRoot !== cwd ? loadConfig(workspaceRoot) : null;

  // Merge: root is the base, package-level replaces per top-level key
  return {
    ...DEFAULT_CONFIG,
    ...rootConfig,
    ...packageConfig,
  };
}
