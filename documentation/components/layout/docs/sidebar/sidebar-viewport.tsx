"use client";
import { ScrollViewport } from "@/components/ui/scroll-area";
import { cn } from "@/components/cn";
import { ScrollArea } from "radix-ui";

export function SidebarViewport(props: ScrollArea.ScrollAreaProps) {
  return (
    <ScrollArea.Root {...props} className={cn("h-full", props.className)}>
      <ScrollViewport
        className="overscroll-contain p-4"
        style={
          {
            "--sidebar-item-offset": "calc(var(--spacing) * 2)",
            maskImage:
              "linear-gradient(to bottom, transparent, white 12px, white calc(100% - 12px), transparent)",
          } as object
        }
      >
        {props.children}
      </ScrollViewport>
    </ScrollArea.Root>
  );
}
