import type { RowGroup, RowLeaf, Writable } from "@1771technologies/lytenyte-shared";
import type { GroupNode } from "./use-group-tree.js";

export const collapseChild = <T>(node: GroupNode<T>) => {
  const onlyChild = node.children.values().next().value!;

  const parentKey = node.key;
  const parent = node.parent;
  parent.children.set(parentKey, onlyChild);

  Object.assign(onlyChild, { parent, key: parentKey });

  const n = onlyChild.row as Writable<RowLeaf | RowGroup>;
  n.parentId = parent.kind === "root" ? null : parent.id;
  n.depth--;

  return onlyChild;
};
