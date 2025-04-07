import type { ApiCore, CellEditLocationCore } from "@1771technologies/grid-types/core";
import { cellEditHandleBulkEdit } from "./cell-edit-handle-bulk-edit";
import type { ApiPro } from "@1771technologies/grid-types/pro";

export function cellEditEnd<D, E>(
  api: ApiCore<D, E> | ApiPro<D, E>,
  l: CellEditLocationCore,
  cancel = false,
) {
  return cellEditHandleBulkEdit(api, [l], cancel);
}
