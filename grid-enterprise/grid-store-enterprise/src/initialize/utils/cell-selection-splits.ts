import { computed } from "@1771technologies/react-cascada";
import { splitCellSelectionRect } from "@1771technologies/grid-core-enterprise";
import type { StoreEnterprise } from "@1771technologies/grid-types";

export function cellSelectionSplits<D, E>(state: StoreEnterprise<D, E>["state"]) {
  return computed(() => {
    const selections = state.cellSelections.get();
    const topCount = state.internal.rowTopCount.get();
    const centerCount =
      state.internal.rowCount.get() - state.internal.rowBottomCount.get() - topCount;

    const splits = selections.flatMap((rect) =>
      splitCellSelectionRect({
        rect,
        rowTopCount: topCount,
        rowCenterCount: centerCount,
        colStartCount: state.internal.columnVisibleStartCount.get(),
        colCenterCount: state.internal.columnVisibleCenterCount.get(),
      }),
    );

    return splits;
  });
}
