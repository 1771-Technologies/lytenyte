import { forwardRef } from "react";
import { DialogContainer } from "../dialog/container.js";

const PopoverContainerBase = (props: DialogContainer.Props, ref: DialogContainer.Props["ref"]) => {
  return (
    <DialogContainer
      {...props}
      ref={ref}
      data-ln-popover={(props as any)["data-ln-menu-popover"] ? undefined : true}
    />
  );
};

export const PopoverContainer = forwardRef(PopoverContainerBase);

export namespace PopoverContainer {
  export type Props = DialogContainer.Props;
}
