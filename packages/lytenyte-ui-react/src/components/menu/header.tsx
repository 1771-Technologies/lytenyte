import { forwardRef, type ComponentProps, type JSX } from "react";
import { Menu as M } from "../../components-headless/menu/index.js";
import { tw } from "../tw.js";

export const Header = forwardRef(
  (props: ComponentProps<typeof M.Header>, ref: JSX.IntrinsicElements["div"]["ref"]) => {
    return (
      <M.Header
        {...props}
        ref={ref}
        className={tw("px-2 text-xs uppercase tracking-wide", props.className)}
      />
    );
  },
);
