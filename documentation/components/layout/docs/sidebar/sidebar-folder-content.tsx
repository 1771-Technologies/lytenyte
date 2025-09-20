"use client";

import { Collapsible } from "radix-ui";
import { Context, useInternalContext } from "./internal-context";
import { CollapsibleContent } from "@/components/ui/collapsible";
import { useMemo } from "react";
import { cn } from "@/components/cn";

export function SidebarFolderContent(props: Collapsible.CollapsibleContentProps) {
  const { level, ...ctx } = useInternalContext();

  return (
    <CollapsibleContent
      {...props}
      className={cn(
        "relative",
        level === 1 && [
          "before:bg-fd-border before:absolute before:inset-y-1 before:start-2.5 before:w-px before:content-['']",
          "**:data-[active=true]:before:content-[''] **:data-[active=true]:before:bg-fd-primary **:data-[active=true]:before:absolute **:data-[active=true]:before:w-px **:data-[active=true]:before:inset-y-2.5 **:data-[active=true]:before:start-2.5",
        ],
        props.className,
      )}
      style={
        {
          "--sidebar-item-offset": `calc(var(--spacing) * ${(level + 1) * 3})`,
          ...props.style,
        } as object
      }
    >
      <Context.Provider
        value={useMemo(
          () => ({
            ...ctx,
            level: level + 1,
          }),
          [ctx, level],
        )}
      >
        {props.children}
      </Context.Provider>
    </CollapsibleContent>
  );
}
