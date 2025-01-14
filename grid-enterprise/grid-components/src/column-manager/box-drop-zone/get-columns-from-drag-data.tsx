import type { ColumnEnterpriseReact } from "@1771technologies/grid-types";
import type { PathTreeNode } from "@1771technologies/react-list-view";
import { allLeafs } from "../column-tree/all-leafs";

export function getColumns(c: unknown): ColumnEnterpriseReact<any>[] {
  const data = c as ColumnEnterpriseReact<any> | { node: PathTreeNode<ColumnEnterpriseReact<any>> };

  if ("id" in data) {
    return [data];
  } else if (data.node.type === "parent") {
    const leafs = allLeafs(data.node);

    return leafs;
  } else {
    return [data.node.data];
  }
}
