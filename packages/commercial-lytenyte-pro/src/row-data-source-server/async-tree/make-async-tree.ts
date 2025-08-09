import type {
  DeleteDataAction,
  GetDataAction,
  SetDataAction,
  TreeRoot,
  TreeRootAndApi,
} from "./+types.async-tree";
import { applyDeleteActionToTree } from "./apply-delete-action-to-tree.js";
import { applySetActionToTree } from "./apply-set-action-to-tree.js";
import { getParentNodeByPath } from "./get-parent-node-by-path.js";

export function makeAsyncTree<K = any, D = any>(): TreeRootAndApi<K, D> {
  const tree: TreeRoot<K, D> = {
    kind: "root",
    byIndex: new Map(),
    byPath: new Map(),
    size: 0,
    asOf: Date.now(),
  };

  const api = {
    set: (p: SetDataAction<K, D>) => applySetActionToTree(p, tree),
    delete: (p: DeleteDataAction) => applyDeleteActionToTree(p, tree),
    get: (p: GetDataAction) => getParentNodeByPath(tree, p.path),
  };

  Object.assign(tree, api);

  return tree as TreeRootAndApi<K, D>;
}
