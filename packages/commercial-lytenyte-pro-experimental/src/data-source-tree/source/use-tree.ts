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

export function useTree<T>({
  data,
  filter,
  idFn = defaultIdFn,
  rowValueFn = rowValueFnDefault,
  rowChildrenFn = rowChildrenFnDefault,
}: UseTreeDataSourceParams<T>) {
  const rowTree = useMemo(() => {
    const root: TreeRoot = {
      kind: "root",
      children: new Map(),
      rowIdToNode: new Map(),
      data,
    };

    const groupKeys = (parent: TreeRoot | TreeParent, path: string[], row: any, parentObj: object) => {
      const value = rowValueFn(row, parentObj, path.at(-1)!);
      const entries = rowChildrenFn(row, parentObj, path.at(-1)!);

      if (filter && !filter(value)) return;

      const expandable = entries.some((x) => isObject(x[1]));
      const node: TreeParent = {
        kind: "parent",
        children: new Map(),
        parent,
        path,
        data: row,
        key: path.at(-1)!,
        row: {
          kind: "branch",
          depth: path.length - 1,
          expandable,
          expanded: false,
          key: path.at(-1)!,
          last: !expandable,
          id: idFn(path, value),
          data: value,
          parentId: parent.kind === "root" ? null : parent.row.id,
        },
      };
      parent.children.set(path.at(-1)!, node);
      root.rowIdToNode.set(node.row.id, node);

      entries.forEach((x) => groupKeys(node, [...path, x[0]], x[1], row));
    };

    const rootRows = Object.entries(data);
    for (const [path, row] of rootRows) {
      groupKeys(root, [path], row, data);
    }

    return root;
  }, [data, filter, idFn, rowChildrenFn, rowValueFn]);

  return rowTree;
}
