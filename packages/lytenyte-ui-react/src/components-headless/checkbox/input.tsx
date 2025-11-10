import { forwardRef, useContext, type JSX } from "react";
import { context } from "./root.js";

const InputBase = (
  props: JSX.IntrinsicElements["input"],
  ref: JSX.IntrinsicElements["input"]["ref"],
) => {
  const ctx = useContext(context);

  return (
    <input
      {...props}
      type="checkbox"
      checked={ctx.checked}
      onChange={(ev) => {
        props.onChange?.(ev);
        if (ev.isPropagationStopped()) return;

        ctx.onCheckedChange?.(ev.target.checked);
      }}
      ref={ref}
    ></input>
  );
};

export const Input = forwardRef(InputBase);
