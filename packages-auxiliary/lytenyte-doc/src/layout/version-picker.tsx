import type { OneDocConfig } from "../../lytenyte-doc";
import { Menu as M } from "@base-ui/react";
import { cn } from "../ui/cn.js";

export function VersionPicker({ versions }: { versions: Required<OneDocConfig["navbar"]>["docVersions"] }) {
  const latest = versions.find((x) => x.href === "latest");
  return (
    <M.Root>
      <M.Trigger className="center hover:bg-xd-accent cursor-pointer items-center gap-2 rounded px-2 py-2 text-sm transition-colors">
        {latest?.full}
        <div className="rounded bg-blue-500/50 px-2 py-0.5 text-[10px]">Latest</div>

        <span className="iconify ph--caret-down relative -left-px"></span>
        <span className="sr-only">Open additional page export options</span>
      </M.Trigger>
      <M.Portal>
        <M.Positioner side="bottom" sideOffset={6}>
          <M.Popup
            className={cn(
              "origin-(--transform-origin) bg-xd-popover border-xd-border text-xd-popover-foreground border px-2 py-1",
              "data-ending-style:opacity-0 data-starting-style:opacity-0 rounded-lg shadow-lg",
              "data-ending-style:scale-90 data-starting-style:scale-90 transition-[transform,scale,opacity]",
              "grid grid-cols-[auto_1fr_auto] gap-x-2",
            )}
          >
            {versions.map((x) => {
              if (x.href === "latest") {
                return (
                  <M.Item className="hover:bg-xd-accent col-span-full grid cursor-pointer grid-cols-subgrid items-center rounded-lg px-2 py-2 text-sm font-semibold">
                    {x.title}
                  </M.Item>
                );
              }

              return (
                <M.Item
                  render={<a href={x.href} target="_blank" />}
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
