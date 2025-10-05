import { forwardRef, type JSX } from "react";
import { useSortManagerCtx } from "./context.js";
import { itemsWithIdToMap } from "@1771technologies/lytenyte-js-utils";
import { sortItemsToSortModel } from "./utils/sort-item-to-sort-model.js";
import { useEvent, useSlot, type SlotComponent } from "@1771technologies/lytenyte-core/yinternal";

export interface SortApplyProps {
  readonly as?: SlotComponent<{ onApply: () => void }>;
}

export const SortApply = forwardRef<
  HTMLDivElement,
  JSX.IntrinsicElements["button"] & SortApplyProps
>(function SortApply({ as, ...props }, forwarded) {
  const ctx = useSortManagerCtx();

  const onApply = useEvent(() => {
    const lookup = itemsWithIdToMap(
      ctx.mode ? ctx.grid.state.columnPivotColumns.get() : ctx.grid.state.columns.get(),
    );

    const model = sortItemsToSortModel(ctx.sortItems, lookup);

    if (ctx.mode) ctx.grid.state.columnPivotModel.set((prev) => ({ ...prev, sort: model }));
    else ctx.grid.state.sortModel.set(model);
  });

  const renderer = useSlot({
    props: [typeof as !== "function" ? { onClick: onApply } : {}, props],
    ref: forwarded,
    slot: as ?? <button />,
    state: { onApply },
  });

  return renderer;
});
