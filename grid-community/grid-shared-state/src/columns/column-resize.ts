import type {
  ApiCommunity,
  ApiEnterprise,
  ColumnCommunity,
  ColumnEnterprise,
} from "@1771technologies/grid-types";

export const columnResize = <D, E>(
  api: ApiEnterprise<D, E> | ApiCommunity<D, E>,
  c: ColumnCommunity<D, E> | ColumnEnterprise<D, E>,
  w: number,
) => {
  if (!api.columnById(c.id)) return;

  api = api as ApiEnterprise<D, E>;
  c = c as ColumnEnterprise<D, E>;

  api.columnUpdate(c, { width: w });
};
export const columnResizeMany = <D, E>(
  api: ApiEnterprise<D, E> | ApiCommunity<D, E>,
  updates: Record<string, number>,
) => {
  const columnUpdates = Object.fromEntries(
    Object.entries(updates)
      .map(([c, v]) => [c, { width: v }] as const)
      .filter((c) => api.columnById(c[0])),
  );

  api.columnUpdateMany(columnUpdates);
};
