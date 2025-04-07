import type { ApiProReact, ColumnProReact } from "@1771technologies/grid-types/pro-react";
import { allLeafs } from "./all-leafs.js";
import type { PathTreeNode } from "@1771technologies/path-tree";

export function canHideItem<D>(item: PathTreeNode<ColumnProReact<any>>, api: ApiProReact<D>) {
  if (item.type === "parent") {
    const leafs = allLeafs(item);

    return leafs.every((leaf) => api.columnIsHidable(leaf));
  } else {
    return api.columnIsHidable(item.data);
  }
}
