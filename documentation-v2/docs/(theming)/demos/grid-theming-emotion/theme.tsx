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
        "text-ln-text flex items-center justify-center px-2 py-1 text-xs font-bold outline-none focus:outline-none",
        "data-[state=on]:text-ln-text-dark data-[state=on]:bg-linear-to-b from-ln-gray-02 to-ln-gray-05 data-[state=on]:rounded-md",
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
        <ToggleItem value="ln-light">Light</ToggleItem>
        <ToggleItem value="ln-dark">Dark</ToggleItem>
        <ToggleItem value="ln-teal">LyteNyte Teal</ToggleItem>
        <ToggleItem value="ln-term">Term 256</ToggleItem>
        <ToggleItem value="ln-shadcn dark">Shadcn Dark</ToggleItem>
        <ToggleItem value="ln-shadcn light">Shadcn Light</ToggleItem>
        <ToggleItem value="ln-cotton-candy">Cotton Candy</ToggleItem>
      </ToggleGroup>
    </div>
  );
}
