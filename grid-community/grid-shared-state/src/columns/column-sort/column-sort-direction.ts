import type {
  ApiCommunity,
  ApiEnterprise,
  ColumnCommunity,
  ColumnEnterprise,
} from "@1771technologies/grid-types";

export const columnSortDirection = <D, E>(
  api: ApiEnterprise<D, E> | ApiCommunity<D, E>,
  c: ColumnCommunity<D, E> | ColumnEnterprise<D, E>,
) => {
  api = api as ApiCommunity<D, E>;
  c = c as ColumnCommunity<D, E>;

  const modelIndex = api.columnSortModelIndex(c);

  if (modelIndex === -1) return null;

  const model = api.getState().sortModel.peek()[modelIndex];
  return model.isDescending ? "desc" : "asc";
};
