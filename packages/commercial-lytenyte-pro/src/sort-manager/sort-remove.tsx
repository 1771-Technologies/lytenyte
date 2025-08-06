import { useSlot, type SlotComponent } from "@1771technologies/lytenyte-react-hooks";
import { forwardRef, type JSX } from "react";
import { useSortRowCtx } from "./context";

export interface SortRemoveProps {
  readonly slot?: SlotComponent<{ onRemove: () => void }>;
}

export const SortRemove = forwardRef<
  HTMLDivElement,
  JSX.IntrinsicElements["button"] & SortRemoveProps
>(function SortRemove({ slot, ...props }, forwarded) {
  const row = useSortRowCtx();

  const renderer = useSlot({
    props: [props],
    ref: forwarded,
    slot: slot ?? <button onClick={row.onDelete}>x</button>,
    state: { onAdd: row.onDelete },
  });

  return renderer;
});
