import { forwardRef, type ComponentProps, type JSX } from "react";
import { Menu as M } from "../../headless/menu/index.js";
import { tw } from "../tw.js";

export const Popover = forwardRef(
  (props: ComponentProps<typeof M.Popover>, ref: JSX.IntrinsicElements["dialog"]["ref"]) => {
    return (
      <M.Popover
        {...props}
        ref={ref}
        className={tw(
          "overflow-visible rounded-lg border border-gray-300/50 bg-gray-100 px-1 py-1 shadow-lg backdrop:opacity-0 dark:shadow-gray-400/10",
          "ln-opening:opacity-0 ln-closing:opacity-0 ln-opening:scale-95 ln-closing:scale-95 transition-[opacity,scale]",
          props.className,
        )}
      />
    );
  },
);
