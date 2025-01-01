import type { ApiCommunity, ApiEnterprise, ColumnCommunity } from "@1771technologies/grid-types";

export const columnById = <D, E>(api: ApiCommunity<D, E> | ApiEnterprise<D, E>, id: string) => {
  if ("columnPivots" in api) {
    const s = api.getState();
    const lookup = s.internal.columnLookup.peek();
    const pivotLookup = s.internal.columnPivotLookup.peek();

    return (pivotLookup.get(id) ?? lookup.get(id)) as ColumnCommunity<D, E>;
  }

  const lookup = api.getState().internal.columnLookup.peek();

  return lookup.get(id);
};
