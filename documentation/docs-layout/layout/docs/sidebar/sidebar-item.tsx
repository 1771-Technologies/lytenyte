"use client";
import { usePathname } from "fumadocs-core/framework";
import Link, { LinkProps } from "fumadocs-core/link";
import { ReactNode } from "react";
import { useInternalContext } from "./internal-context";
import { isActive } from "@/docs-layout/is-active";
import { itemVariants } from "./item-variants";
import { cn } from "@/docs-layout/cn";
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
      {icon ?? (props.external ? <ExternalLink /> : null)}
      {props.children}
    </Link>
  );
}
