import { forwardRef, useContext, type JSX } from "react";
import { context } from "./root.js";

const InputBase = (
  props: Omit<JSX.IntrinsicElements["input"], "disabled" | "value" | "checked">,
  ref: JSX.IntrinsicElements["input"]["ref"],
) => {
  const ctx = useContext(context);

  return (
    <input
      {...props}
      type="checkbox"
      disabled={ctx.disabled}
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
