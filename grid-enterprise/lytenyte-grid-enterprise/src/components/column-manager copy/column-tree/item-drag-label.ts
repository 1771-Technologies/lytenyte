import type { ColumnEnterpriseReact } from "@1771technologies/grid-types";
import type { PathTreeNode } from "@1771technologies/react-list-view";
import { allLeafs } from "./all-leafs";

export function itemDragTag(gridId: string, item: PathTreeNode<ColumnEnterpriseReact<any>>) {
  const column = item.type === "leaf" ? item.data : allLeafs(item).at(0)!;

  const pin = column.pin;
  const pinValue = pin ?? "none";

  return `${gridId}:tree:column:${pinValue}`;
}
