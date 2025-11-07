import { forwardRef, type ComponentProps, type JSX } from "react";
import { Menu as M } from "../../components-headless/menu/index.js";
import { tw } from "../tw.js";
import { buttonStyles, type ButtonProps } from "../button.js";

export const Trigger = forwardRef(
  (
    {
      kind = "tertiary",
      size = "default",
      ...props
    }: ComponentProps<typeof M.Trigger> & ButtonProps,
    ref: JSX.IntrinsicElements["button"]["ref"],
  ) => {
    return (
      <M.Trigger
        {...props}
        ref={ref}
        className={tw(buttonStyles({ kind, size }), props.className)}
      />
    );
  },
);
