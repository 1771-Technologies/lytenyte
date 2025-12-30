"use client";
import type { ClassValue } from "clsx";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

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
