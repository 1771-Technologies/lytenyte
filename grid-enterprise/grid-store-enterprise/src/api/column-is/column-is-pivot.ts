import type { ApiEnterprise, ColumnEnterprise } from "@1771technologies/grid-types";

export const columnIsPivot = <D, E>(api: ApiEnterprise<D, E>, c: ColumnEnterprise<D, E>) => {
  const pivotLookup = api.getState().internal.columnPivotLookup.peek();

  return pivotLookup.has(c.id);
};
