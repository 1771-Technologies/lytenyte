"use client";

import { Collapsible } from "radix-ui";
import { useFolderContext } from "./folder-context";
import { CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { cn } from "@/components/cn";
import { itemVariants } from "./item-variants";

export function SidebarFolderTrigger({ className, ...props }: Collapsible.CollapsibleTriggerProps) {
  const { open } = useFolderContext();

  return (
    <CollapsibleTrigger
      className={cn(itemVariants({ active: false }), "w-full", className)}
      {...props}
    >
      {props.children}
      <ChevronDown
        data-icoj
        className={cn("ms-auto transition-transform", !open && "-rotate-90")}
      />
    </CollapsibleTrigger>
  );
}
