import { cva, type VariantProps } from "class-variance-authority";
import type { JSX } from "react";
import { cn } from "../cn";
import type { LinkProps } from "next/link";
import Link from "next/link";

const variants = {
  primary: "bg-fd-primary text-fd-primary-foreground hover:bg-fd-primary/80",
  outline: "border hover:bg-fd-accent hover:text-fd-accent-foreground",
  ghost: "hover:bg-fd-accent hover:text-fd-accent-foreground",
  secondary:
    "border bg-fd-secondary text-fd-secondary-foreground hover:bg-fd-accent hover:text-fd-accent-foreground",
} as const;

export const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md p-2 text-sm font-medium transition-colors duration-100 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none cursor-pointer disabled:cursor-not-allowed",
  {
    variants: {
      variant: variants,
      // fumadocs use `color` instead of `variant`
      color: variants,
      size: {
        sm: "gap-1 px-2 py-1.5 text-xs",
        icon: "p-1.5 [&_svg]:size-5",
        "icon-sm": "p-1.5 [&_svg]:size-4.5",
        "icon-xs": "p-1 [&_svg]:size-4",
      },
    },
  },
);

export type ButtonProps = VariantProps<typeof buttonVariants>;

export function Button({
  variant,
  size,
  color,
  className,
  ...props
}: JSX.IntrinsicElements["button"] & ButtonProps) {
  return <button {...props} className={cn(buttonVariants({ variant, size, color }), className)} />;
}

export function LinkButton({
  variant,
  size,
  color,
  className,
  ...props
}: LinkProps & ButtonProps & JSX.IntrinsicElements["a"]) {
  return <Link {...props} className={cn(buttonVariants({ variant, size, color }), className)} />;
}
