import type {
  ApiCommunity,
  ApiEnterprise,
  ColumnCommunity,
  ColumnEnterprise,
} from "@1771technologies/grid-types";

export const columnSortGetNext = <D, E>(
  api: ApiEnterprise<D, E> | ApiCommunity<D, E>,
  c: ColumnCommunity<D, E> | ColumnEnterprise<D, E>,
) => {
  api = api as ApiCommunity<D, E>;
  c = c as ColumnCommunity<D, E>;

  if (!api.columnIsSortable(c)) return null;

  const index = api.columnSortCycleIndex(c);
  const sortCycle = api.columnSortCycle(c)!;

  if (index == null) return sortCycle[0];

  return sortCycle[(index + 1) % sortCycle.length];
};
