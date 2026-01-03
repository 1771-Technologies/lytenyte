import { type RowNode, type RowSelectNodeWithParent } from "@1771technologies/lytenyte-shared";
import { isNodeSelected } from "./is-node-selected.js";

export function collapseUpwards(
  node: RowSelectNodeWithParent,
  idToSpec: (id: string) => { size: number; children: Map<any, { row: RowNode<any> }> } | null,
  root: Map<string, RowSelectNodeWithParent>,
  base: boolean,
) {
  const parentSelected = isNodeSelected(node.parent);

  // This node is the same as the parent, so just remove it.
  if (parentSelected === node.selected) {
    node.parent.children?.delete(node.id);

    if (!("kind" in node.parent)) collapseUpwards(node.parent, idToSpec, root, base);
    return;
  }

  // Is this a leaf, if so just move upward
  if (node.children == null) {
    // This node doesn't do anything.
    if (node.selected == null) {
      node.parent.children?.delete(node.id);
    }

    if (!("kind" in node.parent)) collapseUpwards(node.parent, idToSpec, root, base);
    return;
  }

  const treeNode = idToSpec(node.id);
  if (!treeNode) return;

  const size = treeNode.size;

  // This means potentially we have a parent that is equivalent to its children. For example, if all the children
  // are selected, then the parent is also selected, and hence we can select the parent and remove the children.
  if (node.children.size >= size) {
    // Do all the children have the same state.
    let all = true;
    let first: boolean | null | undefined = null;

    for (const x of node.children.values()) {
      if (first == null) first = x.selected;

      if (x.selected !== first) {
        all = false;
        break;
      }
    }

    if (all) {
      node.selected = first!;
      delete node.children;
    }

    // Remove this node
    if (isNodeSelected(node.parent) === node.selected) {
      node.parent.children?.delete(node.id);
    }
  }

  if (!("kind" in node.parent)) collapseUpwards(node.parent, idToSpec, root, base);
  return;
}
