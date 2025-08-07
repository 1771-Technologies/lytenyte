import { useEvent, useSlot, type SlotComponent } from "@1771technologies/lytenyte-react-hooks";
import { forwardRef, type JSX } from "react";
import { useSortManagerCtx } from "./context";
import { itemsWithIdToMap } from "@1771technologies/lytenyte-js-utils";
import { sortItemsToSortModel } from "./utils/sort-item-to-sort-model";

export interface SortApplyProps {
  readonly slot?: SlotComponent<{ onApply: () => void }>;
}

export const SortApply = forwardRef<
  HTMLDivElement,
  JSX.IntrinsicElements["button"] & SortApplyProps
>(function SortApply({ slot, ...props }, forwarded) {
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
    props: [props],
    ref: forwarded,
    slot: slot ?? <button onClick={onApply} />,
    state: { onApply },
  });

  return renderer;
});
