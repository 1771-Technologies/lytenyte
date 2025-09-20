"use client";
import { cn } from "@/components/cn";
import { ComponentProps } from "react";

export function SidebarSeparator(props: ComponentProps<"p">) {
  return (
    <p
      {...props}
      className={cn(
        "ps-(--sidebar-item-offset) mb-1.5 inline-flex items-center gap-2 px-2 empty:mb-0 [&_svg]:size-4 [&_svg]:shrink-0",
        props.className,
      )}
    >
      {props.children}
    </p>
  );
}
