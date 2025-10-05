import { forwardRef, useMemo, type JSX } from "react";
import { useColumnItemContext } from "./context.js";
import { useSlot, type SlotComponent } from "@1771technologies/lytenyte-core/yinternal";

export interface LabelProps {
  readonly as?: SlotComponent;
}

export const Label = forwardRef<HTMLDivElement, JSX.IntrinsicElements["div"] & LabelProps>(
  function Label({ as, ...props }, forwarded) {
    const { item } = useColumnItemContext();

    const label = useMemo(() => {
      if (item.kind == "branch") return item.id.split("#").at(-2);

      return item.data.name ?? item.data.id;
    }, [item]);

    const rendered = useSlot({
      props: [{ children: label }, props],
      ref: forwarded,
      slot: as ?? <div />,
    });

    return rendered;
  },
);
