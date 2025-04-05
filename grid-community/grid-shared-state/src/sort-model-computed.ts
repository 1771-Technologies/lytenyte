import { computed, signal } from "@1771technologies/react-cascada";
import type { ApiCommunity, ApiEnterprise } from "@1771technologies/grid-types";
import type { SortModelItem } from "@1771technologies/grid-types/core";
import { itemsWithIdToMap } from "@1771technologies/js-utils";

export function sortModelComputed<D, E>(
  s: SortModelItem[],
  api: ApiCommunity<D, E> | ApiEnterprise<D, E>,
  pivots: boolean = false,
) {
  const sortModel$ = signal(s);

  api = api as ApiEnterprise<D, E>;

  return computed(
    () => {
      const sx = api.getState();

      const columns = pivots ? sx.internal.columnPivotColumns.get() : sx.columns.get();

      const lookup = itemsWithIdToMap(columns);

      const model = sortModel$.get().filter((c) => {
        const column = lookup.get(c.columnId);
        if (!column) return false;

        if (!pivots && !api.columnIsGroupAutoColumn(column) && api.columnIsPivot?.(column))
          return false;

        return (
          !api.columnIsEmpty(column) && !api.columnIsMarker(column) && api.columnIsSortable(column)
        );
      });

      queueMicrotask(api.rowRefresh);
      return model;
    },
    (v) => sortModel$.set(v),
  );
}
