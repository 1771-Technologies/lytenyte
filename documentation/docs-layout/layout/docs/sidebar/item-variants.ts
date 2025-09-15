"use client";

import { cva } from "class-variance-authority";

export const itemVariants = cva(
  "relative flex flex-row items-center gap-2 rounded-lg p-2 ps-(--sidebar-item-offset) text-start text-fd-muted-foreground [overflow-wrap:anywhere] [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      active: {
        true: "bg-fd-primary/10 text-fd-primary",
        false:
          "transition-colors hover:bg-fd-accent/50 hover:text-fd-accent-foreground/80 hover:transition-none",
      },
    },
  }
);
