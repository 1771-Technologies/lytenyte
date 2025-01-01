import type {
  ApiCommunity,
  ApiEnterprise,
  ColumnCommunity,
  ColumnEnterprise,
} from "@1771technologies/grid-types";

export const columnIndex = <D, E>(
  api: ApiCommunity<D, E> | ApiEnterprise<D, E>,
  c: ColumnCommunity<D, E> | ColumnEnterprise<D, E>,
) => {
  const visible = api.getState().columnsVisible.peek();

  const index = visible.indexOf(c as any);
  return index === -1 ? null : index;
};
