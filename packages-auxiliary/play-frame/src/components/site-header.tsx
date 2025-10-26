import { Separator } from "@/components/ui/separator.js";
import { SidebarTrigger } from "@/components/ui/sidebar.js";
import { ModeToggle } from "@/components/mode-toggle.js";
import type { PropsWithChildren } from "react";

export function SiteHeader({ children, header }: PropsWithChildren<{ header: string }>) {
  return (
    <header className="h-(--header-height) group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) flex shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
        <h1 className="text-base font-medium">{header}</h1>
        <div className="ml-auto flex items-center gap-2">
          {children}
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
