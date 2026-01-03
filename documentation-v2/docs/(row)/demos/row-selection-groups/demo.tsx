//#start
import "@1771technologies/lytenyte-pro-experimental/light-dark.css";
import { Checkbox as C } from "radix-ui";
import { bankDataSmall } from "@1771technologies/grid-sample-data/bank-data-smaller";
import {
  Grid,
  RowGroupCell,
  SelectAll,
  useClientDataSource,
} from "@1771technologies/lytenyte-pro-experimental";
import { CheckIcon, MinusIcon } from "@radix-ui/react-icons";
import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";

export type BankData = (typeof bankDataSmall)[number];
interface GridSpec {
  readonly data: BankData;
}

const columns: Grid.Column<GridSpec>[] = [
  { name: "Job", id: "job", width: 120 },
  { name: "Age", id: "age", type: "number", width: 80, cellRenderer: NumberCell },
  { name: "Balance", id: "balance", type: "number", cellRenderer: BalanceCell },
  { name: "Education", id: "education" },
  { name: "Marital", id: "marital" },
  { name: "Default", id: "default" },
  { name: "Housing", id: "housing" },
  { name: "Loan", id: "loan" },
  { name: "Contact", id: "contact" },
  { name: "Day", id: "day", type: "number", cellRenderer: NumberCell },
  { name: "Month", id: "month" },
  { name: "Duration", id: "duration", type: "number", cellRenderer: DurationCell },
];

const base: Grid.ColumnBase<GridSpec> = { width: 100 };

const group: Grid.RowGroupColumn<GridSpec> = {
  cellRenderer: RowGroupCell,
  width: 200,
};

const marker: Grid.ColumnMarker<GridSpec> = {
  on: true,
  cellRenderer: MarkerCell,
  headerRenderer: MarkerHeader,
};

//#end
export default function GridTheming() {
  const ds = useClientDataSource({
    data: bankDataSmall,
    group: [{ id: "job" }, { id: "education" }],
    rowGroupDefaultExpansion: true,
    rowsIsolatedSelection: true, //!
  });

  return (
    <div className="ln-grid" style={{ height: 500 }}>
      <Grid
        rowSource={ds}
        columns={columns}
        columnBase={base}
        rowGroupColumn={group}
        columnMarker={marker}
        rowSelectionMode="multiple"
      />
    </div>
  );
}

//#start

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

function MarkerHeader(params: Grid.T.HeaderParams<GridSpec>) {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <SelectAll
        {...params}
        slot={({ indeterminate, selected, toggle }) => {
          return (
            <GridCheckbox
              checked={selected || indeterminate}
              indeterminate={indeterminate}
              onClick={(ev) => {
                ev.preventDefault();
                toggle();
              }}
              onKeyDown={(ev) => {
                if (ev.key === "Enter" || ev.key === " ") toggle();
              }}
            />
          );
        }}
      />
    </div>
  );
}

function MarkerCell({ api, selected }: Grid.T.CellRendererParams<GridSpec>) {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <GridCheckbox
        checked={selected}
        onClick={(ev) => {
          ev.stopPropagation();
          api.rowHandleSelect({ shiftKey: ev.shiftKey, target: ev.target }); //!
        }}
        onKeyDown={(ev) => {
          if (ev.key === "Enter" || ev.key === " ")
            api.rowHandleSelect({ shiftKey: ev.shiftKey, target: ev.target }); //!
        }}
      />
    </div>
  );
}

function tw(...c: ClassValue[]) {
  return twMerge(clsx(...c));
}

function GridCheckbox({ children, indeterminate, ...props }: C.CheckboxProps & { indeterminate?: boolean }) {
  return (
    <label className="text-md text-light flex items-center gap-2">
      <C.Root
        {...props}
        type="button"
        className={tw(
          "bg-ln-gray-02 cursor-pointer rounded border-transparent",
          "shadow-[0_1.5px_2px_0_rgba(18,46,88,0.08),0_0_0_1px_var(--ln-gray-40)]",
          "data-[state=checked]:bg-ln-primary-50 data-[state=checked]:shadow-[0_1.5px_2px_0_rgba(18,46,88,0.08),0_0_0_1px_var(--ln-primary-50)]",
          "h-4 w-4",
          props.className,
        )}
      >
        <C.CheckboxIndicator className={"flex items-center justify-center"}>
          {!indeterminate && <CheckIcon className="text-white" />}
          {indeterminate && <MinusIcon className="text-white" />}
        </C.CheckboxIndicator>
      </C.Root>
      {children}
    </label>
  );
}

//#end
