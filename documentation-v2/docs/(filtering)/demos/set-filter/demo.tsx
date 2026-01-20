import "@1771technologies/lytenyte-pro-experimental/components.css";
import "@1771technologies/lytenyte-pro-experimental/light-dark.css";
import { Grid, SmartSelect, useClientDataSource } from "@1771technologies/lytenyte-pro-experimental";
import { data, type DataItem } from "./data.js";
import { useId, useMemo, useState, type CSSProperties } from "react";
import { Switch } from "radix-ui";
import { CheckIcon, Cross1Icon } from "@radix-ui/react-icons";

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

const names = [...new Set(data.map((x) => x.name).sort())].map((x) => ({ id: x, label: x }));

export default function FilteringDemo() {
  const [values, setValues] = useState<{ id: string; label: string }[]>([
    { id: "Office Suite", label: "Office Suite" },
  ]);

  const filterFn: Grid.T.FilterFn<GridSpec["data"]> | null = useMemo(() => {
    if (values.length === 0) return null;
    const allowed = new Set(values.map((x) => x.id));
    return (row) => {
      return allowed.has(row.data.name);
    };
  }, [values]);

  const ds = useClientDataSource<GridSpec>({
    data: data,
    filter: filterFn,
  });

  return (
    <>
      <div className="border-ln-border flex w-full border-b px-2 py-2">
        <SmartSelect
          kind="multi-combo"
          onOptionChange={setValues}
          value={values}
          container={({ options, children }) => {
            console.log(options);
            return (
              <SmartSelect.Container className="max-h-80 overflow-auto">
                {options.length > 0 && children}
                {options.length === 0 && <div className="px-2 py-2">No options match query</div>}
              </SmartSelect.Container>
            );
          }}
          options={(query) => {
            if (!query) return names;

            return names.filter((x) => x.label.toLowerCase().includes(query?.toLowerCase()));
          }}
          trigger={
            <SmartSelect.MultiComboTrigger
              data-ln-input
              className="flex h-10 w-full items-center gap-2"
              renderInput={
                <input type="text" autoComplete="off" className="h-full w-full focus:outline-none" />
              }
            >
              {values.map((x) => {
                return (
                  <SmartSelect.Chip
                    option={x}
                    className="bg-ln-column-fill border-ln-column-stroke flex items-center gap-1 text-nowrap rounded-lg border px-1 py-0.5 ps-2 text-xs"
                  >
                    <span className="relative top-px">{x.label}</span>
                    <SmartSelect.ChipRemove data-ln-button="secondary" data-ln-icon data-ln-size="xs">
                      <Cross1Icon />
                    </SmartSelect.ChipRemove>
                  </SmartSelect.Chip>
                );
              })}
            </SmartSelect.MultiComboTrigger>
          }
        >
          {(p) => {
            return (
              <SmartSelect.Option key={p.option.id} {...p} className="flex items-center justify-between">
                {p.option.label}
                {p.selected && <CheckIcon className="text-ln-primary-50" />}
              </SmartSelect.Option>
            );
          }}
        </SmartSelect>
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
