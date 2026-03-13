import { DEFAULT_CONFIG } from "./default-config.js";
import { loadConfig } from "./load-config.js";
import { findWorkspaceRoot } from "./find-workspace-root.js";

export async function resolvePlayConfig() {
  // eslint-disable-next-line no-undef
  const cwd = process.cwd();
  const packageConfig = loadConfig(cwd);

  const workspaceRoot = await findWorkspaceRoot(cwd);
  const rootConfig = workspaceRoot !== cwd ? loadConfig(workspaceRoot) : null;

  // Merge: root is the base, package-level replaces per top-level key
  return {
    ...DEFAULT_CONFIG,
    ...rootConfig,
    ...packageConfig,
  };
}
