import type { ClassValue } from "clsx";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { ToggleGroup as TG } from "radix-ui";
import type { Grid } from "@1771technologies/lytenyte-pro-experimental";
import type { GridSpec } from "./demo";

const formatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
  minimumFractionDigits: 0,
});
export function BalanceCell({ api, row, column }: Grid.T.CellRendererParams<GridSpec>) {
  const field = api.columnField(column, row);

  if (typeof field === "number") {
    if (field < 0) return `-$${formatter.format(Math.abs(field))}`;

    return "$" + formatter.format(field);
  }

  return `${field ?? "-"}`;
}
export function DurationCell({ api, row, column }: Grid.T.CellRendererParams<GridSpec>) {
  const field = api.columnField(column, row);

  return typeof field === "number" ? `${formatter.format(field)} days` : `${field ?? "-"}`;
}

export function NumberCell({ api, row, column }: Grid.T.CellRendererParams<GridSpec>) {
  const field = api.columnField(column, row);

  return typeof field === "number" ? formatter.format(field) : `${field ?? "-"}`;
}

function tw(...c: ClassValue[]) {
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
