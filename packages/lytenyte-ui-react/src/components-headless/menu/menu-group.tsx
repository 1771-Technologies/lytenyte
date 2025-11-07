import { forwardRef, type JSX } from "react";

const MenuGroupBase = (
  props: JSX.IntrinsicElements["div"],
  ref: JSX.IntrinsicElements["div"]["ref"],
) => {
  return <div {...props} role="group" ref={ref}></div>;
};

export const MenuGroup = forwardRef(MenuGroupBase);
