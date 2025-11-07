import { forwardRef, type ComponentProps, type JSX } from "react";
import { Menu as M } from "../../components-headless/menu/index.js";
import { tw } from "../tw.js";

export const Divider = forwardRef(
  (props: ComponentProps<typeof M.Divider>, ref: JSX.IntrinsicElements["div"]["ref"]) => {
    return (
      <M.Divider
        {...props}
        ref={ref}
        className={tw("-mx-1 my-1 h-px bg-gray-300", props.className)}
      />
    );
  },
);
