import { forwardRef, type ComponentProps, type JSX } from "react";
import { Menu as M } from "../../components-headless/menu/index.js";
import { tw } from "../tw.js";

export const ComboInput = forwardRef(
  (props: ComponentProps<typeof M.ComboInput>, ref: JSX.IntrinsicElements["input"]["ref"]) => {
    return (
      <M.ComboInput
        placeholder="placeholder..."
        {...props}
        ref={ref}
        className={tw(
          "rounded-lg border border-gray-300 bg-gray-50 px-2 py-1 focus-visible:border-gray-300 focus-visible:outline-none",
          props.className,
        )}
      />
    );
  },
);
