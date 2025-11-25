import { CheckIcon, MinusIcon } from "@radix-ui/react-icons";
import type { ClassValue } from "clsx";
import clsx from "clsx";
import { Checkbox as C } from "radix-ui";
import { twMerge } from "tailwind-merge";
import type {
  CellRendererParams,
  HeaderCellRendererParams,
} from "@1771technologies/lytenyte-pro/types";
import type { bankDataSmall } from "@1771technologies/grid-sample-data/bank-data-smaller";
import { ToggleGroup as TG } from "radix-ui";

export type BankData = (typeof bankDataSmall)[number];

const formatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
  minimumFractionDigits: 0,
});
export function BalanceCell({ grid, row, column }: CellRendererParams<BankData>) {
  const field = grid.api.columnField(column, row);

  if (typeof field === "number") {
    if (field < 0) return `-$${formatter.format(Math.abs(field))}`;

    return "$" + formatter.format(field);
  }

  return `${field ?? "-"}`;
}
export function DurationCell({ grid, row, column }: CellRendererParams<BankData>) {
  const field = grid.api.columnField(column, row);

  return typeof field === "number" ? `${formatter.format(field)} days` : `${field ?? "-"}`;
}

export function NumberCell({ grid, row, column }: CellRendererParams<BankData>) {
  const field = grid.api.columnField(column, row);

  return typeof field === "number" ? formatter.format(field) : `${field ?? "-"}`;
}

export function MarkerHeader({ grid }: HeaderCellRendererParams<BankData>) {
  const allSelected = grid.state.rowDataSource.get().rowAreAllSelected();

  const selected = grid.state.rowSelectedIds.useValue();

  return (
    <div className="flex h-full w-full items-center justify-center">
      <GridCheckbox
        checked={allSelected || selected.size > 0}
        indeterminate={!allSelected && selected.size > 0}
        onClick={(ev) => {
          ev.preventDefault();
          grid.api.rowSelectAll({ deselect: allSelected });
        }}
        onKeyDown={(ev) => {
          if (ev.key === "Enter" || ev.key === " ")
            grid.api.rowSelectAll({ deselect: allSelected });
        }}
      />
    </div>
  );
}

export function MarkerCell({ grid, rowSelected }: CellRendererParams<BankData>) {
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
          {!indeterminate && <CheckIcon className="text-white dark:text-black" />}
          {indeterminate && <MinusIcon className="text-white dark:text-black" />}
        </C.CheckboxIndicator>
      </C.Root>
      {children}
    </label>
  );
}

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
        "text-ln-gray-70 flex cursor-pointer items-center justify-center px-2 py-1 text-xs font-bold outline-none focus:outline-none",
        "data-[state=on]:text-ln-gray-90 data-[state=on]:bg-linear-to-b from-ln-gray-02 to-ln-gray-05 data-[state=on]:rounded-md",
        props.className,
      )}
    ></TG.Item>
  );
}
