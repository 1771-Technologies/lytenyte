import { forwardRef, type ComponentProps, type JSX } from "react";
import { Menu as M } from "../../components-headless/menu/index.js";
import { tw } from "../tw.js";

export const Item = forwardRef(
  (props: ComponentProps<typeof M.Item>, ref: JSX.IntrinsicElements["div"]["ref"]) => {
    return (
      <M.Item
        {...props}
        ref={ref}
        className={tw(
          "ln-active:bg-gray-300/40 cursor-pointer select-none",
          "text-nowrap rounded px-2 py-0.5 focus-visible:outline-none",
          props.className,
        )}
      />
    );
  },
);
