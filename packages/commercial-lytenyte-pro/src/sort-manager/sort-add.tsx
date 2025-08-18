import { useSlot, type SlotComponent } from "@1771technologies/lytenyte-react-hooks";
import { forwardRef, type JSX } from "react";
import { useSortRowCtx } from "./context";

export interface SortAddProps {
  readonly as?: SlotComponent<{ onAdd: () => void; disabled: boolean }>;
}

export const SortAdd = forwardRef<HTMLDivElement, JSX.IntrinsicElements["button"] & SortAddProps>(
  function SortAdd({ as: as, ...props }, forwarded) {
    const row = useSortRowCtx();

    const renderer = useSlot({
      props: [typeof as !== "function" ? { onClick: row.onAdd, disabled: !row.canAdd } : {}, props],
      ref: forwarded,
      slot: as ?? <button>+</button>,
      state: { onAdd: row.onAdd, disabled: !row.canAdd },
    });

    return renderer;
  },
);
