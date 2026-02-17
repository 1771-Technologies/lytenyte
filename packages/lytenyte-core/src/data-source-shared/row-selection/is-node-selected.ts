import type {
  RowSelectionLinkedWithParent,
  RowSelectNodeWithParent,
} from "@1771technologies/lytenyte-shared";

export function isNodeSelected(node: RowSelectNodeWithParent | RowSelectionLinkedWithParent) {
  if (node.selected != null) return node.selected;

  return isNodeSelected(node.parent);
}
