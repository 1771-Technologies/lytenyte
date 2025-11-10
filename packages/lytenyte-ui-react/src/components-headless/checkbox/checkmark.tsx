import { forwardRef, useContext, type JSX } from "react";
import { context } from "./root.js";

const CheckmarkBase = (
  props: JSX.IntrinsicElements["div"],
  ref: JSX.IntrinsicElements["div"]["ref"],
) => {
  const ctx = useContext(context);
  return (
    <div
      {...props}
      ref={ref}
      data-ln-checked={ctx.checked}
      data-ln-indeterminate={ctx.indeterminate}
    />
  );
};

export const Checkmark = forwardRef(CheckmarkBase);
