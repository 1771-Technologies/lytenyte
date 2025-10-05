import { forwardRef, type JSX } from "react";
import { useSortRowCtx } from "./context.js";
import { useSlot, type SlotComponent } from "@1771technologies/lytenyte-core/yinternal";

export interface SortRemoveProps {
  readonly as?: SlotComponent<{ onRemove: () => void }>;
}

export const SortRemove = forwardRef<
  HTMLDivElement,
  JSX.IntrinsicElements["button"] & SortRemoveProps
>(function SortRemove({ as, ...props }, forwarded) {
  const row = useSortRowCtx();

  const renderer = useSlot({
    props: [typeof as !== "function" ? { onClick: row.onDelete } : {}, props],
    ref: forwarded,
    slot: as ?? <button>x</button>,
    state: { onAdd: row.onDelete },
  });

  return renderer;
});
