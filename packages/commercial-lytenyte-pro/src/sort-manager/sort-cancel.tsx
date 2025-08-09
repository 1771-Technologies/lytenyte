import { useEvent, useSlot, type SlotComponent } from "@1771technologies/lytenyte-react-hooks";
import { forwardRef, type JSX } from "react";
import { useSortManagerCtx } from "./context";
import { sortModelToSortItems } from "./utils/sort-model-to-sort-items";
import { itemsWithIdToMap } from "@1771technologies/lytenyte-js-utils";

export interface SortCancelProps {
  readonly as?: SlotComponent<{ onCancel: () => void }>;
}

export const SortCancel = forwardRef<
  HTMLDivElement,
  JSX.IntrinsicElements["button"] & SortCancelProps
>(function SortCancel({ as, ...props }, forwarded) {
  const ctx = useSortManagerCtx();

  const onCancel = useEvent(() => {
    const model = ctx.mode
      ? ctx.grid.state.columnPivotModel.get().sorts
      : ctx.grid.state.sortModel.get();

    const lookup = itemsWithIdToMap(
      ctx.mode ? ctx.grid.state.columnPivotColumns.get() : ctx.grid.state.columns.get(),
    );

    const state = sortModelToSortItems(model, lookup);

    if (!state.length) ctx.setSortItems([{ isCustom: false, sortDirection: "ascending" }]);
    else ctx.setSortItems(state);
  });

  const renderer = useSlot({
    props: [typeof as !== "function" ? { onClick: onCancel } : {}, props],
    ref: forwarded,
    slot: as ?? <button />,
    state: { onCancel },
  });

  return renderer;
});
