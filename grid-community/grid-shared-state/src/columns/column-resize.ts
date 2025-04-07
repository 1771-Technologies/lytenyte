import type { ApiCore, ColumnCore } from "@1771technologies/grid-types/core";
import type { ApiPro, ColumnPro } from "@1771technologies/grid-types/pro";

export const columnResize = <D, E>(
  api: ApiPro<D, E> | ApiCore<D, E>,
  c: ColumnCore<D, E> | ColumnPro<D, E>,
  w: number,
) => {
  if (!api.columnById(c.id)) return;

  api = api as ApiPro<D, E>;
  c = c as ColumnPro<D, E>;

  api.columnUpdate(c, { width: w });
};
export const columnResizeMany = <D, E>(
  api: ApiPro<D, E> | ApiCore<D, E>,
  updates: Record<string, number>,
) => {
  const columnUpdates = Object.fromEntries(
    Object.entries(updates)
      .map(([c, v]) => [c, { width: v }] as const)
      .filter((c) => api.columnById(c[0])),
  );

  api.columnUpdateMany(columnUpdates);
};
