import type { OneDocConfig } from "../../lytenyte-doc";
import { Menu as M } from "@base-ui/react";
import { cn } from "../ui/cn.js";

export function VersionPicker({ versions }: { versions: Required<OneDocConfig["navbar"]>["docVersions"] }) {
  const latest = versions.find((x) => x.href === "latest");
  return (
    <M.Root>
      <div className="flex h-full items-center">
        <M.Trigger className="center hover:bg-xd-accent h-[90%] cursor-pointer items-center gap-2 rounded px-2 py-2 text-sm font-bold transition-colors">
          {latest?.full}
          <div className="hidden rounded border border-blue-500/80 bg-blue-500/50 px-2 py-0.5 text-[10px] md:block">
            Latest
          </div>

          <span className="iconify ph--caret-down relative -left-px"></span>
          <span className="sr-only">Open additional page export options</span>
        </M.Trigger>
      </div>
      <M.Portal>
        <M.Positioner side="bottom" sideOffset={6} className="z-100">
          <M.Popup
            className={cn(
              "origin-(--transform-origin) w-(--anchor-width) bg-xd-popover border-xd-border text-xd-popover-foreground border px-2 py-1",
              "data-ending-style:opacity-0 data-starting-style:opacity-0 rounded-lg shadow-lg",
              "data-ending-style:scale-90 data-starting-style:scale-90 transition-[transform,scale,opacity]",
              "grid grid-cols-[auto_1fr_auto] gap-x-2",
            )}
          >
            {versions.map((x) => {
              if (x.href === "latest") {
                return (
                  <M.Item
                    key={x.href}
                    className="hover:bg-xd-accent bg-xd-accent/60 col-span-full grid cursor-pointer grid-cols-subgrid items-center rounded-lg px-2 py-2 text-sm font-semibold"
                  >
                    <div className="col-span-2 flex w-full items-center justify-between">
                      <div>{x.title}</div>
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
                );
              }

              return (
                <M.Item
                  key={x.href}
                  render={<a href={x.href} />}
                  className="hover:bg-xd-accent col-span-full grid cursor-pointer grid-cols-subgrid items-center rounded-lg px-2 py-2 text-sm font-semibold"
                >
                  {x.title}
                </M.Item>
              );
            })}
          </M.Popup>
        </M.Positioner>
      </M.Portal>
    </M.Root>
  );
}
