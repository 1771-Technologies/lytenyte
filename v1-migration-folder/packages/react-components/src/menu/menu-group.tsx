import { useSlot, type SlotComponent } from "@1771technologies/lytenyte-react-hooks";
import { forwardRef, useId, type JSX } from "react";
import { GroupIdProvider } from "./contexts/context-id.js";

export interface MenuGroupProps {
  as?: SlotComponent;
}

export const MenuGroup = forwardRef<HTMLDivElement, JSX.IntrinsicElements["div"] & MenuGroupProps>(
  function MenuGroup({ as, ...props }, forwarded) {
    const id = useId();
    const internalProps: JSX.IntrinsicElements["div"] = {
      role: "group",
      "aria-labelledby": id,
    };

    const slot = useSlot({
      props: [internalProps, props],
      ref: forwarded,
      slot: as ?? <div />,
    });

    return <GroupIdProvider value={id}>{slot}</GroupIdProvider>;
  },
);
