"use client";

import { isTabActive } from "@/components/is-active";
import { usePathname } from "fumadocs-core/framework";
import { ComponentProps, useMemo } from "react";
import { LayoutTab } from "./layout-tab";
import { cn } from "@/components/cn";
import { SidebarTab } from "fumadocs-ui/utils/get-sidebar-tabs";

export interface Option extends SidebarTab {
  props?: ComponentProps<"a">;
}

export function LayoutTabs({
  options,
  vertical,
  ...props
}: ComponentProps<"div"> & {
  options: Option[];
  vertical?: boolean;
}) {
  const pathname = usePathname();
  const selected = useMemo(() => {
    return options.findLast((option) => isTabActive(option, pathname));
  }, [options, pathname]);

  return (
    <div
      {...props}
      className={cn(
        "flex flex-row items-end gap-6 overflow-auto",
        vertical && "flex-col items-start gap-4",
        props.className,
      )}
    >
      {options.map((option) => (
        <LayoutTab
          key={option.url}
          selected={selected === option}
          option={option}
          vertical={vertical}
        />
      ))}
    </div>
  );
}
