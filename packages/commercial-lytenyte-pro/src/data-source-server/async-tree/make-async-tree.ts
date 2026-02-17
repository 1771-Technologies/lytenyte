import type {
  DeleteDataAction,
  GetDataAction,
  SetDataAction,
  TreeLeaf,
  TreeRoot,
  TreeRootAndApi,
} from "./types";
import { applyDeleteActionToTree } from "./apply-delete-action-to-tree.js";
import { applySetActionToTree } from "./apply-set-action-to-tree.js";
import { getParentNodeByPath } from "./get-parent-node-by-path.js";

export function makeAsyncTree(): TreeRootAndApi {
  const tree: TreeRoot = {
    kind: "root",
    byIndex: new Map(),
    byPath: new Map(),

    size: 0,
    asOf: Date.now(),

    rowIdToNode: new Map(),

    before: [],
    after: [],
  };

  const api = {
    set: (p: SetDataAction) => applySetActionToTree(p, tree),
    delete: (p: DeleteDataAction) => applyDeleteActionToTree(p, tree),
    get: (p: GetDataAction) => getParentNodeByPath(tree, p.path),

    addBefore: (leafs: TreeLeaf[]) => {
      for (const l of leafs) {
        if (tree.before.find((x) => x.row.id === l.row.id)) {
          console.error(`Attempting to add row with ${l.row.id} but it has already been added.`);
          return;
        }
        if (tree.rowIdToNode.has(l.row.id)) {
          console.error(`Attempt to add row with ${l.row.id} but this row already exists.`);
          return;
        }

        tree.before.push(l);
        tree.rowIdToNode.set(l.row.id, l);
      }
    },
    addAfter: (leafs: TreeLeaf[]) => {
      for (const l of leafs) {
        if (tree.after.find((x) => x.row.id === l.row.id)) {
          console.error(`Attempting to add row with ${l.row.id} but it has already been added.`);
          return;
        }
        if (tree.rowIdToNode.has(l.row.id)) {
          console.error(`Attempt to add row with ${l.row.id} but this row already exists.`);
          return;
        }

        tree.after.push(l);
        tree.rowIdToNode.set(l.row.id, l);
      }
    },
    deleteBefore: (leafs: string[]) => {
      const found = new Set(leafs.map((l) => tree.before.find((x) => x.row.id === l)).filter((x) => !!x));
      tree.before = tree.before.filter((x) => !found.has(x));
      found.forEach((x) => {
        tree.rowIdToNode.delete(x.row.id);
      });
    },
    deleteAfter: (leafs: string[]) => {
      const found = new Set(leafs.map((l) => tree.after.find((x) => x.row.id === l)).filter((x) => !!x));
      tree.after = tree.after.filter((x) => !found.has(x));
      found.forEach((x) => {
        tree.rowIdToNode.delete(x.row.id);
      });
    },
  };

  Object.assign(tree, api);

  return tree as TreeRootAndApi;
}
