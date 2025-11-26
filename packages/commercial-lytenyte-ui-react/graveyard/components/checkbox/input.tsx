import { forwardRef, type ComponentProps, type JSX } from "react";
import { Checkbox } from "../../headless/checkbox/index.js";
import { tw } from "../tw.js";

export const Input = forwardRef(
  (
    props: ComponentProps<typeof Checkbox.Container>,
    ref: JSX.IntrinsicElements["input"]["ref"],
  ) => {
    return (
      <Checkbox.Input
        {...props}
        ref={ref}
        className={tw(
          "absolute bottom-0 left-0 right-0 top-0 h-full w-full cursor-pointer opacity-0 focus:outline-none disabled:cursor-not-allowed",
          props.className,
        )}
      />
    );
  },
);
