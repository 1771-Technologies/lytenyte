import type { RowSelectNodeWithParent } from "@1771technologies/lytenyte-shared";
import type { ServerData } from "../../server-data";

export function collapseUpwards(
  node: RowSelectNodeWithParent,
  source: ServerData,
  root: Map<string, RowSelectNodeWithParent>,
  base: boolean,
) {
  if ("kind" in node.parent) return;

  const parent = node.parent;

  const treeNode = source.tree.rowIdToNode.get(parent.id);
  if (!treeNode || treeNode.kind === "leaf") return;

  const size = treeNode.size;

  // We've potentially exempted all the rows in this parent.
  if (parent.exceptions && parent.exceptions.size >= size) {
    let allPresent = true;
    for (const x of treeNode.byIndex.values()) {
      if (!parent.exceptions.has(x.row.id)) {
        allPresent = false;
        break;
      }
    }

    if (allPresent) {
      parent.exceptions = undefined;
      parent.children = undefined;

      if (!base) {
        if (!parent.parent) root.delete(parent.id);
        else parent.parent?.children?.delete(parent.id);
      } else parent.selected = false;
    }
  }

  // We have a bunch of selected nodes. So lets check if everything is selected
  if (parent.children && parent.children.size >= size) {
    let allPresentAndSelected = true;
    for (const x of treeNode.byIndex.values()) {
      const n = parent.children.get(x.row.id);
      if (!n || !n.selected || n.exceptions?.size) {
        allPresentAndSelected = false;
        break;
      }
    }

    if (allPresentAndSelected) {
      parent.exceptions = undefined;
      parent.children = undefined;

      if (base) {
        if (!parent.parent) root.delete(parent.id);
        else parent.parent.children?.delete(parent.id);
      } else parent.selected = true;
    }
  }

  collapseUpwards(parent, source, root, base);
}
