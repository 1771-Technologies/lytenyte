import { forwardRef, type ComponentProps, type JSX } from "react";
import { Menu as M } from "../../headless/menu/index.js";
import { tw } from "../tw.js";

export const ComboOption = forwardRef(
  (props: ComponentProps<typeof M.ComboOption>, ref: JSX.IntrinsicElements["div"]["ref"]) => {
    return (
      <M.ComboOption
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
