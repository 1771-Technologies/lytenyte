import { ToggleGroup as TG } from "radix-ui";
import type { ClassValue } from "clsx";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export function tw(...c: ClassValue[]) {
  return twMerge(clsx(...c));
}

export function ToggleGroup(props: Parameters<typeof TG.Root>[0]) {
  return (
    <TG.Root
      {...props}
      className={tw("bg-ln-gray-20 flex items-center gap-2 rounded-xl px-2 py-1", props.className)}
    ></TG.Root>
  );
}

export function ToggleItem(props: Parameters<typeof TG.Item>[0]) {
  return (
    <TG.Item
      {...props}
      className={tw(
        "text-ln-text flex cursor-pointer items-center justify-center px-2 py-1 text-xs font-bold outline-none focus:outline-none",
        "data-[state=on]:text-ln-text-dark data-[state=on]:bg-linear-to-b from-ln-gray-02 to-ln-gray-05 data-[state=on]:rounded-md",
        props.className,
      )}
    ></TG.Item>
  );
}
