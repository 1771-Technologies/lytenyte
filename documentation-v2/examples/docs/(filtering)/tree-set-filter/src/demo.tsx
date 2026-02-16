import "@1771technologies/lytenyte-pro-experimental/components.css";
import "@1771technologies/lytenyte-pro-experimental/light-dark.css";
import { Grid, usePiece, type PieceWritable } from "@1771technologies/lytenyte-pro-experimental";
import { useClientDataSource } from "@1771technologies/lytenyte-pro-experimental";
import { data, type DataItem } from "./data.js";
import { useId, useMemo, useState, type CSSProperties } from "react";
import { Switch } from "radix-ui";
import { Header, saleDateItems } from "./filter.js";

export interface GridSpec {
  readonly data: DataItem;
  readonly api: {
    readonly filterModel: PieceWritable<Record<string, Grid.T.RowSelectionLinked>>;
    readonly treeSetExpansions: PieceWritable<Record<string, Record<string, boolean | undefined>>>;
  };
}

const columns: Grid.Column<GridSpec>[] = [
  { id: "id", name: "Product ID", width: 130 },
  {
    id: "saleDate",
    name: "Sale Date",
    width: 120,
    widthFlex: 1,
    cellRenderer: DateCell,
    headerRenderer: Header,
  },
  { id: "category", name: "Category", widthFlex: 1 },
  { id: "name", name: "Name", widthFlex: 1, width: 160 },
  { id: "quantity", name: "Quantity", widthFlex: 1, type: "number", cellRenderer: NumberCell },
  { id: "price", name: "Price", widthFlex: 1, type: "number", cellRenderer: DollarCell },
  { id: "status", name: "Status", widthFlex: 1 },
  { id: "total", name: "Total", widthFlex: 1, type: "number", cellRenderer: DollarCell },
];

const base: Grid.ColumnBase<GridSpec> = { width: 120 };

export default function FilterDemo() {
  const [model, setModel] = useState<Record<string, Grid.T.RowSelectionLinked>>({});
  const filterModel = usePiece(model, setModel);
  const [expansions, setExpansions] = useState<Record<string, Record<string, boolean | undefined>>>({});
  const treeSetExpansions = usePiece(expansions, setExpansions);

  const excludeSets = useMemo(() => {
    const selectEntries = Object.entries(model)
      .map(([columnId, state]) => {
        // For this demo we are only handling the saleDate column.
        if (columnId !== "saleDate") return null;

        // Convert a selection tree into a set of ids
        const unselectedItems = saleDateItems.filter((x) => {
          const path = x.path;

          let node: Grid.T.RowSelectionLinked | Grid.T.RowSelectNode = state;
          let selection = node.selected;
          // We need to traverse the selection tree, tracking the selection state of the node.
          // If the node stops short of the full path, it means that a parent was changed, and the
          // parent's selection state applies to all its children.
          for (let i = 0; i < path.length; i++) {
            const p = path.slice(0, i + 1).join("/");

            const n: Grid.T.RowSelectNode | undefined = node.children?.get(p);
            if (!n) break;

            node = n;
            if (node.selected != undefined) selection = node.selected;
          }

          if (node.children?.get(x.id)?.selected !== undefined)
            selection = node.children.get(x.id)!.selected!;

          return !selection;
        });

        return [columnId, new Set(unselectedItems.map((x) => x.id))] as const;
      })
      .filter((x) => x && x[1].size !== 0);

    return selectEntries as [string, Set<any>][];
  }, [model]);

  const filterFn = useMemo<Grid.T.FilterFn<GridSpec["data"]> | null>(() => {
    if (excludeSets.length === 0) return null;

    return (row) => {
      for (const [columnId, set] of excludeSets) {
        const field = row.data[columnId as keyof DataItem];
        if (set.has(field)) return false;
      }

      return true;
    };
  }, [excludeSets]);

  const ds = useClientDataSource<GridSpec>({
    data: data,
    filter: filterFn,
  });

  const apiExtension = useMemo(() => {
    return { filterModel, treeSetExpansions };
  }, [filterModel, treeSetExpansions]);

  return (
    <>
      <div className="ln-grid" style={{ height: 500 }}>
        <Grid apiExtension={apiExtension} rowSource={ds} columns={columns} columnBase={base} />
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
