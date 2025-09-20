"use client";
import { cn } from "@/components/cn";
import { ComponentProps } from "react";

export function SidebarFooter(props: ComponentProps<"div">) {
  return (
    <div {...props} className={cn("flex flex-col border-t p-4 pt-2", props.className)}>
      {props.children}
    </div>
  );
}
