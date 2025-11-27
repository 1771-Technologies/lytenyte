import { forwardRef, type JSX } from "react";

const MenuDividerImpl = (
  props: JSX.IntrinsicElements["div"],
  ref: JSX.IntrinsicElements["div"]["ref"],
) => {
  return <div {...props} role="separator" ref={ref}></div>;
};

export const MenuDivider = forwardRef(MenuDividerImpl);
