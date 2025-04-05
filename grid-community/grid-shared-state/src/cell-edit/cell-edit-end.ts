import type { CellEditLocation } from "@1771technologies/grid-types/core";
import { cellEditHandleBulkEdit } from "./cell-edit-handle-bulk-edit";
import type { ApiCommunity, ApiEnterprise } from "@1771technologies/grid-types";

export function cellEditEnd<D, E>(
  api: ApiCommunity<D, E> | ApiEnterprise<D, E>,
  l: CellEditLocation,
  cancel = false,
) {
  return cellEditHandleBulkEdit(api, [l], cancel);
}
