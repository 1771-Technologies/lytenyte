import type { ApiCore, ColumnCore } from "@1771technologies/grid-types/core";
import type { ApiPro, ColumnPro } from "@1771technologies/grid-types/pro";

export const columnSortDirection = <D, E>(
  api: ApiPro<D, E> | ApiCore<D, E>,
  c: ColumnCore<D, E> | ColumnPro<D, E>,
) => {
  api = api as ApiCore<D, E>;
  c = c as ColumnCore<D, E>;

  const modelIndex = api.columnSortModelIndex(c);

  if (modelIndex === -1) return null;

  const model = api.getState().sortModel.peek()[modelIndex];
  return model.isDescending ? "desc" : "asc";
};
