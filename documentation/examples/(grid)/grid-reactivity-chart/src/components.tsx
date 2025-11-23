import { Checkbox as C } from "radix-ui";
import type { CellRendererParams } from "@1771technologies/lytenyte-pro/types";
import type { companiesWithPricePerf } from "@1771technologies/sample-data/companies-with-price-performance";
import { CheckIcon, MinusIcon } from "@radix-ui/react-icons";
import type { ClassValue } from "clsx";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import type { JSX } from "react";

type PerformanceData = (typeof companiesWithPricePerf)[number];

const formatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
  minimumFractionDigits: 0,
});
export function PriceCell({ grid, row, column }: CellRendererParams<PerformanceData>) {
  const field = grid.api.columnField(column, row);

  if (typeof field === "number") {
    if (field < 0) return `-$${formatter.format(Math.abs(field))}`;

    return "$" + formatter.format(field);
  }

  return `${field ?? "-"}`;
}

export function NumberCell({ grid, row, column }: CellRendererParams<PerformanceData>) {
  const field = grid.api.columnField(column, row);

  return typeof field === "number" ? formatter.format(field) : `${field ?? "-"}`;
}

export function MarkerCell({ grid, rowSelected }: CellRendererParams<PerformanceData>) {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <GridCheckbox
        checked={rowSelected}
        onClick={(ev) => {
          ev.stopPropagation();
          grid.api.rowHandleSelect({ shiftKey: ev.shiftKey, target: ev.target });
        }}
        onKeyDown={(ev) => {
          if (ev.key === "Enter" || ev.key === " ")
            grid.api.rowHandleSelect({ shiftKey: ev.shiftKey, target: ev.target });
        }}
      />
    </div>
  );
}

export function GridCheckbox({
  children,
  indeterminate,
  ...props
}: C.CheckboxProps & { indeterminate?: boolean }) {
  return (
    <label className="text-md text-light flex items-center gap-2">
      <C.Root
        {...props}
        type="button"
        className={tw(
          "bg-ln-gray-02 rounded border-transparent",
          "shadow-[0_1.5px_2px_0_rgba(18,46,88,0.08),0_0_0_1px_var(--lng1771-gray-40)]",
          "data-[state=checked]:bg-ln-primary-50 data-[state=checked]:shadow-[0_1.5px_2px_0_rgba(18,46,88,0.08),0_0_0_1px_var(--lng1771-primary-50)]",
          "h-4 w-4",
          props.className,
        )}
      >
        <C.CheckboxIndicator className={tw("flex items-center justify-center")}>
          {!indeterminate && <CheckIcon className="text-white" />}
          {indeterminate && <MinusIcon className="text-white" />}
        </C.CheckboxIndicator>
      </C.Root>
      {children}
    </label>
  );
}

export function tw(...c: ClassValue[]) {
  return twMerge(clsx(...c));
}

export function GridButton(props: JSX.IntrinsicElements["button"]) {
  return (
    <button
      {...props}
      className={tw(
        "border-ln-gray-30 hover:bg-ln-gray-80 dark:hover:bg-ln-gray-90 flex h-8 cursor-pointer items-center gap-2 rounded-lg border bg-black px-2 text-sm text-white shadow transition-colors dark:bg-white dark:text-black",
        props.className,
      )}
    ></button>
  );
}
