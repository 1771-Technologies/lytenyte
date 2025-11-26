import { forwardRef, type JSX } from "react";

const MenuHeaderBase = (
  props: JSX.IntrinsicElements["div"],
  ref: JSX.IntrinsicElements["div"]["ref"],
) => {
  return <div {...props} ref={ref}></div>;
};

export const MenuHeader = forwardRef(MenuHeaderBase);
