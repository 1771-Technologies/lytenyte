import "@1771technologies/lytenyte-pro-experimental/light-dark.css";
import { Grid, useClientDataSource } from "@1771technologies/lytenyte-pro-experimental";
import { data, type DataItem } from "./data.js";
import { useId, useState, type CSSProperties } from "react";
import { Switch } from "radix-ui";
import { getYear } from "date-fns";

export interface GridSpec {
  readonly data: DataItem;
}

const columns: Grid.Column<GridSpec>[] = [
  { id: "id", name: "Product ID", width: 130 },
  { id: "saleDate", name: "Sale Date", width: 120, widthFlex: 1, cellRenderer: DateCell },
  { id: "category", name: "Category", widthFlex: 1 },
  { id: "name", name: "Name", widthFlex: 1, width: 160 },
  { id: "quantity", name: "Quantity", widthFlex: 1, type: "number", cellRenderer: NumberCell },
  { id: "price", name: "Price", widthFlex: 1, type: "number", cellRenderer: DollarCell },
  { id: "status", name: "Status", widthFlex: 1 },
  { id: "total", name: "Total", widthFlex: 1, type: "number", cellRenderer: DollarCell },
];

const base: Grid.ColumnBase<GridSpec> = { width: 120 };

const filter2025: Grid.T.FilterFn<GridSpec["data"]> = (row) => {
  return getYear(row.data.saleDate) === 2025;
};

export default function FilterDemo() {
  const [filterValues, setFilterValues] = useState(true);
  const ds = useClientDataSource<GridSpec>({
    data: data,
    filter: filterValues ? filter2025 : null,
  });

  return (
    <>
      <div className="border-ln-border flex w-full border-b px-2 py-2">
        <SwitchToggle
          label="Sales in 2025"
          checked={filterValues}
          onChange={() => {
            setFilterValues((prev) => !prev);
          }}
        />
      </div>
      <div className="ln-grid" style={{ height: 500 }}>
        <Grid rowSource={ds} columns={columns} columnBase={base} />
      </div>
    </>
  );
}

const formatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
  minimumFractionDigits: 0,
});
export function DollarCell({ api, row, column }: Grid.T.CellRendererParams<GridSpec>) {
  const field = api.columnField(column, row);

  if (typeof field === "number") {
    if (field < 0) return `-$${formatter.format(Math.abs(field))}`;

    return "$" + formatter.format(field);
  }

  return `${field ?? "-"}`;
}

export function NumberCell({ api, row, column }: Grid.T.CellRendererParams<GridSpec>) {
  const field = api.columnField(column, row);

  return typeof field === "number" ? formatter.format(field) : `${field ?? "-"}`;
}

export function DateCell({ api, row, column }: Grid.T.CellRendererParams<GridSpec>) {
  const field = api.columnField(column, row);

  return <div className="flex h-full w-full items-center tabular-nums">{String(field)}</div>;
}
export function SwitchToggle(props: { label: string; checked: boolean; onChange: (b: boolean) => void }) {
  const id = useId();
  return (
    <div className="flex items-center gap-2">
      <label className="text-ln-text-dark text-sm leading-none" htmlFor={id}>
        {props.label}
      </label>
      <Switch.Root
        className="bg-ln-gray-10 data-[state=checked]:bg-ln-primary-50 h-5.5 w-9.5 border-ln-border-strong relative cursor-pointer rounded-full border outline-none"
        id={id}
        checked={props.checked}
        onCheckedChange={(c) => props.onChange(c)}
        style={{ "-webkit-tap-highlight-color": "rgba(0, 0, 0, 0)" } as CSSProperties}
      >
        <Switch.Thumb className="size-4.5 block translate-x-0.5 rounded-full bg-white/95 shadow transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-4 data-[state=checked]:bg-white" />
      </Switch.Root>
    </div>
  );
}
