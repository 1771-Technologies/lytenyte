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
        "text-ln-gray-70 flex items-center justify-center px-2 py-1 text-xs font-bold outline-none focus:outline-none",
        "data-[state=on]:text-ln-gray-90 data-[state=on]:bg-linear-to-b from-ln-gray-02 to-ln-gray-05 data-[state=on]:rounded-md",
        props.className,
      )}
    ></TG.Item>
  );
}

export function ThemePicker({ theme, setTheme }: { theme: string; setTheme: (s: string) => void }) {
  return (
    <div className={tw("flex h-full items-center gap-1 text-nowrap px-2 py-1")}>
      <div className={tw("text-light hidden text-xs font-medium md:block")}>Theme:</div>
      <ToggleGroup
        type="single"
        value={theme}
        className={tw("flex flex-wrap")}
        onValueChange={(c) => {
          if (!c) return;
          setTheme(c);
        }}
      >
        <ToggleItem value="light">Light</ToggleItem>
        <ToggleItem value="dark">Dark</ToggleItem>
        <ToggleItem value="lng1771-teal">LyteNyte Teal</ToggleItem>
        <ToggleItem value="lng1771-term256">Term 256</ToggleItem>
        <ToggleItem value="lng1771-shadcn-dark dark">Shadcn Dark</ToggleItem>
        <ToggleItem value="lng1771-shadcn-light light">Shadcn Light</ToggleItem>
        <ToggleItem value="lng1771-cotton-candy">Cotton Candy</ToggleItem>
      </ToggleGroup>
    </div>
  );
}
