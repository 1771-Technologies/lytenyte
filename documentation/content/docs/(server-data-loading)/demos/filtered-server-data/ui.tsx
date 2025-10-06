"use client";
import { Popover as PopoverPrimitive, Select } from "radix-ui";
import type { ClassValue } from "clsx";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { forwardRef, useMemo, useState } from "react";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";

const Popover = PopoverPrimitive.Root;

const PopoverTrigger = PopoverPrimitive.Trigger;

const PopoverContent = forwardRef<
  React.ComponentRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      side="bottom"
      className={
        "origin-(--radix-popover-content-transform-origin) bg-ln-gray-10 text-ln-gray-80 data-[state=closed]:animate-popover-out data-[state=open]:animate-popover-in z-50 min-w-[240px] max-w-[98vw] rounded-xl border p-2 text-sm shadow-lg backdrop-blur-lg focus-visible:outline-none"
      }
      {...props}
    />
  </PopoverPrimitive.Portal>
));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

const PopoverClose = PopoverPrimitive.PopoverClose;

export { Popover, PopoverTrigger, PopoverContent, PopoverClose };

function tw(...c: ClassValue[]) {
  return twMerge(clsx(...c));
}

export function GridInput(props: React.JSX.IntrinsicElements["input"]) {
  return (
    <input
      {...props}
      className={tw(
        "data-[placeholder]:text-ln-gray-70 flex h-[28px] min-w-full items-center justify-between rounded-lg px-2 text-sm shadow-[0_1.5px_2px_0px_var(--lng1771-gray-30),0_0_0_1px_var(--lng1771-gray-30)] md:min-w-[160px]",
        "bg-ln-gray-00 text-ln-gray-90 gap-2",
        "focus-visible:shadow-[0_1.5px_2px_0px_var(--lng1771-primary-50),0_0_0_1px_var(--lng1771-primary-50)] focus-visible:outline-none",
        "data-[placeholder]:data-[disabled]:text-ln-gray-50 data-[disabled]:shadow-[0_1.5px_2px_0px_var(--lng1771-gray-20),0_0_0_1px_var(--lng1771-gray-20)]",
        "disabled:text-ln-gray-50 disabled:shadow-[0_1.5px_2px_0px_var(--lng1771-gray-20),0_0_0_1px_var(--lng1771-gray-20)]",
        props.className,
      )}
    />
  );
}

interface SelectOption {
  value: string;
  label: string;
}

interface GridSelectProps {
  readonly placeholder?: string;
  readonly value?: SelectOption | null;
  readonly onChange?: (v: SelectOption) => void;
  readonly options: SelectOption[];
  readonly className?: string;
  readonly disabled?: boolean;
}

export function GridSelect(p: GridSelectProps) {
  const value = useMemo(() => p.value?.value ?? "", [p.value]);
  const [open, setOpen] = useState(false);

  return (
    <Select.Root
      value={value}
      open={open}
      onOpenChange={setOpen}
      onValueChange={(v) => {
        const value = p.options.find((c) => c.value === v)!;

        p.onChange?.(value);
      }}
    >
      <Select.Trigger
        disabled={p.disabled}
        className={tw(
          "data-[placeholder]:text-ln-gray-70 flex h-[28px] min-w-full items-center justify-between rounded-lg px-2 text-sm shadow-[0_1.5px_2px_0px_var(--lng1771-gray-30),0_0_0_1px_var(--lng1771-gray-30)] md:min-w-[160px]",
          "bg-ln-gray-00 text-ln-gray-90 gap-2",
          "data-[placeholder]:data-[disabled]:text-ln-gray-50 data-[disabled]:shadow-[0_1.5px_2px_0px_var(--lng1771-gray-20),0_0_0_1px_var(--lng1771-gray-20)]",
          "focus-visible:shadow-[0_1.5px_2px_0px_var(--lng1771-primary-50),0_0_0_1px_var(--lng1771-primary-50)]",
          "overflow-hidden text-ellipsis whitespace-nowrap text-nowrap",
          p.className,
        )}
      >
        <Select.Value placeholder={p.placeholder ?? "Select..."} />
        <Select.Icon>
          <ChevronDownIcon />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          position="popper"
          sideOffset={5}
          className="border-ln-gray-30 bg-ln-gray-02 z-[100] max-h-[300px] min-w-[var(--radix-select-trigger-width)] overflow-y-auto overflow-x-hidden rounded-lg border shadow-[0_14px_18px_-6px_rgba(30,30,41,0.07),0_3px_13px_0_rgba(30,30,41,0.10)] md:max-h-[unset]"
          inert={false}
        >
          <Select.ScrollUpButton className="flex h-[25px] cursor-default items-center justify-center">
            <ChevronUpIcon />
          </Select.ScrollUpButton>
          <Select.Viewport className="p-[4px]">
            {p.options.map((c) => {
              return (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              );
            })}
          </Select.Viewport>
          <Select.ScrollDownButton className="flex h-[25px] cursor-default items-center justify-center">
            <ChevronDownIcon />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}

const SelectItem = forwardRef(
  ({ children, className, ...props }: Select.SelectItemProps, forwardedRef) => {
    return (
      <Select.Item
        className={tw(
          "text-ln-gray-80 h-[32px] px-2 py-1 text-sm",
          "data-[disabled]:text-ln-gray-60 data-[disabled]:pointer-events-none",
          "data-[highlighted]:text-lng-gray-90 data-[highlighted]:bg-ln-gray-20 rounded-lg data-[highlighted]:outline-none",
          "relative flex cursor-pointer select-none items-center leading-none",
          className,
        )}
        {...props}
        ref={forwardedRef as any}
      >
        <Select.ItemText>{children}</Select.ItemText>
        <Select.ItemIndicator className="absolute right-0 inline-flex w-[25px] items-center justify-center">
          <CheckIcon />
        </Select.ItemIndicator>
      </Select.Item>
    );
  },
);

SelectItem.displayName = "SelectITem";
