import { forwardRef, type JSX } from "react";
import { tw } from "./tw.js";
import { cva, type VariantProps } from "../external/cva.js";

// eslint-disable-next-line react-refresh/only-export-components
export const buttonStyles = cva(
  "h-11 px-3 rounded-lg flex items-center text-sm font-semibold tracking-tight transition-[background-color,transform] cursor-pointer disabled:cursor-not-allowed not-disabled:active:scale-[0.98] focus-visible:outline focus-visible:-outline-offset-1 focus-visible:outline-primary-500",
  {
    variants: {
      kind: {
        primary:
          "bg-gray-950 text-gray-50 hover:bg-gray-900 border border-gray-950 disabled:bg-gray-800 disabled:text-gray-400 disabled:border-gray-800",
        secondary:
          "bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300 dark:shadow-[inset_0_1px_1px_0_rgba(159,224,216,0.25),0_2px_2px_0_rgba(4,19,18,0.22),inset_0_0_11px_0_rgba(212,242,240,0.12)] disabled:text-gray-500 disabled:hover:bg-transparent disabled:bg-border-300 disabled:shadow-none",
        tertiary:
          "bg-gray-300/50 text-gray-900 border border-transparent hover:bg-gray-300/80 disabled:bg-gray-300/30 disabled:text-gray-500",
      },

      size: {
        default: "h-8",
        medium: "h-9",
        large: "h-11",
        icon: "h-8 w-8 px-0 justify-center",
      },
    },
  },
);

export type ButtonProps = VariantProps<typeof buttonStyles>;

const ButtonImpl = (
  {
    kind = "primary",
    size = "default",
    ...props
  }: Omit<JSX.IntrinsicElements["button"], "ref"> & ButtonProps,
  forwarded: JSX.IntrinsicElements["button"]["ref"],
) => {
  return (
    <button
      {...props}
      ref={forwarded}
      className={tw(buttonStyles({ kind, size }), props.className)}
    />
  );
};

export const Button = forwardRef(ButtonImpl);
