"use client";

import { cn } from "@/components/cn";
import { useOnChange } from "fumadocs-core/utils/use-on-change";
import { useSidebar } from "fumadocs-ui/contexts/sidebar";
import { ComponentProps, useRef, useState } from "react";

export function SidebarContent(props: ComponentProps<"aside">) {
  const { collapsed } = useSidebar();
  const [hover, setHover] = useState(false);
  const timerRef = useRef(0);
  const closeTimeRef = useRef(0);

  useOnChange(collapsed, () => {
    setHover(false);
    closeTimeRef.current = Date.now() + 150;
  });

  return (
    <aside
      id="nd-sidebar"
      {...props}
      data-collapsed={collapsed}
      className={cn(
        "rtl:right-(--removed-body-scroll-bar-size,0) top-(--fd-sidebar-top) fixed left-0 flex flex-col items-end rtl:left-auto",
        "bottom-(--fd-sidebar-margin) bg-fd-card *:w-(--fd-sidebar-width) z-20 border-e text-sm duration-0 max-lg:hidden",
        collapsed && [
          "translate-x-(--fd-sidebar-offset) rtl:-translate-x-(--fd-sidebar-offset) rounded-xl border",
          hover ? "z-50 shadow-lg" : "opacity-0",
        ],
        props.className,
      )}
      style={
        {
          ...props.style,
          // "--fd-sidebar-offset": hover ? "calc(var(--spacing) * 2)" : "calc(16px - 100%)",
          "--fd-sidebar-margin": collapsed ? "0.5rem" : "0px",
          "--fd-sidebar-top": `calc(var(--fd-banner-height) + var(--fd-nav-height) + var(--fd-sidebar-margin))`,
          width: collapsed
            ? "var(--fd-sidebar-width)"
            : "calc(var(--spacing) + var(--fd-sidebar-width) + var(--fd-layout-offset))",
        } as object
      }
      onPointerEnter={(e) => {
        if (!collapsed || e.pointerType === "touch" || closeTimeRef.current > Date.now()) return;
        window.clearTimeout(timerRef.current);
        setHover(true);
      }}
      onPointerLeave={(e) => {
        if (!collapsed || e.pointerType === "touch") return;
        window.clearTimeout(timerRef.current);

        timerRef.current = window.setTimeout(
          () => {
            setHover(false);
            closeTimeRef.current = Date.now() + 150;
          },
          Math.min(e.clientX, document.body.clientWidth - e.clientX) > 100 ? 0 : 500,
        );
      }}
    >
      {props.children}
    </aside>
  );
}
