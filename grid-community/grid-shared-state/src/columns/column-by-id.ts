import type { ApiCore, ColumnCore } from "@1771technologies/grid-types/core";
import type { ApiPro } from "@1771technologies/grid-types/pro";

export const columnById = <D, E>(api: ApiCore<D, E> | ApiPro<D, E>, id: string) => {
  if ("columnPivots" in api) {
    const s = api.getState();
    const lookup = s.internal.columnLookup.peek();
    const pivotLookup = s.internal.columnPivotLookup.peek();

    return (pivotLookup.get(id) ?? lookup.get(id)) as ColumnCore<D, E>;
  }

  const lookup = api.getState().internal.columnLookup.peek();

  return lookup.get(id);
};
