import fs, { existsSync, readFileSync, statSync } from "fs";
import { capitalize } from "es-toolkit";
import { getRoot } from "./get-root.js";
import type { DirectLink, ExternalLink, Group, PageLink, Root, Separator } from "./types.js";
import { generateId } from "../../lytenyte-doc.js";

export function getSidebarConfig(path: string, collection: string): Root {
  const root = getRoot(path);

  const allPagesForDir = getPagesForDirectory(root.path);
  const pages = root.pages ?? allPagesForDir;

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

    const pages: string[] = finalizePageList(meta.pages, path);
    const group = {
      kind: "group",
      id: path,
      label: meta.label ?? capitalize(current.replace("(", "").replace(")", "")),
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

function getPagesForDirectory(path: string) {
  const dir = fs.readdirSync(path);

  return dir
    .filter((x) => {
      const s = statSync(`${path}/${x}`);
      if (s.isDirectory()) return true;

      return x.endsWith(".mdx");
    })
    .map((x) => (x.endsWith(".mdx") ? x.slice(0, x.length - 4) : x));
}

function finalizePageList(pages: string[] | undefined, path: string) {
  let pagesForDir = getPagesForDirectory(path);

  if (!pages) return pagesForDir;

  const pagesToRemove = new Set(pages.filter((x) => x.startsWith("!")).map((x) => x.slice(1)));
  pagesForDir = pagesForDir.filter((x) => !pagesToRemove.has(x));

  const remainingPages = pagesForDir.filter((x) => !pages.includes(x));

  const finalPages: string[] = [];

  for (let i = 0; i < pages.length; i++) {
    const p = pages[i];
    if (p.startsWith("...")) {
      finalPages.push(...remainingPages);
      continue;
    }

    finalPages.push(p);
  }

  return finalPages;
}
