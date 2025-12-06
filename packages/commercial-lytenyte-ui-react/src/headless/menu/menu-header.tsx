import { forwardRef, type JSX } from "react";

const MenuHeaderBase = (props: MenuHeader.Props, ref: MenuHeader.Props["ref"]) => {
  return <div {...props} ref={ref}></div>;
};

export const MenuHeader = forwardRef(MenuHeaderBase);

export namespace MenuHeader {
  export type Props = JSX.IntrinsicElements["div"];
}
