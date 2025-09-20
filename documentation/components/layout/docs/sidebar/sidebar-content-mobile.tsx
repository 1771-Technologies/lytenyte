"use client";

import { cn } from "@/components/cn";
import { Presence } from "@radix-ui/react-presence";
import { useSidebar } from "fumadocs-ui/contexts/sidebar";
import { ComponentProps } from "react";

export function SidebarContentMobile({ className, children, ...props }: ComponentProps<"aside">) {
  const { open, setOpen } = useSidebar();
  const state = open ? "open" : "closed";

  return (
    <>
      <Presence present={open}>
        <div
          data-state={state}
          className="backdrop-blur-xs data-[state=open]:animate-fd-fade-in data-[state=closed]:animate-fd-fade-out fixed inset-0 z-40"
          onClick={() => setOpen(false)}
        />
      </Presence>
      <Presence present={open}>
        {({ present }) => (
          <aside
            id="nd-sidebar-mobile"
            {...props}
            data-state={state}
            className={cn(
              "bg-fd-background data-[state=open]:animate-fd-sidebar-in data-[state=closed]:animate-fd-sidebar-out fixed inset-y-0 end-0 z-40 flex w-[85%] max-w-[380px] flex-col border-s text-[15px] shadow-lg",
              !present && "invisible",
              className,
            )}
          >
            {children}
          </aside>
        )}
      </Presence>
    </>
  );
}
