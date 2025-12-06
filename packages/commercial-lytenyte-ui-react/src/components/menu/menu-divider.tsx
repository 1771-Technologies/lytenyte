import { forwardRef, type JSX } from "react";

const MenuDividerImpl = (props: MenuDivider.Props, ref: MenuDivider.Props["ref"]) => {
  return <div {...props} role="separator" data-ln-menu-separator ref={ref}></div>;
};

export const MenuDivider = forwardRef(MenuDividerImpl);

export namespace MenuDivider {
  export type Props = JSX.IntrinsicElements["div"];
}
