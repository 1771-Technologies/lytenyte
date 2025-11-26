import { forwardRef, type ComponentProps, type JSX } from "react";
import { Menu as M } from "../../headless/menu/index.js";
import { tw } from "../tw.js";

export const SubmenuContainer = forwardRef(
  (props: ComponentProps<typeof M.SubmenuContainer>, ref: JSX.IntrinsicElements["div"]["ref"]) => {
    return (
      <M.SubmenuContainer
        {...props}
        ref={ref}
        className={tw(
          "overflow-visible rounded-lg border border-gray-300/50 bg-gray-100 px-1 py-1 shadow-lg backdrop:opacity-0 dark:shadow-gray-400/10",
          props.className,
        )}
      />
    );
  },
);
