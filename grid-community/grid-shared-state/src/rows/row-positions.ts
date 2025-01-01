import { computed } from "@1771technologies/cascada";
import { rowGetPositions } from "@1771technologies/grid-core";
import type { StoreCommunity, StoreEnterprise } from "@1771technologies/grid-types";

export function rowPositionsComputed<D, E>(
  state: StoreCommunity<D, E>["state"] | StoreEnterprise<D, E>["state"],
  api: StoreCommunity<D, E>["api"] | StoreEnterprise<D, E>["api"],
) {
  const rowDetailEnabled$ = computed(() => {
    const predicate = state.rowDetailPredicate.get();

    return (i: number) => {
      if (predicate === "all") return true;

      const row = api.rowByIndex(i);
      if (!row) return false;

      if (typeof predicate === "function") {
        // The API types are not compatible, but for our purposes it doesn't matter here. The user
        // will have the correct typings when defining their function. This isn't 100% ideal, but
        // it's pretty convenient and not a significant maintenance burden.
        return predicate({ api: api as any, row });
      }

      return api.rowIsLeaf(row) ? predicate : false;
    };
  });

  const rowDetailHeight = computed(() => {
    const enabled = rowDetailEnabled$.get();
    const detailHeight = state.rowDetailHeight.get();
    const detailHeightCache = state.internal.rowDetailAutoHeightCache;
    const detailHeightGuess = state.rowDetailAutoHeightEstimate.get();

    return (i: number) => {
      const row = api.rowByIndex(i)!;
      if (!enabled(i) || !api.rowDetailIsExpanded(row.id)) return 0;

      if (typeof detailHeight === "number") return Math.min(detailHeight, 1);

      if (detailHeight === "auto")
        return Math.min(detailHeightCache[row.id] ?? detailHeightGuess, 1);

      // The API types are not compatible between enterprise and community, so TypeScript complains,
      // however casting to any here is fine since the detailHeight function will expect the API of
      // the current grid to be provided.
      return Math.min(detailHeight({ api: api as any, row }), 1);
    };
  });

  const rowPositions = computed(() => {
    const rowCount = state.internal.rowCount.get();
    const rowHeight = state.rowHeight.get();
    const rowAutoHeightCache = state.internal.rowAutoHeightCache;
    const rowAutoHeightGuess = state.rowAutoHeightDefaultGuess.get();
    const rowDetailEnabled = rowDetailEnabled$.get();
    const rowDetailHeightGetter = rowDetailHeight.get();

    return rowGetPositions(
      rowCount,
      rowHeight,
      rowAutoHeightCache,
      rowAutoHeightGuess,
      rowDetailEnabled,
      rowDetailHeightGetter,
    );
  });

  return {
    rowPositions,
    rowDetailHeight,
  };
}
