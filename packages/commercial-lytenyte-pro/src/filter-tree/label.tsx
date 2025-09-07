import { useSlot, type SlotComponent } from "@1771technologies/lytenyte-react-hooks";
import { forwardRef, useMemo, type JSX } from "react";
import { useTreeItemContext } from "./context.js";

export interface LabelProps {
  readonly as?: SlotComponent;
}

export const Label = forwardRef<HTMLDivElement, JSX.IntrinsicElements["div"] & LabelProps>(
  function Label({ as, ...props }, forwarded) {
    const { item } = useTreeItemContext();

    const label = useMemo(() => {
      if (item.kind == "branch") return item.branch.id.split("#").at(-1);

      return item.leaf.data.label ?? item.leaf.data.id;
    }, [item]);

    const rendered = useSlot({
      props: [{ children: label }, props],
      ref: forwarded,
      slot: as ?? <div />,
    });

    return rendered;
  },
);
