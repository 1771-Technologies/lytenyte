"use client";
import { cn } from "@/components/cn";
import { useNav } from "fumadocs-ui/contexts/layout";
import { useSidebar } from "fumadocs-ui/contexts/sidebar";
import type { ComponentProps } from "react";

export function Navbar({ mode, ...props }: ComponentProps<"header"> & { mode: "top" | "auto" }) {
  const { open, collapsed } = useSidebar();
  const { isTransparent } = useNav();

  return (
    <header
      id="nd-subnav"
      {...props}
      className={cn(
        "top-(--fd-banner-height) right-(--removed-body-scroll-bar-size,0) px-(--fd-layout-offset) h-(--fd-nav-height) fixed left-0 z-10 flex flex-col backdrop-blur-sm transition-colors",
        (!isTransparent || open) && "bg-fd-background/80",
        mode === "auto" &&
          !collapsed &&
          "ps-[calc(var(--fd-layout-offset)+var(--fd-sidebar-width))]",
        props.className,
      )}
    >
      {props.children}
    </header>
  );
}
