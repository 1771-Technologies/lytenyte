import { readdirSync } from "node:fs";
import npath from "node:path";
import type { Root } from "mdast";
import { resolve } from "path";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";
import { findRootSync } from "@manypkg/find-root";
import { parseMdxStringToAst } from "./utils/parseMdxStringToAst.js";
import { execSync } from "child_process";

export interface RemarkDemoOptions {
  readonly componentName?: string;

  readonly githubRepo?: string;
  readonly githubOrg?: string;
}

export const remarkDemo: Plugin<[], Root> = (opts?: RemarkDemoOptions) => {
  const componentName = opts?.componentName ?? "CodeFrame";
  const githubRepo = opts?.githubOrg ?? "";
  const githubOrg = opts?.githubOrg ?? "";
  const githubBranch = getCurrentGitBranch()!;

  let demoInd0x = 0;

  return (tree, file) => {
    visit(tree, "leafDirective", (node, index, parent) => {
      if (!parent || typeof index !== "number" || !file.dirname) return;

      const name = node.name;
      if (name !== "demo") return;

      const children = node.children?.[0];
      if (!children) return;

      const [title, ...rest] = (children as { value: string }).value.split("=");
      let path = rest.join("=").slice(1, -1);
      if (path.endsWith("/")) path = path.slice(0, -1);

      const demoFolder = resolve(file.dirname!, path);
      const files = readdirSync(demoFolder);

      const demoFile = files.find((x) => x.startsWith("demo.tsx"));

      const filesMap: string[] = [];
      const imports = files.map((x) => {
        const i = `import File${demoInd0x} from "${path}/${x}?raw";`;

        filesMap.push(`"${x}": File${demoInd0x}`);

        demoInd0x++;
        return i;
      });

      const relFolder = demoFolder.replaceAll('"', "").replaceAll("'", "");
      const mdxDir = file.path ? npath.dirname(file.path) : process.cwd();
      const absFolder = npath.resolve(mdxDir, relFolder);
      const root = findRootSync(process.cwd()).rootDir;
      const demoPathPart = npath.relative(root, absFolder).split("/").slice(0, -1);
      demoPathPart.splice(1, 0, "examples");
      const demoPath = demoPathPart.join("/");

      const stackblitzUrl = githubRepo ? getStackBlitzUrl(demoPath, githubOrg, githubRepo, githubBranch) : "";
      const codeSandboxUrl = githubRepo
        ? getCodeSandboxUrl(demoPath, githubOrg, githubRepo, githubBranch)
        : "";

      const demoName = `File${demoInd0x}`;
      const comp = `import ${demoName} from "${path}/${demoFile}"`;
      demoInd0x++;

      const fileExport = `{${filesMap.join(",")}}`;
      const fragment = `${imports.join("\n")}\n${comp}\n\n<${componentName} 
        title="${title}" 
        files={${fileExport}}
        codeSandbox="${codeSandboxUrl}"
        stackBlitz="${stackblitzUrl}"
        ><${demoName} client:load /></${componentName}>`.trim();

      const mdx = parseMdxStringToAst(fragment);

      parent.children.splice(index, 1, ...mdx);
    });
  };
};

export function getCurrentGitBranch(cwd = process.cwd()) {
  try {
    // Works in normal repos. In detached HEAD it returns "HEAD".
    const branch = execSync("git rev-parse --abbrev-ref HEAD", {
      cwd,
      stdio: ["ignore", "pipe", "ignore"],
      encoding: "utf8",
    }).trim();

    return branch; // e.g. "main", "feature/foo", or "HEAD" (detached)
  } catch {
    return null; // not a git repo, git not installed, etc.
  }
}

const getStackBlitzUrl = (path: string, org: string, repo: string, branch: string) => {
  void org;
  void repo;
  void branch;
  const final = path.startsWith("/") ? path.slice(1) : path;

  const url = final.replace("/content/docs/", "/examples/").replace("demos/", "");

  return `https://stackblitz.com/fork/github/1771-technologies/lytenyte/tree/main/${url}?file=src/demo.tsx`;
};

const getCodeSandboxUrl = (path: string, org: string, repo: string, branch: string) => {
  void org;
  void repo;
  void branch;

  const final = path.startsWith("/") ? path.slice(1) : path;
  const url = final.replace("/content/docs/", "/examples/").replace("demos/", "");

  return `https://codesandbox.io/s/github/1771technologies/lytenyte/tree/main/${url}?file=%2Fsrc%2Fdemo.tsx`;
};
