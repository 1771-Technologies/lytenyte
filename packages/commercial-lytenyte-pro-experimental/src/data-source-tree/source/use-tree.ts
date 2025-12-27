import { useMemo } from "react";
import type { TreeLeaf, TreeParent, TreeRoot } from "../types";
import { isObject } from "../utils/is-object.js";
import type { UseTreeDataSourceParams } from "../use-tree-data-source";

const defaultIdFn = (path: string[]) => path.join("-->");
export function useTree({ data, idFn = defaultIdFn }: UseTreeDataSourceParams) {
  const rowTree = useMemo(() => {
    const root: TreeRoot = {
      kind: "root",
      children: new Map(),
      rowIdToNode: new Map(),
    };

    const groupKeys = (parent: TreeRoot | TreeParent, path: string[], row: any) => {
      // This will form a group node
      if (isObject(row)) {
        const entries = Object.entries(row);

        const node: TreeParent = {
          kind: "parent",
          children: new Map(),
          parent,
          path,
          row: {
            kind: "branch",
            depth: path.length - 1,
            expandable: entries.length > 0,
            expanded: false,
            key: path.at(-1)!,
            last: entries.every((x) => !isObject(x[1])),
            id: idFn(path, row),
            data: row,
          },
        };
        parent.children.set(path.at(-1)!, node);
        root.rowIdToNode.set(node.row.id, node);

        entries.forEach((entry) => groupKeys(node, [...path, entry[0]], entry[1]));
      } else {
        const node: TreeLeaf = {
          kind: "leaf",
          parent,
          path,
          row: {
            id: idFn(path, row),
            data: row,
            kind: "leaf",
          },
        };
        parent.children.set(path.at(-1)!, node);
        root.rowIdToNode.set(node.row.id, node);
      }
    };

    const rootRows = Object.entries(data);
    for (const [path, row] of rootRows) {
      groupKeys(root, [path], row);
    }

    return root;
  }, [data, idFn]);

  return rowTree;
}
