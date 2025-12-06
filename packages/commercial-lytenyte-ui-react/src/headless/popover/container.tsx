import { forwardRef } from "react";
import { Container } from "../dialog/index.parts.js";

const PopoverContainerBase = (props: Container.Props, ref: Container.Props["ref"]) => {
  return <Container {...props} ref={ref} data-ln-popover />;
};

export const PopoverContainer = forwardRef(PopoverContainerBase);

export namespace PopoverContainer {
  export type Props = Container.Props;
}
