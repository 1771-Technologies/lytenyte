import { CheckIcon, MinusIcon } from "@radix-ui/react-icons";
import type { ClassValue } from "clsx";
import clsx from "clsx";
import { Checkbox as C, Switch } from "radix-ui";
import { twMerge } from "tailwind-merge";
import type {
  CellRendererParams,
  HeaderCellRendererParams,
} from "@1771technologies/lytenyte-pro/types";
import type { bankDataSmall } from "@1771technologies/grid-sample-data/bank-data-smaller";
import { useId, type CSSProperties, type JSX } from "react";

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

export function GridButton(props: JSX.IntrinsicElements["button"]) {
  return (
    <button
      {...props}
      className={tw(
        "dark:border-ln-gray-30 border-ln-gray-60 hover:bg-ln-gray-20 text-ln-gray-80 flex h-10 cursor-pointer items-center gap-2 rounded-lg border px-2 text-sm font-semibold shadow-lg transition-colors",
        "shadow-[0_2px_2px_0_hsla(176,64%,5%,0.22)] shadow-[inset_0_0_11px_0_hsla(176,55%,89%,0.12)] backdrop-blur-[10px]",
        props.className,
      )}
    ></button>
  );
}

export function SwitchToggle(props: {
  label: string;
  checked: boolean;
  onChange: (b: boolean) => void;
}) {
  const id = useId();
  return (
    <div className="flex items-center gap-2">
      <label className="text-ln-gray-90 text-sm leading-none" htmlFor={id}>
        {props.label}
      </label>
      <Switch.Root
        className="bg-ln-gray-00 border-ln-gray-30 data-[state=checked]:bg-ln-gray-10 relative h-[22px] w-[38px] cursor-default cursor-pointer rounded-full border outline-none"
        id={id}
        checked={props.checked}
        onCheckedChange={(c) => props.onChange(c)}
        style={{ "-webkit-tap-highlight-color": "rgba(0, 0, 0, 0)" } as CSSProperties}
      >
        <Switch.Thumb className="bg-ln-primary-50 block size-[20px] translate-x-0 rounded-full shadow transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[15px]" />
      </Switch.Root>
    </div>
  );
}
