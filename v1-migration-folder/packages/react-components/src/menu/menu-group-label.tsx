import { useSlot, type SlotComponent } from "@1771technologies/lytenyte-react-hooks";
import { forwardRef, type JSX } from "react";
import { useGroupId } from "./contexts/context-id.js";

export interface MenuGroupLabelProps {
  readonly as?: SlotComponent;
}

export const MenuGroupLabel = forwardRef<
  HTMLDivElement,
  JSX.IntrinsicElements["div"] & MenuGroupLabelProps
>(function MenuGroupLabel({ as, ...props }, forwarded) {
  const internalProps: JSX.IntrinsicElements["div"] = {
    role: "presentation",
    id: useGroupId(),
  };
  const slot = useSlot({
    props: [internalProps, props],
    ref: forwarded,
    slot: as ?? <div />,
  });

  return slot;
});
