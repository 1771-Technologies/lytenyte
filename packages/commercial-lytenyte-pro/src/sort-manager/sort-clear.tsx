import { useEvent, useSlot, type SlotComponent } from "@1771technologies/lytenyte-react-hooks";
import { forwardRef, type JSX } from "react";
import { useSortManagerCtx } from "./context";

export interface SortClearProps {
  readonly slot?: SlotComponent<{ onClear: () => void }>;
}

export const SortClear = forwardRef<
  HTMLDivElement,
  JSX.IntrinsicElements["button"] & SortClearProps
>(function SortClear({ slot, ...props }, forwarded) {
  const ctx = useSortManagerCtx();

  const onClear = useEvent(() => {
    if (ctx.mode) {
      ctx.grid.state.columnPivotModel.set((prev) => ({ ...prev, sorts: [] }));
    } else {
      ctx.grid.state.sortModel.set([]);
    }
  });

  const renderer = useSlot({
    props: [props],
    ref: forwarded,
    slot: slot ?? <button onClick={onClear} />,
    state: { onClear },
  });

  return renderer;
});
