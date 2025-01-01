import { computed, signal } from "@1771technologies/cascada";
import type { ApiCommunity, ApiEnterprise, ColumnEnterprise } from "@1771technologies/grid-types";
import type { ColumnFilter as CFC } from "@1771technologies/grid-types/community";
import type { ColumnFilter as CFE } from "@1771technologies/grid-types/enterprise";
import { itemsWithIdToMap } from "@1771technologies/js-utils";

export function filterModelComputed<D, E>(
  filters: CFE<any, any>[] | CFC<any, any>[],
  api: ApiEnterprise<D, E> | ApiCommunity<D, E>,
  pivots: boolean = false,
) {
  const model$ = signal(filters);

  api = api as ApiEnterprise<D, E>;

  return computed(
    () => {
      const sx = api.getState();
      const columns = pivots ? sx.internal.columnPivotColumns.get() : sx.columns.get();

      const registered = sx.filterFunctions.get();

      const lookup = itemsWithIdToMap(columns);

      const isColumnValid = (id: string) => {
        const column = lookup.get(id);
        if (!column) return false;

        if (!pivots && api.columnIsPivot?.(column)) return false;

        return (
          !api.columnIsMarker(column) &&
          !api.columnIsEmpty(column) &&
          !api.columnIsGroupAutoColumn(column)
        );
      };

      const model = model$.get().filter((f) => {
        return isValidFilter(f, lookup, registered, isColumnValid);
      });

      return model;
    },
    (v) => model$.set(v),
  );
}

function isValidFilter(
  f: CFE<any, any>,
  lookup: Map<string, ColumnEnterprise<any, any>>,
  register: Record<string, any>,
  isColumnValid: (id: string) => boolean,
): boolean {
  if (f.kind === "function") return true;
  if (f.kind === "registered") return !!register[f.id];
  if (f.kind === "date" || f.kind === "number" || f.kind === "text" || f.kind === "in") {
    return isColumnValid(f.columnId);
  }
  if (f.kind === "combined")
    return (
      isValidFilter(f.left, lookup, register, isColumnValid) &&
      isValidFilter(f.right, lookup, register, isColumnValid)
    );

  return false;
}
