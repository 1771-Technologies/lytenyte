import { useSlot, type SlotComponent } from "@1771technologies/lytenyte-react-hooks";
import { useColumnItemContext } from "./context";
import { forwardRef, useMemo, type JSX } from "react";

export interface LabelProps {
  readonly slot?: SlotComponent;
}

export const Label = forwardRef<HTMLDivElement, JSX.IntrinsicElements["div"] & LabelProps>(
  function Label({ slot, ...props }, forwarded) {
    const { item } = useColumnItemContext();

    const label = useMemo(() => {
      if (item.kind == "branch") return item.branch.id.split("#").at(-2);

      return item.leaf.data.name ?? item.leaf.data.id;
    }, [item]);

    const rendered = useSlot({
      props: [{ children: label }, props],
      ref: forwarded,
      slot: slot ?? <div />,
    });

    return rendered;
  },
);
