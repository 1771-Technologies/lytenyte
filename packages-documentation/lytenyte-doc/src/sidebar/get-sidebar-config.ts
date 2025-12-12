import fs, { existsSync, readFileSync, statSync } from "fs";
import { getRoot } from "./get-root.js";
import type { DirectLink, ExternalLink, Group, PageLink, Root, Separator } from "./types.js";
import { generateId } from "../../lytenyte-doc.js";

export function getSidebarConfig(path: string, collection: string): Root {
  const root = getRoot(path);

  const pages = root.pages ?? fs.readdirSync(root.path);

  return {
    kind: "root",
    children: pages.map((x) => processPage(root.path, x)).filter(Boolean),
    path: root.path,
    collection,
  };
}

function processPage(
  parent: string,
  current: string,
): PageLink | DirectLink | ExternalLink | Separator | Group | null {
  if (current === "---") return { kind: "separator" };
  if (current.startsWith("[")) {
    const [label, link] = current.split("]");
    return {
      kind: "direct-link",
      id: link.replace("(", "").replace(")", ""),
      label: label.slice(1),
    };
  }
  if (current.startsWith("external:")) {
    const [label, link] = current.replace("external:", "").split("]");
    return {
      kind: "external-link",
      href: link.replace("(", "").replace(")", ""),
      label: label.slice(1),
    };
  }

  try {
    const path = `${parent}/${current}`;
    const file = statSync(path);
    if (!file.isDirectory()) throw new Error("Not a directory");

    const hasMeta = existsSync(`${path}/meta.json`);
    const meta = hasMeta ? JSON.parse(readFileSync(`${path}/meta.json`, "utf-8")) : {};

    if (meta.root) return null;

    const pages: string[] = meta.pages ?? fs.readdirSync(path);

    const group = {
      kind: "group",
      collapsed: meta.collapsed ?? false,
      collapsible: meta.collapsible ?? true,
      children: pages.map((x) => processPage(path, x)).filter(Boolean),
    } satisfies Group;

    if (!group.children.length) return null;

    return group;
  } catch {
    const prefixed = current.endsWith(".mdx") ? current : `${current}.mdx`;
    // File is not a folder check for the mdx file.
    const path = `${parent}/${prefixed}`;
    if (!existsSync(path)) return null;

    return {
      kind: "page-link",
      path,
      id: generateId({ entry: path.split("/").slice(1).join("/") }),
    };
  }
}
