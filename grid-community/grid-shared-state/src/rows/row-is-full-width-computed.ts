import { computed } from "@1771technologies/react-cascada";
import type { StoreCommunity, StoreEnterprise } from "@1771technologies/grid-types";

export function rowIsFullWidthComputed<D, E>(
  state: StoreCommunity<D, E>["state"] | StoreEnterprise<D, E>["state"],
  api: StoreCommunity<D, E>["api"] | StoreEnterprise<D, E>["api"],
) {
  return computed(() => {
    const rowDisplayMode = state.rowGroupDisplayMode.get();
    const rowFullWidthPredicate = state.rowFullWidthPredicate.get();

    return (r: number) => {
      const row = api.rowByIndex(r);
      if (!row) return false;

      if (api.rowIsGroup(row) && rowDisplayMode === "full-row") return true;

      return rowFullWidthPredicate ? rowFullWidthPredicate({ api: api as any, row }) : false;
    };
  });
}
