"use client";
import { type ComponentProps } from "react";
import { useSidebar } from "fumadocs-ui/contexts/sidebar";
import { cn } from "@/docs-layout/cn";

export function LayoutBody(props: ComponentProps<"main">) {
  const { collapsed } = useSidebar();

  return (
    <main
      id="nd-docs-layout"
      {...props}
      className={cn(
        "pt-(--fd-nav-height) fd-notebook-layout flex flex-1 flex-col",
        !collapsed && "mx-(--fd-layout-offset)",
        props.className,
      )}
      style={{
        ...props.style,
        paddingInlineStart: collapsed
          ? "min(calc(100vw - var(--fd-page-width)), var(--fd-sidebar-width))"
          : "var(--fd-sidebar-width)",
      }}
    >
      {props.children}
    </main>
  );
}
