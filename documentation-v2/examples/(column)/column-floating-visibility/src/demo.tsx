//#start
import "@1771technologies/lytenyte-pro-experimental/light-dark.css";
import type { OrderData } from "@1771technologies/grid-sample-data/orders";
import { data } from "@1771technologies/grid-sample-data/orders";
import {
  AvatarCell,
  EmailCell,
  FloatingFilter,
  IdCell,
  PaymentMethodCell,
  PriceCell,
  ProductCell,
  PurchaseDateCell,
  SwitchToggle,
} from "./components.jsx";
import {
  useClientDataSource,
  Grid,
  type PieceWritable,
  usePiece,
} from "@1771technologies/lytenyte-pro-experimental";
import { useCallback, useMemo, useState } from "react";

const columns: Grid.Column<GridSpec>[] = [
  { id: "id", width: 60, widthMin: 60, cellRenderer: IdCell, name: "ID" },
  { id: "product", cellRenderer: ProductCell, width: 200, name: "Product", type: "string" },
  { id: "price", type: "number", cellRenderer: PriceCell, width: 100, name: "Price" },
  { id: "customer", cellRenderer: AvatarCell, width: 180, name: "Customer", type: "string" },
  { id: "purchaseDate", cellRenderer: PurchaseDateCell, name: "Purchase Date", width: 130 },
  { id: "paymentMethod", cellRenderer: PaymentMethodCell, name: "Payment Method", width: 150 },
  { id: "email", cellRenderer: EmailCell, width: 220, name: "Email", type: "string" },
];

export interface GridSpec {
  readonly data: OrderData;
  readonly api: {
    readonly filterModel: PieceWritable<Record<string, string | null>>;
  };
}

const base: Grid.ColumnBase<GridSpec> = { floatingCellRenderer: FloatingFilter };
//#end

export default function ColumnBase() {
  const [filterModel, setFilterModel] = useState<Record<string, string | null>>({});

  const filter$ = usePiece(filterModel, setFilterModel);
  const apiExtension: GridSpec["api"] = useMemo(() => {
    return {
      filterModel: filter$,
    };
  }, [filter$]);

  const filterFunction: Grid.T.FilterFn<GridSpec["data"]> = useCallback(
    (row) => {
      const entries = Object.entries(filterModel);
      for (const [key, value] of entries) {
        const data = row.data[key as keyof OrderData];
        // The data should be defined, but if not removed this row in our filter
        if (!data) return false;
        if (!`${data}`.toLowerCase().includes(value?.toLowerCase() ?? "")) return false;
      }
      return true;
    },
    [filterModel],
  );

  const ds = useClientDataSource<GridSpec>({ data: data, filter: filterFunction });

  const [floatingRowEnabled, setFloatingRowEnabled] = useState(true); //!

  return (
    <>
      <div className="border-ln-border flex w-full border-b px-2 py-2">
        <SwitchToggle
          label="Toggle Floating Row"
          checked={floatingRowEnabled}
          onChange={() => {
            setFloatingRowEnabled((prev) => !prev); //!
          }}
        />
      </div>

      <div className={"ln-grid"} style={{ height: 500 }}>
        <Grid
          apiExtension={apiExtension}
          rowHeight={50}
          columns={columns}
          columnBase={base}
          rowSource={ds}
          floatingRowEnabled={floatingRowEnabled} //!
        />
      </div>
    </>
  );
}
