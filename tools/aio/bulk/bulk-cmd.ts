import { Command } from "commander";
import path from "path";
import fg from "fast-glob";
import { getAioConfig } from "./get-aio-config";
import { getProjectRoot } from "./get-project-root";
import { TopologicalSort } from "topological-sort";
import { getPackageJson, type PackageJson } from "../build-cmd/vite.config";

export const bulkCmd = new Command("bulk").description("Bulk Commands").action(async () => {
  const aioConfig = getAioConfig();
  const root = getProjectRoot();

  const files = fg
    .globSync(
      aioConfig.packages.map((c) => `${c}/package.json`),
      { ignore: ["**/node_modules/**"], cwd: root },
    )
    .map((f) => path.resolve(root, f));

  const map = new Map<string, [PackageJson, string]>();

  for (const file of files) {
    const pkgJson = getPackageJson(file);
    map.set(pkgJson.name, [pkgJson, file]);
  }
  const sortOp = new TopologicalSort(map);

  for (const [pkg] of map.values()) {
    const deps = pkg.dependencies ?? {};
    const names = Object.keys(deps).filter((dep) => {
      return aioConfig.packagePrefixes.some((prefix) => dep.startsWith(prefix));
    });

    for (const dep of names) {
      sortOp.addEdge(pkg.name, dep);
    }
  }

  const order = [...sortOp.sort().values()].reverse();

  for (const node of order) {
    const packageName = node.node[0].name;

    console.log(`Checking: ${packageName}`);

    const proc = Bun.spawn(["aio", "check"], {
      stdio: ["inherit", "inherit", "inherit"],
      cwd: node.node[1].replace("package.json", ""),
    });

    await proc.exited;

    if (proc.exitCode !== 0) {
      console.log("FAILED\n\n", node.node[1]);
      break;
    }
  }

  for (const node of order) {
    const packageName = node.node[0].name;
    console.log(`Building: ${packageName}`);

    const proc = Bun.spawn(["aio", "build"], {
      stdio: ["inherit", "inherit", "inherit"],
      cwd: node.node[1].replace("package.json", ""),
    });

    await proc.exited;

    if (proc.exitCode !== 0) {
      console.log("FAILED to build: \n\n", node.node[1]);
      break;
    }
  }
});
