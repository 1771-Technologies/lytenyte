import { findRoot } from "@manypkg/find-root";

export async function findWorkspaceRoot(startDir) {
  try {
    const { rootDir } = await findRoot(startDir);
    return rootDir;
  } catch {
    return startDir;
  }
}
