import fs from "fs";
import { parse } from "acorn";
import path from "node:path";
import { visit } from "unist-util-visit";
import type { Plugin } from "unified";
import { findRootSync } from "@manypkg/find-root";
import type { Root, Paragraph, Text } from "mdast";

const getStackBlitzUrl = (path: string, org: string, repo: string, branch: string) => {
  const final = path.startsWith("/") ? path.slice(1) : path;

  const url = final.replace("/content/docs/", "/examples/").replace("demos/", "");
  return `https://stackblitz.com/fork/github/${org}/${repo}/tree/${branch}/${url}?file=src/demo.tsx`;
};

const getCodeSandboxUrl = (path: string, org: string, repo: string, branch: string) => {
  const final = path.startsWith("/") ? path.slice(1) : path;
  const url = final.replace("/content/docs/", "/examples/").replace("demos/", "");

  return `https://codesandbox.io/s/github/${org}/${repo}/tree/${branch}/${url}?file=%2Fsrc%2Fdemo.tsx`;
};

export interface CodeDemoOptions {
  readonly githubOrg: string;
  readonly githubRepo: string;
  readonly githubBranch?: string;
}

const remarkDemo: Plugin<any, Root> = ({
  githubOrg,
  githubRepo,
  githubBranch = "main",
}: CodeDemoOptions) => {
  let demoIndex = 0;
  return (tree, file) => {
    visit(tree, "paragraph", (node: Paragraph, index, parent) => {
      if (!parent) return;
      if (node.children.length !== 1) return;

      const only = node.children[0];
      if (only.type !== "text") return;

      const value = (only as Text).value.trim();
      if (!value.startsWith("!demo")) return;

      const [namepath, filePath] = value.split("=");

      const demoName = namepath.split(":").at(-1) ?? null;
      const relFolder = filePath.replaceAll('"', "").replaceAll("'", "");

      // Resolve against the current MDX file’s directory
      const mdxDir = file.path ? path.dirname(file.path) : process.cwd();
      const absFolder = path.resolve(mdxDir, relFolder);

      const root = findRootSync(process.cwd()).rootDir;

      const demoPath = path.relative(root, absFolder);

      const stackblitzUrl = getStackBlitzUrl(demoPath, githubOrg, githubRepo, githubBranch);
      const codeSandboxUrl = getCodeSandboxUrl(demoPath, githubOrg, githubRepo, githubBranch);

      const componentBasename = "demo";
      const componentFile =
        [".tsx", ".jsx", ".ts", ".js"]
          .map((ext) => path.join(absFolder, `${componentBasename}${ext}`))
          .find((p) => fs.existsSync(p)) ??
        // fallback to index-style names if desired
        [".tsx", ".jsx", ".ts", ".js"]
          .map((ext) => path.join(absFolder, `index${ext}`))
          .find((p) => fs.existsSync(p));

      const importName = `DemoComponent_${demoIndex++}`;
      const importSpec = toPosixPath("./" + path.relative(mdxDir, componentFile!));

      const code = `import ${importName} from "${importSpec}";`;
      const program = parse(code, { ecmaVersion: "latest", sourceType: "module" });

      const importNode = {
        type: "mdxjsEsm",
        value: code,
        data: { estree: program },
      };

      const codeFrame = {
        type: "mdxJsxFlowElement",
        name: "CodeDemo",
        attributes: [
          { type: "mdxJsxAttribute", name: "title", value: demoName },
          { type: "mdxJsxAttribute", name: "absolute", value: absFolder },
          { type: "mdxJsxAttribute", name: "relative", value: relFolder },
          { type: "mdxJsxAttribute", name: "codeSandbox", value: codeSandboxUrl },
          { type: "mdxJsxAttribute", name: "stackBlitz", value: stackblitzUrl },
        ],
        children: [
          {
            type: "mdxJsxFlowElement",
            name: importName,
            attributes: [],
            children: [],
          },
        ],
      };

      parent.children.splice(index!, 1, importNode as any, codeFrame as any);
    });
  };
};
function toPosixPath(p: string) {
  return p.split(path.sep).join("/");
}

export default remarkDemo;
