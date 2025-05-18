import type { GridCore } from "@1771technologies/grid-types/core";
import type { GridPro } from "@1771technologies/grid-types/pro";
import { computed } from "@1771technologies/react-cascada";

export function rowIsFullWidthComputed<D, E>(
  state: GridCore<D, E>["state"] | GridPro<D, E>["state"],
  api: GridCore<D, E>["api"] | GridPro<D, E>["api"],
) {
  return computed(() => {
    const rowFullWidthPredicate = state.rowFullWidthPredicate.get();

    return (r: number) => {
      const row = api.rowByIndex(r);
      if (!row) return false;

      return rowFullWidthPredicate ? rowFullWidthPredicate({ api: api as any, row }) : false;
    };
  });
}
