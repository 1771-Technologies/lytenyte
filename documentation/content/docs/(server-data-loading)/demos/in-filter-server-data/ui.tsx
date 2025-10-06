"use client";
import { Popover as PopoverPrimitive, Checkbox as C } from "radix-ui";
import type { ClassValue } from "clsx";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { forwardRef } from "react";
import { CheckIcon } from "@radix-ui/react-icons";

const Popover = PopoverPrimitive.Root;

const PopoverTrigger = PopoverPrimitive.Trigger;

const PopoverContent = forwardRef<
  React.ComponentRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      side="bottom"
      {...props}
      className={tw(
        "bg-ln-gray-10 text-ln-gray-80 data-[state=closed]:animate-popover-out data-[state=open]:animate-popover-in origin-(--radix-popover-content-transform-origin) z-50 min-w-[240px] max-w-[98vw] rounded-xl border p-2 text-sm shadow-lg backdrop-blur-lg focus-visible:outline-none",
        props.className,
      )}
    />
  </PopoverPrimitive.Portal>
));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

const PopoverClose = PopoverPrimitive.PopoverClose;

export { Popover, PopoverTrigger, PopoverContent, PopoverClose };

export function tw(...c: ClassValue[]) {
  return twMerge(clsx(...c));
}

export function GridInput(props: React.JSX.IntrinsicElements["input"]) {
  return (
    <input
      {...props}
      className={tw(
        "data-[placeholder]:text-ln-gray-70 flex h-[28px] min-w-full items-center justify-between rounded-lg px-2 text-sm shadow-[0_1.5px_2px_0px_var(--lng1771-gray-30),0_0_0_1px_var(--lng1771-gray-30)] md:min-w-[160px]",
        "bg-ln-gray-00 text-ln-gray-90 gap-2",
        "focus-visible:shadow-[0_1.5px_2px_0px_var(--lng1771-primary-50),0_0_0_1px_var(--lng1771-primary-50)] focus-visible:outline-none",
        "data-[placeholder]:data-[disabled]:text-ln-gray-50 data-[disabled]:shadow-[0_1.5px_2px_0px_var(--lng1771-gray-20),0_0_0_1px_var(--lng1771-gray-20)]",
        "disabled:text-ln-gray-50 disabled:shadow-[0_1.5px_2px_0px_var(--lng1771-gray-20),0_0_0_1px_var(--lng1771-gray-20)]",
        props.className,
      )}
    />
  );
}

export function Checkbox({ children, ...props }: C.CheckboxProps) {
  return (
    <label className="text-md text-light flex items-center gap-2">
      <C.Root
        {...(props as any)}
        type="button"
        className={tw(
          "h-4 w-4 rounded border border-gray-400",
          props.checked && "bg-ln-primary-50 border-ln-primary-70",
          props.className,
        )}
      >
        <C.CheckboxIndicator className="flex items-center justify-center text-white">
          <CheckIcon />
        </C.CheckboxIndicator>
      </C.Root>
      {children}
    </label>
  );
}
