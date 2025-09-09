import { ROOT_LEAF_PREFIX } from "./+constants.async-tree.js";
import type { SetDataAction, TreeLeaf, TreeParent, TreeRoot } from "./+types.async-tree.js";

export function maybeApplySetActionItems<K, D>(
  p: SetDataAction<K, D>,
  pathNode: TreeParent<K, D> | TreeRoot<K, D>,
) {
  if (!p.items?.length) {
    return false;
  }

  const asOf = p.asOf ?? Date.now();
  for (let i = 0; i < p.items.length; i++) {
    const item = p.items[i];

    const path =
      item.kind === "leaf" ? `${p.path.at(-1) ?? ROOT_LEAF_PREFIX}#${item.relIndex}` : item.path;

    const existingIndex = pathNode.byIndex.get(item.relIndex);

    if (existingIndex) {
      pathNode.byPath.delete(existingIndex.path);
      pathNode.byIndex.delete(item.relIndex);
    }

    const existingByPath = pathNode.byPath.get(path);
    if (existingByPath) {
      pathNode.byPath.delete(existingByPath.path);
      pathNode.byIndex.delete(existingByPath.relIndex);
    }

    const existing = existingByPath ?? existingIndex;

    // We always replace when making a leaf
    if (item.kind === "leaf") {
      const node: TreeLeaf<K, D> = { ...item, parent: pathNode, path: path!, asOf };

      const currentI = pathNode.byIndex.get(item.relIndex);
      const currentP = pathNode.byPath.get(path);

      if (!currentI || currentI.asOf < asOf) pathNode.byIndex.set(item.relIndex, node);
      if (!currentP || currentP.asOf < asOf) pathNode.byPath.set(path, node);
    } else {
      const node: TreeParent<K, D> = {
        byIndex: existing?.kind === "parent" ? existing.byIndex : new Map(),
        byPath: existing?.kind === "parent" ? existing.byPath : new Map(),
        data: item.data,
        kind: "parent",
        relIndex: item.relIndex,
        parent: pathNode,
        path,
        size: item.size,
        asOf,
      };

      const currentI = pathNode.byIndex.get(item.relIndex);
      const currentP = pathNode.byPath.get(path);

      if (!currentI || currentI.asOf < asOf) pathNode.byIndex.set(item.relIndex, node);
      if (!currentP || currentP.asOf < asOf) pathNode.byPath.set(path, node);
    }
  }

  return true;
}
