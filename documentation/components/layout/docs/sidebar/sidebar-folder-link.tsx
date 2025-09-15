"use client";

import { usePathname } from "fumadocs-core/framework";
import { useFolderContext } from "./folder-context";
import { useInternalContext } from "./internal-context";
import { isActive } from "@/components/is-active";
import Link, { LinkProps } from "fumadocs-core/link";
import { cn } from "@/components/cn";
import { ChevronDown } from "lucide-react";
import { itemVariants } from "./item-variants";

export function SidebarFolderLink(props: LinkProps) {
  const { open, setOpen } = useFolderContext();
  const { prefetch } = useInternalContext();

  const pathname = usePathname();
  const active = props.href !== undefined && isActive(props.href, pathname, false);

  return (
    <Link
      {...props}
      data-active={active}
      className={cn(itemVariants({ active }), "w-full", props.className)}
      onClick={(e) => {
        if (e.target instanceof Element && e.target.matches("[data-icon], [data-icon] *")) {
          setOpen(!open);
          e.preventDefault();
        } else {
          setOpen(active ? !open : true);
        }
      }}
      prefetch={prefetch}
    >
      {props.children}
      <ChevronDown
        data-icon
        className={cn("ms-auto transition-transform", !open && "-rotate-90")}
      />
    </Link>
  );
}
