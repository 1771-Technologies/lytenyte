"use client";
import { useSidebar } from "fumadocs-ui/contexts/sidebar";
import type { ComponentProps } from "react";

export function SidebarTrigger({ children, ...props }: ComponentProps<"button">) {
  const { setOpen } = useSidebar();

  return (
    <button {...props} aria-label="Open Sidebar" onClick={() => setOpen((prev) => !prev)}>
      {children}
    </button>
  );
}
