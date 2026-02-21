"use client";

import { isTabActive } from "@/components/is-active";
import { usePathname } from "fumadocs-core/framework";
import type { ComponentProps } from "react";
import { useMemo } from "react";
import { LayoutTab } from "./layout-tab";
import { cn } from "@/components/cn";
import type { Option } from "@/components/root-toggle";
import { VersionPicker } from "./version-picker";

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
    return options.findLast((option) => {
      if (option.matchSelected) {
        return (
          option.matchSelected.match.some((c) => pathname.startsWith(c)) &&
          !option.matchSelected.ignore.some((c) => pathname.startsWith(c))
        );
      }

      return isTabActive(option, pathname);
    });
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
        <LayoutTab key={option.url} selected={selected === option} option={option} vertical={vertical} />
      ))}
      <div className="flex-1" />
      <div className="hidden h-full items-center justify-center lg:flex">
        <VersionPicker />
      </div>
    </div>
  );
}
