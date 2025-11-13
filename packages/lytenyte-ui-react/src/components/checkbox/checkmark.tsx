import { forwardRef, type ComponentProps, type JSX } from "react";
import { Checkbox } from "../../components-headless/checkbox/index.js";
import { tw } from "../tw.js";

export const Checkmark = forwardRef(
  (
    { children, ...props }: ComponentProps<typeof Checkbox.Container>,
    ref: JSX.IntrinsicElements["input"]["ref"],
  ) => {
    return (
      <Checkbox.Checkmark
        {...props}
        ref={ref}
        className={tw(
          "group pointer-events-none flex items-center justify-center text-white data-[ln-disabled=true]:text-gray-500",
          props.className,
        )}
      >
        {children ? (
          children
        ) : (
          <>
            <span className="iconify ph--check-fat-fill hidden size-3 group-data-[ln-checked='true']:block"></span>
            <span className="iconify ph--minus-bold hidden size-4 group-data-[ln-disabled=false]:group-data-[ln-checked='false']:group-data-[ln-indeterminate='true']:block" />
            <span className="iconify ph--prohibit hidden size-4 group-data-[ln-disabled=true]:group-data-[ln-checked=false]:group-data-[ln-indeterminate=false]:block" />
          </>
        )}
      </Checkbox.Checkmark>
    );
  },
);
