import type {
  ApiCommunity,
  ApiEnterprise,
  ColumnCommunity,
  ColumnEnterprise,
} from "@1771technologies/grid-types";

export const columnSortModelIndex = <D, E>(
  api: ApiEnterprise<D, E> | ApiCommunity<D, E>,
  c: ColumnCommunity<D, E> | ColumnEnterprise<D, E>,
) => {
  api = api as ApiCommunity<D, E>;
  c = c as ColumnCommunity<D, E>;

  const s = api.getState();
  const model = s.sortModel.peek();

  return model.findIndex((col) => c.id === col.columnId);
};
