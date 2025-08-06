import { useSlot, type SlotComponent } from "@1771technologies/lytenyte-react-hooks";
import { forwardRef, type JSX } from "react";
import { useSortRowCtx } from "./context";

export interface SortAddProps {
  readonly slot?: SlotComponent<{ onAdd: () => void; disabled: boolean }>;
}

export const SortAdd = forwardRef<HTMLDivElement, JSX.IntrinsicElements["button"] & SortAddProps>(
  function SortAdd({ slot, ...props }, forwarded) {
    const row = useSortRowCtx();

    const renderer = useSlot({
      props: [props],
      ref: forwarded,
      slot: slot ?? (
        <button onClick={row.onAdd} disabled={!row.canAdd}>
          +
        </button>
      ),
      state: { onAdd: row.onAdd, disabled: !row.canAdd },
    });

    return renderer;
  },
);
