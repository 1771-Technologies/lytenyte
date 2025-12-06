import { forwardRef, type JSX } from "react";

const MenuGroupBase = (props: MenuGroup.Props, ref: MenuGroup.Props["ref"]) => {
  return <div {...props} role="group" ref={ref}></div>;
};

export const MenuGroup = forwardRef(MenuGroupBase);

export namespace MenuGroup {
  export type Props = JSX.IntrinsicElements["div"];
}
