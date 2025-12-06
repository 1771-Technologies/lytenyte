import { forwardRef } from "react";
import { PopoverContainer as Container } from "../popover/container.js";

const MenuPopoverBase = (props: Container.Props, ref: Container.Props["ref"]) => {
  return <Container {...props} ref={ref} data-ln-menu-popover />;
};

export const MenuPopover = forwardRef(MenuPopoverBase);

export namespace MenuPopover {
  export type Props = Container.Props;
}
