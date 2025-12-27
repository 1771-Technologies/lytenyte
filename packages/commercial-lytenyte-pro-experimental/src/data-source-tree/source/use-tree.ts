import { useMemo } from "react";
import type { TreeParent, TreeRoot } from "../types";
import { isObject } from "../utils/is-object.js";
import type { UseTreeDataSourceParams } from "../use-tree-data-source";

const defaultIdFn = (path: string[]) => path.join("-->");

const rowValueFnDefault = (x: object) => {
  if (!isObject(x)) return null;
  const entries = Object.entries(x).filter((v) => !isObject(v[1]));
  return Object.fromEntries(entries);
};

const rowChildrenFnDefault = (x: object) => {
  if (!isObject(x)) return [];
  return Object.entries(x).filter((x) => isObject(x[1]));
};

export function useTree({
  data,
  idFn = defaultIdFn,
  rowValueFn = rowValueFnDefault,
  rowChildrenFn = rowChildrenFnDefault,
}: UseTreeDataSourceParams) {
  const rowTree = useMemo(() => {
    const root: TreeRoot = {
      kind: "root",
      children: new Map(),
      rowIdToNode: new Map(),
    };

    const groupKeys = (parent: TreeRoot | TreeParent, path: string[], row: any) => {
      const value = rowValueFn(row);
      const entries = rowChildrenFn(row);

      const expandable = entries.some((x) => isObject(x[1]));
      const node: TreeParent = {
        kind: "parent",
        children: new Map(),
        parent,
        path,
        row: {
          kind: "branch",
          depth: path.length - 1,
          expandable,
          expanded: false,
          key: path.at(-1)!,
          last: !expandable,
          id: idFn(path, row),
          data: value,
        },
      };
      parent.children.set(path.at(-1)!, node);
      root.rowIdToNode.set(node.row.id, node);

      entries.forEach((x) => groupKeys(node, [...path, x[0]], x[1]));
    };

    const rootRows = Object.entries(data);
    for (const [path, row] of rootRows) {
      groupKeys(root, [path], row);
    }

    return root;
  }, [data, idFn, rowChildrenFn, rowValueFn]);

  return rowTree;
}
