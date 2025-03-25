import type { ApiEnterpriseReact, ColumnEnterpriseReact } from "@1771technologies/grid-types";
import { canHideItem } from "./can-hide-item.js";
import { allLeafs } from "./all-leafs.js";
import type { PathTreeNode } from "@1771technologies/path-tree";

export function handleItemHide(
  item: PathTreeNode<ColumnEnterpriseReact<any>>,
  api: ApiEnterpriseReact<any>,
) {
  const state = api.getState();
  const base = state.columnBase.peek();

  if (canHideItem(item, api)) {
    if (item.type === "parent") {
      const columns = allLeafs(item);

      const allVisible = columns.every((c) => !(c.hide ?? base.hide));
      const nextState = allVisible ? true : false;

      const update = Object.fromEntries(columns.map((c) => [c.id, { hide: nextState }]));

      api.columnUpdateMany(update);
    } else {
      const column = item.data;
      const next = !(column.hide ?? base.hide);
      api.columnUpdate(column, { hide: next });
    }
  }
}
