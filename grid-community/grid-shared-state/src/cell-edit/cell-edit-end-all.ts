import type { ApiCommunity, ApiEnterprise } from "@1771technologies/grid-types";
import { cellEditHandleBulkEdit } from "./cell-edit-handle-bulk-edit";

export function cellEditEndAll<D, E>(
  api: ApiCommunity<D, E> | ApiEnterprise<D, E>,
  cancel = false,
) {
  const s = api.getState();
  const l = [...s.internal.cellEditActiveEdits.peek().values()];

  return cellEditHandleBulkEdit(api, l, cancel);
}
