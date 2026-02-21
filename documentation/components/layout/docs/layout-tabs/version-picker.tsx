import { cn } from "@/components/cn";
import { Menu as M } from "@base-ui-components/react";
import { ChevronDown } from "lucide-react";

export function VersionPicker() {
  return (
    <M.Root>
      <div className="flex h-full items-center">
        <M.Trigger className="hover:bg-fd-accent flex h-[90%] cursor-pointer items-center justify-between gap-2 rounded px-2 py-2 text-sm font-bold transition-colors">
          v1.0.20
          <ChevronDown className="size-4" />
          <span className="sr-only">Open additional page export options</span>
        </M.Trigger>
      </div>
      <M.Portal>
        <M.Positioner side="bottom" sideOffset={6} className="z-100">
          <M.Popup
            className={cn(
              "origin-(--transform-origin) w-(--anchor-width) bg-fd-popover border-xd-border text-xd-popover-foreground border px-2 py-1",
              "data-ending-style:opacity-0 data-starting-style:opacity-0 rounded-lg shadow-lg",
              "data-ending-style:scale-90 data-starting-style:scale-90 transition-[transform,scale,opacity]",
              "grid w-24 grid-cols-[auto_1fr_auto] gap-x-2",
            )}
          >
            <M.Item
              render={<a href="https://www.1771technologies.com/docs/intro-getting-started" />}
              className="hover:bg-fd-accent col-span-full grid cursor-pointer grid-cols-subgrid items-center rounded-lg px-2 py-2 text-sm font-semibold"
            >
              v2
            </M.Item>

            <M.Item className="hover:bg-fd-accent bg-fd-accent/60 col-span-full grid cursor-pointer grid-cols-subgrid items-center rounded-lg px-2 py-2 text-sm font-semibold">
              <div className="col-span-2 flex w-full items-center justify-between">
                <div>v1</div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentcolor"
                  viewBox="0 0 256 256"
                >
                  <path d="M232.49,80.49l-128,128a12,12,0,0,1-17,0l-56-56a12,12,0,1,1,17-17L96,183,215.51,63.51a12,12,0,0,1,17,17Z"></path>
                </svg>
              </div>
            </M.Item>
          </M.Popup>
        </M.Positioner>
      </M.Portal>
    </M.Root>
  );
}
