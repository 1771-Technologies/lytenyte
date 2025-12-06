import { readdirSync } from "fs";
import type { Root } from "mdast";
import { resolve } from "path";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";
import { parseMdxStringToAst } from "./utils/parseMdxStringToAst.js";

export interface RemarkDemoOptions {
  readonly componentName?: string;
}

export const remarkDemo: Plugin<[], Root> = (opts?: RemarkDemoOptions) => {
  const componentName = opts?.componentName ?? "CodeFrame";
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

      const demoFile = files.find((x) => x.startsWith("demo"));

      const filesMap: string[] = [];
      const imports = files.map((x) => {
        const i = `import File${demoInd0x} from "${path}/${x}?raw";`;

        filesMap.push(`"${x}": File${demoInd0x}`);

        demoInd0x++;
        return i;
      });

      const demoName = `File${demoInd0x}`;
      const comp = `import ${demoName} from "${path}/${demoFile}"`;
      demoInd0x++;

      const fileExport = `{${filesMap.join(",")}}`;
      const fragment = `${imports.join(
        "\n",
      )}\n${comp}\n\n<${componentName} title="${title}" files={${fileExport}}><${demoName} client:load /></${componentName}>`.trim();

      const mdx = parseMdxStringToAst(fragment);

      parent.children.splice(index, 1, ...mdx);
    });
  };
};
