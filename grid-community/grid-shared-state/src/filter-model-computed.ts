import { computed, signal } from "@1771technologies/react-cascada";
import type { ApiCommunity, ApiEnterprise, ColumnEnterprise } from "@1771technologies/grid-types";
import type { ColumnFilterModel as CFC } from "@1771technologies/grid-types/community";
import type { ColumnFilterModel as CFE } from "@1771technologies/grid-types/enterprise";
import { itemsWithIdToMap } from "@1771technologies/js-utils";

export function filterModelComputed<D, E>(
  filters: CFE<any, any> | CFC<any, any>,
  api: ApiEnterprise<D, E> | ApiCommunity<D, E>,
  pivots: boolean = false,
) {
  const model$ = signal(filters);

  api = api as ApiEnterprise<D, E>;

  return computed(
    () => {
      const sx = api.getState();
      const columns = pivots ? sx.internal.columnPivotColumns.get() : sx.columns.get();

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

      if (!pivots) {
        console.log(model$.get());
        console.log("i ran");
      }

      const model = Object.entries(model$.get())
        .map((c) => {
          const columnId = c[0];
          const filter = c[1] as CFE<any, any>["string"];

          if (!isColumnValid(columnId)) return null;
          const validSimple = isValidSimpleFilter(filter.simple, lookup, isColumnValid);
          const validSet = isValidSetFilter(filter.set, isColumnValid);

          if (!validSimple && !validSet) return null;

          const v: any = {};

          if (validSimple) v.simple = filter.simple;
          if (validSet) v.set = filter.set;

          return [columnId, v as CFE<any, any>["string"]];
        })
        .filter((c) => c !== null);

      return Object.fromEntries(model);
    },
    (v) => model$.set(v),
  );
}

function isValidSetFilter(
  f: CFE<any, any>["string"]["set"],
  isColumnValid: (id: string) => boolean,
) {
  if (!f) return false;
  if (!isColumnValid(f.columnId)) return;

  return f;
}

function isValidSimpleFilter(
  f: CFE<any, any>["string"]["simple"],
  lookup: Map<string, ColumnEnterprise<any, any>>,
  isColumnValid: (id: string) => boolean,
): boolean {
  if (!f) return false;

  if (f.kind === "function") return true;
  if (f.kind === "date" || f.kind === "number" || f.kind === "text") {
    return isColumnValid(f.columnId);
  }
  if (f.kind === "combined")
    return (
      isValidSimpleFilter(f.left, lookup, isColumnValid) &&
      isValidSimpleFilter(f.right, lookup, isColumnValid)
    );

  return false;
}
