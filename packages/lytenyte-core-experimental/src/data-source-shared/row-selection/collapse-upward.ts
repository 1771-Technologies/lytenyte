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

  if (node.children == null) {
    // This node doesn't do anything since it has not children and has no selection state.
    // We can safely remove it from the selection tree.
    if (node.selected == null) {
      node.parent.children?.delete(node.id);
    }

    // If we aren't at the root, then we can continue upwards.
    if (!("kind" in node.parent)) collapseUpwards(node.parent, idToSpec, root, base);
    return;
  }

  // The node must be defined otherwise how is it selected in the UI.
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

      if (x.selected !== first || x.children) {
        all = false;
        break;
      }
    }

    if (all) {
      node.selected = first!;
      delete node.children;
    }

    if (isNodeSelected(node.parent) === node.selected) {
      node.parent.children?.delete(node.id);
    }
  }

  if (!("kind" in node.parent)) collapseUpwards(node.parent, idToSpec, root, base);
  return;
}
