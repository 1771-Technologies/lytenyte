import { forwardRef, type ComponentProps, type JSX } from "react";
import { Menu as M } from "../../components-headless/menu/index.js";

export const ComboMenu = forwardRef(
  (props: ComponentProps<typeof M.ComboMenu>, ref: JSX.IntrinsicElements["div"]["ref"]) => {
    return <M.ComboMenu {...props} ref={ref} className={props.className} />;
  },
);
