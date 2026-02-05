//#start
import { Popover } from "@1771technologies/lytenyte-pro-experimental";
import "@1771technologies/lytenyte-pro-experimental/components.css";
import "@1771technologies/lytenyte-pro-experimental/light-dark.css";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
//#end

export default function TreeViewDemo() {
  return (
    <div style={{ height: "400px" }} className="ln-grid flex justify-center pt-8">
      <Popover>
        <Popover.Trigger data-ln-button="website" data-ln-size="md">
          Open Popover
        </Popover.Trigger>

        <Popover.Container className="flex max-w-80 flex-col gap-3">
          <Popover.Arrow />
          <Popover.Title className="text-lg font-bold">Popover Title</Popover.Title>
          <Popover.Description>
            A description of the popover content for accessibility reasons.
          </Popover.Description>
          <div>You can include more popover content. Popovers should only be used for auxiliary actions.</div>

          <Popover.Close data-ln-button="tertiary" data-ln-size="md">
            Close Popover
          </Popover.Close>
        </Popover.Container>
      </Popover>
    </div>
  );
}

export function tw(...c: ClassValue[]) {
  return twMerge(clsx(...c));
}
