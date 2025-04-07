import type { ApiCore, ColumnCore } from "@1771technologies/grid-types/core";
import type { ApiPro, ColumnPro } from "@1771technologies/grid-types/pro";

export const columnSortModelIndex = <D, E>(
  api: ApiPro<D, E> | ApiCore<D, E>,
  c: ColumnPro<D, E> | ColumnCore<D, E>,
) => {
  api = api as ApiCore<D, E>;
  c = c as ColumnCore<D, E>;

  const s = api.getState();
  const model = s.sortModel.peek();

  return model.findIndex((col) => c.id === col.columnId);
};
