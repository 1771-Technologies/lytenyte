"use client";

import { Tooltip as TooltipPrimitive } from "radix-ui";
import * as React from "react";
import { cn } from "./cn.js";

const TooltipProvider = TooltipPrimitive.Provider;
const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
  React.ComponentRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      side="bottom"
      className={cn(
        "origin-(--radix-popover-content-transform-origin) z-50 rounded-lg border border-gray-200 bg-gray-100 p-2 text-sm text-gray-800 shadow-lg backdrop-blur-lg focus-visible:outline-none dark:border-gray-100 dark:bg-gray-200",
        "transition-opacity data-[state=closed]:opacity-0 data-[state=open]:opacity-100",
        className,
      )}
      {...props}
    >
      {props.children}
      <TooltipPrimitive.Arrow className="fill-gray-200 stroke-gray-100"></TooltipPrimitive.Arrow>
    </TooltipPrimitive.Content>
  </TooltipPrimitive.Portal>
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent };
