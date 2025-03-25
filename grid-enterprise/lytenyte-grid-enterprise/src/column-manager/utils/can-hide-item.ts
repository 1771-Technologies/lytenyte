import type { ApiEnterpriseReact, ColumnEnterpriseReact } from "@1771technologies/grid-types";
import { allLeafs } from "./all-leafs.js";
import type { PathTreeNode } from "@1771technologies/path-tree";

export function canHideItem<D>(
  item: PathTreeNode<ColumnEnterpriseReact<any>>,
  api: ApiEnterpriseReact<D>,
) {
  if (item.type === "parent") {
    const leafs = allLeafs(item);

    return leafs.every((leaf) => api.columnIsHidable(leaf));
  } else {
    return api.columnIsHidable(item.data);
  }
}
