"use client";

import { type ComponentProps } from "react";
import { Link } from "waku";
import { tw } from "../utils";

export function NavTreeLink({
  isLeaf,
  path,
  ...props
}: ComponentProps<typeof Link> & { isLeaf?: boolean; path: string }) {
  const isActive = path === props.to;

  return (
    <Link
      {...props}
      className={tw(
        "hover:text-primary-600 flex items-center transition-colors",
        isActive && "text-primary-500 hover:text-primary-500 font-semibold",
        isLeaf &&
          "hover:before:bg-primary-400 relative before:absolute before:-left-3.5 before:h-full before:w-px before:bg-gray-200 before:transition-colors before:content-['']",
        isLeaf && isActive && "before:bg-primary-500 hover:before:bg-primary-500",
        props.className,
      )}
    />
  );
}
