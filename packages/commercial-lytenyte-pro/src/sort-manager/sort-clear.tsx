import { useEvent, useSlot, type SlotComponent } from "@1771technologies/lytenyte-react-hooks";
import { forwardRef, type JSX } from "react";
import { useSortManagerCtx } from "./context";

export interface SortClearProps {
  readonly as?: SlotComponent<{ onClear: () => void }>;
}

export const SortClear = forwardRef<
  HTMLDivElement,
  JSX.IntrinsicElements["button"] & SortClearProps
>(function SortClear({ as, ...props }, forwarded) {
  const ctx = useSortManagerCtx();

  const onClear = useEvent(() => {
    if (ctx.mode) {
      ctx.grid.state.columnPivotModel.set((prev) => ({ ...prev, sorts: [] }));
    } else {
      ctx.grid.state.sortModel.set([]);
    }
  });

  const renderer = useSlot({
    props: [typeof as !== "function" ? { onClick: onClear } : {}, props],
    ref: forwarded,
    slot: as ?? <button />,
    state: { onClear },
  });

  return renderer;
});
