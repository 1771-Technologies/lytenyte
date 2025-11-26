import { forwardRef, type ComponentProps, type JSX } from "react";
import { Checkbox } from "../../headless/checkbox/index.js";
import { tw } from "../tw.js";

export const Container = forwardRef(
  (props: ComponentProps<typeof Checkbox.Container>, ref: JSX.IntrinsicElements["div"]["ref"]) => {
    return (
      <Checkbox.Container
        {...props}
        ref={ref}
        className={tw(
          "flex h-5 w-5 cursor-pointer items-center justify-center overflow-hidden rounded-md border border-gray-300",
          "relative transition-[border,box-shadow,background-color] hover:shadow-[0px_0px_4px_rgba(0,_0,_0,_0.24)]",
          "focus-within:has-[:focus-visible]:outline-primary-500 focus-within:has-[:focus-visible]:outline focus-within:has-[:focus-visible]:outline-offset-1",
          "data-[ln-checked=true]:bg-primary-500 data-[ln-checked=true]:border-primary-500",
          "data-[ln-indeterminate=true]:bg-primary-500 data-[ln-indeterminate=true]:border-primary-500",
          "data-[ln-disabled=true]:data-[ln-checked=true]:border-gray-300 data-[ln-disabled=true]:data-[ln-indeterminate=true]:border-gray-300 data-[ln-disabled=true]:bg-gray-300",
          "data-[ln-disabled=true]:cursor-not-allowed",
          props.className,
        )}
      />
    );
  },
);
