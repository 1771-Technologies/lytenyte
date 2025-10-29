"use client";
import { usePathname } from "fumadocs-core/framework";
import type { LinkProps } from "fumadocs-core/link";
import Link from "fumadocs-core/link";
import type { ReactNode } from "react";
import { useInternalContext } from "./internal-context";
import { isActive } from "@/components/is-active";
import { itemVariants } from "./item-variants";
import { cn } from "@/components/cn";
import { ExternalLink } from "lucide-react";

export function SidebarItem({
  icon,
  ...props
}: LinkProps & {
  icon?: ReactNode;
}) {
  const pathname = usePathname();
  const active = props.href !== undefined && isActive(props.href, pathname, false);
  const { prefetch } = useInternalContext();

  return (
    <Link
      {...props}
      data-active={active}
      className={cn(itemVariants({ active }), props.className)}
      prefetch={prefetch}
    >
      {props.children}
      {icon ?? (props.external ? <ExternalLink /> : null)}
    </Link>
  );
}
