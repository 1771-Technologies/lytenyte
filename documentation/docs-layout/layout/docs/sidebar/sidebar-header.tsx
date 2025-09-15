"use client";
import { cn } from "@/docs-layout/cn";
import { ComponentProps } from "react";

export function SidebarHeader(props: ComponentProps<"div">) {
  return (
    <div {...props} className={cn("flex flex-col gap-3 p-4 pb-2", props.className)}>
      {props.children}
    </div>
  );
}
