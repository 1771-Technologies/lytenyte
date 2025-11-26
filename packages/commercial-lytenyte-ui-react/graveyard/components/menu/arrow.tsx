import { forwardRef, type JSX } from "react";
import { Menu as M } from "../../headless/menu/index.js";
import { tw } from "../tw.js";

export const Arrow = forwardRef(
  (props: JSX.IntrinsicElements["svg"], ref: JSX.IntrinsicElements["svg"]["ref"]) => {
    return (
      <M.Arrow
        {...props}
        ref={ref}
        className={tw(
          "absolute [&>path]:stroke-gray-300 [&>polygon]:fill-gray-100",
          "ln-placement-left:rotate-90 ln-placement-left:right-0 ln-placement-left:translate-x-[12px]",
          "ln-placement-right:rotate-270 ln-placement-right:left-0 ln-placement-right:-translate-x-[12px]",
          "ln-placement-top:rotate-180 ln-placement-top:bottom-0 ln-placement-top:translate-y-[8px]",
          "ln-placement-top:bottom-0 ln-placement-bottom:-translate-y-[12px]",
          props.className,
        )}
      />
    );
  },
);
