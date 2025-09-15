"use client";
import { buttonVariants } from "@/docs-layout/ui/button";
import { cn } from "@/docs-layout/cn";
import { useSidebar } from "fumadocs-ui/contexts/sidebar";
import { SidebarIcon } from "lucide-react";
import { ComponentProps } from "react";

export function NavbarSidebarTrigger({ className, ...props }: ComponentProps<"button">) {
  const { setOpen } = useSidebar();

  return (
    <button
      {...props}
      className={cn(
        buttonVariants({
          color: "ghost",
          size: "icon-sm",
          className,
        })
      )}
      onClick={() => setOpen((prev) => !prev)}
    >
      <SidebarIcon />
    </button>
  );
}
