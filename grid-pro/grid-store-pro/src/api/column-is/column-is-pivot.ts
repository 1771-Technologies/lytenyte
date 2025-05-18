import type { ApiPro, ColumnPro } from "@1771technologies/grid-types/pro";

export const columnIsPivot = <D, E>(api: ApiPro<D, E>, c: ColumnPro<D, E>) => {
  const pivotLookup = api.getState().internal.columnPivotLookup.peek();

  return pivotLookup.has(c.id);
};
