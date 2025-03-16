import type { ColumnEnterpriseReact } from "@1771technologies/grid-types";
import type { PathTreeNode } from "@1771technologies/react-list-view";
import { allLeafs } from "../column-tree/all-leafs";
import { columnSource } from "./sources";

export function getColumns(c: unknown): ColumnEnterpriseReact<any>[] {
  const data = c as
    | { column: ColumnEnterpriseReact<any>; source: string }
    | { node: PathTreeNode<ColumnEnterpriseReact<any>> };

  if ("source" in data) {
    return [data.column];
  } else if (data.node.type === "parent") {
    const leafs = allLeafs(data.node);

    return leafs;
  } else {
    return [data.node.data];
  }
}

export function getDataSource(c: unknown): string {
  const data = c as
    | { column: ColumnEnterpriseReact<any>; source: string }
    | { node: PathTreeNode<ColumnEnterpriseReact<any>> };

  if ("source" in data) {
    return data.source;
  } else {
    return columnSource;
  }
}
